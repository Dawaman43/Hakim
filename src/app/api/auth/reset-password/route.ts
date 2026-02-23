import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { otpCodes, users } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const { phone, otpCode, newPassword } = await req.json();

    if (!phone || !otpCode || !newPassword) {
      return NextResponse.json({ success: false, error: "Phone, code, and new password are required" }, { status: 400 });
    }

    const recentCodes = await db.select().from(otpCodes)
      .where(and(
        eq(otpCodes.phone, phone),
        eq(otpCodes.verified, false),
        eq(otpCodes.purpose, "PASSWORD_RESET")
      ))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (recentCodes.length === 0) {
      return NextResponse.json({ success: false, error: "No pending reset OTP found for this number" }, { status: 400 });
    }

    const latestChallenge = recentCodes[0];

    if (new Date() > latestChallenge.expiresAt) {
      return NextResponse.json({ success: false, error: "OTP code has expired" }, { status: 400 });
    }

    if (latestChallenge.code !== otpCode) {
      return NextResponse.json({ success: false, error: "Invalid OTP code" }, { status: 400 });
    }

    const user = (await db.select().from(users).where(eq(users.phone, phone)).limit(1))[0];
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    await db.update(users).set({ passwordHash: hashPassword(newPassword) }).where(eq(users.id, user.id));
    await db.update(otpCodes).set({ verified: true }).where(eq(otpCodes.id, latestChallenge.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
  }
}
