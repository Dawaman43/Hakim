import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { phone, name, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json({ success: false, error: "Phone and password are required" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (existing[0]) {
      return NextResponse.json({ success: false, error: "Phone already registered" }, { status: 400 });
    }

    const userId = uuidv4();
    await db.insert(users).values({
      id: userId,
      phone,
      name: name || null,
      role: "PATIENT",
      isVerified: true,
      passwordHash: hashPassword(password),
    });

    const user = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];
    const token = await signToken({ userId, phone: user.phone, role: user.role });
    return NextResponse.json({ success: true, user, token });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 });
  }
}
