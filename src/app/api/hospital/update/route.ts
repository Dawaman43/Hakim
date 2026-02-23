import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { hospitals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      hospitalId,
      name,
      region,
      city,
      address,
      emergencyContactNumber,
      latitude,
      longitude,
      facilityType,
    } = body || {};

    let targetHospitalId = hospitalId as string | null;
    if (payload.role !== "SUPER_ADMIN") {
      const hosp = await db.select().from(hospitals).where(eq(hospitals.adminId, payload.userId)).limit(1);
      if (!hosp[0]) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      targetHospitalId = hosp[0].id;
    }

    if (!targetHospitalId) {
      return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });
    }

    await db.update(hospitals).set({
      name: name ?? undefined,
      region: region ?? undefined,
      city: city ?? undefined,
      address: address ?? undefined,
      emergencyContactNumber: emergencyContactNumber ?? undefined,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      facilityType: facilityType ?? undefined,
    }).where(eq(hospitals.id, targetHospitalId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hospital update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update hospital" }, { status: 500 });
  }
}
