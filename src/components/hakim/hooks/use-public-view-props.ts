"use client";

import { useMemo } from "react";
import type { PublicViewProps } from "../renderers/types";
import type { ViewType } from "../routes";
import type { Language, TranslationStrings } from "../translations";
import type { Appointment, Department, Hospital, QueueStatusResponse, TriageResult, User } from "@/types";

interface UsePublicViewPropsParams {
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
  totalHospitals: number;
  facilityCounts: Record<string, number>;
  totalDepartments: number;
  totalRegions: number;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
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
  nearestHospitals: Array<Hospital & { distance: number }>;
  nearestLoading: boolean;
  nearestError: string | null;
  navigation: React.ReactNode;
  footer: React.ReactNode;
}

export function usePublicViewProps(params: UsePublicViewPropsParams) {
  return useMemo<PublicViewProps>(() => ({
    view: params.view,
    darkMode: params.darkMode,
    language: params.language,
    user: params.user,
    token: params.token,
    isAuthenticated: params.isAuthenticated,
    mobileMenuOpen: params.mobileMenuOpen,
    setMobileMenuOpen: params.setMobileMenuOpen,
    onNavigate: params.onNavigate,
    onToggleLanguage: params.onToggleLanguage,
    onToggleDarkMode: params.onToggleDarkMode,
    onLogout: params.onLogout,
    onFindNearest: params.onFindNearest,
    locationLoading: params.locationLoading,
    t: params.t,
    selectedRegion: params.selectedRegion,
    getAmbulanceInfo: params.getAmbulanceInfo,
    loading: params.loading,
    otpSent: params.otpSent,
    phone: params.phone,
    setPhone: params.setPhone,
    name: params.name,
    setName: params.setName,
    otp: params.otp,
    setOtp: params.setOtp,
    setOtpSent: params.setOtpSent,
    sendOtp: params.sendOtp,
    verifyOtp: params.verifyOtp,
    hospitals: params.hospitals,
    totalHospitals: params.totalHospitals,
    facilityCounts: params.facilityCounts,
    totalDepartments: params.totalDepartments,
    totalRegions: params.totalRegions,
    page: params.page,
    pageSize: params.pageSize,
    setPage: params.setPage,
    setPageSize: params.setPageSize,
    viewMode: params.viewMode,
    setViewMode: params.setViewMode,
    searchTerm: params.searchTerm,
    setSearchTerm: params.setSearchTerm,
    regionFilter: params.regionFilter,
    setRegionFilter: params.setRegionFilter,
    facilityTypeFilter: params.facilityTypeFilter,
    setFacilityTypeFilter: params.setFacilityTypeFilter,
    selectedHospital: params.selectedHospital,
    setSelectedHospital: params.setSelectedHospital,
    loadDepartments: params.loadDepartments,
    departments: params.departments,
    selectedDepartment: params.selectedDepartment,
    setSelectedDepartment: params.setSelectedDepartment,
    notes: params.notes,
    setNotes: params.setNotes,
    onBook: params.onBook,
    currentAppointment: params.currentAppointment,
    queueStatus: params.queueStatus,
    symptoms: params.symptoms,
    setSymptoms: params.setSymptoms,
    triageResult: params.triageResult,
    setTriageResult: params.setTriageResult,
    reportEmergency: params.reportEmergency,
    apiGet: params.apiGet,
    setCurrentAppointment: params.setCurrentAppointment,
    userLocation: params.userLocation,
    locationNotice: params.locationNotice,
    nearestHospitals: params.nearestHospitals,
    nearestLoading: params.nearestLoading,
    nearestError: params.nearestError,
    navigation: params.navigation,
    footer: params.footer,
  }), [
    params.view,
    params.darkMode,
    params.language,
    params.user,
    params.token,
    params.isAuthenticated,
    params.mobileMenuOpen,
    params.setMobileMenuOpen,
    params.onNavigate,
    params.onToggleLanguage,
    params.onToggleDarkMode,
    params.onLogout,
    params.onFindNearest,
    params.locationLoading,
    params.t,
    params.selectedRegion,
    params.getAmbulanceInfo,
    params.loading,
    params.otpSent,
    params.phone,
    params.setPhone,
    params.name,
    params.setName,
    params.otp,
    params.setOtp,
    params.setOtpSent,
    params.sendOtp,
    params.verifyOtp,
    params.hospitals,
    params.totalHospitals,
    params.facilityCounts,
    params.totalDepartments,
    params.totalRegions,
    params.page,
    params.pageSize,
    params.setPage,
    params.setPageSize,
    params.viewMode,
    params.setViewMode,
    params.searchTerm,
    params.setSearchTerm,
    params.regionFilter,
    params.setRegionFilter,
    params.facilityTypeFilter,
    params.setFacilityTypeFilter,
    params.selectedHospital,
    params.setSelectedHospital,
    params.loadDepartments,
    params.departments,
    params.selectedDepartment,
    params.setSelectedDepartment,
    params.notes,
    params.setNotes,
    params.onBook,
    params.currentAppointment,
    params.queueStatus,
    params.symptoms,
    params.setSymptoms,
    params.triageResult,
    params.setTriageResult,
    params.reportEmergency,
    params.apiGet,
    params.setCurrentAppointment,
    params.userLocation,
    params.locationNotice,
    params.nearestHospitals,
    params.nearestLoading,
    params.nearestError,
    params.navigation,
    params.footer,
  ]);
}
