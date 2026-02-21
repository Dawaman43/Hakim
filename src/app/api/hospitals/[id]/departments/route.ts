import { NextResponse } from "next/server";
import { db } from "@/db/node-client";
import { departments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const rows = await db.select().from(departments).where(eq(departments.hospitalId, params.id));
    const data = rows.map((dept) => ({
      id: dept.id,
      hospitalId: dept.hospitalId,
      name: dept.name,
      description: dept.description,
      averageServiceTimeMin: dept.averageServiceTimeMin,
      dailyCapacity: dept.dailyCapacity,
      currentQueueCount: dept.currentQueueCount,
      isActive: dept.isActive,
      createdAt: dept.createdAt.toISOString(),
      updatedAt: dept.updatedAt.toISOString(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load departments:", error);
    return NextResponse.json({ success: false, error: `Failed to load departments: ${message}` }, { status: 500 });
  }
}
