import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { otpCodes, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendTelegramOtp(telegramId: string, code: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramId,
      text: `🔐 Your Hakim password reset code is: ${code}`,
    }),
  }).catch(() => null);
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const user = (await db.select().from(users).where(eq(users.phone, phone)).limit(1))[0];

    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await db.insert(otpCodes).values({
      id: uuidv4(),
      phone,
      code,
      purpose: "PASSWORD_RESET",
      expiresAt,
    });

    if (user?.telegramId) {
      await sendTelegramOtp(user.telegramId, code);
    }

    return NextResponse.json({ success: true, message: "If the account exists, an OTP was sent." });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json({ success: false, error: "Failed to request password reset" }, { status: 500 });
  }
}
