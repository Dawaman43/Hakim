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

// Optional: Check status or register the webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const register = searchParams.get("register");

  if (register === "true" && bot) {
    try {
      // Get the current domain from the request headers
      const host = req.headers.get("host");
      const protocol = host?.includes("localhost") ? "http" : "https";
      const webhookUrl = `${protocol}://${host}/api/webhook/telegram`;
      
      await bot.api.setWebhook(webhookUrl);
      return NextResponse.json({ 
        success: true, 
        message: `Webhook registered to ${webhookUrl}`,
        mode: "webhook"
      });
    } catch (err: any) {
      return NextResponse.json({ 
        success: false, 
        error: err.message 
      }, { status: 500 });
    }
  }

  return NextResponse.json({ 
    status: "alive", 
    mode: "webhook",
    configured: !!token,
    tip: "Add ?register=true to this URL to link your bot to this endpoint"
  });
}
