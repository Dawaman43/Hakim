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
      <div className="bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">{tr.welcomeBack}, {user?.name?.split(" ")[0] || "Admin"}!</h2>
        <p className="text-[#2D4B32]">{tr.manageYourHospital}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.todayPatients}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
              <Users size={20} className="text-current" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{dashboardStats.todayPatients}</p>
        </div>
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.currentlyWaiting}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
              <Timer size={20} className="text-current" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#2D4B32]">{dashboardStats.waiting}</p>
        </div>
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.servedToday}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
              <CheckCircle size={20} className="text-current" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#2D4B32]">{dashboardStats.served}</p>
        </div>
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.averageWaitTime}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
              <Clock size={20} className="text-current" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{dashboardStats.avgWaitTime}<span className="text-lg font-normal">min</span></p>
        </div>
      </div>

      <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
        <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.queueStatus}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-gray-700/50" : "bg-background"}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.departmentName}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.currentToken}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.waitingCount}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.servedCount}</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{tr.status}</th>
                <th className={`text-right py-4 px-6 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardQueues.map((queue, index) => (
                <tr key={queue.departmentId} className={index % 2 === 0 ? "" : darkMode ? "bg-gray-750/30" : "bg-background"}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
                        <Stethoscope size={16} className="text-current" />
                      </div>
                      <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{queue.departmentName}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-6 text-center font-mono font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>#{queue.currentToken}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      queue.waiting > 10 ? (darkMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700") :
                      queue.waiting > 5 ? (darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white") :
                      (darkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700")
                    }`}>
                      {queue.waiting}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{queue.served}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      queue.status === "busy" ? (darkMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700") : (darkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700")
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${queue.status === "busy" ? "bg-red-500" : "bg-green-500"}`} />
                      {queue.status === "busy" ? tr.busy : tr.normal}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-4 py-2 bg-[#2D4B32] text-white rounded-lg text-sm font-medium hover:bg-[#2D4B32] transition">
                      {tr.callNext}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.quickActions}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => setDashboardSection("queues")} className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10" : "bg-[#2D4B32] text-white hover:bg-[#2D4B32]"}`}>
            <Users size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.manageQueues}</span>
          </button>
          <button className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-red-900/50 text-red-400 hover:bg-red-900/70" : "bg-red-50 text-red-700 hover:bg-red-100"}`}>
            <FirstAid size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.addEmergency}</span>
          </button>
          <button className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10" : "bg-[#2D4B32] text-white hover:bg-[#2D4B32]"}`}>
            <Bell size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.broadcastAlert}</span>
          </button>
          <button onClick={() => setDashboardSection("analytics")} className={`p-4 rounded-xl transition text-center ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10" : "bg-[#2D4B32] text-white hover:bg-[#2D4B32]"}`}>
            <ChartBar size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{tr.viewReports}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
