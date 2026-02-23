import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Prefer direct (non-pooler) URL for migrations to avoid DNS/pooler issues
    url: (process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL)!,
  },
});
