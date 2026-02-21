"use client";

import { motion } from "framer-motion";
import {
  ArrowClockwise,
  CheckCircle,
  Clock,
  Stethoscope,
  Timer,
  Users,
} from "@phosphor-icons/react";
import type { Hospital, Department } from "@/types";
import type { ViewType } from "../routes";

interface AdminDashboardPageProps {
  darkMode: boolean;
  loading: boolean;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  loadAdminQueue: () => void;
  adminStats: unknown;
  departments: Department[];
  setSelectedDepartment: (department: Department | null) => void;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
}

export function AdminDashboardPage({
  darkMode,
  loading,
  hospitals,
  selectedHospital,
  setSelectedHospital,
  loadAdminQueue,
  adminStats,
  departments,
  setSelectedDepartment,
  onNavigate,
  navigation,
}: AdminDashboardPageProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Admin Dashboard</h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Manage hospital queues and view analytics</p>
              </div>
              <button
                onClick={loadAdminQueue}
                disabled={loading}
                className={`px-4 py-2 border rounded-xl transition flex items-center gap-2 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <ArrowClockwise size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            <div className={`rounded-2xl shadow-lg p-4 mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
              <select
                value={selectedHospital?.id || ""}
                onChange={(e) => {
                  const hospital = hospitals.find(h => h.id === e.target.value);
                  setSelectedHospital(hospital || null);
                  if (hospital) loadAdminQueue();
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-200"}`}
              >
                <option value="">Select a hospital</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            {adminStats && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Total Today</span>
                      <Users size={20} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {(adminStats as Record<string, unknown>).summary?.totalPatientsToday as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Waiting</span>
                      <Timer size={20} className="text-[#2D4B32]" />
                    </div>
                    <p className="text-3xl font-bold text-[#2D4B32]">
                      {(adminStats as Record<string, unknown>).summary?.totalWaiting as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Served</span>
                      <CheckCircle size={20} className="text-[#2D4B32]" />
                    </div>
                    <p className="text-3xl font-bold text-[#2D4B32]">
                      {(adminStats as Record<string, unknown>).summary?.totalServed as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Avg Wait</span>
                      <Clock size={20} className="text-[#2D4B32]" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {(adminStats as Record<string, unknown>).summary?.averageWaitTime as number || 0} min
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                  <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Department Queue Status</h3>
                  <div className="space-y-3">
                    {((adminStats as Record<string, unknown>).departmentStats as unknown[])?.map((dept: unknown) => (
                      <div
                        key={(dept as Record<string, unknown>).departmentId as string}
                        className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-background"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10" : "bg-[#2D4B32]"}`}>
                            <Stethoscope size={20} className="text-[#2D4B32]" />
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {(dept as Record<string, unknown>).departmentName as string}
                            </p>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Token #{(dept as Record<string, unknown>).currentToken as number} serving
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-[#2D4B32]">{(dept as Record<string, unknown>).totalWaiting as number}</p>
                            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>waiting</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-[#2D4B32]">{(dept as Record<string, unknown>).totalServed as number}</p>
                            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>served</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedDepartment(departments.find(d => d.id === (dept as Record<string, unknown>).departmentId) || null);
                              onNavigate("admin-queue");
                            }}
                            className={`px-4 py-2 rounded-lg transition font-medium ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10" : "bg-[#2D4B32] text-[#2D4B32] hover:bg-[#2D4B32]"}`}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
