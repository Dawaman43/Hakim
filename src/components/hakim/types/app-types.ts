"use client";

export type DashboardSection =
  | "overview"
  | "profile"
  | "location"
  | "queues"
  | "appointments"
  | "departments"
  | "staff"
  | "analytics"
  | "settings";

export interface HospitalRegistrationData {
  hospitalName: string;
  hospitalType: "GOVERNMENT" | "PRIVATE" | "NGO" | "";
  region: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  adminName: string;
  adminPhone: string;
  adminPassword: string;
  confirmPassword: string;
  operatingHours: string;
  services: string[];
  agreeToTerms: boolean;
}

export interface HospitalProfile {
  name: string;
  type: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  operatingHours: string;
  services: string[];
  isActive?: boolean;
  facilityType?: string | null;
}

export interface DashboardStats {
  todayPatients: number;
  waiting: number;
  served: number;
  avgWaitTime: number;
}

export interface DashboardQueue {
  departmentId: string;
  departmentName: string;
  currentToken: number;
  waiting: number;
  served: number;
  status: string;
}

export interface DashboardAppointment {
  id: string;
  tokenNumber: number;
  status: string;
  createdAt: string;
  patientName?: string | null;
  patientPhone?: string | null;
  departmentName?: string | null;
  notes?: string | null;
}
