import { Bot, InlineKeyboard } from "grammy";
import { db } from "@/db/client";
import { otpCodes, users, hospitals, departments, appointments } from "@/db/schema";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export function setupBot(bot: Bot) {
  const waitingForContact = new Set<number>();

  // Helper to format phone numbers
  const scrubPhone = (phone: string) => {
    let p = phone.replace(/\s+/g, "");
    if (p.startsWith("+251")) p = "0" + p.slice(4);
    else if (p.startsWith("251")) p = "0" + p.slice(3);
    return p;
  };

  // --- HEALTH & DEBUG ---
  bot.command("health", async (ctx) => {
    try {
      const start = Date.now();
      await db.select({ count: sql<number>`count(*)` }).from(users).limit(1);
      const latency = Date.now() - start;
      await ctx.reply(`✅ System healthy\nLatency: ${latency}ms\nMode: ${process.env.NODE_ENV}`);
    } catch (err: any) {
      await ctx.reply(`❌ System unhealthy\nError: ${err.message}`);
    }
  });

  bot.command("me", async (ctx) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const userList = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      if (userList.length === 0) {
        return ctx.reply("Your Telegram account is not linked to any Hakim profile. Use /start to link.");
      }
      const user = userList[0];
      await ctx.reply(`👤 Profile Info:\n\nName: ${user.name || "N/A"}\nPhone: ${user.phone}\nTelegram ID: ${user.telegramId}`);
    } catch (err) {
      ctx.reply("Error fetching profile.");
    }
  });

  // --- START & AUTH ---
  bot.command("start", async (ctx) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const existingUserList = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      const existingUser = existingUserList[0];

      if (existingUser) {
        await ctx.reply(`Welcome back to Hakim, ${existingUser.name || "friend"}! 👋\n\nUse /hospitals to find clinics or /book to get a token.`);
        return;
      }
    } catch (error) {
      console.error("DB error on start:", error);
    }

    waitingForContact.add(ctx.from?.id!);
    await ctx.reply(
      "Welcome to Hakim! 🏥\n\nPlease share your contact to verify your phone number and get your login code.",
      {
        reply_markup: {
          keyboard: [[{ text: "📱 Share Contact", request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  });

  bot.on("message:contact", async (ctx) => {
    const contact = ctx.message.contact;
    if (contact.user_id !== ctx.from.id) return ctx.reply("Please share your own contact.");

    const phone = scrubPhone(contact.phone_number);
    waitingForContact.delete(ctx.from.id);

    try {
      const telegramId = ctx.from.id.toString();
      const existingUserList = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      const existingUser = existingUserList[0];

      if (existingUser) {
        await db.update(users).set({ telegramId }).where(eq(users.id, existingUser.id));
      } else {
        await db.insert(users).values({ id: uuidv4(), phone, telegramId, name: contact.first_name });
      }

      await ctx.reply(`Verification successful! 👋\n\nYou can now use /hospitals or /book.`, { 
        reply_markup: { remove_keyboard: true } 
      });
    } catch (error) {
      console.error("Auth error:", error);
      await ctx.reply("Error during verification.");
    }
  });

  // --- HOSPITALS ---
  bot.command("hospitals", async (ctx) => {
    const query = ctx.match;
    try {
      let results;
      if (query) {
        results = await db.select().from(hospitals).where(like(hospitals.city, `%${query}%`)).limit(5);
      } else {
        results = await db.select().from(hospitals).limit(5);
      }

      if (results.length === 0) return ctx.reply("No hospitals found.");

      let response = "🏥 Available Hospitals:\n\n";
      results.forEach((h) => {
        response += `🔹 *${h.name}* (${h.city})\n   📍 ${h.address}\n\n`;
      });
      response += "Use /book to make an appointment.";
      await ctx.reply(response, { parse_mode: "Markdown" });
    } catch (err) {
      ctx.reply("Error fetching hospitals.");
    }
  });

  // --- BOOKING ---
  bot.command("book", async (ctx) => {
    const hList = await db.select().from(hospitals).where(eq(hospitals.isActive, true)).limit(5);
    if (hList.length === 0) return ctx.reply("No hospitals available for booking.");

    const keyboard = new InlineKeyboard();
    hList.forEach((h) => {
      keyboard.text(h.name, `book_hosp_${h.id}`).row();
    });

    await ctx.reply("Choose a hospital to book an appointment:", { reply_markup: keyboard });
  });

  bot.callbackQuery(/^book_hosp_(.+)$/, async (ctx) => {
    const hospitalId = ctx.match[1];
    const dList = await db.select().from(departments).where(and(eq(departments.hospitalId, hospitalId), eq(departments.isActive, true)));
    
    if (dList.length === 0) return ctx.answerCallbackQuery("No departments found for this hospital.");

    const keyboard = new InlineKeyboard();
    dList.forEach((d) => {
      keyboard.text(d.name, `book_dept_${hospitalId}_${d.id}`).row();
    });

    await ctx.editMessageText("Great! Now choose a department:", { reply_markup: keyboard });
  });

  bot.callbackQuery(/^book_dept_(.+)_(.+)$/, async (ctx) => {
    const [_, hospitalId, departmentId] = ctx.match;
    const telegramId = ctx.from.id.toString();

    try {
      const userList = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      if (userList.length === 0) return ctx.answerCallbackQuery("Please use /start to verify your phone first.");
      const user = userList[0];

      const deptList = await db.select().from(departments).where(eq(departments.id, departmentId)).limit(1);
      const dept = deptList[0];
      const tokenNumber = (dept.currentQueueCount || 0) + 1;

      await db.insert(appointments).values({
        id: uuidv4(),
        patientId: user.id,
        hospitalId,
        departmentId,
        tokenNumber,
        status: "WAITING",
      });

      await db.update(departments).set({ currentQueueCount: tokenNumber }).where(eq(departments.id, departmentId));

      await ctx.editMessageText(`✅ Token Issued!\n\nToken Number: **${tokenNumber}**\nDepartment: ${dept.name}\nEst. Wait: ${tokenNumber * dept.averageServiceTimeMin} mins.\n\nSee you there!`, { parse_mode: "Markdown" });
    } catch (err) {
      console.error(err);
      await ctx.answerCallbackQuery("Booking failed. Please try again.");
    }
  });

  // --- STATUS ---
  bot.command("status", async (ctx) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const userList = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      if (userList.length === 0) return ctx.reply("Link your account first with /start");

      const activeAppts = await db.select({
        token: appointments.tokenNumber,
        status: appointments.status,
        hospName: hospitals.name,
        deptName: departments.name,
      })
      .from(appointments)
      .innerJoin(hospitals, eq(appointments.hospitalId, hospitals.id))
      .innerJoin(departments, eq(appointments.departmentId, departments.id))
      .where(and(eq(appointments.patientId, userList[0].id), eq(appointments.status, "WAITING")))
      .orderBy(desc(appointments.createdAt));

      if (activeAppts.length === 0) return ctx.reply("You have no active appointments.");

      let response = "🎫 Your Active Tokens:\n\n";
      activeAppts.forEach((a) => {
        response += `🏥 *${a.hospName}*\n🔹 ${a.deptName}\n🎟 Token: **${a.token}**\nStatus: ${a.status}\n\n`;
      });
      await ctx.reply(response, { parse_mode: "Markdown" });
    } catch (err) {
      console.error(err);
      ctx.reply("Error fetching status.");
    }
  });

  bot.catch((err) => console.error("Bot error:", err));
}
