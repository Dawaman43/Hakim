import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { notifications } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

type TriagePayload = {
  severityLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  recommendation: string;
  isEmergency: boolean;
  emergencyNumber?: string;
  keywords: string[];
};

const OPENAI_MODEL = "gpt-4o-mini";
const GEMINI_MODEL = "gemini-2.0-flash-lite";

const SYSTEM_PROMPT = [
  "You are a medical triage assistant for a queue management app in Ethiopia.",
  "Return ONLY valid JSON with keys:",
  "severityLevel (CRITICAL|HIGH|MEDIUM|LOW),",
  "confidence (0-1), recommendation (short),",
  "isEmergency (boolean), emergencyNumber (string, use 911), keywords (array of strings).",
  "If symptoms indicate immediate danger, use CRITICAL or HIGH.",
  "Do not include any extra text."
].join(" ");

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

async function callGemini(symptomsText: string): Promise<TriagePayload | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${SYSTEM_PROMPT}\nSymptoms: ${symptomsText}` }],
          },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) return null;
  const json = extractJson(content);
  if (!json) return null;
  return JSON.parse(json) as TriagePayload;
}

async function callOpenAI(symptomsText: string): Promise<TriagePayload | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Symptoms: ${symptomsText}` },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;
  const json = extractJson(content);
  if (!json) return null;
  return JSON.parse(json) as TriagePayload;
}
function fallbackTriage(symptomsText: string): TriagePayload {
  const keywords = ["chest", "breath", "blood", "heart", "stroke", "accident", "unconscious", "seizure"];
  const found = keywords.filter((k) => symptomsText?.toLowerCase().includes(k));
  const severityLevel = found.length > 0 ? "CRITICAL" : "MEDIUM";
  return {
    severityLevel,
    confidence: 0.7,
    recommendation: severityLevel === "CRITICAL"
      ? "Seek immediate medical attention. Call 911 or go to the nearest emergency room."
      : "Consult a doctor promptly.",
    isEmergency: severityLevel === "CRITICAL" || severityLevel === "HIGH",
    emergencyNumber: "911",
    keywords: found,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptomsText, hospitalId, contactPhone, guestName } = body;

    if (!symptomsText || typeof symptomsText !== "string" || symptomsText.trim().length < 5) {
      return NextResponse.json({ success: false, error: "Symptoms are required" }, { status: 400 });
    }

    let triage =
      (await callGemini(symptomsText)) ||
      (await callOpenAI(symptomsText)) ||
      fallbackTriage(symptomsText);

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
