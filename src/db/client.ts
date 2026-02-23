import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import dns from "node:dns";
import { Agent } from "undici";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}


const databaseUrl = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const agent = new Agent({ connect: { family: 4 } });
neonConfig.fetchFunction = (input, init) => fetch(input, { ...init, dispatcher: agent });

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export const pool = { end: () => Promise.resolve() };
