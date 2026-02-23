"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiGet("/api/patient/appointments", token)
      .then((res) => {
        if (res?.success) setItems(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [apiGet, token]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}
      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate("profile")}
            className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
          >
            <ArrowLeft size={20} />
            {t.backToDashboard}
          </button>
          <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {t.upcomingAppointments}
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {t.noAppointments}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{t.locating}</p>
          ) : items.length === 0 ? (
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{t.noAppointments}</p>
          ) : (
            <div className="space-y-4">
              {items.map((appt) => (
                <div
                  key={appt.id}
                  className={`rounded-2xl border p-4 ${darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {appt.hospital?.name || t.hospitals} • {appt.department?.name || t.departments}
                      </p>
                      <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        #{appt.tokenNumber} • {appt.status}
                      </p>
                    </div>
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
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
