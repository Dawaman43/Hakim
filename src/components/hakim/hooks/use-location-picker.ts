"use client";

import { useCallback, useRef, useState } from "react";

interface UseLocationPickerParams {
  regionCoordinates: Record<string, { lat: number; lng: number }>;
  defaultLocation: { lat: number; lng: number };
  onNavigate: (view: string) => void;
  setUserLocation: (loc: { lat: number; lng: number; city?: string } | null) => void;
}

export function useLocationPicker({
  regionCoordinates,
  defaultLocation,
  onNavigate,
  setUserLocation,
}: UseLocationPickerParams) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("Addis Ababa");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const ipFallbackTriedRef = useRef(false);
  const watchFallbackTriedRef = useRef(false);

  const tryIpFallback = useCallback(async (shouldNavigate: boolean = true) => {
    if (ipFallbackTriedRef.current) return false;
    ipFallbackTriedRef.current = true;
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) return false;
      const data = await res.json();
      if (
        typeof data?.latitude !== "number" ||
        typeof data?.longitude !== "number"
      )
        return false;
      setUserLocation({ lat: data.latitude, lng: data.longitude, city: data.city });
      setLocationNotice(
        data?.city
          ? `Using approximate location near ${data.city}`
          : "Using approximate location near your area",
      );
      setShowLocationModal(false);
      setLocationError(null);
      if (shouldNavigate) onNavigate("nearest-hospitals");
      return true;
    } catch {
      return false;
    }
  }, [onNavigate, setUserLocation]);

  const tryWatchPosition = useCallback((shouldNavigate: boolean = true) => {
    return new Promise<boolean>((resolve) => {
      if (watchFallbackTriedRef.current || !navigator.geolocation) {
        resolve(false);
        return;
      }
      watchFallbackTriedRef.current = true;
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          navigator.geolocation.clearWatch(watchId);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then((res) => res.json())
            .then((data) => {
              const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state;
              if (city) setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude, city });
            })
            .catch(() => {});
          setLocationLoading(false);
          setShowLocationModal(false);
          setLocationNotice(null);
          if (shouldNavigate) onNavigate("nearest-hospitals");
          resolve(true);
        },
        () => {
          navigator.geolocation.clearWatch(watchId);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
      );
    });
  }, [onNavigate, setUserLocation]);

  const requestLocation = useCallback(
    (forceLowAccuracy: boolean = false, shouldNavigate: boolean = true) => {
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setLocationError(
          "Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.",
        );
        setLocationLoading(false);
        return;
      }

      setLocationLoading(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then((res) => res.json())
            .then((data) => {
              const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state;
              if (city) setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude, city });
            })
            .catch(() => {});
          setLocationLoading(false);
          setShowLocationModal(false);
          setLocationNotice(null);
          if (shouldNavigate) onNavigate("nearest-hospitals");
        },
        (error) => {
          console.log("Geolocation error:", {
            code: error.code,
            message: error.message,
            forcedLowAccuracy: forceLowAccuracy,
          });
          if (
            !forceLowAccuracy &&
            (error.code === error.POSITION_UNAVAILABLE ||
              error.code === error.TIMEOUT)
          ) {
            requestLocation(true, shouldNavigate);
            return;
          }
          if (
            error.code === error.POSITION_UNAVAILABLE ||
            error.code === error.TIMEOUT
          ) {
            tryWatchPosition(shouldNavigate).then((didWatch) => {
              if (didWatch) return;
              tryIpFallback(shouldNavigate).then((didFallback) => {
                if (didFallback) {
                  setLocationLoading(false);
                  return;
                } else {
                  setLocationLoading(false);
                  let errorMsg = "Could not get your location. ";
                  if (error.code === error.POSITION_UNAVAILABLE) {
                    if (typeof window !== "undefined" && !window.isSecureContext) {
                      errorMsg = "Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.";
                    } else {
                      errorMsg = "Your device could not determine its location. Please select your region below.";
                    }
                  } else {
                    errorMsg = "Location request timed out. Please try again or select your region below.";
                  }
                  setLocationError(errorMsg);
                }
              });
            });
            return;
          }

          setLocationLoading(false);
          let errorMsg = "Could not get your location. ";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg =
              "Location permission was denied. Please allow location access in your browser and device settings, or select your region below.";
          }
          setLocationError(errorMsg);
        },
        forceLowAccuracy
          ? { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 }
          : { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 },
      );
    },
    [onNavigate, setUserLocation, tryIpFallback, tryWatchPosition],
  );

  const getUserLocation = useCallback(async (shouldNavigate: boolean = true) => {
    setLocationError(null);
    setLocationNotice(null);
    ipFallbackTriedRef.current = false;
    watchFallbackTriedRef.current = false;
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hakim_user_location");
      }
    } catch {
      // ignore
    }
    setUserLocation(null);

    // If geolocation is unavailable or not in a secure context, gracefully fallback to IP location
    if (
      !navigator.geolocation ||
      (typeof window !== "undefined" && !window.isSecureContext)
    ) {
      const fallbackSuccess = await tryIpFallback(shouldNavigate);
      if (!fallbackSuccess) {
        setLocationError(
          "Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.",
        );
        setShowLocationModal(true);
      }
      return;
    }

    try {
      if (navigator.permissions?.query) {
        const status = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        if (status.state === "denied") {
          const fallbackSuccess = await tryIpFallback(shouldNavigate);
          if (!fallbackSuccess) {
            setLocationError(
              "Location permission was denied. Please allow location access in your browser and device settings, or select your region below.",
            );
            setShowLocationModal(true);
          }
          return;
        }
      }
    } catch {
      // Permission API not available; continue to prompt
    }

    setShowLocationModal(true);
    requestLocation(false, shouldNavigate);
  }, [requestLocation, tryIpFallback]);

  const useSelectedRegion = useCallback(() => {
    const coords = regionCoordinates[selectedRegion] || defaultLocation;
    setUserLocation({ ...coords, city: selectedRegion });
    setLocationError(null);
    setShowLocationModal(false);
    setLocationNotice(`Showing hospitals near ${selectedRegion}`);
    onNavigate("nearest-hospitals");
  }, [
    defaultLocation,
    onNavigate,
    regionCoordinates,
    selectedRegion,
    setUserLocation,
  ]);

  const useDefaultLocation = useCallback(() => {
    setUserLocation({ ...defaultLocation, city: "Addis Ababa" });
    setLocationError(null);
    setShowLocationModal(false);
    setLocationNotice("Using Addis Ababa as your location");
    onNavigate("nearest-hospitals");
  }, [defaultLocation, onNavigate, setUserLocation]);

  const searchCustomLocation = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLocationLoading(true);
    setLocationError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&countrycodes=et&limit=1`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const city = result.name;
        setUserLocation({ lat, lng, city });
        setLocationNotice(`Showing hospitals near ${city}`);
        setShowLocationModal(false);
        onNavigate("nearest-hospitals");
      } else {
        setLocationError(`Could not find location matching "${query}" in Ethiopia. Please try another search term.`);
      }
    } catch {
      setLocationError("Failed to search location. Please check your connection and try again.");
    } finally {
      setLocationLoading(false);
    }
  }, [onNavigate, setUserLocation]);

  return {
    showLocationModal,
    setShowLocationModal,
    locationNotice,
    locationError,
    locationLoading,
    selectedRegion,
    setSelectedRegion,
    getUserLocation,
    requestLocation,
    useSelectedRegion,
    useDefaultLocation,
    searchCustomLocation,
    setLocationError,
  };
}
