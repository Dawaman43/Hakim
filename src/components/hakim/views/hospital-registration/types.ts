"use client";

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
