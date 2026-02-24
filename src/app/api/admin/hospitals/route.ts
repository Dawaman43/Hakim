import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { hospitals, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
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
        id: hospitals.id,
        name: hospitals.name,
        region: hospitals.region,
        city: hospitals.city,
        isActive: hospitals.isActive,
        adminId: hospitals.adminId,
        createdAt: hospitals.createdAt,
        adminName: users.name,
        adminPhone: users.phone,
      })
      .from(hospitals)
      .leftJoin(users, eq(users.id, hospitals.adminId))
      .orderBy(desc(hospitals.createdAt));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Admin hospitals error:", error);
    return NextResponse.json({ success: false, error: "Failed to load hospitals" }, { status: 500 });
  }
}
