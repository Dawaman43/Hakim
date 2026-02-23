"use client";

import { ArrowRight, EnvelopeSimple, Hospital, Phone } from "@phosphor-icons/react";
import type { HospitalRegistrationData } from "./types";

interface StepHospitalInfoProps {
  darkMode: boolean;
  t: Record<string, string>;
  registrationData: HospitalRegistrationData;
  setRegistrationData: (updater: (prev: HospitalRegistrationData) => HospitalRegistrationData) => void;
  regionOptions: string[];
  onNext: () => void;
}

export function StepHospitalInfo({
  darkMode,
  t,
  registrationData,
  setRegistrationData,
  regionOptions,
  onNext,
}: StepHospitalInfoProps) {
  const tr = t;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>
        {tr.hospitalInfo}
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.hospitalName} *
          </label>
          <div className="relative">
            <Hospital size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
            <input
              type="text"
              placeholder="e.g., Tikur Anbessa General Hospital"
              value={registrationData.hospitalName}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, hospitalName: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.hospitalType} *
          </label>
          <select
            value={registrationData.hospitalType}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, hospitalType: e.target.value as "GOVERNMENT" | "PRIVATE" | "NGO" }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground" : "border-border"}`}
          >
            <option value="">Select type</option>
            <option value="GOVERNMENT">{tr.government}</option>
            <option value="PRIVATE">{tr.privateHospital}</option>
            <option value="NGO">{tr.ngoHospital}</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.region} *
          </label>
          <select
            value={registrationData.region}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, region: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground" : "border-border"}`}
          >
            {regionOptions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.city} *
          </label>
          <input
            type="text"
            placeholder="e.g., Addis Ababa"
            value={registrationData.city}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, city: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.operatingHoursLabel}
          </label>
          <select
            value={registrationData.operatingHours}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, operatingHours: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground" : "border-border"}`}
          >
            <option value="24/7">{tr.hours247}</option>
            <option value="business">{tr.hoursBusiness}</option>
            <option value="extended">{tr.hoursExtended}</option>
            <option value="custom">{tr.hoursCustom}</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.address}
          </label>
          <input
            type="text"
            placeholder="Full address"
            value={registrationData.address}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, address: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.phoneLabel} *
          </label>
          <div className="relative">
            <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
            <input
              type="tel"
              placeholder="011XXXXXXXX"
              value={registrationData.phone}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.emailAddress} *
          </label>
          <div className="relative">
            <EnvelopeSimple size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
            <input
              type="email"
              placeholder="email@hospital.org"
              value={registrationData.email}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
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
