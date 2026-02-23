import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id?: string } }) {
  try {
    const pathname = new URL(request.url).pathname;
    const match = pathname.match(/\/api\/hospitals\/([^/]+)\/departments/);
    const idFromPath = match?.[1];
    const hospitalId = params?.id || idFromPath;
    if (!hospitalId) {
      return NextResponse.json({ success: false, error: "Missing hospital id" }, { status: 400 });
    }
    const result = await db.execute(sql`
      select
        id,
        hospital_id as "hospitalId",
        name,
        description,
        average_service_time_min as "averageServiceTimeMin",
        daily_capacity as "dailyCapacity",
        current_queue_count as "currentQueueCount",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from public.departments
      where hospital_id = ${hospitalId}
      order by name
    `);
    const rows = (result as any).rows ?? result;
    const data = rows.map((dept: any) => ({
      ...dept,
      createdAt: dept.createdAt ? new Date(dept.createdAt).toISOString() : null,
      updatedAt: dept.updatedAt ? new Date(dept.updatedAt).toISOString() : null,
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load departments:", error);
    return NextResponse.json({ success: false, error: `Failed to load departments: ${message}` }, { status: 500 });
  }
}
