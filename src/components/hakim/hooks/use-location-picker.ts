"use client";

import { useCallback, useRef, useState } from "react";

interface UseLocationPickerParams {
  regionCoordinates: Record<string, { lat: number; lng: number }>;
  defaultLocation: { lat: number; lng: number };
  onNavigate: (view: string) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
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

  const tryIpFallback = useCallback(async () => {
    if (ipFallbackTriedRef.current) return false;
    ipFallbackTriedRef.current = true;
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) return false;
      const data = await res.json();
      if (typeof data?.latitude !== "number" || typeof data?.longitude !== "number") return false;
      setUserLocation({ lat: data.latitude, lng: data.longitude });
      setLocationNotice(data?.city ? `Using approximate location near ${data.city}` : "Using approximate location near your area");
      setShowLocationModal(false);
      setLocationError(null);
      onNavigate("nearest-hospitals");
      return true;
    } catch {
      return false;
    }
  }, [onNavigate, setUserLocation]);

  const tryWatchPosition = useCallback(() => {
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
          setLocationLoading(false);
          setShowLocationModal(false);
          setLocationNotice(null);
          onNavigate("nearest-hospitals");
          resolve(true);
        },
        () => {
          navigator.geolocation.clearWatch(watchId);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
    });
  }, [onNavigate, setUserLocation]);

  const requestLocation = useCallback((forceLowAccuracy: boolean = false) => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setLocationError("Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.");
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
        setLocationLoading(false);
        setShowLocationModal(false);
        setLocationNotice(null);
        onNavigate("nearest-hospitals");
      },
      (error) => {
        console.log("Geolocation error:", {
          code: error.code,
          message: error.message,
          forcedLowAccuracy: forceLowAccuracy,
        });
        if (!forceLowAccuracy && (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT)) {
          requestLocation(true);
          return;
        }
        if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
          tryWatchPosition().then((didWatch) => {
            if (didWatch) return;
            tryIpFallback().then((didFallback) => {
              if (didFallback) {
                setLocationLoading(false);
              }
            });
          });
        }
        setLocationLoading(false);
        let errorMsg = "Could not get your location. ";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission was denied. Please allow location access in your browser and device settings, or select your region below.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          if (typeof window !== "undefined" && !window.isSecureContext) {
            errorMsg = "Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.";
          } else {
            errorMsg = "Your device could not determine its location (code 2). Try enabling High Accuracy / Precise location in system settings, or select your region below.";
          }
        } else {
          errorMsg = "Location request timed out. Please try again or select your region below.";
        }
        setLocationError(errorMsg);
      },
      forceLowAccuracy
        ? { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 }
        : { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  }, [onNavigate, setUserLocation, tryIpFallback]);

  const getUserLocation = useCallback(async () => {
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

    if (!navigator.geolocation) {
      setShowLocationModal(true);
      return;
    }

    if (typeof window !== "undefined" && !window.isSecureContext) {
      setLocationError("Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.");
      setShowLocationModal(true);
      return;
    }

    try {
      if (navigator.permissions?.query) {
        const status = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        if (status.state === "denied") {
          setLocationError("Location permission was denied. Please allow location access in your browser and device settings, or select your region below.");
          setShowLocationModal(true);
          return;
        }
      }
    } catch {
      // Permission API not available; continue to prompt
    }

    setShowLocationModal(true);
    requestLocation(false);
  }, [requestLocation]);

  const useSelectedRegion = useCallback(() => {
    const coords = regionCoordinates[selectedRegion] || defaultLocation;
    setUserLocation(coords);
    setLocationError(null);
    setShowLocationModal(false);
    setLocationNotice(`Showing hospitals near ${selectedRegion}`);
    onNavigate("nearest-hospitals");
  }, [defaultLocation, onNavigate, regionCoordinates, selectedRegion, setUserLocation]);

  const useDefaultLocation = useCallback(() => {
    setUserLocation(defaultLocation);
    setLocationError(null);
    setShowLocationModal(false);
    setLocationNotice("Using Addis Ababa as your location");
    onNavigate("nearest-hospitals");
  }, [defaultLocation, onNavigate, setUserLocation]);

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
    setLocationError,
  };
}
