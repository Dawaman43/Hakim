import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, departments, hospitals } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get("hospitalId");
    if (!hospitalId) {
      return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });
    }

    if (payload.role !== "SUPER_ADMIN") {
      const hosp = await db.select().from(hospitals).where(eq(hospitals.id, hospitalId)).limit(1);
      if (!hosp[0] || hosp[0].adminId !== payload.userId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const summaryRows = await db
      .select({
        totalPatientsToday: sql<number>`count(*)`.as("totalPatientsToday"),
        totalWaiting: sql<number>`sum(case when ${appointments.status} = 'WAITING' then 1 else 0 end)`.as("totalWaiting"),
        totalServed: sql<number>`sum(case when ${appointments.status} = 'COMPLETED' then 1 else 0 end)`.as("totalServed"),
      })
      .from(appointments)
      .where(and(eq(appointments.hospitalId, hospitalId), gte(appointments.createdAt, startOfDay)));

    const deptRows = await db
      .select({
        departmentId: departments.id,
        departmentName: departments.name,
        avgTime: departments.averageServiceTimeMin,
        totalWaiting: sql<number>`sum(case when ${appointments.status} = 'WAITING' then 1 else 0 end)`.as("totalWaiting"),
        totalServed: sql<number>`sum(case when ${appointments.status} = 'COMPLETED' then 1 else 0 end)`.as("totalServed"),
        currentToken: sql<number>`max(case when ${appointments.status} = 'SERVING' then ${appointments.tokenNumber} else null end)`.as("currentToken"),
      })
      .from(departments)
      .leftJoin(appointments, eq(appointments.departmentId, departments.id))
      .where(eq(departments.hospitalId, hospitalId))
      .groupBy(departments.id);

    const averageWaitTime = deptRows.length
      ? Math.round(deptRows.reduce((acc, d) => acc + (d.avgTime || 0), 0) / deptRows.length)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalPatientsToday: summaryRows[0]?.totalPatientsToday || 0,
          totalWaiting: summaryRows[0]?.totalWaiting || 0,
          totalServed: summaryRows[0]?.totalServed || 0,
          averageWaitTime,
        },
        departmentStats: deptRows.map((d) => ({
          departmentId: d.departmentId,
        departmentName: d.departmentName,
        totalWaiting: d.totalWaiting || 0,
        totalServed: d.totalServed || 0,
        currentToken: d.currentToken || 0,
        averageServiceTimeMin: d.avgTime || 0,
      })),
    },
  });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ success: false, error: "Failed to load analytics" }, { status: 500 });
  }
}
