import { db } from "../src/db/client";
import { users } from "../src/db/schema";
import { hashPassword } from "../src/lib/password";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const email = process.env.ADMIN_EMAIL || "";
const phone = process.env.ADMIN_PHONE || "";
const name = process.env.ADMIN_NAME || "Super Admin";
const password = process.env.ADMIN_PASSWORD || "";

if (!email || !phone || !password) {
  console.error("Missing required env. Set ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD (and optional ADMIN_NAME).");
  process.exit(1);
}

async function main() {
  const existingByPhone = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  const existing = existingByPhone[0]
    ? existingByPhone[0]
    : (email ? (await db.select().from(users).where(eq(users.email, email)).limit(1))[0] : null);

  const passwordHash = hashPassword(password);

  if (existing) {
    await db.update(users).set({
      email,
      phone,
      name,
      role: "SUPER_ADMIN",
      passwordHash,
      isVerified: true,
    }).where(eq(users.id, existing.id));
    console.log(`Updated SUPER_ADMIN: ${existing.id}`);
    return;
  }

  const id = uuidv4();
  await db.insert(users).values({
    id,
    email,
    phone,
    name,
    role: "SUPER_ADMIN",
    passwordHash,
    isVerified: true,
  });
  console.log(`Created SUPER_ADMIN: ${id}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
