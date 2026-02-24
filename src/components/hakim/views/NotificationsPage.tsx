"use client";

import { ArrowLeft, Bell } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
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

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiGet("/api/patient/notifications", token);
      if (res?.success) setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  }, [apiGet, token]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const statusClass = (status?: string) => {
    if (status === "SENT") return darkMode ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-50 text-emerald-700";
    if (status === "FAILED") return darkMode ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-700";
    return darkMode ? "bg-card text-muted-foreground" : "bg-muted text-muted-foreground";
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}
      <section className={`pt-8 pb-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate("profile")}
            className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-muted-foreground hover:text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <ArrowLeft size={20} />
            {t.backToDashboard}
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/15 text-primary" : "bg-primary text-primary-foreground"}`}>
              <Bell size={18} className="text-current" />
            </div>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>
                {t.notifications}
              </h1>
              <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>
                {t.notificationHistoryDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{t.locating}</p>
          ) : items.length === 0 ? (
            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{t.noNotifications}</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const timestamp = item.sentAt || item.createdAt;
                const hasContext = item.hospitalName || item.departmentName || item.appointment?.tokenNumber;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 ${darkMode ? "bg-background border-border" : "bg-card border-border"}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-2">
                        <p className={`text-lg font-semibold ${darkMode ? "text-foreground" : "text-foreground"}`}>
                          {item.message}
                        </p>
                        {hasContext ? (
                          <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                            {item.hospitalName || t.hospitals}
                            {item.departmentName ? ` • ${item.departmentName}` : ""}
                            {item.appointment?.tokenNumber ? ` • #${item.appointment.tokenNumber}` : ""}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className={`px-2.5 py-1 rounded-full ${statusClass(item.status)}`}>{item.status}</span>
                          <span className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{item.channel}</span>
                        </div>
                      </div>
                      <div className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
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
