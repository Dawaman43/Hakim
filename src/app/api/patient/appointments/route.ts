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
    } catch {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const userId = payload?.userId as string | undefined;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const allowed = ["WAITING", "SERVING", "COMPLETED", "CANCELLED", "SKIPPED", "EMERGENCY"];
    const statusFilter = status && allowed.includes(status) ? [status] : allowed;

    const rows = await db
      .select({
        appointment: appointments,
        hospitalName: hospitals.name,
        departmentName: departments.name,
      })
      .from(appointments)
      .innerJoin(hospitals, eq(appointments.hospitalId, hospitals.id))
      .innerJoin(departments, eq(appointments.departmentId, departments.id))
      .where(
        and(
          eq(appointments.patientId, userId),
          inArray(appointments.status, statusFilter as any)
        )
      )
      .orderBy(desc(appointments.createdAt));

    return NextResponse.json({
      success: true,
      data: rows.map((row) => ({
        ...row.appointment,
        hospital: { name: row.hospitalName },
        department: { name: row.departmentName },
      })),
    });
  } catch (error) {
    console.error("Appointments error:", error);
    const message = error instanceof Error ? error.message : "Failed to load appointments";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
