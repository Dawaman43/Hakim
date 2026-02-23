import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, departments, hospitals, notifications, users } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";
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
    let phone = payload?.phone as string | undefined;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!phone) {
      const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      phone = userRows[0]?.phone;
    }

    const whereClause = phone
      ? or(eq(appointments.patientId, userId), eq(notifications.recipient, phone))
      : eq(appointments.patientId, userId);

    const rows = await db
      .select({
        notification: notifications,
        appointment: appointments,
        hospitalName: hospitals.name,
        departmentName: departments.name,
      })
      .from(notifications)
      .leftJoin(appointments, eq(notifications.appointmentId, appointments.id))
      .leftJoin(hospitals, eq(appointments.hospitalId, hospitals.id))
      .leftJoin(departments, eq(appointments.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(notifications.createdAt))
      .limit(100);

    return NextResponse.json({
      success: true,
      data: rows.map((row) => ({
        ...row.notification,
        appointment: row.appointment
          ? {
              ...row.appointment,
              hospital: row.hospitalName ? { name: row.hospitalName } : undefined,
              department: row.departmentName ? { name: row.departmentName } : undefined,
            }
          : null,
        hospitalName: row.hospitalName,
        departmentName: row.departmentName,
      })),
    });
  } catch (error) {
    console.error("Notifications error:", error);
    const message = error instanceof Error ? error.message : "Failed to load notifications";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
