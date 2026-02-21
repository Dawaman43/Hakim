import { NextResponse } from "next/server";
import { redisGet } from "@/lib/upstash";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId");
    if (!appointmentId) {
      return NextResponse.json({ success: false, error: "Missing appointmentId" }, { status: 400 });
    }

    const cacheKey = `queue_status:${appointmentId}`;
    const cached = await redisGet<any>(cacheKey);
    if (!cached) {
      return NextResponse.json({ success: false, error: "Queue status not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: cached, cached: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load queue status:", error);
    return NextResponse.json({ success: false, error: `Failed to load queue status: ${message}` }, { status: 500 });
  }
}
