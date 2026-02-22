import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { notifications } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptomsText, hospitalId, contactPhone, guestName } = body;

    // Simple keyword extraction for triage in the API too
    const keywords = ["chest", "breath", "blood", "heart", "stroke", "accident"];
    const found = keywords.filter(k => symptomsText?.toLowerCase().includes(k));
    
    const severity = found.length > 0 ? "CRITICAL" : "MEDIUM";

    // Create a notification for the hospital admin (mocked or saved to DB)
    const notificationId = uuidv4();
    await db.insert(notifications).values({
      id: notificationId,
      type: "EMERGENCY_REPORT",
      channel: "DASHBOARD",
      recipient: hospitalId || "SYSTEM_ADMIN",
      message: `Emergency Report: ${symptomsText}\nContact: ${contactPhone} ${guestName ? `(${guestName})` : ""}\nSeverity: ${severity}`,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      triage: {
        severity,
        recommendation: severity === "CRITICAL" 
          ? "Seek immediate medical attention. Call 911." 
          : "Consult a doctor promptly.",
        confidence: 0.85,
        identifiedKeywords: found
      }
    });

  } catch (error: any) {
    console.error("Emergency report API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
