import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { notifications } from "@/db/schema";
import { desc } from "drizzle-orm";
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

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || 100), 300);

    const rows = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        channel: notifications.channel,
        recipient: notifications.recipient,
        message: notifications.message,
        status: notifications.status,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Admin audit error:", error);
    return NextResponse.json({ success: false, error: "Failed to load audit logs" }, { status: 500 });
  }
}
