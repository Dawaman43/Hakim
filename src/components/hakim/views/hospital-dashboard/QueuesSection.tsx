"use client";

import { motion } from "framer-motion";
import type { DashboardQueue } from "./types";

interface QueuesSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  dashboardQueues: DashboardQueue[];
}

export function QueuesSection({
  darkMode,
  t,
  dashboardQueues,
}: QueuesSectionProps) {
  const tr = t;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-background"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.manageQueues}</h3>

        {dashboardQueues.map((queue) => (
          <div key={queue.departmentId} className={`mb-4 p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-background"}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{queue.departmentName}</h4>
              <span className="text-2xl font-bold text-[#2D4B32]">#{queue.currentToken}</span>
            </div>
            <div className="flex items-center gap-4 text-sm mb-3">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{queue.waiting} {tr.waitingCount}</span>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{queue.served} {tr.servedCount}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#2D4B32] text-white rounded-lg text-sm font-medium hover:bg-[#2D4B32] transition">
                {tr.callNext}
              </button>
              <button className={`py-2 px-4 rounded-lg text-sm font-medium transition ${darkMode ? "bg-gray-600 text-gray-300 hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                {tr.viewQueue}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
