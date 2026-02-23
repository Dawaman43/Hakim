import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { notifications } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { aiTriage } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptomsText, hospitalId, contactPhone, guestName } = body;

    if (!symptomsText || typeof symptomsText !== "string" || symptomsText.trim().length < 5) {
      return NextResponse.json({ success: false, error: "Symptoms are required" }, { status: 400 });
    }

    let triage = await aiTriage(symptomsText);

    if (!triage.emergencyNumber) triage.emergencyNumber = "911";

    // Create a notification for the hospital admin (mocked or saved to DB)
    const notificationId = uuidv4();
    await db.insert(notifications).values({
      id: notificationId,
      type: "EMERGENCY_REPORT",
      channel: "DASHBOARD",
      recipient: hospitalId || "SYSTEM_ADMIN",
      message: `Emergency Report: ${symptomsText}\nContact: ${contactPhone} ${guestName ? `(${guestName})` : ""}\nSeverity: ${triage.severityLevel}`,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      triage,
    });

  } catch (error: any) {
    console.error("Emergency report API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
