"use client";

import { useState } from "react";
import type { HospitalRegistrationData } from "../types/app-types";

const DEFAULT_REGISTRATION: HospitalRegistrationData = {
  hospitalName: "",
  hospitalType: "",
  region: "Addis Ababa",
  city: "",
  address: "",
  phone: "",
  email: "",
  adminName: "",
  adminPhone: "",
  adminPassword: "",
  confirmPassword: "",
  operatingHours: "24/7",
  services: [],
  agreeToTerms: false,
};

export function useHospitalRegistration() {
  const [registrationStep, setRegistrationStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationData, setRegistrationData] = useState<HospitalRegistrationData>(DEFAULT_REGISTRATION);

  return {
    registrationStep,
    setRegistrationStep,
    showPassword,
    setShowPassword,
    registrationData,
    setRegistrationData,
  };
}
