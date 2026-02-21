"use client";

import { useCallback, useState } from "react";

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

  const getUserLocation = useCallback(async () => {
    setLocationError(null);
    setLocationNotice(null);

    if (!navigator.geolocation) {
      setShowLocationModal(true);
      return;
    }

    setShowLocationModal(true);
  }, []);

  const requestLocation = useCallback((forceLowAccuracy: boolean = false) => {
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
        setLocationLoading(false);
        let errorMsg = "Could not get your location. ";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission was denied. Please allow location access in your browser and device settings, or select your region below.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          if (typeof window !== "undefined" && !window.isSecureContext) {
            errorMsg = "Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.";
          } else {
            errorMsg = "Your device could not determine its location. Make sure location services are enabled, or select your region below.";
          }
        } else {
          errorMsg = "Location request timed out. Please try again or select your region below.";
        }
        setLocationError(errorMsg);
      },
      forceLowAccuracy
        ? { enableHighAccuracy: false, timeout: 12000, maximumAge: 120000 }
        : { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
    );
  }, [onNavigate, setUserLocation]);

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
