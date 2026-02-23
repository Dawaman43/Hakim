import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { departments, hospitals, notifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/password";
import { v4 as uuidv4 } from "uuid";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const SERVICE_MAP: Record<string, { name: string; avg: number }> = {
  emergency: { name: "Emergency", avg: 10 },
  outpatient: { name: "Outpatient", avg: 15 },
  inpatient: { name: "Inpatient", avg: 30 },
  laboratory: { name: "Laboratory", avg: 12 },
  radiology: { name: "Radiology", avg: 20 },
  pharmacy: { name: "Pharmacy", avg: 8 },
  maternal: { name: "Maternal Health", avg: 20 },
  pediatric: { name: "Pediatrics", avg: 18 },
  surgical: { name: "Surgical", avg: 25 },
};

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
    const ip = getClientIp(req);
    const limit = rateLimit(`hospital-register:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const body = await req.json();
    const {
      hospitalName,
      region,
      city,
      address,
      phone,
      email,
      adminName,
      adminPhone,
      adminPassword,
      services = [],
    } = body || {};

    if (!hospitalName || !region || !address || !adminName || !adminPhone || !adminPassword) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existingAdmin = await db.select().from(users).where(eq(users.phone, adminPhone)).limit(1);
    if (existingAdmin[0]) {
      return NextResponse.json({ success: false, error: "Admin phone already exists" }, { status: 400 });
    }

    const adminId = uuidv4();
    await db.insert(users).values({
      id: adminId,
      phone: adminPhone,
      name: adminName,
      email: email || null,
      role: "HOSPITAL_ADMIN",
      passwordHash: hashPassword(adminPassword),
      isVerified: true,
    });

    const hospitalId = uuidv4();
    await db.insert(hospitals).values({
      id: hospitalId,
      adminId,
      name: hospitalName,
      region,
      city: city || null,
      address,
      emergencyContactNumber: phone || null,
      isActive: false,
      facilityType: "HOSPITAL",
    });

    const deptValues = (services as string[])
      .map((s) => SERVICE_MAP[s])
      .filter(Boolean)
      .map((d) => ({
        id: uuidv4(),
        hospitalId,
        name: d.name,
        averageServiceTimeMin: d.avg,
        dailyCapacity: 50,
        currentQueueCount: 0,
        isActive: true,
      }));

    if (deptValues.length > 0) {
      await db.insert(departments).values(deptValues);
    }

    await db.insert(notifications).values({
      id: uuidv4(),
      type: "HOSPITAL_REGISTRATION",
      channel: "SYSTEM",
      recipient: "SUPER_ADMIN",
      message: `New hospital registration: ${hospitalName} (${region}) • Admin: ${adminName} (${adminPhone})`,
      status: "PENDING",
    });

    await notifySuperAdmins(`New hospital registration: ${hospitalName} (${region}). Admin: ${adminName} ${adminPhone}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hospital registration error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
