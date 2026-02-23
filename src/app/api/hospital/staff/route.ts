import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { hospitals } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";

async function ensureTable() {
  await db.execute(sql`
    create table if not exists hospital_staff (
      id text primary key,
      hospital_id text not null,
      name text not null,
      phone text not null,
      role text not null default 'STAFF',
      created_at timestamptz not null default now()
    )
  `);
}

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await ensureTable();

    const hosp = await db.select().from(hospitals).where(eq(hospitals.adminId, payload.userId)).limit(1);
    if (!hosp[0]) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const rows = await db.execute(sql`
      select id, hospital_id as "hospitalId", name, phone, role, created_at as "createdAt"
      from hospital_staff
      where hospital_id = ${hosp[0].id}
      order by created_at desc
    `);

    const data = (rows as any)?.rows ?? rows ?? [];
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Hospital staff GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load staff" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await ensureTable();

    const { name, phone, role } = await request.json();
    if (!name || !phone) {
      return NextResponse.json({ success: false, error: "Name and phone are required" }, { status: 400 });
    }

    const hosp = await db.select().from(hospitals).where(eq(hospitals.adminId, payload.userId)).limit(1);
    if (!hosp[0]) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const id = uuidv4();
    await db.execute(sql`
      insert into hospital_staff (id, hospital_id, name, phone, role)
      values (${id}, ${hosp[0].id}, ${name}, ${phone}, ${role || "STAFF"})
    `);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hospital staff POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to add staff" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await ensureTable();

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("id");
    if (!staffId) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    const hosp = await db.select().from(hospitals).where(eq(hospitals.adminId, payload.userId)).limit(1);
    if (!hosp[0]) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    await db.execute(sql`
      delete from hospital_staff where id = ${staffId} and hospital_id = ${hosp[0].id}
    `);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hospital staff DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to remove staff" }, { status: 500 });
  }
}
