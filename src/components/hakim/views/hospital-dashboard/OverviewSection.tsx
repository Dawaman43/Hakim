"use client";

import { motion } from "framer-motion";
import { Bell, ChartBar, CheckCircle, Clock, FirstAid, Stethoscope, Timer, Users } from "@phosphor-icons/react";
import type { DashboardStats, DashboardQueue, DashboardSection } from "./types";

interface OverviewSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  user: { name?: string } | null;
  dashboardStats: DashboardStats;
  dashboardQueues: DashboardQueue[];
  setDashboardSection: (section: DashboardSection) => void;
}

export function OverviewSection({
  darkMode,
  t,
  user,
  dashboardStats,
  dashboardQueues,
  setDashboardSection,
}: OverviewSectionProps) {
  const tr = t;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-primary rounded-2xl p-6 text-foreground shadow-xl">
        <h2 className="text-2xl font-bold mb-2">{tr.welcomeBack}, {user?.name?.split(" ")[0] || "Admin"}!</h2>
        <p className="text-primary">{tr.manageYourHospital}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.todayPatients}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
              <Users size={20} className="text-current" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>{dashboardStats.todayPatients}</p>
        </div>
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.currentlyWaiting}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
              <Timer size={20} className="text-current" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{dashboardStats.waiting}</p>
        </div>
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.servedToday}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
              <CheckCircle size={20} className="text-current" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{dashboardStats.served}</p>
        </div>
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.averageWaitTime}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
              <Clock size={20} className="text-current" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>{dashboardStats.avgWaitTime}<span className="text-lg font-normal">min</span></p>
        </div>
      </div>

      <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className={`p-6 border-b ${darkMode ? "border-border" : "border-border"}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.queueStatus}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-card/50" : "bg-background"}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.departmentName}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.currentToken}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.waitingCount}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.servedCount}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.status}</th>
                <th className={`text-right py-4 px-6 text-sm font-medium ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardQueues.map((queue, index) => (
                <tr key={queue.departmentId} className={index % 2 === 0 ? "" : darkMode ? "bg-muted/30" : "bg-background"}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                        <Stethoscope size={16} className="text-current" />
                      </div>
                      <span className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>{queue.departmentName}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-6 text-center font-mono font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>#{queue.currentToken}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      queue.waiting > 10 ? (darkMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700") :
                      queue.waiting > 5 ? (darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground") :
                      (darkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700")
                    }`}>
                      {queue.waiting}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-center ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{queue.served}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      queue.status === "busy" ? (darkMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700") : (darkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700")
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${queue.status === "busy" ? "bg-red-500" : "bg-green-500"}`} />
                      {queue.status === "busy" ? tr.busy : tr.normal}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary transition">
                      {tr.callNext}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.quickActions}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => setDashboardSection("queues")} className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-primary text-primary-foreground hover:bg-primary"}`}>
            <Users size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.manageQueues}</span>
          </button>
          <button className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-red-900/50 text-red-400 hover:bg-red-900/70" : "bg-red-50 text-red-700 hover:bg-red-100"}`}>
            <FirstAid size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.addEmergency}</span>
          </button>
          <button className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-primary text-primary-foreground hover:bg-primary"}`}>
            <Bell size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.broadcastAlert}</span>
          </button>
          <button onClick={() => setDashboardSection("analytics")} className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-primary text-primary-foreground hover:bg-primary"}`}>
            <ChartBar size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.viewReports}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
