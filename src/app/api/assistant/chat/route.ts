import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`assistant-chat:${ip}`, 20, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const filtered: ChatMessage[] = messages
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-16);

    if (filtered.length === 0) {
      return NextResponse.json({ success: false, error: "Messages are required" }, { status: 400 });
    }

    const reply = (await aiChat(filtered)) ||
      "I'm sorry, I couldn't generate a response right now. If this feels urgent, please call emergency services (911).";

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error("Assistant chat API error:", error);
    return NextResponse.json({ success: false, error: "Failed to get AI response" }, { status: 500 });
  }
}
