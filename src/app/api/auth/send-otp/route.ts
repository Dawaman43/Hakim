import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { otpCodes, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { normalizeEthiopianPhone } from "@/lib/phone";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

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
      text: `🔐 Your Hakim OTP code is: ${code}`,
    }),
  }).catch(() => null);
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`send-otp:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const { phone, purpose } = await req.json();
    const normalizedPhone = normalizeEthiopianPhone(phone);

    if (!normalizedPhone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const newId = uuidv4();
    console.log("Inserting OTP", { newId, phone: normalizedPhone, code, purpose, expiresAt });

    await db.insert(otpCodes).values({
      id: newId,
      phone: normalizedPhone,
      code,
      purpose: purpose || "LOGIN",
      expiresAt,
    });

    const user = (await db.select().from(users).where(eq(users.phone, normalizedPhone)).limit(1))[0];
    if (user?.telegramId) {
      await sendTelegramOtp(user.telegramId, code);
    }

    if (process.env.NODE_ENV === "development") {
       return NextResponse.json({ success: true, otpCode: code });
    }

    return NextResponse.json({
      success: true,
      message: "OTP generated in DB. Awaiting Telegram bot to transmit.",
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate OTP" }, { status: 500 });
  }
}
