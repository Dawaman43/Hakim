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
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
        {tr.adminAccount}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {tr.adminName} *
          </label>
          <div className="relative">
            <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <input
              type="text"
              placeholder="Full name"
              value={registrationData.adminName}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, adminName: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {tr.adminPhone} *
          </label>
          <div className="relative">
            <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <input
              type="tel"
              placeholder="09XXXXXXXXX"
              value={registrationData.adminPhone}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, adminPhone: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {tr.adminPassword} *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={registrationData.adminPassword}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, adminPassword: e.target.value }))}
              className={`w-full pr-12 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {tr.confirmPassword} *
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={registrationData.confirmPassword}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
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
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {tr.agreeTerms}
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          <ArrowLeft size={20} />
          {tr.back}
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || !registrationData.adminName || !registrationData.adminPhone || !registrationData.adminPassword}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D4B32] text-white rounded-xl font-medium hover:bg-[#2D4B32] transition disabled:opacity-50"
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
