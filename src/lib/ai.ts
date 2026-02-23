type ChatMessage = { role: "user" | "assistant"; content: string };

const OPENAI_MODEL = "gpt-4o-mini";
const GEMINI_MODEL = "gemini-2.0-flash-lite";

const TRIAGE_SYSTEM_PROMPT = [
  "You are a medical triage assistant for a queue management app in Ethiopia.",
  "Return ONLY valid JSON with keys:",
  "severityLevel (CRITICAL|HIGH|MEDIUM|LOW),",
  "confidence (0-1), recommendation (short),",
  "isEmergency (boolean), emergencyNumber (string, use 911), keywords (array of strings).",
  "If symptoms indicate immediate danger, use CRITICAL or HIGH.",
  "Do not include any extra text."
].join(" ");

const CHAT_SYSTEM_PROMPT = [
  "You are a medical triage assistant for a queue management app in Ethiopia.",
  "Provide concise guidance and ask clarifying questions when helpful.",
  "Do not provide a diagnosis or treatment plan.",
  "If symptoms appear life-threatening, advise calling emergency services (911).",
  "Keep responses short and clear."
].join(" ");

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

async function callOpenAIChat(messages: ChatMessage[], systemPrompt: string) {
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
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

async function callGeminiChat(messages: ChatMessage[], systemPrompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const transcript = messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
  const text = `${systemPrompt}\n${transcript}\nAssistant:`;
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

export async function aiChat(messages: ChatMessage[]) {
  const reply = (await callGeminiChat(messages, CHAT_SYSTEM_PROMPT)) ||
    (await callOpenAIChat(messages, CHAT_SYSTEM_PROMPT));
  return reply;
}

export type TriagePayload = {
  severityLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  recommendation: string;
  isEmergency: boolean;
  emergencyNumber?: string;
  keywords: string[];
};

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

async function callGeminiTriage(symptomsText: string): Promise<TriagePayload | null> {
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
            parts: [{ text: `${TRIAGE_SYSTEM_PROMPT}\nSymptoms: ${symptomsText}` }],
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

async function callOpenAITriage(symptomsText: string): Promise<TriagePayload | null> {
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
        { role: "system", content: TRIAGE_SYSTEM_PROMPT },
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

export async function aiTriage(symptomsText: string): Promise<TriagePayload> {
  return (
    (await callGeminiTriage(symptomsText)) ||
    (await callOpenAITriage(symptomsText)) ||
    fallbackTriage(symptomsText)
  );
}
