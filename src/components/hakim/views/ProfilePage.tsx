"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CaretRight,
  Clock,
  SignOut,
  Ticket,
  User,
} from "@phosphor-icons/react";
import type { Appointment } from "@/types";
import type { ViewType } from "../routes";
import { formatPhoneDisplay } from "@/lib/queue-utils";

interface ProfilePageProps {
  darkMode: boolean;
  user: { name?: string; phone?: string; role?: string } | null;
  token: string | null;
  apiGet: (path: string, token?: string) => Promise<any>;
  setCurrentAppointment: (appointment: Appointment | null) => void;
  currentAppointment: Appointment | null;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  navigation: React.ReactNode;
  t: Record<string, string>;
}

export function ProfilePage({
  darkMode,
  user,
  token,
  apiGet,
  setCurrentAppointment,
  currentAppointment,
  onNavigate,
  onLogout,
  navigation,
  t,
}: ProfilePageProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-primary to-primary rounded-3xl p-8 text-foreground text-center shadow-xl shadow-primary/20">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} />
              </div>
              <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
              <p className="text-primary">{formatPhoneDisplay(user?.phone || "")}</p>
              <span className="inline-block mt-4 px-4 py-1 bg-background rounded-full text-sm">
                {user?.role === "HOSPITAL_ADMIN" ? "Hospital Admin" : "Patient"}
              </span>
            </div>

            <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
              <button
                onClick={async () => {
                  if (currentAppointment) {
                    onNavigate("token");
                    return;
                  }
                  if (!token) {
                    alert("Your session expired. Please sign in again.");
                    onNavigate("auth");
                    return;
                  }
                  const res = await apiGet("/api/patient/active-token", token || undefined);
                  if (res?.success && res.appointment) {
                    setCurrentAppointment(res.appointment);
                    onNavigate("token");
                    return;
                  }
                  if (res?.status === 401) {
                    alert("Your session expired. Please sign in again.");
                    onNavigate("auth");
                    return;
                  }
                  alert(res?.error || "No active appointments found");
                }}
                className={`w-full p-4 flex items-center gap-4 transition border-b ${darkMode ? "hover:bg-background border-border" : "hover:bg-muted/40 border-border"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                  <Ticket size={20} className="text-current" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>My Active Token</p>
                  <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>View your current queue position</p>
                </div>
                <CaretRight size={20} className={darkMode ? "text-muted-foreground" : "text-muted-foreground"} />
              </button>

              <button
                onClick={() => onNavigate("appointments")}
                className={`w-full p-4 flex items-center gap-4 transition border-b ${darkMode ? "hover:bg-background border-border" : "hover:bg-muted/40 border-border"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                  <Clock size={20} className="text-current" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>{t.appointmentHistory}</p>
                  <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>View past appointments</p>
                </div>
                <CaretRight size={20} className={darkMode ? "text-muted-foreground" : "text-muted-foreground"} />
              </button>

              <button
                onClick={() => onNavigate("notifications")}
                className={`w-full p-4 flex items-center gap-4 transition ${darkMode ? "hover:bg-background" : "hover:bg-muted/40"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                  <Bell size={20} className="text-current" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>{t.notifications}</p>
                  <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{t.notificationHistoryDesc}</p>
                </div>
                <CaretRight size={20} className={darkMode ? "text-muted-foreground" : "text-muted-foreground"} />
              </button>
            </div>

            <button
              onClick={() => { onLogout(); onNavigate("landing"); }}
              className={`w-full py-4 border rounded-xl font-medium transition flex items-center justify-center gap-2 ${darkMode ? "border-red-800 text-red-400 hover:bg-red-900/30" : "border-red-200 text-red-600 hover:bg-red-50"}`}
            >
              <SignOut size={20} />
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
