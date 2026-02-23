import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { hospitals, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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

    const rows = await db
      .select({
        hospital: hospitals,
        adminName: users.name,
        adminPhone: users.phone,
      })
      .from(hospitals)
      .leftJoin(users, eq(hospitals.adminId, users.id))
      .where(and(eq(hospitals.isActive, false)));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Pending hospitals error:", error);
    return NextResponse.json({ success: false, error: "Failed to load" }, { status: 500 });
  }
}
