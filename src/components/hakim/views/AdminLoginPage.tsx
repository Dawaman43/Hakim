"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  Heart,
  Phone,
} from "@phosphor-icons/react";
import type { ViewType } from "../routes";

interface AdminLoginPageProps {
  darkMode: boolean;
  onLogin: (user: { id: string; name: string; phone: string; role: string }) => void;
  onNavigate: (view: ViewType) => void;
}

export function AdminLoginPage({
  darkMode,
  onLogin,
  onNavigate,
}: AdminLoginPageProps) {
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminLogin = async () => {
    setAdminLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onLogin({ id: "admin", name: "Hospital Admin", phone: adminPhone, role: "admin" });
      onNavigate("hospital-dashboard");
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setAdminLoading(false);
    }
  };

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
            Hospital Admin Login
          </h2>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Sign in to manage your hospital
          </p>
        </div>

        <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Phone Number
              </label>
              <div className="relative">
                <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
              />
            </div>
            <button
              onClick={handleAdminLogin}
              disabled={adminLoading || !adminPhone || !adminPassword}
              className="w-full py-3 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {adminLoading ? (
                <ArrowClockwise className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          <div className={`mt-6 pt-6 border-t text-center ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Don't have an account?{" "}
              <button onClick={() => onNavigate("hospital-register")} className="text-[#2D4B32] hover:underline font-medium">
                Register your hospital
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("landing")}
          className={`w-full mt-6 py-3 transition flex items-center justify-center gap-2 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
