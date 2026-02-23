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
    <header className={`sticky top-0 z-30 px-6 py-4 border-b backdrop-blur-sm ${darkMode ? "bg-background/80 border-border" : "bg-background border-border"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.dashboardTitle}</h1>
          <div className="flex items-center gap-2">
            <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{hospitalProfile?.name}</p>
            {hospitalProfile?.isActive === false && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600">
                Pending Approval
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition-all ${darkMode ? "bg-background text-yellow-400 hover:bg-card" : "bg-muted text-muted-foreground hover:bg-muted"}`}
          >
            {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all ${darkMode ? "bg-background text-muted-foreground hover:bg-card" : "bg-muted text-muted-foreground hover:bg-muted"}`}
          >
            <Globe size={18} />
            <span className="text-xs font-medium">{language === "en" ? "አማ" : "EN"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
