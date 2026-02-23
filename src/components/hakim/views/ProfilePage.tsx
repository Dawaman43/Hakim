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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-3xl p-8 text-white text-center shadow-xl shadow-[#2D4B32]/20">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} />
              </div>
              <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
              <p className="text-[#2D4B32]">{formatPhoneDisplay(user?.phone || "")}</p>
              <span className="inline-block mt-4 px-4 py-1 bg-background rounded-full text-sm">
                {user?.role === "HOSPITAL_ADMIN" ? "Hospital Admin" : "Patient"}
              </span>
            </div>

            <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
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
                className={`w-full p-4 flex items-center gap-4 transition border-b ${darkMode ? "hover:bg-gray-950 border-gray-800" : "hover:bg-gray-50 border-gray-100"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
                  <Ticket size={20} className="text-current" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>My Active Token</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>View your current queue position</p>
                </div>
                <CaretRight size={20} className={darkMode ? "text-gray-600" : "text-gray-400"} />
              </button>

              <button
                onClick={() => onNavigate("appointments")}
                className={`w-full p-4 flex items-center gap-4 transition border-b ${darkMode ? "hover:bg-gray-950 border-gray-800" : "hover:bg-gray-50 border-gray-100"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
                  <Clock size={20} className="text-current" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{t.appointmentHistory}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>View past appointments</p>
                </div>
                <CaretRight size={20} className={darkMode ? "text-gray-600" : "text-gray-400"} />
              </button>

              <button
                onClick={() => onNavigate("notifications")}
                className={`w-full p-4 flex items-center gap-4 transition ${darkMode ? "hover:bg-gray-950" : "hover:bg-gray-50"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
                  <Bell size={20} className="text-current" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{t.notifications}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{t.notificationHistoryDesc}</p>
                </div>
                <CaretRight size={20} className={darkMode ? "text-gray-600" : "text-gray-400"} />
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
