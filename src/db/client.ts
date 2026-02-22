import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

// Strip problematic query params that cause warnings in 'pg'
const url = new URL(databaseUrl);
url.searchParams.delete("sslmode");
url.searchParams.delete("channel_binding");

export const pool = new Pool({ 
  connectionString: url.toString(),
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });
