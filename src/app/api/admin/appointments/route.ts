import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, departments, hospitals, users } from "@/db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "all";
    const statusParam = searchParams.get("status");
    const hospitalIdParam = searchParams.get("hospitalId");
    const limit = Math.min(Number(searchParams.get("limit") || 50), 200);
    const offset = Math.max(Number(searchParams.get("offset") || 0), 0);

    let hospitalId = hospitalIdParam;
    if (payload.role !== "SUPER_ADMIN") {
      const hosp = await db.select().from(hospitals).where(eq(hospitals.adminId, payload.userId)).limit(1);
      if (!hosp[0]) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      hospitalId = hosp[0].id;
    }

    const statusList = statusParam ? statusParam.split(",").map((s) => s.trim()) : null;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const whereParts = [
      hospitalId ? eq(appointments.hospitalId, hospitalId) : undefined,
      statusList ? inArray(appointments.status, statusList as any) : undefined,
      scope === "today" ? sql`${appointments.createdAt} >= ${startOfDay}` : undefined,
    ].filter(Boolean) as any[];

    const whereClause = whereParts.length ? and(...whereParts) : undefined;

    let query = db
      .select({
        id: appointments.id,
        tokenNumber: appointments.tokenNumber,
        status: appointments.status,
        createdAt: appointments.createdAt,
        notes: appointments.notes,
        patientName: users.name,
        patientPhone: users.phone,
        departmentName: departments.name,
        hospitalName: hospitals.name,
      })
      .from(appointments)
      .leftJoin(users, eq(users.id, appointments.patientId))
      .leftJoin(departments, eq(departments.id, appointments.departmentId))
      .leftJoin(hospitals, eq(hospitals.id, appointments.hospitalId))
      .orderBy(desc(appointments.createdAt))
      .limit(limit)
      .offset(offset);

    if (whereClause) {
      query = query.where(whereClause);
    }

    const rows = await query;

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Admin appointments error:", error);
    return NextResponse.json({ success: false, error: "Failed to load appointments" }, { status: 500 });
  }
}
