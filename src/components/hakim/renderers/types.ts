"use client";

import type { ReactNode } from "react";
import type { Appointment, Department, Hospital, QueueStatusResponse, TriageResult, User } from "@/types";
import type { Language, TranslationStrings } from "../translations";
import type { ViewType } from "../routes";
import type { DashboardQueue, DashboardSection, DashboardStats, HospitalProfile, HospitalRegistrationData } from "../types/app-types";

export interface PublicViewProps {
  view: ViewType;
  darkMode: boolean;
  language: Language;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  onNavigate: (view: ViewType) => void;
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onFindNearest: () => void;
  locationLoading: boolean;
  t: TranslationStrings;
  selectedRegion: string | null;
  getAmbulanceInfo: () => any;
  loading: boolean;
  otpSent: boolean;
  phone: string;
  setPhone: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  otp: string;
  setOtp: (value: string) => void;
  setOtpSent: (value: boolean) => void;
  sendOtp: (purpose?: "LOGIN" | "REGISTRATION") => void;
  verifyOtp: () => void;
  hospitals: Hospital[];
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
  facilityTypeFilter: string;
  setFacilityTypeFilter: (value: string) => void;
  selectedHospital: Hospital | null;
  setSelectedHospital: (value: Hospital | null) => void;
  loadDepartments: (hospitalId: string) => void;
  departments: Department[];
  selectedDepartment: Department | null;
  setSelectedDepartment: (value: Department | null) => void;
  notes: string;
  setNotes: (value: string) => void;
  onBook: () => void;
  currentAppointment: Appointment | null;
  queueStatus: QueueStatusResponse | null;
  symptoms: string;
  setSymptoms: (value: string) => void;
  triageResult: TriageResult | null;
  setTriageResult: (value: TriageResult | null) => void;
  reportEmergency: () => void;
  apiGet: (path: string, token?: string) => Promise<any>;
  setCurrentAppointment: (appt: Appointment | null) => void;
  userLocation: { lat: number; lng: number } | null;
  locationNotice: string | null;
  getHospitalsByDistance: (limit?: number) => Array<{ hospital: Hospital; distance: number }>;
  navigation: ReactNode;
  footer: ReactNode;
}

export interface AdminViewProps {
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
  navigation: ReactNode;
}

export interface HospitalViewProps {
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

export interface HakimViewRendererProps {
  publicProps: PublicViewProps;
  adminProps: AdminViewProps;
  hospitalProps: HospitalViewProps;
}
