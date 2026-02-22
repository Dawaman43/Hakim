import { Bot, InlineKeyboard, Keyboard } from "grammy";
import { db } from "@/db/client";
import { otpCodes, users, hospitals, departments, appointments } from "@/db/schema";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Simple Triage Logic
const TRIAGE_KEYWORDS: Record<string, "CRITICAL" | "HIGH" | "MEDIUM"> = {
  "chest": "CRITICAL",
  "breath": "CRITICAL",
  "heart": "CRITICAL",
  "blood": "HIGH",
  "bleeding": "HIGH",
  "accident": "HIGH",
  "stroke": "CRITICAL",
  "unconscious": "CRITICAL",
  "pain": "MEDIUM",
  "fever": "MEDIUM",
};

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
    langBtn: "🌐 Language",
    meBtn: "👤 My Profile",
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
    emergencyCrit: "⚠️ CRITICAL SEVERITY\n\nSeek immediate medical attention. Call 911 or proceed to the nearest emergency room.",
    emergencyHigh: "🔴 HIGH SEVERITY\n\nUrgent care needed. Please go to the nearest hospital quickly.",
    emergencyMed: "🟡 MEDIUM SEVERITY\n\nPrompt attention recommended.",
    emergencyLow: "🟢 LOW SEVERITY\n\nStandard queue recommended.",
    call911: "📞 Call 911",
    about: "🏥 Hakim - Healthcare Queue Management\n\nLeading the digital transformation of Ethiopian healthcare. Skip the wait, get care faster.",
    contact: "📞 Emergency: 911\n📧 Support: support@hakim.et\n📍 Addis Ababa, Ethiopia",
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
    langBtn: "🌐 ቋንቋ",
    meBtn: "👤 መገለጫዬ",
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
    emergencyCrit: "⚠️ በጣም አስጊ ደረጃ\n\nወዲያውኑ የህክምና እርዳታ ያግኙ። 911 ይደውሉ ወይም ወደ ቅርቡ ድንገተኛ ክፍል ይሂዱ።",
    emergencyHigh: "🔴 ከፍተኛ ደረጃ\n\nአስቸኳይ እንክብካቤ ያስፈልጋል። እባክዎ በፍጥነት ወደ ቅርብ ሆስፒታል ይሂዱ።",
    emergencyMed: "🟡 መካከለኛ ደረጃ\n\nፈጣን ትኩረት ይመከራል።",
    emergencyLow: "🟢 ዝቅተኛ ደረጃ\n\nመደበኛ የመጠባበቂያ መስመር ይመከራል።",
    call911: "📞 911 ደውል",
    about: "🏥 ሃኪም - የጤና የመጠባበቂያ አስተዳደር\n\nየኢትዮጵያን ጤና አጠባበቅ በዲጂታል መንገድ እየቀየርን ነው። መጠባበቂያን ዝለል፣ ፈጣን እንክብካቤ አግኝ።",
    contact: "📞 አደጋ ጊዜ: 911\n📧 ድጋፍ: support@hakim.et\n📍 አዲስ አበባ፣ ኢትዮጵያ",
  }
};

