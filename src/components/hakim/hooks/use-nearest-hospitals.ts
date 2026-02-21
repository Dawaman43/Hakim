"use client";

import { useCallback } from "react";
import type { Hospital } from "@/types";

interface UseNearestHospitalsParams {
  hospitals: Hospital[];
  userLocation: { lat: number; lng: number } | null;
}

export function useNearestHospitals({ hospitals, userLocation }: UseNearestHospitalsParams) {
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const getHospitalsByDistance = useCallback(() => {
    if (!userLocation) return [] as Array<Hospital & { distance: number }>;

    return hospitals
      .filter(h => h.latitude && h.longitude)
      .map(h => ({
        ...h,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          h.latitude!,
          h.longitude!
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [calculateDistance, hospitals, userLocation]);

  return { getHospitalsByDistance };
}
