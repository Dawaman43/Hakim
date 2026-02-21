import { NextResponse } from "next/server";
import { db } from "@/db/node-client";
import { hospitals, departments } from "@/db/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { redisGet, redisSet } from "@/lib/upstash";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 24)));
    const region = searchParams.get("region");
    const facilityType = searchParams.get("type");
    const search = searchParams.get("search");

    const cacheKey = `hospitals:v2:page=${page}:limit=${limit}:region=${region ?? "all"}:type=${facilityType ?? "all"}:search=${search ?? ""}`;
    const cached = await redisGet<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        total: cached.total,
        facilityCounts: cached.facilityCounts ?? {},
        totalDepartments: cached.totalDepartments ?? 0,
        totalRegions: cached.totalRegions ?? 0,
        page,
        pageSize: limit,
        cached: true,
      });
    }

    const conditions = [];
    if (region) conditions.push(eq(hospitals.region, region));
    if (facilityType) conditions.push(eq(hospitals.facilityType, facilityType));
    if (search) {
      conditions.push(or(ilike(hospitals.name, `%${search}%`), ilike(hospitals.address, `%${search}%`)));
    }
    const whereClause = conditions.length ? and(...(conditions as any)) : undefined;

    const totalRow = await db
      .select({ count: sql<number>`count(*)` })
      .from(hospitals)
      .where(whereClause);
    const total = Number(totalRow[0]?.count ?? 0);

    const facilityCountsRows = await db
      .select({
        facilityType: hospitals.facilityType,
        count: sql<number>`count(*)`,
      })
      .from(hospitals)
      .where(whereClause)
      .groupBy(hospitals.facilityType);
    const facilityCounts = facilityCountsRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.facilityType] = Number(row.count);
      return acc;
    }, {});

    const totalDepartmentsRow = await db
      .select({ count: sql<number>`count(*)` })
      .from(departments);
    const totalDepartments = Number(totalDepartmentsRow[0]?.count ?? 0);

    const totalRegionsRow = await db
      .select({ count: sql<number>`count(distinct ${hospitals.region})` })
      .from(hospitals);
    const totalRegions = Number(totalRegionsRow[0]?.count ?? 0);

    const rows = await db
      .select()
      .from(hospitals)
      .where(whereClause)
      .orderBy(hospitals.name)
      .limit(limit)
      .offset((page - 1) * limit);
    const counts = await db
      .select({
        hospitalId: departments.hospitalId,
        count: sql<number>`count(*)`,
      })
      .from(departments)
      .groupBy(departments.hospitalId);

    const countMap = new Map<string, number>();
    for (const row of counts) {
      countMap.set(row.hospitalId, Number(row.count));
    }

    const data = rows.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      region: hospital.region,
      address: hospital.address,
      latitude: hospital.latitude ?? null,
      longitude: hospital.longitude ?? null,
      emergencyContactNumber: hospital.emergencyContactNumber ?? null,
      isActive: hospital.isActive,
      adminId: null,
      facilityType: hospital.facilityType,
      facilityTypeDisplay: hospital.facilityType,
      createdAt: hospital.createdAt.toISOString(),
      updatedAt: hospital.updatedAt.toISOString(),
      departmentCount: countMap.get(hospital.id) ?? 0,
    }));
    await redisSet(cacheKey, { data, total, facilityCounts, totalDepartments, totalRegions }, 300);
    return NextResponse.json({
      success: true,
      data,
      total,
      facilityCounts,
      totalDepartments,
      totalRegions,
      page,
      pageSize: limit,
      cached: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load hospitals:", error);
    return NextResponse.json({ success: false, error: `Failed to load hospitals: ${message}` }, { status: 500 });
  }
}
