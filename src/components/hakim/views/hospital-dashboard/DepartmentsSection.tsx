"use client";

import { motion } from "framer-motion";
import { PencilSimple, Plus } from "@phosphor-icons/react";
import type { DashboardQueue, NewDepartment } from "./types";

interface DepartmentsSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  showAddDepartment: boolean;
  setShowAddDepartment: (value: boolean) => void;
  newDepartment: NewDepartment;
  setNewDepartment: (value: NewDepartment) => void;
  dashboardQueues: DashboardQueue[];
}

export function DepartmentsSection({
  darkMode,
  t,
  showAddDepartment,
  setShowAddDepartment,
  newDepartment,
  setNewDepartment,
  dashboardQueues,
}: DepartmentsSectionProps) {
  const tr = t;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.departments}</h3>
        <button
          onClick={() => setShowAddDepartment(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
        >
          <Plus size={20} />
          {tr.addDepartment}
        </button>
      </div>

      {showAddDepartment && (
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
          <h4 className={`font-medium mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.addDepartment}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.departmentNameLabel}</label>
              <input
                type="text"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                placeholder="e.g., Cardiology"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.departmentDesc}</label>
              <input
                type="text"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                placeholder="Brief description"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.dailyCapacity}</label>
              <input
                type="number"
                value={newDepartment.capacity}
                onChange={(e) => setNewDepartment({ ...newDepartment, capacity: parseInt(e.target.value) })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.avgServiceTime}</label>
              <input
                type="number"
                value={newDepartment.avgTime}
                onChange={(e) => setNewDepartment({ ...newDepartment, avgTime: parseInt(e.target.value) })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"}`}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setShowAddDepartment(false)}
              className={`px-4 py-2 rounded-lg font-medium transition ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {tr.cancel}
            </button>
            <button
              onClick={() => {
                setShowAddDepartment(false);
                setNewDepartment({ name: "", description: "", capacity: 50, avgTime: 15 });
              }}
              className="px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
            >
              {tr.saveChanges}
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardQueues.map((dept) => (
          <div key={dept.departmentId} className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{dept.departmentName}</h4>
              <div className="flex gap-1">
                <button className={`p-2 rounded-lg transition ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                  <PencilSimple size={16} />
                </button>
              </div>
            </div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <p>Current Token: <span className="font-bold text-[#2D4B32]">#{dept.currentToken}</span></p>
              <p>{tr.waitingCount}: {dept.waiting}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
