"use client";

import { useMemo } from "react";
import type { AdminViewProps } from "../renderers/types";
import type { ViewType } from "../routes";
import type { Department, Hospital, User } from "@/types";

interface UseAdminViewPropsParams {
  view: ViewType;
  darkMode: boolean;
  loading: boolean;
  hospitals: Hospital[];
  departments: Department[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (value: Hospital | null) => void;
  selectedDepartment: Department | null;
  setSelectedDepartment: (value: Department | null) => void;
  loadAdminQueue: () => void;
  adminStats: unknown;
  callNextPatient: () => void;
  onNavigate: (view: ViewType) => void;
  onLogin: (user: User, token: string) => void;
  navigation: React.ReactNode;
}

export function useAdminViewProps(params: UseAdminViewPropsParams) {
  return useMemo<AdminViewProps>(() => ({
    view: params.view,
    darkMode: params.darkMode,
    loading: params.loading,
    hospitals: params.hospitals,
    departments: params.departments,
    selectedHospital: params.selectedHospital,
    setSelectedHospital: params.setSelectedHospital,
    selectedDepartment: params.selectedDepartment,
    setSelectedDepartment: params.setSelectedDepartment,
    loadAdminQueue: params.loadAdminQueue,
    adminStats: params.adminStats,
    callNextPatient: params.callNextPatient,
    onNavigate: params.onNavigate,
    onLogin: params.onLogin,
    navigation: params.navigation,
  }), [
    params.view,
    params.darkMode,
    params.loading,
    params.hospitals,
    params.departments,
    params.selectedHospital,
    params.setSelectedHospital,
    params.selectedDepartment,
    params.setSelectedDepartment,
    params.loadAdminQueue,
    params.adminStats,
    params.callNextPatient,
    params.onNavigate,
    params.onLogin,
    params.navigation,
  ]);
}
