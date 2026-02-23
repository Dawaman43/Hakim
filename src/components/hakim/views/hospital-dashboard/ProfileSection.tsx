"use client";

import { motion } from "framer-motion";
import type { HospitalProfile } from "./types";

interface ProfileSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (updater: (prev: HospitalProfile | null) => HospitalProfile | null) => void;
}

export function ProfileSection({
  darkMode,
  t,
  hospitalProfile,
  setHospitalProfile,
}: ProfileSectionProps) {
  const tr = t;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.editProfile}</h3>
          <button className="px-4 py-2 bg-[#2D4B32] text-white rounded-lg text-sm font-medium hover:bg-[#2D4B32] transition">
            {tr.saveChanges}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.hospitalName}</label>
            <input
              type="text"
              value={hospitalProfile?.name || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.hospitalType}</label>
            <select
              value={hospitalProfile?.type || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, type: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            >
              <option value="GOVERNMENT">{tr.government}</option>
              <option value="PRIVATE">{tr.privateHospital}</option>
              <option value="NGO">{tr.ngoHospital}</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.region}</label>
            <input
              type="text"
              value={hospitalProfile?.region || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, region: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.city}</label>
            <input
              type="text"
              value={hospitalProfile?.city || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, city: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.address}</label>
            <input
              type="text"
              value={hospitalProfile?.address || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.phoneLabel}</label>
            <input
              type="tel"
              value={hospitalProfile?.phone || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.emailAddress}</label>
            <input
              type="email"
              value={hospitalProfile?.email || ""}
              onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
