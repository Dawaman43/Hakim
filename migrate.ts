import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

async function main() {
  console.log("Applying migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations applied successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed", err);
  process.exit(1);
});
