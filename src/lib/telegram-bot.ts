import { Bot, Context } from "grammy";
import { db } from "@/db/client";
import { otpCodes, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Note: This file should not call config() or start()
// It just defines the bot behavior.

export function setupBot(bot: Bot) {
  // Keep track of users we've asked for contacts to prevent spamming the keyboard
  const waitingForContact = new Set<number>();

  bot.command("start", async (ctx) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const existingUserList = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      const existingUser = existingUserList[0];

      if (existingUser) {
        // Known user! Check if they have an pending auth challenge.
        const recentCodes = await db.select().from(otpCodes)
          .where(and(eq(otpCodes.phone, existingUser.phone), eq(otpCodes.verified, false)))
          .orderBy(desc(otpCodes.createdAt))
          .limit(1);

        const latestChallenge = recentCodes[0];

        if (latestChallenge && new Date() <= latestChallenge.expiresAt) {
          await ctx.reply(`Welcome back, ${existingUser.name || "friend"}! 👋\n\nYour Hakim authentication code is: **${latestChallenge.code}**\n\nIt expires in 10 minutes. Enter this code on the website to securely log in.`, { parse_mode: "Markdown" });
        } else {
          await ctx.reply(`Welcome back to Hakim, ${existingUser.name || "friend"}!\n\nTo log in, please request a code from the Hakim web app first.`);
        }
        return;
      }
    } catch (error) {
      console.error("DB error on start:", error);
    }

    // If not known yet, ask for contact
    waitingForContact.add(ctx.from?.id!);
    await ctx.reply(
      "Welcome to Hakim! 🏥\n\nTo keep your medical data secure, we need to verify your phone number. Please press the button below to share your contact so we can fetch your login code.\n\n*(Note: You must initiate a login on the web app first!)*",
      {
        reply_markup: {
          keyboard: [
            [{ text: "📱 Share Contact", request_contact: true }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  });

  bot.on("message:contact", async (ctx) => {
    const contact = ctx.message.contact;

    if (contact.user_id !== ctx.from.id) {
      return ctx.reply("Please share your own contact information.");
    }

    // Scrub the phone number to match the DB format (e.g. 09... instead of +2519...)
    let phone = contact.phone_number;
    if (phone.startsWith("+251")) {
      phone = "0" + phone.slice(4);
    } else if (phone.startsWith("251")) {
      phone = "0" + phone.slice(3);
    } else if (phone.startsWith("+")) {
       // Just in case other country codes
       phone = phone.replace("+", "");
    }

    waitingForContact.delete(ctx.from.id);

    // Check the DB for pending OTPs for this number
    try {
      const recentCodes = await db.select().from(otpCodes)
        .where(and(eq(otpCodes.phone, phone), eq(otpCodes.verified, false)))
        .orderBy(desc(otpCodes.createdAt))
        .limit(1);

      const latestChallenge = recentCodes[0];

      if (!latestChallenge || new Date() > latestChallenge.expiresAt) {
        await ctx.reply(
          "I couldn't find a pending login request for this phone number.\n\nPlease go to the Hakim Web App, enter your phone number to register or login first, and then come back here!",
          { reply_markup: { remove_keyboard: true } }
        );
        return;
      }

      // Connect telegramId to the user so they bypass contact sharing next time!
      const telegramId = ctx.from.id.toString();
      const existingUserList = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      const existingUser = existingUserList[0];

      if (existingUser) {
        await db.update(users).set({ telegramId }).where(eq(users.id, existingUser.id));
      } else {
        await db.insert(users).values({
          id: uuidv4(),
          phone,
          telegramId,
        });
      }

      await ctx.reply(
        `Verification successful! 👋\n\nYour Hakim authentication code is: **${latestChallenge.code}**\n\nIt expires in 10 minutes. Enter this code on the website to securely log in.`,
        { parse_mode: "Markdown", reply_markup: { remove_keyboard: true } }
      );

    } catch (error) {
      console.error("Database query error:", error);
      await ctx.reply("Sorry, I encountered an internal error while checking your code. Please try again later.", { reply_markup: { remove_keyboard: true } });
    }
  });

  bot.on("message", async (ctx) => {
    if (waitingForContact.has(ctx.from.id)) {
      await ctx.reply("Please use the '📱 Share Contact' button below to continue.", {
         reply_markup: {
          keyboard: [
            [{ text: "📱 Share Contact", request_contact: true }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    } else {
      // If we already know them, typing random stuff should just tell them to use the web app.
      const telegramId = ctx.from?.id.toString();
      if (telegramId) {
        const existingUserList = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
        if (existingUserList.length > 0) {
          await ctx.reply("Please request a new code from the Hakim web app when you need to log in!");
          return;
        }
      }
      await ctx.reply("Send /start to securely authenticate with Hakim.");
    }
  });

  bot.catch((err) => {
    console.error("Bot error:", err);
  });
}
