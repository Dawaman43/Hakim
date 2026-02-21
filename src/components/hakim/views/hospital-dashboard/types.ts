"use client";

export type DashboardSection =
  | "overview"
  | "profile"
  | "location"
  | "queues"
  | "departments"
  | "staff"
  | "analytics"
  | "settings";

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

export interface NewDepartment {
  name: string;
  description: string;
  capacity: number;
  avgTime: number;
}
