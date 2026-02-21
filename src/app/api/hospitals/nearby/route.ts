import { NextResponse } from "next/server";
import { db } from "@/db/node-client";
import { hospitals, departments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { redisGet, redisSet } from "@/lib/upstash";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ success: false, error: "Invalid lat/lng" }, { status: 400 });
    }

    const roundedLat = lat.toFixed(3);
    const roundedLng = lng.toFixed(3);
    const cacheKey = `hospitals:nearby:v1:${roundedLat}:${roundedLng}:limit=${limit}`;
    const cached = await redisGet<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true });
    }

    const distanceSql = sql<number>`
      (6371 * 2 * asin(sqrt(
        power(sin(radians(${lat} - ${hospitals.latitude}) / 2), 2) +
        cos(radians(${lat})) * cos(radians(${hospitals.latitude})) *
        power(sin(radians(${lng} - ${hospitals.longitude}) / 2), 2)
      )))
    `;

    const rows = await db
      .select({
        hospital: hospitals,
        distance: distanceSql.as("distance"),
      })
      .from(hospitals)
      .where(sql`${hospitals.latitude} is not null and ${hospitals.longitude} is not null`)
      .orderBy(sql`distance`)
      .limit(limit);

    const data = rows.map((row) => ({
      id: row.hospital.id,
      name: row.hospital.name,
      region: row.hospital.region,
      address: row.hospital.address,
      latitude: row.hospital.latitude ?? null,
      longitude: row.hospital.longitude ?? null,
      emergencyContactNumber: row.hospital.emergencyContactNumber ?? null,
      isActive: row.hospital.isActive,
      adminId: null,
      facilityType: row.hospital.facilityType,
      facilityTypeDisplay: row.hospital.facilityType,
      createdAt: row.hospital.createdAt.toISOString(),
      updatedAt: row.hospital.updatedAt.toISOString(),
      departmentCount: 0,
      distance: Number(row.distance ?? 0),
    }));

    await redisSet(cacheKey, data, 300);
    return NextResponse.json({ success: true, data, cached: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load nearby hospitals:", error);
    return NextResponse.json({ success: false, error: `Failed to load nearby hospitals: ${message}` }, { status: 500 });
  }
}
