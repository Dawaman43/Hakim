"use client";

import { motion } from "framer-motion";
import type { HospitalProfile } from "./types";

interface ProfileSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (value: HospitalProfile | null) => void;
  onSave: () => void;
  saving: boolean;
}

export function ProfileSection({
  darkMode,
  t,
  hospitalProfile,
  setHospitalProfile,
  onSave,
  saving,
}: ProfileSectionProps) {
  const tr = t;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.editProfile}</h3>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary transition disabled:opacity-60"
            disabled={saving}
          >
            {saving ? `${tr.saveChanges}...` : tr.saveChanges}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.hospitalName}</label>
            <input
              type="text"
              value={hospitalProfile?.name || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, name: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.hospitalType}</label>
            <select
              value={hospitalProfile?.type || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, type: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            >
              <option value="GOVERNMENT">{tr.government}</option>
              <option value="PRIVATE">{tr.privateHospital}</option>
              <option value="NGO">{tr.ngoHospital}</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.region}</label>
            <input
              type="text"
              value={hospitalProfile?.region || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, region: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.city}</label>
            <input
              type="text"
              value={hospitalProfile?.city || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, city: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.address}</label>
            <input
              type="text"
              value={hospitalProfile?.address || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, address: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.phoneLabel}</label>
            <input
              type="tel"
              value={hospitalProfile?.phone || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, phone: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.emailAddress}</label>
            <input
              type="email"
              value={hospitalProfile?.email || ""}
              onChange={(e) => setHospitalProfile(hospitalProfile ? { ...hospitalProfile, email: e.target.value } : null)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-card border-border text-foreground" : "border-border"}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
