"use client";

import { ArrowLeft, Bell } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Appointment, Notification } from "@/types";
import type { ViewType } from "../routes";

type NotificationItem = Notification & {
  appointment?: Appointment | null;
  hospitalName?: string | null;
  departmentName?: string | null;
};

interface NotificationsPageProps {
  darkMode: boolean;
  token: string | null;
  apiGet: (path: string, token?: string) => Promise<any>;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  t: Record<string, string>;
}

export function NotificationsPage({
  darkMode,
  token,
  apiGet,
  onNavigate,
  navigation,
  footer,
  t,
}: NotificationsPageProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiGet("/api/patient/notifications", token)
      .then((res) => {
        if (res?.success) setItems(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [apiGet, token]);

  const statusClass = (status?: string) => {
    if (status === "SENT") return darkMode ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-50 text-emerald-700";
    if (status === "FAILED") return darkMode ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-700";
    return darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600";
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}
      <section className={`pt-8 pb-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate("profile")}
            className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
          >
            <ArrowLeft size={20} />
            {t.backToDashboard}
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/15 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
              <Bell size={18} className="text-current" />
            </div>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {t.notifications}
              </h1>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {t.notificationHistoryDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{t.locating}</p>
          ) : items.length === 0 ? (
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{t.noNotifications}</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const timestamp = item.sentAt || item.createdAt;
                const hasContext = item.hospitalName || item.departmentName || item.appointment?.tokenNumber;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 ${darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-2">
                        <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {item.message}
                        </p>
                        {hasContext ? (
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {item.hospitalName || t.hospitals}
                            {item.departmentName ? ` • ${item.departmentName}` : ""}
                            {item.appointment?.tokenNumber ? ` • #${item.appointment.tokenNumber}` : ""}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className={`px-2.5 py-1 rounded-full ${statusClass(item.status)}`}>{item.status}</span>
                          <span className={darkMode ? "text-gray-500" : "text-gray-500"}>{item.channel}</span>
                        </div>
                      </div>
                      <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {timestamp ? new Date(timestamp).toLocaleString() : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {footer}
    </div>
  );
}
