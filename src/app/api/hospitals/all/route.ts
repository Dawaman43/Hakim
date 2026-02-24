import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { hospitals } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(hospitals)
      .where(sql`${hospitals.latitude} is not null and ${hospitals.longitude} is not null`);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Hospitals all error:", error);
    return NextResponse.json({ success: false, error: "Failed to load hospitals" }, { status: 500 });
  }
}
