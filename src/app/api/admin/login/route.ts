import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json({ success: false, error: "Phone and password are required" }, { status: 400 });
    }

    const rows = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    const user = rows[0];
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    if (user.role !== "HOSPITAL_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const token = await signToken({ userId: user.id, phone: user.phone, role: user.role });
    return NextResponse.json({ success: true, user, token });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, error: "Failed to login" }, { status: 500 });
  }
}
