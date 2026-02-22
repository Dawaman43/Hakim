import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { otpCodes } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { phone, purpose } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const newId = uuidv4();
    console.log("Inserting OTP", { newId, phone, code, purpose, expiresAt });

    await db.insert(otpCodes).values({
      id: newId,
      phone,
      code,
      purpose: purpose || "LOGIN",
      expiresAt,
    });

    if (process.env.NODE_ENV === "development") {
       return NextResponse.json({ success: true, otpCode: code });
    }

    return NextResponse.json({ success: true, message: "OTP generated in DB. Awaiting Telegram bot to transmit." });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate OTP" }, { status: 500 });
  }
}
