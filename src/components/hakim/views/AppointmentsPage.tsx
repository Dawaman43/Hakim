"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import type { Appointment } from "@/types";
import type { ViewType } from "../routes";

interface AppointmentsPageProps {
  darkMode: boolean;
  token: string | null;
  apiGet: (path: string, token?: string) => Promise<any>;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  t: Record<string, string>;
}

export function AppointmentsPage({
  darkMode,
  token,
  apiGet,
  onNavigate,
  navigation,
  footer,
  t,
}: AppointmentsPageProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Appointment[]>([]);

  const loadAppointments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiGet("/api/patient/appointments", token);
      if (res?.success) setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  }, [apiGet, token]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}
      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate("profile")}
            className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-muted-foreground hover:text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <ArrowLeft size={20} />
            {t.backToDashboard}
          </button>
          <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? "text-foreground" : "text-foreground"}`}>
            {t.upcomingAppointments}
          </h1>
          <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>
            {t.noAppointments}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{t.locating}</p>
          ) : items.length === 0 ? (
            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{t.noAppointments}</p>
          ) : (
            <div className="space-y-4">
              {items.map((appt) => (
                <div
                  key={appt.id}
                  className={`rounded-2xl border p-4 ${darkMode ? "bg-background border-border" : "bg-card border-border"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                        {appt.hospital?.name || t.hospitals} • {appt.department?.name || t.departments}
                      </p>
                      <p className={`text-lg font-semibold ${darkMode ? "text-foreground" : "text-foreground"}`}>
                        #{appt.tokenNumber} • {appt.status}
                      </p>
                    </div>
                    <div className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                      {new Date(appt.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {footer}
    </div>
  );
}
