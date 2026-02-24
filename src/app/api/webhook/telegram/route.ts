import { Bot, webhookCallback } from "grammy";
import { setupBot } from "@/lib/telegram-bot";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const requestId = Math.random().toString(36).substring(7);
  console.log(`📥 [${requestId}] Received Telegram Webhook POST request`);
  
  if (!bot) {
    console.error(`❌ [${requestId}] Webhook error: bot not initialized`);
    return NextResponse.json({ error: "Bot not initialized" }, { status: 500 });
  }

  try {
    // Read the body for logging (clone the request because we can only read body once)
    const clonedReq = req.clone();
    const body = await clonedReq.json();
    console.log(`📦 [${requestId}] Update body:`, JSON.stringify(body).substring(0, 500));

    // Grammy handles the request parsing and response
    // For Next.js App Router, "std/http" is usually correct as it takes a standard Request
    const response = await webhookCallback(bot, "std/http")(req);
    console.log(`✅ [${requestId}] Webhook processed successfully, status: ${response.status}`);
    return response;
  } catch (err: any) {
    console.error(`❌ [${requestId}] Webhook processing error:`, err.message);
    // Always return 200 to Telegram to stop retries if it's a logic error,
    // but here it might be a connectivity error.
    return NextResponse.json({ error: "Internal processing error", message: err.message }, { status: 200 });
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
      const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL || `${protocol}://${host}/api/webhook/telegram`;
      
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
