import { Bot, webhookCallback } from "grammy";
import { setupBot } from "@/lib/telegram-bot";
import { NextRequest, NextResponse } from "next/server";

// This is the production webhook endpoint
// It will only be active if TELEGRAM_BOT_TOKEN is set

const token = process.env.TELEGRAM_BOT_TOKEN;

// Create the bot instance for the webhook
let bot: Bot | null = null;

if (token) {
  bot = new Bot(token);
  setupBot(bot);
  console.log("🤖 Telegram Bot initialized for Webhook");
} else {
  console.warn("⚠️ TELEGRAM_BOT_TOKEN not set for webhook route");
}

export async function POST(req: NextRequest) {
  console.log("📥 Received Telegram Webhook POST request");
  
  if (!bot) {
    console.error("❌ Webhook error: TELEGRAM_BOT_TOKEN is missing or bot not initialized");
    return NextResponse.json({ error: "Bot not initialized" }, { status: 500 });
  }

  try {
    // Grammy handles the request parsing and response
    return await webhookCallback(bot, "std/http")(req);
  } catch (err: any) {
    console.error("❌ Webhook processing error:", err.message);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

// Optional: Check status or register the webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const register = searchParams.get("register");

  console.log("🔍 Webhook GET status check triggered");

  const status = {
    status: "alive",
    mode: "webhook",
    hasToken: !!token,
    tokenPrefix: token ? `${token.substring(0, 10)}...` : "NONE",
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || "unknown",
  };

  if (register === "true") {
    if (!bot) {
      console.error("❌ Registration failed: TELEGRAM_BOT_TOKEN not set");
      return NextResponse.json({ ...status, success: false, error: "TOKEN_MISSING" }, { status: 500 });
    }
    
    try {
      const host = req.headers.get("host") || "hakim-gray.vercel.app";
      const protocol = host.includes("localhost") ? "http" : "https";
      const webhookUrl = `${protocol}://${host}/api/webhook/telegram`;
      
      console.log(`📡 Attempting to register webhook: ${webhookUrl}`);
      await bot.api.setWebhook(webhookUrl);
      console.log("✅ Webhook successfully registered with Telegram");
      
      return NextResponse.json({ 
        ...status,
        success: true, 
        message: `Webhook registered to ${webhookUrl}`,
      });
    } catch (err: any) {
      console.error("❌ Webhook registration failed:", err.message);
      return NextResponse.json({ 
        ...status,
        success: false, 
        error: err.message 
      }, { status: 500 });
    }
  }

  return NextResponse.json({ 
    ...status,
    tip: "Add ?register=true to this URL to link your bot to this endpoint"
  });
}

