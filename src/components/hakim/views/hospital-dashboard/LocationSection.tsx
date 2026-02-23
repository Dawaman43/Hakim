"use client";

import { motion } from "framer-motion";
import { Crosshair, MapPin } from "@phosphor-icons/react";
import type { HospitalProfile } from "./types";

interface LocationSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (updater: (prev: HospitalProfile | null) => HospitalProfile | null) => void;
}

export function LocationSection({
  darkMode,
  t,
  hospitalProfile,
  setHospitalProfile,
}: LocationSectionProps) {
  const tr = t;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.hospitalLocation}</h3>
        <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{tr.clickMapToSet}</p>

        <div className={`w-full h-80 rounded-xl flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-background"}`}>
          <div className="text-center">
            <MapPin size={48} className={`mx-auto mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Interactive Map</p>
            <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Click to set hospital location</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.latitude}</label>
            <input
              type="number"
              step="0.0001"
              value={hospitalProfile?.latitude || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, latitude: parseFloat(e.target.value) } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.longitude}</label>
            <input
              type="number"
              step="0.0001"
              value={hospitalProfile?.longitude || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, longitude: parseFloat(e.target.value) } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
        </div>

        <button className="mt-4 w-full py-3 bg-[#2D4B32] text-white rounded-xl font-medium hover:bg-[#2D4B32] transition flex items-center justify-center gap-2">
          <Crosshair size={20} />
          {tr.useCurrentLocation}
        </button>
      </div>
    </motion.div>
  );
}
