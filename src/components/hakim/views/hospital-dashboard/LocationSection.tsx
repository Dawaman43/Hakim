"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Crosshair, MapPin } from "@phosphor-icons/react";
import type { HospitalProfile } from "./types";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (value: HospitalProfile | null) => void;
  onSave: () => void;
  saving: boolean;
}

export function LocationSection({
  darkMode,
  t,
  hospitalProfile,
  setHospitalProfile,
  onSave,
  saving,
}: LocationSectionProps) {
  const tr = t;
  const [mapReady, setMapReady] = useState(false);
  const center: [number, number] = [
    hospitalProfile?.latitude ?? 9.145,
    hospitalProfile?.longitude ?? 40.4897,
  ];

  const updateLocation = (lat: number, lng: number) => {
    setHospitalProfile((prev) =>
      prev ? { ...prev, latitude: lat, longitude: lng } : prev
    );
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        // ignore errors here, user can click map
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const ClickHandler = () => {
    useMapEvents({
      click: (event) => {
        updateLocation(event.latlng.lat, event.latlng.lng);
      },
    });
    return null;
  };

  useEffect(() => {
    setMapReady(true);
    if (L?.Icon?.Default?.mergeOptions) {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.hospitalLocation}</h3>
        <p className={`mb-4 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.clickMapToSet}</p>

        <div className={`w-full h-80 rounded-xl overflow-hidden border ${darkMode ? "bg-card border-border" : "bg-background border-border"}`}>
          {mapReady ? (
            <MapContainer
              center={center}
              zoom={hospitalProfile?.latitude && hospitalProfile?.longitude ? 14 : 6}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickHandler />
              {hospitalProfile?.latitude && hospitalProfile?.longitude ? (
                <Marker position={[hospitalProfile.latitude, hospitalProfile.longitude]} />
              ) : null}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Loading map...
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.latitude}</label>
            <input
              type="number"
              step="0.0001"
              value={hospitalProfile?.latitude || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, latitude: parseFloat(e.target.value) } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.longitude}</label>
            <input
              type="number"
              step="0.0001"
              value={hospitalProfile?.longitude || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, longitude: parseFloat(e.target.value) } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
        </div>

        <button
          onClick={useCurrentLocation}
          className="mt-4 w-full py-3 border border-border rounded-xl font-medium hover:bg-muted/40 transition flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={saving}
        >
          <Crosshair size={20} />
          {tr.useCurrentLocation}
        </button>
        <button
          onClick={onSave}
          className="mt-3 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary transition flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? `${tr.saveChanges}...` : tr.saveChanges}
        </button>
      </div>
    </motion.div>
  );
}
