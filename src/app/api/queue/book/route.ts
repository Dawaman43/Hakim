import { db } from "@/db/client";
import { appointments, departments, hospitals, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalId, departmentId, notes, guestPhone, guestName } = body;

    if (!hospitalId || !departmentId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Identify user
    let userPhone = guestPhone;
    let userId: string | null = null;

    // In a real app, we'd get the user from the session/token
    // For now, we'll try to find or create the user based on phone
    if (userPhone) {
      const existingUserList = await db.select().from(users).where(eq(users.phone, userPhone)).limit(1);
      if (existingUserList.length > 0) {
        userId = existingUserList[0].id;
      } else {
        userId = uuidv4();
        await db.insert(users).values({
          id: userId,
          phone: userPhone,
          name: guestName || "Guest",
        });
      }
    } else {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    // Get department to calculate token
    const deptList = await db.select().from(departments).where(eq(departments.id, departmentId)).limit(1);
    if (deptList.length === 0) {
      return NextResponse.json({ success: false, error: "Department not found" }, { status: 404 });
    }
    const dept = deptList[0];

    // Generate token number (simple increment for now)
    const tokenNumber = (dept.currentQueueCount || 0) + 1;

    // Create appointment
    const appointmentId = uuidv4();
    const newAppointment = {
      id: appointmentId,
      patientId: userId,
      hospitalId,
      departmentId,
      tokenNumber,
      status: "WAITING" as const,
      notes,
    };

    await db.insert(appointments).values(newAppointment);

    // Update department queue count
    await db.update(departments)
      .set({ currentQueueCount: tokenNumber })
      .where(eq(departments.id, departmentId));

    // Get hospital name for response
    const hospList = await db.select().from(hospitals).where(eq(hospitals.id, hospitalId)).limit(1);

    return NextResponse.json({
      success: true,
      appointment: { ...newAppointment, createdAt: new Date().toISOString() },
      tokenNumber,
      queuePosition: tokenNumber, // Simplified
      estimatedWaitMinutes: tokenNumber * dept.averageServiceTimeMin,
      hospitalName: hospList[0]?.name || "Hospital",
      departmentName: dept.name,
    });

  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
