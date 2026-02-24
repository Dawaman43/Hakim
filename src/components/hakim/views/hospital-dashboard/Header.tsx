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
    <header className={`sticky top-0 z-30 px-6 py-4 border-b backdrop-blur-sm ${darkMode ? "bg-primary/20 border-primary/30" : "bg-primary border-primary"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-primary-foreground" : "text-primary-foreground"}`}>{tr.dashboardTitle}</h1>
          <div className="flex items-center gap-2">
            <p className={`text-sm ${darkMode ? "text-primary-foreground/80" : "text-primary-foreground/80"}`}>{hospitalProfile?.name}</p>
            {hospitalProfile?.isActive === false && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-amber-200/40 bg-amber-200/15 text-amber-100">
                Pending Approval
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition-all ${darkMode ? "bg-primary/40 text-white hover:bg-primary/50" : "bg-primary/20 text-white hover:bg-primary/30"}`}
          >
            {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all ${darkMode ? "bg-primary/40 text-white hover:bg-primary/50" : "bg-primary/20 text-white hover:bg-primary/30"}`}
          >
            <Globe size={18} />
            <span className="text-xs font-medium">{language === "en" ? "አማ" : "EN"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
