"use client";

import { motion } from "framer-motion";
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  FirstAid,
} from "@phosphor-icons/react";
import type { Department } from "@/types";
import type { ViewType } from "../routes";

interface AdminQueuePageProps {
  darkMode: boolean;
  loading: boolean;
  departments: Department[];
  selectedDepartment: Department | null;
  setSelectedDepartment: (department: Department | null) => void;
  callNextPatient: () => void;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
}

export function AdminQueuePage({
  darkMode,
  loading,
  departments,
  selectedDepartment,
  setSelectedDepartment,
  callNextPatient,
  onNavigate,
  navigation,
}: AdminQueuePageProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate("admin-dashboard")}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>

            <h1 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>Queue Management</h1>

            <div className={`rounded-2xl shadow-lg p-4 mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
              <select
                value={selectedDepartment?.id || ""}
                onChange={(e) => {
                  const dept = departments.find(d => d.id === e.target.value);
                  setSelectedDepartment((dept as Department) || null);
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-950 border-gray-700 text-white" : "border-gray-200"}`}
              >
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {selectedDepartment && (
              <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
                <div className="text-center mb-6">
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Currently Serving</p>
                  <p className={`text-5xl font-bold my-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    #{departments.find(d => d.id === selectedDepartment.id)?.currentQueueCount || 0}
                  </p>
                </div>
                <button
                  onClick={callNextPatient}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <ArrowClockwise className="animate-spin" size={20} />
                  ) : (
                    <>
                      <ArrowRight size={20} />
                      Call Next Patient
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-gray-950" : "bg-background"}`}>
                <ArrowClockwise size={24} className="text-[#2D4B32] mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Skip Patient</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-gray-950" : "bg-background"}`}>
                <FirstAid size={24} className="text-red-500 mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Emergency Insert</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-gray-950" : "bg-background"}`}>
                <Check size={24} className="text-[#2D4B32] mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Mark Complete</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-gray-950" : "bg-background"}`}>
                <Clock size={24} className="text-[#2D4B32] mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>View History</p>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
