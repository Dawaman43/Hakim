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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: adminPhone, password: adminPassword }),
      });
      const data = await res.json();
      if (!data?.success) {
        alert(data?.error || "Login failed");
        return;
      }
      onLogin(data.user, data.token);
      onNavigate(data.user?.role === "SUPER_ADMIN" ? "admin-dashboard" : "hospital-dashboard");
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <button onClick={() => onNavigate("landing")} className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center shadow-lg">
              <Heart weight="fill" className="text-foreground" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              Hakim
            </span>
          </button>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>
            Hospital Admin Login
          </h2>
          <p className={`mt-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            Sign in to manage your hospital
          </p>
        </div>

        <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                Phone Number
              </label>
              <div className="relative">
                <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
                <input
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
              />
            </div>
            <button
              onClick={handleAdminLogin}
              disabled={adminLoading || !adminPhone || !adminPassword}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

          <div className={`mt-6 pt-6 border-t text-center ${darkMode ? "border-border" : "border-border"}`}>
            <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              Don't have an account?{" "}
              <button onClick={() => onNavigate("hospital-register")} className="text-primary hover:underline font-medium">
                Register your hospital
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("landing")}
          className={`w-full mt-6 py-3 transition flex items-center justify-center gap-2 ${darkMode ? "text-muted-foreground hover:text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
