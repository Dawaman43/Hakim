import { NextRequest, NextResponse } from "next/server";

const OPENAI_MODEL = "gpt-4o-mini";
const GEMINI_MODEL = "gemini-2.0-flash-lite";

const SYSTEM_PROMPT = [
  "You are a medical triage assistant for a queue management app in Ethiopia.",
  "Provide concise guidance and ask clarifying questions when helpful.",
  "Do not provide a diagnosis or treatment plan.",
  "If symptoms appear life-threatening, advise calling emergency services (911).",
  "Keep responses short and clear."
].join(" ");

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildTranscript(messages: ChatMessage[]) {
  return messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
}

async function callGemini(messages: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const text = `${SYSTEM_PROMPT}\n${buildTranscript(messages)}\nAssistant:`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

async function callOpenAI(messages: ChatMessage[]) {
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
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const filtered = messages
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-12);

    if (filtered.length === 0) {
      return NextResponse.json({ success: false, error: "Messages are required" }, { status: 400 });
    }

    const reply = (await callGemini(filtered)) || (await callOpenAI(filtered)) ||
      "I'm sorry, I couldn't generate a response right now. If this feels urgent, please call emergency services (911).";

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error("Emergency chat API error:", error);
    return NextResponse.json({ success: false, error: "Failed to get AI response" }, { status: 500 });
  }
}
