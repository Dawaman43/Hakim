import { Bot, webhookCallback } from "grammy";
import { setupBot } from "@/lib/telegram-bot";
import { NextRequest, NextResponse } from "next/server";

// This is the production webhook endpoint
// It will only be active if TELEGRAM_BOT_TOKEN is set

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  // If no token is set, we return a 404 or a simple message
  // This avoids errors during build time if environment variables aren't injected yet
  console.warn("TELEGRAM_BOT_TOKEN not set for webhook route");
}

// Create the bot instance for the webhook
const bot = token ? new Bot(token) : null;

// Initialize bot logic if bot exists
if (bot) {
  setupBot(bot);
}

export async function POST(req: NextRequest) {
  if (!bot) {
    return NextResponse.json({ error: "Bot not initialized" }, { status: 500 });
  }

  try {
    // Grammy handles the request parsing and response
    return await webhookCallback(bot, "std/http")(req);
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

// Optional: You can also add a GET route to easily check if the webhook is "available"
export async function GET() {
  return NextResponse.json({ 
    status: "alive", 
    mode: "webhook",
    configured: !!token 
  });
}
