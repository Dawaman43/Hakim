"use client";

import { useEffect } from "react";
import type { Appointment, QueueStatusResponse } from "@/types";

interface UseQueueStatusPollingParams {
  api: { get: (path: string, token?: string) => Promise<any> };
  view: string;
  currentAppointment: Appointment | null;
  setQueueStatus: (status: QueueStatusResponse | null) => void;
}

export function useQueueStatusPolling({
  api,
  view,
  currentAppointment,
  setQueueStatus,
}: UseQueueStatusPollingParams) {
  useEffect(() => {
    if (view !== "token" || !currentAppointment) return;

    const interval = setInterval(async () => {
      const res = await api.get(`/api/queue/status?appointmentId=${currentAppointment.id}`);
      if (res.success) {
        setQueueStatus(res.data);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [api, currentAppointment, setQueueStatus, view]);
}
