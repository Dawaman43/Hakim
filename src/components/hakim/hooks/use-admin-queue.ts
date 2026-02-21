"use client";

import { useCallback } from "react";
import type { Hospital, Department } from "@/types";

interface UseAdminQueueParams {
  api: { post: (path: string, body: unknown, token?: string) => Promise<any>; get: (path: string, token?: string) => Promise<any> };
  token: string | null;
  selectedHospital: Hospital | null;
  selectedDepartment: Department | null;
  setAdminStats: (stats: unknown) => void;
  setLoading: (value: boolean) => void;
}

export function useAdminQueue({
  api,
  token,
  selectedHospital,
  selectedDepartment,
  setAdminStats,
  setLoading,
}: UseAdminQueueParams) {
  const loadAdminQueue = useCallback(async () => {
    if (!selectedHospital) return;

    try {
      const res = await api.get(`/api/admin/analytics?hospitalId=${selectedHospital.id}`, token || undefined);
      if (res.success) {
        setAdminStats(res.data);
      }
    } catch (error) {
      console.error("Load admin queue error:", error);
    }
  }, [api, selectedHospital, setAdminStats, token]);

  const callNextPatient = async () => {
    if (!selectedDepartment) return;

    setLoading(true);
    try {
      const res = await api.post(
        "/api/admin/call-next",
        {
          hospitalId: selectedHospital?.id,
          departmentId: selectedDepartment.id,
        },
        token || undefined
      );

      if (res.success) {
        alert(`Called patient: Token #${res.data.appointment.tokenNumber}`);
        loadAdminQueue();
      } else {
        alert(res.error || "Failed to call next patient");
      }
    } catch (error) {
      console.error("Call next error:", error);
      alert("Failed to call next patient");
    } finally {
      setLoading(false);
    }
  };

  return { loadAdminQueue, callNextPatient };
}
