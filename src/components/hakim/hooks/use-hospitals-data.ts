"use client";

import { useCallback, useEffect, useState } from "react";
import { MOCK_HOSPITALS } from "@/lib/mock-hospitals";
import type { Hospital, Department } from "@/types";

interface UseHospitalsDataParams {
  setLoading: (value: boolean) => void;
}

export function useHospitalsData({ setLoading }: UseHospitalsDataParams) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const loadHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const mockHospitals: Hospital[] = MOCK_HOSPITALS.map((h) => ({
        id: h.id,
        name: h.name,
        region: h.region,
        address: h.address,
        latitude: h.latitude,
        longitude: h.longitude,
        emergencyContactNumber: h.emergencyContactNumber,
        isActive: h.isActive,
        adminId: null,
        facilityType: h.facilityType,
        facilityTypeDisplay: h.facilityType === "HOSPITAL" ? "Hospital" :
                            h.facilityType === "HEALTH_CENTER" ? "Health Center" :
                            h.facilityType === "CLINIC" ? "Clinic" :
                            h.facilityType === "HEALTH_POST" ? "Health Post" :
                            h.facilityType === "PHARMACY" ? "Pharmacy" :
                            h.facilityType === "LABORATORY" ? "Laboratory" :
                            "Specialized Center",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        departments: h.departments.map((d, i) => ({
          id: `dept-${h.id}-${i}`,
          hospitalId: h.id,
          name: d.name,
          description: `${d.name} department`,
          averageServiceTimeMin: d.avgTime,
          dailyCapacity: d.capacity,
          currentQueueCount: Math.floor(Math.random() * 30),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      }));
      setHospitals(mockHospitals);
    } catch (error) {
      console.error("Failed to load healthcare facilities:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const loadDepartments = useCallback(async (hospitalId: string) => {
    setLoading(true);
    try {
      const hospital = hospitals.find(h => h.id === hospitalId);
      if (hospital && hospital.departments) {
        setDepartments(hospital.departments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Failed to load departments:", error);
    } finally {
      setLoading(false);
    }
  }, [hospitals, setLoading]);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  return {
    hospitals,
    departments,
    loadHospitals,
    loadDepartments,
  };
}
