"use client";

import type { TriageResult } from "@/types";

interface UseEmergencyTriageParams {
  api: { post: (path: string, body: unknown, token?: string) => Promise<any> };
  token: string | null;
  symptoms: string;
  selectedHospitalId?: string | null;
  phone: string;
  userPhone?: string | null;
  name: string;
  setTriageResult: (result: TriageResult | null) => void;
  setLoading: (value: boolean) => void;
}

export function useEmergencyTriage({
  api,
  token,
  symptoms,
  selectedHospitalId,
  phone,
  userPhone,
  name,
  setTriageResult,
  setLoading,
}: UseEmergencyTriageParams) {
  const reportEmergency = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        "/api/emergency/report",
        {
          symptomsText: symptoms,
          hospitalId: selectedHospitalId || undefined,
          contactPhone: phone || userPhone,
          guestName: name,
        },
        token || undefined
      );

      if (res.success) {
        setTriageResult(res.triage);
      } else {
        alert(res.error || "Failed to report emergency");
      }
    } catch (error) {
      console.error("Emergency report error:", error);
      alert("Failed to report emergency. Please call 911 directly.");
    } finally {
      setLoading(false);
    }
  };

  return { reportEmergency };
}
