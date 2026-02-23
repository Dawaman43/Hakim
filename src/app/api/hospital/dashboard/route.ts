import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, departments, hospitals, users } from "@/db/schema";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const hospitalIdParam = searchParams.get("hospitalId");

    let hospitalId = hospitalIdParam;
    if (payload.role !== "SUPER_ADMIN") {
      const hosp = await db.select().from(hospitals).where(eq(hospitals.adminId, payload.userId)).limit(1);
      if (!hosp[0]) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      hospitalId = hosp[0].id;
    }

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });
    }

    const hospital = (await db.select().from(hospitals).where(eq(hospitals.id, hospitalId)).limit(1))[0];
    if (!hospital) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

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

    const apptRows = await db
      .select({
        id: appointments.id,
        tokenNumber: appointments.tokenNumber,
        status: appointments.status,
        createdAt: appointments.createdAt,
        notes: appointments.notes,
        patientName: users.name,
        patientPhone: users.phone,
        departmentName: departments.name,
      })
      .from(appointments)
      .leftJoin(users, eq(users.id, appointments.patientId))
      .leftJoin(departments, eq(departments.id, appointments.departmentId))
      .where(eq(appointments.hospitalId, hospitalId))
      .orderBy(desc(appointments.createdAt))
      .limit(30);

    return NextResponse.json({
      success: true,
      data: {
        hospital,
        stats: {
          todayPatients: summaryRows[0]?.totalPatientsToday || 0,
          waiting: summaryRows[0]?.totalWaiting || 0,
          served: summaryRows[0]?.totalServed || 0,
          avgWaitTime: averageWaitTime,
        },
        queues: deptRows.map((d) => ({
          departmentId: d.departmentId,
          departmentName: d.departmentName,
          waiting: d.totalWaiting || 0,
          served: d.totalServed || 0,
          currentToken: d.currentToken || 0,
          status: (d.totalWaiting || 0) > 10 ? "busy" : "normal",
        })),
        appointments: apptRows,
      },
    });
  } catch (error) {
    console.error("Hospital dashboard error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
