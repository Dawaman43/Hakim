"use client";

import { Globe, Moon, Sun } from "@phosphor-icons/react";
import type { HospitalProfile } from "./types";

interface HeaderProps {
  darkMode: boolean;
  language: string;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
  t: Record<string, string>;
  hospitalProfile: HospitalProfile | null;
}

export function Header({
  darkMode,
  language,
  toggleDarkMode,
  toggleLanguage,
  t,
  hospitalProfile,
}: HeaderProps) {
  const tr = t;

  return (
    <header className={`sticky top-0 z-30 px-6 py-4 border-b backdrop-blur-sm ${darkMode ? "bg-gray-950/80 border-gray-800" : "bg-background border-gray-200"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.dashboardTitle}</h1>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{hospitalProfile?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition-all ${darkMode ? "bg-gray-950 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all ${darkMode ? "bg-gray-950 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <Globe size={18} />
            <span className="text-xs font-medium">{language === "en" ? "አማ" : "EN"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
