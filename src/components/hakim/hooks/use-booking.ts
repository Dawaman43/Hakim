"use client";

import type { Hospital, Department, Appointment, QueueStatusResponse } from "@/types";

interface UseBookingParams {
  api: { post: (path: string, body: unknown, token?: string) => Promise<any> };
  token: string | null;
  notes: string;
  isAuthenticated: boolean;
  phone: string;
  name: string;
  selectedHospital: Hospital | null;
  selectedDepartment: Department | null;
  setCurrentAppointment: (appt: Appointment | null) => void;
  setQueueStatus: (status: QueueStatusResponse | null) => void;
  navigateTo: (view: string) => void;
  setLoading: (value: boolean) => void;
}

export function useBooking({
  api,
  token,
  notes,
  isAuthenticated,
  phone,
  name,
  selectedHospital,
  selectedDepartment,
  setCurrentAppointment,
  setQueueStatus,
  navigateTo,
  setLoading,
}: UseBookingParams) {
  const bookAppointment = async () => {
    if (!selectedHospital || !selectedDepartment) return;

    setLoading(true);
    try {
      const res = await api.post(
        "/api/queue/book",
        {
          hospitalId: selectedHospital.id,
          departmentId: selectedDepartment.id,
          notes,
          guestPhone: !isAuthenticated ? phone : undefined,
          guestName: !isAuthenticated ? name : undefined,
        },
        token || undefined
      );

      if (res.success) {
        setCurrentAppointment(res.appointment);
        setQueueStatus({
          departmentId: selectedDepartment.id,
          departmentName: selectedDepartment.name,
          currentToken: res.currentToken || 0,
          lastTokenIssued: res.tokenNumber,
          totalWaiting: res.queuePosition,
          estimatedWaitMinutes: res.estimatedWaitMinutes,
          nextAvailableSlot: "",
        });
        navigateTo("token");
      } else {
        alert(res.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Book appointment error:", error);
      alert("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return { bookAppointment };
}
