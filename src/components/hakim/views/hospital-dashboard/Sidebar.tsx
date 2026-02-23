"use client";

import { ChartBar, Gear, Heart, Hospital, House, IdentificationCard, MapPin, SignOut, Stethoscope, User, Users } from "@phosphor-icons/react";
import type { DashboardSection, HospitalProfile } from "./types";

interface SidebarProps {
  darkMode: boolean;
  t: Record<string, string>;
  user: { name?: string } | null;
  hospitalProfile: HospitalProfile | null;
  dashboardSection: DashboardSection;
  setDashboardSection: (section: DashboardSection) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({
  darkMode,
  t,
  user,
  hospitalProfile,
  dashboardSection,
  setDashboardSection,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const tr = t;

  const sidebarItems = [
    { id: "overview", icon: House, label: tr.overview },
    { id: "profile", icon: Hospital, label: tr.profile },
    { id: "location", icon: MapPin, label: tr.location },
    { id: "queues", icon: Users, label: tr.queues },
    { id: "appointments", icon: Users, label: tr.appointments },
    { id: "departments", icon: Stethoscope, label: tr.departments },
    { id: "staff", icon: IdentificationCard, label: tr.staff },
    { id: "analytics", icon: ChartBar, label: tr.analytics },
    { id: "settings", icon: Gear, label: tr.settings },
  ] as const;

  return (
    <aside className={`w-64 fixed left-0 top-0 h-full z-40 flex flex-col transition-colors duration-300 ${darkMode ? "bg-background border-r border-border" : "bg-card border-r border-border"}`}>
      <div className="p-6">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center shadow-lg">
            <Heart weight="fill" className="text-foreground" size={22} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
            Hakim
          </span>
        </button>
      </div>

      <nav className="flex-1 px-4 py-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setDashboardSection(item.id as DashboardSection)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
              dashboardSection === item.id
                ? darkMode ? "bg-primary/10 text-primary font-medium" : "bg-primary text-primary-foreground font-medium"
                : darkMode ? "text-muted-foreground hover:text-foreground hover:bg-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t ${darkMode ? "border-border" : "border-border"}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center shadow-sm">
            <User size={16} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium truncate ${darkMode ? "text-foreground" : "text-foreground"}`}>{user?.name || "Admin"}</p>
            <p className={`text-xs truncate ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{hospitalProfile?.name}</p>
          </div>
        </div>
        <button
          onClick={() => { onLogout(); onNavigate("landing"); }}
          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"}`}
        >
          <SignOut size={18} />
          {tr.signOut}
        </button>
      </div>
    </aside>
  );
}
