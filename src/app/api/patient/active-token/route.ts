import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, departments, hospitals } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = await verifyToken(token);
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
    const userId = payload?.userId as string | undefined;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        appointment: appointments,
        hospitalName: hospitals.name,
        departmentName: departments.name,
        deptAvg: departments.averageServiceTimeMin,
        deptQueue: departments.currentQueueCount,
      })
      .from(appointments)
      .innerJoin(hospitals, eq(appointments.hospitalId, hospitals.id))
      .innerJoin(departments, eq(appointments.departmentId, departments.id))
      .where(
        and(
          eq(appointments.patientId, userId),
          inArray(appointments.status, ["WAITING", "SERVING", "EMERGENCY"])
        )
      )
      .orderBy(desc(appointments.createdAt))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ success: true, appointment: null, queueStatus: null });
    }

    const row = rows[0];
    const appt = row.appointment;
    const totalWaiting = Math.max((row.deptQueue ?? 0) - appt.tokenNumber, 0);
    const estimatedWaitMinutes = totalWaiting * (row.deptAvg ?? 0);

    return NextResponse.json({
      success: true,
      appointment: {
        ...appt,
        hospital: { name: row.hospitalName },
        department: { name: row.departmentName },
      },
      queueStatus: {
        departmentId: appt.departmentId,
        departmentName: row.departmentName,
        currentToken: Math.max((row.deptQueue ?? appt.tokenNumber) - totalWaiting, appt.tokenNumber),
        lastTokenIssued: row.deptQueue ?? appt.tokenNumber,
        totalWaiting,
        estimatedWaitMinutes,
        nextAvailableSlot: "",
      },
    });
  } catch (error) {
    console.error("Active token error:", error);
    const message = error instanceof Error ? error.message : "Failed to load active token";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
