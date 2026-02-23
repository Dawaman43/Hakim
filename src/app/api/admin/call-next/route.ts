import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, departments, hospitals } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

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

    return NextResponse.json({ success: true, data: next[0] });
  } catch (error) {
    console.error("Call next error:", error);
    return NextResponse.json({ success: false, error: "Failed to call next" }, { status: 500 });
  }
}
