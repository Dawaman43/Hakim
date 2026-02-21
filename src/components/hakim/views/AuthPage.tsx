"use client";

import { motion } from "framer-motion";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Phone,
  User,
} from "@phosphor-icons/react";
import type { ViewType } from "../routes";

interface AuthPageProps {
  darkMode: boolean;
  loading: boolean;
  otpSent: boolean;
  phone: string;
  setPhone: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  otp: string;
  setOtp: (value: string) => void;
  setOtpSent: (value: boolean) => void;
  sendOtp: (type: "REGISTRATION" | "LOGIN") => void;
  verifyOtp: () => void;
  onNavigate: (view: ViewType) => void;
  t: Record<string, string>;
}

export function AuthPage({
  darkMode,
  loading,
  otpSent,
  phone,
  setPhone,
  name,
  setName,
  otp,
  setOtp,
  setOtpSent,
  sendOtp,
  verifyOtp,
  onNavigate,
  t,
}: AuthPageProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
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
            {otpSent ? t.verifyOTP : t.signIn}
          </h2>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {otpSent ? `${t.weSentCode} ${phone}` : t.signInPhone}
          </p>
        </div>

        <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
          {!otpSent ? (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{t.phoneNumberLabel}</label>
                <div className="relative">
                  <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <input
                    type="tel"
                    placeholder="09XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition text-lg ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{t.nameOptionalLabel}</label>
                <div className="relative">
                  <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <input
                    type="text"
                    placeholder={t.yourNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition text-lg ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                  />
                </div>
              </div>
              <button
                onClick={() => sendOtp(name ? "REGISTRATION" : "LOGIN")}
                disabled={loading || !phone}
                className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <ArrowClockwise className="animate-spin" size={20} />
                ) : (
                  <>
                    {t.continue}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{t.enterOTPLabel}</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`w-full text-center text-3xl tracking-widest py-4 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition font-mono ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <ArrowClockwise className="animate-spin" size={20} />
                ) : (
                  <>
                    {t.verifySignInBtn}
                    <Check size={20} />
                  </>
                )}
              </button>
              <button
                onClick={() => setOtpSent(false)}
                className={`w-full py-3 transition flex items-center justify-center gap-2 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
              >
                <ArrowCounterClockwise size={16} />
                {t.changePhone}
              </button>
            </div>
          )}

          <div className={`mt-6 pt-6 border-t text-center ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {t.byContinuing}{" "}
              <a href="#" className="text-[#2D4B32] hover:underline">{t.termsOfService}</a>
              {" "}and{" "}
              <a href="#" className="text-[#2D4B32] hover:underline">{t.privacyPolicy}</a>
            </p>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-2xl border ${darkMode ? "bg-gray-900/50 border-gray-800" : "bg-[#2D4B32]/10 border-[#2D4B32]"}`}>
          <p className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Want to register your hospital?{" "}
            <button onClick={() => onNavigate("hospital-register")} className="text-[#2D4B32] hover:underline font-medium">
              {t.registerAsHospital}
            </button>
          </p>
        </div>

        <button
          onClick={() => onNavigate("landing")}
          className={`w-full mt-4 py-3 transition flex items-center justify-center gap-2 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
        >
          <ArrowLeft size={16} />
          {t.backToHome}
        </button>
      </motion.div>
    </div>
  );
}
