"use client";

import { ArrowLeft, Heart } from "@phosphor-icons/react";
import type { HospitalRegistrationData } from "./hospital-registration/types";
import { StepHospitalInfo } from "./hospital-registration/StepHospitalInfo";
import { StepServices } from "./hospital-registration/StepServices";
import { StepAdminAccount } from "./hospital-registration/StepAdminAccount";

interface HospitalRegistrationPageProps {
  darkMode: boolean;
  registrationStep: number;
  setRegistrationStep: (step: number) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  registrationData: HospitalRegistrationData;
  setRegistrationData: (updater: (prev: HospitalRegistrationData) => HospitalRegistrationData) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  onNavigate: (view: "landing" | "auth") => void;
  t: Record<string, string>;
  regionOptions: string[];
}

export function HospitalRegistrationPage({
  darkMode,
  registrationStep,
  setRegistrationStep,
  showPassword,
  setShowPassword,
  registrationData,
  setRegistrationData,
  loading,
  setLoading,
  onNavigate,
  t,
  regionOptions,
}: HospitalRegistrationPageProps) {
  const tr = t;

  const services = [
    { id: "emergency", label: tr.emergencyServices },
    { id: "outpatient", label: tr.outpatientServices },
    { id: "inpatient", label: tr.inpatientServices },
    { id: "laboratory", label: tr.laboratoryServices },
    { id: "radiology", label: tr.radiologyServices },
    { id: "pharmacy", label: tr.pharmacyServices },
    { id: "maternal", label: tr.maternalHealth },
    { id: "pediatric", label: tr.pediatricCare },
    { id: "surgical", label: tr.surgicalServices },
  ];

  const handleServiceToggle = (serviceId: string) => {
    setRegistrationData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleRegister = async () => {
    if (registrationData.adminPassword !== registrationData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (registrationData.adminPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (!registrationData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(tr.registrationSuccess);
      onNavigate("auth");
      setRegistrationStep(1);
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate("landing")} className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg">
              <Heart weight="fill" className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
              Hakim
            </span>
          </button>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {tr.registerHospital}
          </h2>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {tr.registerHospitalDesc}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                registrationStep >= step
                  ? "bg-[#2D4B32] text-white"
                  : darkMode ? "bg-gray-950 text-gray-400" : "bg-gray-200 text-gray-500"
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-1 rounded transition-all ${
                  registrationStep > step ? "bg-[#2D4B32]" : darkMode ? "bg-gray-950" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
          {registrationStep === 1 && (
            <StepHospitalInfo
              darkMode={darkMode}
              t={tr}
              registrationData={registrationData}
              setRegistrationData={setRegistrationData}
              regionOptions={regionOptions}
              onNext={() => setRegistrationStep(2)}
            />
          )}

          {registrationStep === 2 && (
            <StepServices
              darkMode={darkMode}
              t={tr}
              services={services}
              registrationData={registrationData}
              onToggleService={handleServiceToggle}
              onBack={() => setRegistrationStep(1)}
              onNext={() => setRegistrationStep(3)}
            />
          )}

          {registrationStep === 3 && (
            <StepAdminAccount
              darkMode={darkMode}
              t={tr}
              registrationData={registrationData}
              setRegistrationData={setRegistrationData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onBack={() => setRegistrationStep(2)}
              onSubmit={handleRegister}
            />
          )}
        </div>

        <button
          onClick={() => onNavigate("landing")}
          className={`w-full mt-6 py-3 transition flex items-center justify-center gap-2 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
        >
          <ArrowLeft size={20} />
          {tr.backToHome}
        </button>
      </div>
    </div>
  );
}
