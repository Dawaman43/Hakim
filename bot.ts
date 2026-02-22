import { Bot } from "grammy";
import { setupBot } from "./src/lib/telegram-bot";
import { config } from "dotenv";

// Load environment variables from .env
config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Error: TELEGRAM_BOT_TOKEN environment variable not set.");
  process.exit(1);
}

const bot = new Bot(token);

// Initialize bot logic from shared library
setupBot(bot);

bot.start({
  onStart: (botInfo) => {
    console.log(`🤖 Hakim Bot @${botInfo.username} is running securely (Polling mode)...`);
    console.log(`Waiting for commands on Telegram!`);
  }
});

