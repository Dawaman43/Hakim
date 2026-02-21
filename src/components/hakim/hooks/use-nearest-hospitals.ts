"use client";

import { useCallback, useEffect, useState } from "react";
import type { Hospital } from "@/types";
import { api } from "../api";

interface UseNearestHospitalsParams {
  userLocation: { lat: number; lng: number } | null;
}

export function useNearestHospitals({ userLocation }: UseNearestHospitalsParams) {
  const [nearestHospitals, setNearestHospitals] = useState<Array<Hospital & { distance: number }>>([]);
  const [nearestLoading, setNearestLoading] = useState(false);
  const [nearestError, setNearestError] = useState<string | null>(null);

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

  const loadNearestHospitals = useCallback(async () => {
    if (!userLocation) {
      setNearestHospitals([]);
      setNearestError(null);
      return;
    }
    setNearestLoading(true);
    setNearestError(null);
    try {
      const res = await api.get(`/api/hospitals/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&limit=50`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setNearestHospitals(res.data || []);
        return;
      }

      // Fallback: fetch a larger sample and compute distances client-side
      const fallback = await api.get(`/api/hospitals?limit=200&page=1`);
      if (fallback.success && Array.isArray(fallback.data)) {
        const computed = fallback.data
          .filter((h: Hospital) => h.latitude && h.longitude)
          .map((h: Hospital) => ({
            ...h,
            distance: calculateDistance(userLocation.lat, userLocation.lng, h.latitude!, h.longitude!),
          }))
          .sort((a: any, b: any) => a.distance - b.distance);
        setNearestHospitals(computed.slice(0, 50));
      } else {
        setNearestHospitals([]);
        setNearestError(res.error || "Unable to load nearby hospitals.");
      }
    } catch {
      setNearestHospitals([]);
      setNearestError("Unable to load nearby hospitals.");
    } finally {
      setNearestLoading(false);
    }
  }, [calculateDistance, userLocation]);

  useEffect(() => {
    loadNearestHospitals();
  }, [loadNearestHospitals]);

  return { nearestHospitals, nearestLoading, nearestError, loadNearestHospitals };
}
