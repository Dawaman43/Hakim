import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, departments, hospitals, users } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";
import { sendTelegramMessage } from "@/lib/telegram-notify";

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { departmentId, hospitalId } = await request.json();
    if (!departmentId || !hospitalId) {
      return NextResponse.json({ success: false, error: "departmentId and hospitalId required" }, { status: 400 });
    }

    if (payload.role !== "SUPER_ADMIN") {
      const hosp = await db.select().from(hospitals).where(eq(hospitals.id, hospitalId)).limit(1);
      if (!hosp[0] || hosp[0].adminId !== payload.userId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    const next = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.departmentId, departmentId), eq(appointments.status, "WAITING")))
      .orderBy(asc(appointments.createdAt))
      .limit(1);

    if (!next[0]) {
      return NextResponse.json({ success: false, error: "No waiting patients" }, { status: 404 });
    }

    await db.update(appointments).set({ status: "SERVING" }).where(eq(appointments.id, next[0].id));
    await db.update(departments).set({ currentQueueCount: next[0].tokenNumber }).where(eq(departments.id, departmentId));

    const appt = await db
      .select({
        appointmentId: appointments.id,
        tokenNumber: appointments.tokenNumber,
        patientName: users.name,
        patientPhone: users.phone,
        patientTelegramId: users.telegramId,
        hospitalName: hospitals.name,
        departmentName: departments.name,
      })
      .from(appointments)
      .leftJoin(users, eq(users.id, appointments.patientId))
      .leftJoin(hospitals, eq(hospitals.id, appointments.hospitalId))
      .leftJoin(departments, eq(departments.id, appointments.departmentId))
      .where(eq(appointments.id, next[0].id))
      .limit(1);

    if (appt[0]?.patientTelegramId) {
      await sendTelegramMessage(
        appt[0].patientTelegramId,
        `✅ Your appointment is ready.\nHospital: ${appt[0].hospitalName}\nDepartment: ${appt[0].departmentName}\nToken: #${appt[0].tokenNumber}\nPlease proceed to the desk now.`
      );
    }

    return NextResponse.json({ success: true, data: next[0] });
  } catch (error) {
    console.error("Call next error:", error);
    return NextResponse.json({ success: false, error: "Failed to call next" }, { status: 500 });
  }
}
