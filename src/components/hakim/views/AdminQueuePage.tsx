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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate("admin-dashboard")}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-muted-foreground hover:text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>

            <h1 className={`text-2xl font-bold mb-6 ${darkMode ? "text-foreground" : "text-foreground"}`}>Queue Management</h1>

            <div className={`rounded-2xl shadow-lg p-4 mb-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
              <select
                value={selectedDepartment?.id || ""}
                onChange={(e) => {
                  const dept = departments.find(d => d.id === e.target.value);
                  setSelectedDepartment((dept as Department) || null);
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground" : "border-border"}`}
              >
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {selectedDepartment && (
              <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                <div className="text-center mb-6">
                  <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>Currently Serving</p>
                  <p className={`text-5xl font-bold my-2 ${darkMode ? "text-foreground" : "text-foreground"}`}>
                    #{departments.find(d => d.id === selectedDepartment.id)?.currentQueueCount || 0}
                  </p>
                </div>
                <button
                  onClick={callNextPatient}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary text-primary-foreground rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-background" : "bg-background"}`}>
                <ArrowClockwise size={24} className="text-primary mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>Skip Patient</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-background" : "bg-background"}`}>
                <FirstAid size={24} className="text-red-500 mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>Emergency Insert</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-background" : "bg-background"}`}>
                <Check size={24} className="text-primary mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>Mark Complete</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? "bg-background" : "bg-background"}`}>
                <Clock size={24} className="text-primary mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>View History</p>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
