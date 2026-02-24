"use client";

import { ArrowClockwise, ArrowLeft, Check, Eye, EyeSlash, Phone, User } from "@phosphor-icons/react";
import type { HospitalRegistrationData } from "./types";

interface StepAdminAccountProps {
  darkMode: boolean;
  t: Record<string, string>;
  registrationData: HospitalRegistrationData;
  setRegistrationData: (updater: (prev: HospitalRegistrationData) => HospitalRegistrationData) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepAdminAccount({
  darkMode,
  t,
  registrationData,
  setRegistrationData,
  showPassword,
  setShowPassword,
  loading,
  onBack,
  onSubmit,
}: StepAdminAccountProps) {
  const tr = t;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>
        {tr.adminAccount}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.adminName} *
          </label>
          <div className="relative">
            <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
            <input
              type="text"
              placeholder="Full name"
              value={registrationData.adminName}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, adminName: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.adminPhone} *
          </label>
          <div className="relative">
            <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
            <input
              type="tel"
              placeholder="09XXXXXXXXX"
              value={registrationData.adminPhone}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, adminPhone: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.adminPassword} *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={registrationData.adminPassword}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, adminPassword: e.target.value }))}
              className={`w-full pr-12 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {tr.confirmPassword} *
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={registrationData.confirmPassword}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
          />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={registrationData.agreeToTerms}
          onChange={(e) => setRegistrationData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
          className="mt-1"
        />
        <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
          {tr.agreeToTerms}
        </p>
      </div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={registrationData.agreeToPrivacy}
          onChange={(e) => setRegistrationData(prev => ({ ...prev, agreeToPrivacy: e.target.checked }))}
          className="mt-1"
        />
        <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
          {tr.agreeToPrivacy}
        </p>
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
          onClick={onSubmit}
          disabled={
            loading ||
            !registrationData.adminName ||
            !registrationData.adminPhone ||
            !registrationData.adminPassword ||
            !registrationData.agreeToTerms ||
            !registrationData.agreeToPrivacy
          }
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary transition disabled:opacity-50"
        >
          {loading ? (
            <ArrowClockwise className="animate-spin" size={20} />
          ) : (
            <>
              {tr.completeRegistration}
              <Check size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
