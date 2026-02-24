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
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>
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
                ? darkMode ? "bg-primary/10 border-primary/50 text-primary-foreground" : "bg-primary border-primary text-primary-foreground"
                : darkMode ? "bg-background border-border text-muted-foreground hover:bg-card" : "bg-background border-border text-muted-foreground hover:bg-muted/40"
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
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${darkMode ? "bg-background text-muted-foreground hover:bg-card" : "bg-muted text-muted-foreground hover:bg-muted/60"}`}
        >
          <ArrowLeft size={20} />
          {tr.back}
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary transition"
        >
          {tr.nextStep}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
