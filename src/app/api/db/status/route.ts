import { NextResponse } from "next/server";
import { db } from "@/db/node-client";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const dbNameRow = await db.execute<{ current_database: string }>(sql`select current_database() as current_database`);
    const schemaRow = await db.execute<{ current_schema: string }>(sql`select current_schema() as current_schema`);
    const tableRow = await db.execute<{ exists: boolean }>(
      sql`select exists(select 1 from information_schema.tables where table_name = 'hospitals') as exists`
    );

    return NextResponse.json({
      success: true,
      database: dbNameRow.rows?.[0]?.current_database,
      schema: schemaRow.rows?.[0]?.current_schema,
      hospitalsTableExists: Boolean(tableRow.rows?.[0]?.exists),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
