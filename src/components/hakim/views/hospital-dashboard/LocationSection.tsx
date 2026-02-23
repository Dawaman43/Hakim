"use client";

import { motion } from "framer-motion";
import { Crosshair, MapPin } from "@phosphor-icons/react";
import type { HospitalProfile } from "./types";

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.hospitalLocation}</h3>
        <p className={`mb-4 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.clickMapToSet}</p>

        <div className={`w-full h-80 rounded-xl flex items-center justify-center ${darkMode ? "bg-card" : "bg-background"}`}>
          <div className="text-center">
            <MapPin size={48} className={`mx-auto mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>Interactive Map</p>
            <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>Click to set hospital location</p>
          </div>
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
          onClick={onSave}
          className="mt-4 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary transition flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={saving}
        >
          <Crosshair size={20} />
          {saving ? `${tr.saveChanges}...` : tr.useCurrentLocation}
        </button>
      </div>
    </motion.div>
  );
}
