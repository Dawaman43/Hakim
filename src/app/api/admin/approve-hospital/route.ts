import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { hospitals, notifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";

async function notifyAdmin(telegramId: string | null | undefined, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !telegramId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: telegramId, text: message }),
  }).catch(() => null);
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (payload?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { hospitalId } = await request.json();
    if (!hospitalId) return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });

    const hospital = await db.select().from(hospitals).where(eq(hospitals.id, hospitalId)).limit(1);
    if (!hospital[0]) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    await db.update(hospitals).set({ isActive: true }).where(eq(hospitals.id, hospitalId));

    const admin = hospital[0].adminId
      ? (await db.select().from(users).where(eq(users.id, hospital[0].adminId!)).limit(1))[0]
      : null;

    await db.insert(notifications).values({
      id: uuidv4(),
      type: "HOSPITAL_APPROVED",
      channel: "SYSTEM",
      recipient: admin?.phone || "ADMIN",
      message: `Your hospital ${hospital[0].name} has been approved.`,
      status: "PENDING",
    });

    await notifyAdmin(admin?.telegramId, `Your hospital ${hospital[0].name} has been approved. You can now access the dashboard.`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve hospital error:", error);
    return NextResponse.json({ success: false, error: "Failed to approve" }, { status: 500 });
  }
}
