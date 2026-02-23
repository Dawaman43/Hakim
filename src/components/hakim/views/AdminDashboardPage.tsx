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
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
  const summary = (adminStats as Record<string, any>)?.summary || {};
  const departmentStats = ((adminStats as Record<string, any>)?.departmentStats as any[]) || [];
  const totalWaiting = summary.totalWaiting || 0;
  const totalServed = summary.totalServed || 0;
  const totalPatientsToday = summary.totalPatientsToday || 0;
  const statusBreakdown = [
    { key: "waiting", name: "Waiting", value: totalWaiting },
    { key: "served", name: "Served", value: totalServed },
    {
      key: "inProgress",
      name: "In Progress",
      value: Math.max(totalPatientsToday - totalWaiting - totalServed, 0),
    },
  ];
  const deptVolume = departmentStats.map((dept) => ({
    ...dept,
    totalVolume: (dept.totalWaiting || 0) + (dept.totalServed || 0),
  }));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>Admin Dashboard</h1>
                <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>Manage hospital queues and view analytics</p>
              </div>
              <button
                onClick={loadAdminQueue}
                disabled={loading}
                className={`px-4 py-2 border rounded-xl transition flex items-center gap-2 ${darkMode ? "border-border text-muted-foreground hover:bg-background" : "border-border text-muted-foreground hover:bg-muted/40"}`}
              >
                <ArrowClockwise size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            <div className={`rounded-2xl shadow-lg p-4 mb-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
              <select
                value={selectedHospital?.id || ""}
                onChange={(e) => {
                  const hospital = hospitals.find(h => h.id === e.target.value);
                  setSelectedHospital(hospital || null);
                  if (hospital) loadAdminQueue();
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground" : "border-border"}`}
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
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>Total Today</span>
                      <Users size={20} className={darkMode ? "text-muted-foreground" : "text-muted-foreground"} />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>
                      {(adminStats as Record<string, unknown>).summary?.totalPatientsToday as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>Waiting</span>
                      <Timer size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">
                      {(adminStats as Record<string, unknown>).summary?.totalWaiting as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>Served</span>
                      <CheckCircle size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">
                      {(adminStats as Record<string, unknown>).summary?.totalServed as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>Avg Wait</span>
                      <Clock size={20} className="text-primary" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>
                      {(adminStats as Record<string, unknown>).summary?.averageWaitTime as number || 0} min
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 mb-6">
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>Status Breakdown</h3>
                    <ChartContainer
                      className="h-72 w-full"
                      config={{
                        waiting: { label: "Waiting", color: "hsl(var(--primary))" },
                        served: { label: "Served", color: "hsl(var(--muted-foreground))" },
                        inProgress: { label: "In Progress", color: "hsl(var(--secondary))" },
                      }}
                    >
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={statusBreakdown}
                          dataKey="value"
                          nameKey="key"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                        >
                          {statusBreakdown.map((entry) => (
                            <Cell
                              key={entry.key}
                              fill={`var(--color-${entry.key})`}
                            />
                          ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 lg:col-span-2 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>Department Load</h3>
                    <ChartContainer
                      className="h-72 w-full"
                      config={{
                        waiting: { label: "Waiting", color: "hsl(var(--primary))" },
                        served: { label: "Served", color: "hsl(var(--muted-foreground))" },
                      }}
                    >
                      <BarChart data={departmentStats}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="departmentName" tickLine={false} axisLine={false} interval={0} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="totalWaiting" name="waiting" fill="var(--color-waiting)" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="totalServed" name="served" fill="var(--color-served)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-4 mb-6">
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>Department Volume</h3>
                    <ChartContainer
                      className="h-72 w-full"
                      config={{
                        totalVolume: { label: "Total Volume", color: "hsl(var(--primary))" },
                      }}
                    >
                      <BarChart data={deptVolume}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="departmentName" tickLine={false} axisLine={false} interval={0} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="totalVolume" name="totalVolume" fill="var(--color-totalVolume)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>

                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>Average Service Time</h3>
                    <ChartContainer
                      className="h-72 w-full"
                      config={{
                        averageServiceTimeMin: { label: "Avg Service (min)", color: "hsl(var(--secondary))" },
                      }}
                    >
                      <BarChart data={departmentStats}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="departmentName" tickLine={false} axisLine={false} interval={0} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="averageServiceTimeMin" name="averageServiceTimeMin" fill="var(--color-averageServiceTimeMin)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>

                <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                  <h3 className={`font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>Department Queue Status</h3>
                  <div className="space-y-3">
                    {((adminStats as Record<string, unknown>).departmentStats as unknown[])?.map((dept: unknown) => (
                      <div
                        key={(dept as Record<string, unknown>).departmentId as string}
                        className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-background" : "bg-background"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                            <Stethoscope size={20} className="text-current" />
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? "text-foreground" : "text-foreground"}`}>
                              {(dept as Record<string, unknown>).departmentName as string}
                            </p>
                            <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                              Token #{(dept as Record<string, unknown>).currentToken as number} serving
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-primary">{(dept as Record<string, unknown>).totalWaiting as number}</p>
                            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>waiting</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-primary">{(dept as Record<string, unknown>).totalServed as number}</p>
                            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>served</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedDepartment(departments.find(d => d.id === (dept as Record<string, unknown>).departmentId) || null);
                              onNavigate("admin-queue");
                            }}
                            className={`px-4 py-2 rounded-lg transition font-medium ${darkMode ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-primary text-primary-foreground hover:bg-primary"}`}
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
