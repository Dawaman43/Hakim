export async function sendTelegramMessage(telegramId: string | null | undefined, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !telegramId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: telegramId, text: message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

