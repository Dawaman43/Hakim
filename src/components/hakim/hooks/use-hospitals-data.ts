"use client";

import { useCallback, useEffect, useState } from "react";
import type { Hospital, Department } from "@/types";
import { api } from "../api";

interface UseHospitalsDataParams {
  setLoading: (value: boolean) => void;
  page: number;
  pageSize: number;
  regionFilter: string;
  facilityTypeFilter: string;
  searchTerm: string;
}

export function useHospitalsData({ setLoading, page, pageSize, regionFilter, facilityTypeFilter, searchTerm }: UseHospitalsDataParams) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalHospitals, setTotalHospitals] = useState(0);
  const [facilityCounts, setFacilityCounts] = useState<Record<string, number>>({});
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalRegions, setTotalRegions] = useState(0);

  const loadHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      if (regionFilter && regionFilter !== "All Regions") params.set("region", regionFilter);
      if (facilityTypeFilter && facilityTypeFilter !== "ALL") params.set("type", facilityTypeFilter);
      if (searchTerm) params.set("search", searchTerm);
      const res = await api.get(`/api/hospitals?${params.toString()}`);
      if (res.success) {
        setHospitals(res.data as Hospital[]);
        setTotalHospitals(res.total ?? 0);
        setFacilityCounts(res.facilityCounts ?? {});
        setTotalDepartments(res.totalDepartments ?? 0);
        setTotalRegions(res.totalRegions ?? 0);
      } else {
        console.error("Failed to load healthcare facilities:", res.error);
        setHospitals([]);
        setTotalHospitals(0);
        setFacilityCounts({});
        setTotalDepartments(0);
        setTotalRegions(0);
      }
    } catch (error) {
      console.error("Failed to load healthcare facilities:", error);
      setHospitals([]);
      setTotalHospitals(0);
      setFacilityCounts({});
      setTotalDepartments(0);
      setTotalRegions(0);
    } finally {
      setLoading(false);
    }
  }, [facilityTypeFilter, page, pageSize, regionFilter, searchTerm, setLoading]);

  const loadDepartments = useCallback(async (hospitalId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/hospitals/${hospitalId}/departments`);
      if (res.success) {
        setDepartments(res.data as Department[]);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  return {
    hospitals,
    departments,
    totalHospitals,
    facilityCounts,
    totalDepartments,
    totalRegions,
    loadHospitals,
    loadDepartments,
  };
}
