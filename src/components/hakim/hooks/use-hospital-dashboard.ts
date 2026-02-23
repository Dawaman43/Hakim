"use client";

import { useState } from "react";
import type { Department } from "@/types";
import type { DashboardQueue, DashboardSection, DashboardStats, HospitalProfile, DashboardAppointment } from "../types/app-types";

const DEFAULT_STATS: DashboardStats = {
  todayPatients: 0,
  waiting: 0,
  served: 0,
  avgWaitTime: 0,
};

const DEFAULT_NEW_DEPARTMENT = {
  name: "",
  description: "",
  capacity: 50,
  avgTime: 15,
};

export function useHospitalDashboard() {
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>("overview");
  const [hospitalProfile, setHospitalProfile] = useState<HospitalProfile | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [dashboardQueues, setDashboardQueues] = useState<DashboardQueue[]>([]);
  const [dashboardAppointments, setDashboardAppointments] = useState<DashboardAppointment[]>([]);
  const [hospitalDepartments, setHospitalDepartments] = useState<Department[]>([]);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState(DEFAULT_NEW_DEPARTMENT);

  return {
    dashboardSection,
    setDashboardSection,
    hospitalProfile,
    setHospitalProfile,
    dashboardStats,
    setDashboardStats,
    dashboardQueues,
    setDashboardQueues,
    dashboardAppointments,
    setDashboardAppointments,
    hospitalDepartments,
    setHospitalDepartments,
    showAddDepartment,
    setShowAddDepartment,
    newDepartment,
    setNewDepartment,
  };
}
