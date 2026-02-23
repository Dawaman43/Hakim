import { Bot, InlineKeyboard, Keyboard } from "grammy";
import { db } from "@/db/client";
import { otpCodes, users, hospitals, departments, appointments } from "@/db/schema";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { aiChat, aiTriage } from "@/lib/ai";
import { normalizeEthiopianPhone } from "@/lib/phone";

const emergencySessions = new Map<string, boolean>();
const aiSessions = new Map<string, Array<{ role: "user" | "assistant"; content: string }>>();

// Bilingual Helper
const strings = {
  en: {
    welcome: "Welcome to Hakim! 🏥",
    shareContact: "Please share your contact to verify your phone and access all features.",
    shareContactBtn: "📱 Share Contact",
    verifySuccess: "Verification successful! 👋",
    mainMenu: "Main Menu",
    bookBtn: "🏥 Book Token",
    nearbyBtn: "📍 Find Nearby",
    statusBtn: "🎫 My Tokens",
    emergencyBtn: "🆘 Emergency",
    hospitalsBtn: "🏥 Hospitals",
    aiBtn: "🤖 Ask AI",
    langBtn: "🌐 Language",
    meBtn: "👤 My Profile",
    logoutBtn: "🚪 Logout",
    hospFound: "🏥 Available Hospitals:",
    noHosp: "No hospitals found.",
    chooseHosp: "Choose a hospital to book an appointment:",
    chooseDept: "Great! Now choose a department:",
    tokenIssued: "✅ Token Issued!",
    tokenNum: "Token Number",
    estWait: "Est. Wait",
    noAppts: "You have no active appointments.",
    yourAppts: "🎫 Your Active Tokens:",
    cancelBtn: "❌ Cancel",
    cancelled: "Appointment cancelled.",
    emergencyStart: "🚨 Emergency Assist\n\nPlease describe your symptoms (e.g. 'chest pain').",
    aiStart: "🤖 AI Health Assistant\n\nAsk a health question. Example: /ai I have a headache and fever.",
    emergencyCrit: "⚠️ CRITICAL SEVERITY\n\nSeek immediate medical attention. Call 911 or proceed to the nearest emergency room.",
    emergencyHigh: "🔴 HIGH SEVERITY\n\nUrgent care needed. Please go to the nearest hospital quickly.",
    emergencyMed: "🟡 MEDIUM SEVERITY\n\nPrompt attention recommended.",
    emergencyLow: "🟢 LOW SEVERITY\n\nStandard queue recommended.",
    call911: "📞 Call 911",
    about: "🏥 Hakim - Healthcare Queue Management\n\nLeading the digital transformation of Ethiopian healthcare. Skip the wait, get care faster.",
    contact: "📞 Emergency: 911\n📧 Support: support@hakim.et\n📍 Addis Ababa, Ethiopia",
    logoutSuccess: "You have been logged out.",
    linkSuccess: "Your account is linked. Here is your OTP:",
    linkInvalid: "Link invalid or expired. Please request a new link from the app.",
  },
  am: {
    welcome: "ወደ ሃኪም እንኳን ደህና መጡ! 🏥",
    shareContact: "ሁሉንም ባህሪያት ለመጠቀም እባክዎ ስልክዎን ለማረጋገጥ መገለጫዎን ያጋሩ።",
    shareContactBtn: "📱 መገለጫን አጋራ",
    verifySuccess: "ማረጋገጫ ተሳክቷል! 👋",
    mainMenu: "ዋና ሜኑ",
    bookBtn: "🏥 ቦታ ያምሩ",
    nearbyBtn: "📍 ቅርብ ሆስፒታሎች",
    statusBtn: "🎫 የእኔ ቶከኖች",
    emergencyBtn: "🆘 አደጋ ጊዜ",
    hospitalsBtn: "🏥 ሆስፒታሎች",
    aiBtn: "🤖 ኤይአይ ጠይቅ",
    langBtn: "🌐 ቋንቋ",
    meBtn: "👤 መገለጫዬ",
    logoutBtn: "🚪 ውጣ",
    hospFound: "🏥 የሚገኙ ሆስፒታሎች:",
    noHosp: "ምንም ሆስፒታል አልተገኘም።",
    chooseHosp: "ቦታ ለማስያዝ ሆስፒታል ይምረጡ:",
    chooseDept: "በጣም ጥሩ! አሁን ክፍል ይምረጡ:",
    tokenIssued: "✅ ቶከን ተሰጥቷል!",
    tokenNum: "የቶከን ቁጥር",
    estWait: "የሚገመት ጊዜ",
    noAppts: "ምንም ንቁ ቀጠሮ የሎትም።",
    yourAppts: "🎫 የእርስዎ ንቁ ቶከኖች:",
    cancelBtn: "❌ ሰርዝ",
    cancelled: "ቀጠሮው ተሰርዟል።",
    emergencyStart: "🚨 የአደጋ ጊዜ እርዳታ\n\nእባክዎ ምልክቶችዎን ይግለጹ (ምሳሌ: 'የደረት ህመም')።",
    aiStart: "🤖 የጤና ኤይአይ አገልጋይ\n\nጤና ጥያቄ ይጠይቁ። ለምሳሌ: /ai ራስ ህመም እና ትኩሳት አለኝ።",
    emergencyCrit: "⚠️ በጣም አስጊ ደረጃ\n\nወዲያውኑ የህክምና እርዳታ ያግኙ። 911 ይደውሉ ወይም ወደ ቅርቡ ድንገተኛ ክፍል ይሂዱ።",
    emergencyHigh: "🔴 ከፍተኛ ደረጃ\n\nአስቸኳይ እንክብካቤ ያስፈልጋል። እባክዎ በፍጥነት ወደ ቅርብ ሆስፒታል ይሂዱ።",
    emergencyMed: "🟡 መካከለኛ ደረጃ\n\nፈጣን ትኩረት ይመከራል።",
    emergencyLow: "🟢 ዝቅተኛ ደረጃ\n\nመደበኛ የመጠባበቂያ መስመር ይመከራል።",
    call911: "📞 911 ደውል",
    about: "🏥 ሃኪም - የጤና የመጠባበቂያ አስተዳደር\n\nየኢትዮጵያን ጤና አጠባበቅ በዲጂታል መንገድ እየቀየርን ነው። መጠባበቂያን ዝለል፣ ፈጣን እንክብካቤ አግኝ።",
    contact: "📞 አደጋ ጊዜ: 911\n📧 ድጋፍ: support@hakim.et\n📍 አዲስ አበባ፣ ኢትዮጵያ",
    logoutSuccess: "ተወጥተዋል።",
    linkSuccess: "መለያዎ ተገናኝቷል። ኦቲፒዎ:",
    linkInvalid: "ሊንኩ ተቀባይነት የለውም ወይም አልተቀበለም። ከመተግበሪያው እንደገና ይጠይቁ።",
  }
};

