import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { appointments, hospitals, users, departments } from "@/db/schema";
import { sql } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (payload?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const totals = await db.execute(sql`
      select
        (select count(*) from ${hospitals})::int as "totalHospitals",
        (select count(*) from ${hospitals} where ${hospitals.isActive} = true)::int as "activeHospitals",
        (select count(*) from ${users})::int as "totalUsers",
        (select count(*) from ${departments})::int as "totalDepartments",
        (select count(*) from ${appointments})::int as "totalAppointments",
        (select count(*) from ${appointments} where ${appointments.status} = 'WAITING')::int as "totalWaiting",
        (select count(*) from ${appointments} where ${appointments.status} = 'COMPLETED')::int as "totalServed"
    `);

    const row = (totals as any)?.rows?.[0] ?? (Array.isArray(totals) ? totals[0] : null) ?? {};

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ success: false, error: "Failed to load overview" }, { status: 500 });
  }
}
