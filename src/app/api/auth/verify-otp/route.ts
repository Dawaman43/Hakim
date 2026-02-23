import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users, otpCodes } from "@/db/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { signToken } from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";

async function notifySuperAdmins(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ids = (process.env.SUPER_ADMIN_TELEGRAM_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!token || ids.length === 0) return;
  await Promise.all(
    ids.map((chatId) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      }).catch(() => null)
    )
  );
}

export async function POST(req: Request) {
  try {
    const { phone, otpCode, name } = await req.json();

    if (!phone || !otpCode) {
      return NextResponse.json({ success: false, error: "Phone and code are required" }, { status: 400 });
    }

    const recentCodes = await db.select().from(otpCodes)
      .where(and(
        eq(otpCodes.phone, phone),
        eq(otpCodes.verified, false),
        or(eq(otpCodes.purpose, "LOGIN"), eq(otpCodes.purpose, "REGISTRATION"))
      ))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (recentCodes.length === 0) {
      return NextResponse.json({ success: false, error: "No pending OTP found for this number" }, { status: 400 });
    }

    const latestChallenge = recentCodes[0];

    if (new Date() > latestChallenge.expiresAt) {
      return NextResponse.json({ success: false, error: "OTP code has expired" }, { status: 400 });
    }

    if (latestChallenge.code !== otpCode) {
      return NextResponse.json({ success: false, error: "Invalid OTP code" }, { status: 400 });
    }

    await db.update(otpCodes).set({ verified: true }).where(eq(otpCodes.id, latestChallenge.id));

    let userList = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    let user = userList[0];

    if (!user) {
      const newUserId = uuidv4();
      await db.insert(users).values({
        id: newUserId,
        phone,
        name: name || null,
        role: "PATIENT",
        isVerified: true,
      });
      await notifySuperAdmins(`New user registered: ${phone}${name ? ` (${name})` : ""}`);
      userList = await db.select().from(users).where(eq(users.id, newUserId)).limit(1);
      user = userList[0];
    } else if (name && !user.name) {
      await db.update(users).set({ name }).where(eq(users.id, user.id));
      user.name = name;
    }

    const token = await signToken({ userId: user.id, phone: user.phone });

    return NextResponse.json({ success: true, user, token });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ success: false, error: "Failed to verify OTP" }, { status: 500 });
  }
}
