"use client";

import { useMemo } from "react";
import type { HospitalViewProps } from "../renderers/types";
import type { ViewType } from "../routes";
import type { Language, TranslationStrings } from "../translations";
import type { User } from "@/types";
import type { DashboardQueue, DashboardSection, DashboardStats, HospitalProfile, HospitalRegistrationData } from "../types/app-types";

interface UseHospitalViewPropsParams {
  view: ViewType;
  darkMode: boolean;
  language: Language;
  t: TranslationStrings;
  user: User | null;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
  registrationStep: number;
  setRegistrationStep: (value: number) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  registrationData: HospitalRegistrationData;
  setRegistrationData: (value: HospitalRegistrationData) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  regionOptions: string[];
  dashboardSection: DashboardSection;
  setDashboardSection: (value: DashboardSection) => void;
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (value: HospitalProfile | null) => void;
  dashboardStats: DashboardStats;
  setDashboardStats: (value: DashboardStats) => void;
  dashboardQueues: DashboardQueue[];
  setDashboardQueues: (value: DashboardQueue[]) => void;
  showAddDepartment: boolean;
  setShowAddDepartment: (value: boolean) => void;
  newDepartment: { name: string; description: string; capacity: number; avgTime: number };
  setNewDepartment: (value: { name: string; description: string; capacity: number; avgTime: number }) => void;
}

export function useHospitalViewProps(params: UseHospitalViewPropsParams) {
  return useMemo<HospitalViewProps>(() => ({
    view: params.view,
    darkMode: params.darkMode,
    language: params.language,
    t: params.t,
    user: params.user,
    onNavigate: params.onNavigate,
    onLogout: params.onLogout,
    onToggleLanguage: params.onToggleLanguage,
    onToggleDarkMode: params.onToggleDarkMode,
    registrationStep: params.registrationStep,
    setRegistrationStep: params.setRegistrationStep,
    showPassword: params.showPassword,
    setShowPassword: params.setShowPassword,
    registrationData: params.registrationData,
    setRegistrationData: params.setRegistrationData,
    loading: params.loading,
    setLoading: params.setLoading,
    regionOptions: params.regionOptions,
    dashboardSection: params.dashboardSection,
    setDashboardSection: params.setDashboardSection,
    hospitalProfile: params.hospitalProfile,
    setHospitalProfile: params.setHospitalProfile,
    dashboardStats: params.dashboardStats,
    setDashboardStats: params.setDashboardStats,
    dashboardQueues: params.dashboardQueues,
    setDashboardQueues: params.setDashboardQueues,
    showAddDepartment: params.showAddDepartment,
    setShowAddDepartment: params.setShowAddDepartment,
    newDepartment: params.newDepartment,
    setNewDepartment: params.setNewDepartment,
  }), [
    params.view,
    params.darkMode,
    params.language,
    params.t,
    params.user,
    params.onNavigate,
    params.onLogout,
    params.onToggleLanguage,
    params.onToggleDarkMode,
    params.registrationStep,
    params.setRegistrationStep,
    params.showPassword,
    params.setShowPassword,
    params.registrationData,
    params.setRegistrationData,
    params.loading,
    params.setLoading,
    params.regionOptions,
    params.dashboardSection,
    params.setDashboardSection,
    params.hospitalProfile,
    params.setHospitalProfile,
    params.dashboardStats,
    params.setDashboardStats,
    params.dashboardQueues,
    params.setDashboardQueues,
    params.showAddDepartment,
    params.setShowAddDepartment,
    params.newDepartment,
    params.setNewDepartment,
  ]);
}