export function setupBot(bot: Bot) {
  // --- HELPERS ---
  const getLang = async (telegramId: string): Promise<"en" | "am"> => {
    try {
      if (!telegramId) return "en";
      const u = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      return (u[0]?.language as "en" | "am") || "en";
    } catch {
      return "en";
    }
  };

  const getMainKeyboard = (lang: "en" | "am") => {
    const s = strings[lang];
    return new Keyboard()
      .text(s.bookBtn).text(s.hospitalsBtn).row()
      .text(s.nearbyBtn).text(s.statusBtn).row()
      .text(s.emergencyBtn).text(s.aiBtn).row()
      .text(s.langBtn).text(s.meBtn).row()
      .text(s.logoutBtn).row()
      .resized();
  };

  const scrubPhone = (phone: string) => normalizeEthiopianPhone(phone);

  const getHospKeyboard = async (page = 0) => {
    const limit = 5;
    const offset = page * limit;
    const hList = await db.select().from(hospitals).where(eq(hospitals.isActive, true)).limit(limit).offset(offset);
    const keyboard = new InlineKeyboard();
    hList.forEach((h) => keyboard.text(h.name, `book_hosp_${h.id}`).row());
    if (page > 0) keyboard.text("⬅️ Prev", `hosp_page_${page - 1}`).row();
    if (hList.length === limit) keyboard.text("Next ➡️", `hosp_page_${page + 1}`).row();
    return keyboard;
  };

  const showHospitalsPage = async (ctx: any, page = 0) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    const s = strings[lang];
    const keyboard = await getHospKeyboard(page);
    await ctx.reply(s.hospFound, { reply_markup: keyboard });
  };

  // --- REUSABLE LOGIC ---
  const showMe = async (ctx: any) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    if (!u[0]) return ctx.reply("Please /start first.");
    await ctx.reply(`👤 Profile:\nName: ${u[0].name || "N/A"}\nPhone: ${u[0].phone}\nLang: ${u[0].language}`);
  };

  const toggleLanguage = async (ctx: any) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    if (!u[0]) return ctx.reply("Please /start first.");

    const newLang = u[0].language === "en" ? "am" : "en";
    await db.update(users).set({ language: newLang }).where(eq(users.id, u[0].id));
    
    const s = strings[newLang];
    await ctx.reply(newLang === "en" ? "Language set to English" : "ቋንቋ ወደ አማርኛ ተቀይሯል", {
      reply_markup: getMainKeyboard(newLang)
    });
  };

  const showStatus = async (ctx: any, lang: "en" | "am") => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const s = strings[lang];
    const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    if (!u[0]) return;

    const list = await db.select({
      id: appointments.id,
      token: appointments.tokenNumber,
      hosp: hospitals.name,
      dept: departments.name
    })
    .from(appointments)
    .innerJoin(hospitals, eq(appointments.hospitalId, hospitals.id))
    .innerJoin(departments, eq(appointments.departmentId, departments.id))
    .where(and(eq(appointments.patientId, u[0].id), eq(appointments.status, "WAITING")));

    if (list.length === 0) return ctx.reply(s.noAppts);

    let res = s.yourAppts + "\n\n";
    for (const a of list) {
      res += `🏥 *${a.hosp}*\n🔹 ${a.dept}\n🎟 ${s.tokenNum}: **${a.token}**\n\n`;
      const kb = new InlineKeyboard().text(s.cancelBtn, `cancel_${a.id}`);
      await ctx.reply(res, { parse_mode: "Markdown", reply_markup: kb });
      res = ""; 
    }
  };

  const sendLatestOtp = async (ctx: any, lang: "en" | "am") => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const s = strings[lang];
    const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    if (!u[0]) return ctx.reply("Please /start first.");
    const normalizedPhone = scrubPhone(u[0].phone);
    const otpRow = await db
      .select()
      .from(otpCodes)
      .where(and(eq(otpCodes.phone, normalizedPhone), eq(otpCodes.verified, false)))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);
    if (!otpRow[0] || otpRow[0].purpose === "TELEGRAM_LINK") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      await db.insert(otpCodes).values({
        id: uuidv4(),
        phone: normalizedPhone,
        code: otp,
        purpose: "LOGIN",
        expiresAt,
      });
      return ctx.reply(`${s.linkSuccess} \`${otp}\``, { parse_mode: "Markdown" });
    }
    return ctx.reply(`${s.linkSuccess} \`${otpRow[0].code}\``, { parse_mode: "Markdown" });
  };

  // --- MIDDLEWARE / INTERCEPT ---
  bot.on("message", async (ctx, next) => {
    console.log(`💬 Incoming message from ${ctx.from?.id}: ${ctx.message?.text || "[non-text]"}`);
    await next();
  });

  bot.on("message:text", async (ctx, next) => {
    const text = ctx.message.text;
    const tid = ctx.from?.id.toString();
    if (!tid) return await next();
    
    // Quick Debug Commands (No DB)
    if (text === "/ping") {
      console.log("🏓 Ping received");
      return ctx.reply("pong 🏓");
    }

    const lang = await getLang(tid);
    const s = strings[lang];
    
    // Handle Menu Buttons
    if (text === s.bookBtn) return ctx.reply(s.chooseHosp, { reply_markup: await getHospKeyboard() });
    if (text === s.hospitalsBtn) return showHospitalsPage(ctx, 0);
    if (text === s.statusBtn) return showStatus(ctx, lang);
    if (text === s.nearbyBtn) return ctx.reply(lang === "en" ? "Send location" : "ቦታዎን ይላኩ", { reply_markup: { keyboard: [[{ text: "📍 Share Location", request_location: true }]], resize_keyboard: true, one_time_keyboard: true } });
    if (text === s.emergencyBtn) {
      emergencySessions.set(tid, true);
      return ctx.reply(s.emergencyStart);
    }
    if (text === s.aiBtn) return ctx.reply(s.aiStart);
    if (text === s.langBtn) return toggleLanguage(ctx);
    if (text === s.meBtn) return showMe(ctx);
    if (text === s.logoutBtn) {
      const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
      if (u[0]) await db.update(users).set({ telegramId: null }).where(eq(users.id, u[0].id));
      emergencySessions.delete(tid);
      aiSessions.delete(tid);
      return ctx.reply(s.logoutSuccess, { reply_markup: getMainKeyboard(lang) });
    }

    await next();
  });

  // --- COMMANDS ---
  bot.command("start", async (ctx) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;

    const parts = ctx.message.text?.split(" ") || [];
    if (parts[1]?.startsWith("link_")) {
      const code = parts[1].replace("link_", "");
      const link = await db.select().from(otpCodes).where(eq(otpCodes.code, code)).limit(1);
      if (!link[0] || link[0].purpose !== "TELEGRAM_LINK" || new Date() > link[0].expiresAt) {
        return ctx.reply(strings.en.linkInvalid + " / " + strings.am.linkInvalid);
      }
      const user = await db.select().from(users).where(eq(users.phone, link[0].phone)).limit(1);
      if (!user[0]) {
        return ctx.reply(strings.en.linkInvalid + " / " + strings.am.linkInvalid);
      }
      await db.update(users).set({ telegramId: tid }).where(eq(users.id, user[0].id));
      await db.update(otpCodes).set({ verified: true }).where(eq(otpCodes.id, link[0].id));

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      await db.insert(otpCodes).values({
        id: uuidv4(),
        phone: user[0].phone,
        code: otp,
        purpose: "LOGIN",
        expiresAt,
      });

      return ctx.reply(
        `${strings.en.linkSuccess} \`${otp}\`\n\n${strings.am.linkSuccess} \`${otp}\``,
        { reply_markup: getMainKeyboard("en"), parse_mode: "Markdown" }
      );
    }

    if (parts[1]) {
      const payloadPhone = scrubPhone(parts[1]);
      console.log("Telegram /start payload", { tid, payload: parts[1], payloadPhone });
      if (!/^\d{9,15}$/.test(payloadPhone)) {
        return ctx.reply(strings.en.linkInvalid + " / " + strings.am.linkInvalid);
      }

      try {
        const existingUser = await db.select().from(users).where(eq(users.phone, payloadPhone)).limit(1);
        if (existingUser[0]) {
          await db.update(users).set({ telegramId: tid }).where(eq(users.id, existingUser[0].id));
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await db.insert(otpCodes).values({
          id: uuidv4(),
          phone: payloadPhone,
          code: otp,
          purpose: existingUser[0] ? "LOGIN" : "REGISTRATION",
          expiresAt,
        });

        const lang = (existingUser[0]?.language as "en" | "am") || "en";
        return ctx.reply(
          `${strings.en.linkSuccess} \`${otp}\`\n\n${strings.am.linkSuccess} \`${otp}\``,
          { reply_markup: getMainKeyboard(lang), parse_mode: "Markdown" }
        );
      } catch (err: any) {
        console.error("Telegram /start OTP insert error", err);
        return ctx.reply("Error generating OTP. Please try again.");
      }
    }

    const existing = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    const lang = (existing[0]?.language as "en" | "am") || "en";
    const s = strings[lang];

    if (existing[0]) {
      await sendLatestOtp(ctx, lang);
      await ctx.reply(s.welcome, { reply_markup: getMainKeyboard(lang) });
      return;
    }

    await ctx.reply(s.welcome + "\n\n" + s.shareContact, {
      reply_markup: {
        keyboard: [[{ text: s.shareContactBtn, request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  });

  bot.on("message:contact", async (ctx) => {
    const tid = ctx.from?.id.toString();
    if (!ctx.message.contact || ctx.message.contact.user_id !== ctx.from?.id || !tid) return;
    const phone = scrubPhone(ctx.message.contact.phone_number);

    try {
      const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      if (existing[0]) {
        await db.update(users).set({ telegramId: tid }).where(eq(users.id, existing[0].id));
      } else {
        await db.insert(users).values({ id: uuidv4(), phone, telegramId: tid, name: ctx.message.contact.first_name });
      }
      await ctx.reply(strings.en.verifySuccess + " / " + strings.am.verifySuccess, { reply_markup: getMainKeyboard("en") });
    } catch (err) {
      console.error("Link error:", err);
      ctx.reply("Error linking account.");
    }
  });

  bot.command("language", toggleLanguage);
  bot.command("status", async (ctx) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    await showStatus(ctx, lang);
  });
  bot.command("me", showMe);
  bot.command("otp", async (ctx) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    await sendLatestOtp(ctx, lang);
  });
  bot.command("logout", async (ctx) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    if (u[0]) await db.update(users).set({ telegramId: null }).where(eq(users.id, u[0].id));
    emergencySessions.delete(tid);
    aiSessions.delete(tid);
    return ctx.reply(strings[lang].logoutSuccess, { reply_markup: getMainKeyboard(lang) });
  });

  bot.command("health", async (ctx) => {
    try {
      await db.select().from(users).limit(1);
      await ctx.reply("✅ Status: Online\nDB: Connected");
    } catch (e: any) {
      await ctx.reply("❌ Status: Error\nDB: " + e.message);
    }
  });

  bot.command("dbinfo", async (ctx) => {
    try {
      const dbName = await db.execute(sql`select current_database() as name`);
      const dbHost = await db.execute(sql`select inet_server_addr() as host`);
      const nameRow = (dbName as any)?.rows?.[0] ?? (Array.isArray(dbName) ? dbName[0] : null);
      const hostRow = (dbHost as any)?.rows?.[0] ?? (Array.isArray(dbHost) ? dbHost[0] : null);
      await ctx.reply(
        `DB: ${nameRow?.name || "unknown"}\nHost: ${hostRow?.host || "unknown"}`
      );
    } catch (e: any) {
      await ctx.reply("DB info error: " + e.message);
    }
  });

  bot.command("hospitals", async (ctx) => {
    await showHospitalsPage(ctx, 0);
  });

  bot.command("ai", async (ctx) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    const s = strings[lang];
    const text = ctx.message.text?.replace("/ai", "").trim();
    if (!text) {
      return ctx.reply(s.aiStart);
    }
    const history = aiSessions.get(tid) || [];
    const next = [...history, { role: "user", content: text }].slice(-8);
    const reply = await aiChat(next);
    if (!reply) return ctx.reply(lang === "en" ? "AI unavailable. Please try again later." : "ኤይአይ አልተገኘም፣ ቆይተው ይሞክሩ።");
    aiSessions.set(tid, [...next, { role: "assistant", content: reply }].slice(-8));
    return ctx.reply(reply);
  });

  // --- CALLBACKS & EVENTS ---
  bot.callbackQuery(/^cancel_(.+)$/, async (ctx) => {
    const aid = ctx.match[1];
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    await db.update(appointments).set({ status: "CANCELLED" }).where(eq(appointments.id, aid));
    await ctx.editMessageText(`✅ ${strings[lang].cancelled}`);
  });

  bot.on("message:location", async (ctx) => {
    const { latitude: lat, longitude: lng } = ctx.message.location;
    console.log(`📍 Received location from ${ctx.from?.id}: ${lat}, ${lng}`);
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    const s = strings[lang];

    try {
      const distanceSql = sql<number>`
        (6371 * 2 * asin(sqrt(
          power(sin(radians(${lat} - ${hospitals.latitude}) / 2), 2) +
          cos(radians(${lat})) * cos(radians(${hospitals.latitude})) *
          power(sin(radians(${lng} - ${hospitals.longitude}) / 2), 2)
        )))
      `;

      const rows = await db.select({ h: hospitals, d: distanceSql.as("dist") }).from(hospitals).orderBy(sql`dist`).limit(3);

      let res = s.hospFound + "\n\n";
      rows.forEach(r => {
        res += `🔹 *${r.h.name}*\n📍 ${r.h.address}\n📏 ${r.d.toFixed(1)} km\n🔗 [Maps](https://www.google.com/maps?q=${r.h.latitude},${r.h.longitude})\n\n`;
      });
      await ctx.reply(res, { parse_mode: "Markdown", reply_markup: getMainKeyboard(lang) });
    } catch (e) {
      console.error("Location error:", e);
      ctx.reply("Error finding hospitals.");
    }
  });

  bot.on("message:text", async (ctx) => {
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    const s = strings[lang];
    const text = ctx.message.text;

    if (emergencySessions.get(tid)) {
      emergencySessions.delete(tid);
      const triage = await aiTriage(text);
      const msg = triage.severityLevel === "CRITICAL" ? s.emergencyCrit :
        triage.severityLevel === "HIGH" ? s.emergencyHigh :
        triage.severityLevel === "MEDIUM" ? s.emergencyMed : s.emergencyLow;
      const kb = triage.isEmergency ? new InlineKeyboard().url(s.call911, "tel:911") : undefined;
      return ctx.reply(msg, { reply_markup: kb });
    }
  });

  bot.callbackQuery(/^book_hosp_(.+)$/, async (ctx) => {
    const hid = ctx.match[1];
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    const dList = await db.select().from(departments).where(and(eq(departments.hospitalId, hid), eq(departments.isActive, true)));
    
    if (dList.length === 0) return ctx.answerCallbackQuery("No departments.");

    const keyboard = new InlineKeyboard();
    dList.forEach((d) => keyboard.text(d.name, `book_dept_${hid}_${d.id}`).row());
    await ctx.editMessageText(strings[lang].chooseDept, { reply_markup: keyboard });
  });

  bot.callbackQuery(/^hosp_page_(\d+)$/, async (ctx) => {
    const page = parseInt(ctx.match[1], 10);
    await ctx.answerCallbackQuery();
    await showHospitalsPage(ctx, page);
  });

  bot.callbackQuery(/^book_dept_(.+)_(.+)$/, async (ctx) => {
    const [_, hid, did] = ctx.match;
    const tid = ctx.from?.id.toString();
    if (!tid) return;
    const lang = await getLang(tid);
    const s = strings[lang];

    try {
      const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
      if (!u[0]) return ctx.answerCallbackQuery("Error");

      const d = (await db.select().from(departments).where(eq(departments.id, did)).limit(1))[0];
      const token = (d.currentQueueCount || 0) + 1;

      await db.insert(appointments).values({ id: uuidv4(), patientId: u[0].id, hospitalId: hid, departmentId: did, tokenNumber: token, status: "WAITING" });
      await db.update(departments).set({ currentQueueCount: token }).where(eq(departments.id, did));

      await ctx.editMessageText(`${s.tokenIssued}\n\n${s.tokenNum}: **${token}**\n${s.estWait}: ${token * d.averageServiceTimeMin} mins.`, { parse_mode: "Markdown" });
    } catch (err) {
      await ctx.answerCallbackQuery("Failed");
    }
  });

  bot.catch((err) => console.error("Bot Error:", err));
}
