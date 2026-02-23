import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { otpCodes } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

function generateLinkCode() {
  return uuidv4().replace(/-/g, "").slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const linkCode = generateLinkCode();
    await db.insert(otpCodes).values({
      id: uuidv4(),
      phone,
      code: linkCode,
      purpose: "TELEGRAM_LINK",
      expiresAt,
    });

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "Hakim_bet_bot";
    const telegramLink = `https://t.me/${botUsername}?start=link_${linkCode}`;

    return NextResponse.json({ success: true, telegramLink });
  } catch (error) {
    console.error("Telegram link error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate link" }, { status: 500 });
  }
}
