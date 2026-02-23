"use client";

import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import type { HospitalRegistrationData } from "./types";

interface StepServicesProps {
  darkMode: boolean;
  t: Record<string, string>;
  services: { id: string; label: string }[];
  registrationData: HospitalRegistrationData;
  onToggleService: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepServices({
  darkMode,
  t,
  services,
  registrationData,
  onToggleService,
  onBack,
  onNext,
}: StepServicesProps) {
  const tr = t;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
        {tr.servicesOffered}
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => onToggleService(service.id)}
            className={`flex items-center justify-between p-3 rounded-xl border transition ${
              registrationData.services.includes(service.id)
                ? darkMode ? "bg-[#2D4B32]/10 border-[#2D4B32]/50 text-[#2D4B32]" : "bg-[#2D4B32] border-[#2D4B32] text-[#2D4B32]"
                : darkMode ? "bg-gray-950 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-background border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{service.label}</span>
            {registrationData.services.includes(service.id) && <Check size={14} />}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${darkMode ? "bg-gray-950 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          <ArrowLeft size={20} />
          {tr.back}
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D4B32] text-white rounded-xl font-medium hover:bg-[#2D4B32] transition"
        >
          {tr.nextStep}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
