import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, hospitals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

const allowedStatuses = ["WAITING", "SERVING", "COMPLETED", "CANCELLED", "SKIPPED", "EMERGENCY"];

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { appointmentId, status } = await request.json();
    if (!appointmentId || !status) {
      return NextResponse.json({ success: false, error: "appointmentId and status are required" }, { status: 400 });
    }
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const appt = await db.select().from(appointments).where(eq(appointments.id, appointmentId)).limit(1);
    if (!appt[0]) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (payload.role !== "SUPER_ADMIN") {
      const hosp = await db.select().from(hospitals).where(eq(hospitals.adminId, payload.userId)).limit(1);
      if (!hosp[0] || hosp[0].id !== appt[0].hospitalId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    await db.update(appointments).set({ status }).where(eq(appointments.id, appointmentId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ success: false, error: "Failed to update appointment" }, { status: 500 });
  }
}