export function setupBot(bot: Bot) {
  // --- HELPERS ---
  const getLang = async (telegramId: string): Promise<"en" | "am"> => {
    try {
      const u = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      return (u[0]?.language as "en" | "am") || "en";
    } catch {
      return "en";
    }
  };

  const getMainKeyboard = (lang: "en" | "am") => {
    const s = strings[lang];
    return new Keyboard()
      .text(s.bookBtn).text(s.nearbyBtn).row()
      .text(s.statusBtn).text(s.emergencyBtn).row()
      .text(s.langBtn).text(s.meBtn).row()
      .resized();
  };

  const scrubPhone = (phone: string) => {
    let p = phone.replace(/\s+/g, "");
    if (p.startsWith("+251")) p = "0" + p.slice(4);
    else if (p.startsWith("251")) p = "0" + p.slice(3);
    return p;
  };

  // --- MIDDLEWARE / INTERCEPT ---
  bot.on("message:text", async (ctx, next) => {
    const lang = await getLang(ctx.from.id.toString());
    const s = strings[lang];
    
    // Handle Menu Buttons
    if (ctx.message.text === s.bookBtn) return ctx.reply(s.chooseHosp, { reply_markup: await getHospKeyboard() });
    if (ctx.message.text === s.statusBtn) return bot.handleUpdate({ ...ctx.update, message: { ...ctx.message, text: "/status" } } as any);
    if (ctx.message.text === s.nearbyBtn) return ctx.reply(lang === "en" ? "Send location" : "ቦታዎን ይላኩ", { reply_markup: { keyboard: [[{ text: "📍 Share Location", request_location: true }]], resize_keyboard: true, one_time_keyboard: true } });
    if (ctx.message.text === s.emergencyBtn) return ctx.reply(s.emergencyStart);
    if (ctx.message.text === s.langBtn) return bot.handleUpdate({ ...ctx.update, message: { ...ctx.message, text: "/language" } } as any);
    if (ctx.message.text === s.meBtn) return bot.handleUpdate({ ...ctx.update, message: { ...ctx.message, text: "/me" } } as any);

    await next();
  });

  const getHospKeyboard = async () => {
    const hList = await db.select().from(hospitals).where(eq(hospitals.isActive, true)).limit(5);
    const keyboard = new InlineKeyboard();
    hList.forEach((h) => keyboard.text(h.name, `book_hosp_${h.id}`).row());
    return keyboard;
  };

  // --- COMMANDS ---
  bot.command("start", async (ctx) => {
    const tid = ctx.from?.id.toString();
    const existing = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    const lang = (existing[0]?.language as "en" | "am") || "en";
    const s = strings[lang];

    if (existing[0]) {
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
    if (ctx.message.contact.user_id !== ctx.from.id) return;
    const phone = scrubPhone(ctx.message.contact.phone_number);
    const tid = ctx.from.id.toString();

    try {
      const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      if (existing[0]) {
        await db.update(users).set({ telegramId: tid }).where(eq(users.id, existing[0].id));
      } else {
        await db.insert(users).values({ id: uuidv4(), phone, telegramId: tid, name: ctx.message.contact.first_name });
      }
      await ctx.reply(strings.en.verifySuccess + " / " + strings.am.verifySuccess, { reply_markup: getMainKeyboard("en") });
    } catch (err) {
      ctx.reply("Error linking account.");
    }
  });

  bot.command("language", async (ctx) => {
    const tid = ctx.from?.id.toString();
    const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    if (!u[0]) return ctx.reply("Please /start first.");

    const newLang = u[0].language === "en" ? "am" : "en";
    await db.update(users).set({ language: newLang }).where(eq(users.id, u[0].id));
    
    const s = strings[newLang];
    await ctx.reply(newLang === "en" ? "Language set to English" : "ቋንቋ ወደ አማርኛ ተቀይሯል", {
      reply_markup: getMainKeyboard(newLang)
    });
  });

  bot.command("status", async (ctx) => {
    const tid = ctx.from?.id.toString();
    const lang = await getLang(tid);
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
      res = ""; // Reset for next
    }
  });

  bot.callbackQuery(/^cancel_(.+)$/, async (ctx) => {
    const aid = ctx.match[1];
    const lang = await getLang(ctx.from.id.toString());
    await db.update(appointments).set({ status: "CANCELLED" }).where(eq(appointments.id, aid));
    await ctx.editMessageText(`✅ ${strings[lang].cancelled}`);
  });

  bot.on("message:location", async (ctx) => {
    const { latitude: lat, longitude: lng } = ctx.message.location;
    const lang = await getLang(ctx.from.id.toString());
    const s = strings[lang];

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
  });

  // --- EMERGENCY TRIAGE ---
  bot.on("message:text", async (ctx) => {
    const lang = await getLang(ctx.from.id.toString());
    const s = strings[lang];
    const text = ctx.message.text.toLowerCase();
    
    let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "LOW";
    for (const [key, val] of Object.entries(TRIAGE_KEYWORDS)) {
      if (text.includes(key)) {
        if (val === "CRITICAL") severity = "CRITICAL";
        else if (val === "HIGH" && severity !== "CRITICAL") severity = "HIGH";
        else if (val === "MEDIUM" && severity === "LOW") severity = "MEDIUM";
      }
    }

    if (severity === "LOW" && text.length < 10) return; // Ignore short chatter

    const msg = severity === "CRITICAL" ? s.emergencyCrit : 
                severity === "HIGH" ? s.emergencyHigh : 
                severity === "MEDIUM" ? s.emergencyMed : s.emergencyLow;

    const kb = severity === "CRITICAL" ? new InlineKeyboard().url(s.call911, "tel:911") : undefined;
    await ctx.reply(msg, { reply_markup: kb });
  });

  // --- BOT CALLBACKS (Booking) ---
  bot.callbackQuery(/^book_hosp_(.+)$/, async (ctx) => {
    const hid = ctx.match[1];
    const lang = await getLang(ctx.from.id.toString());
    const dList = await db.select().from(departments).where(and(eq(departments.hospitalId, hid), eq(departments.isActive, true)));
    
    if (dList.length === 0) return ctx.answerCallbackQuery("No departments.");

    const keyboard = new InlineKeyboard();
    dList.forEach((d) => keyboard.text(d.name, `book_dept_${hid}_${d.id}`).row());
    await ctx.editMessageText(strings[lang].chooseDept, { reply_markup: keyboard });
  });

  bot.callbackQuery(/^book_dept_(.+)_(.+)$/, async (ctx) => {
    const [_, hid, did] = ctx.match;
    const tid = ctx.from.id.toString();
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

  // --- UTILS ---
  bot.command("me", async (ctx) => {
    const tid = ctx.from?.id.toString();
    const u = await db.select().from(users).where(eq(users.telegramId, tid)).limit(1);
    if (!u[0]) return;
    await ctx.reply(`👤 Profile:\nName: ${u[0].name || "N/A"}\nPhone: ${u[0].phone}\nLang: ${u[0].language}`);
  });

  bot.command("health", async (ctx) => {
    try {
      await db.select().from(users).limit(1);
      await ctx.reply("✅ Status: Online\nDB: Connected");
    } catch (e: any) {
      await ctx.reply("❌ Status: Error\nDB: " + e.message);
    }
  });

  bot.catch((err) => console.error("Bot Error:", err));
}
