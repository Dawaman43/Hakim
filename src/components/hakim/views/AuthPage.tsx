"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeSlash,
  Phone,
  User,
} from "@phosphor-icons/react";
import type { ViewType } from "../routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { normalizeEthiopianPhone } from "@/lib/phone";

interface AuthPageProps {
  darkMode: boolean;
  loading: boolean;
  otpSent: boolean;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  otp: string;
  setOtp: (value: string) => void;
  setOtpSent: (value: boolean) => void;
  sendOtp: (type: "REGISTRATION" | "LOGIN") => void;
  verifyOtp: () => void;
  loginWithPassword: (payload: { phone?: string; email?: string; password: string }) => Promise<void>;
  onNavigate: (view: ViewType) => void;
  t: Record<string, string>;
}

export function AuthPage({
  darkMode,
  loading,
  otpSent,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  otp,
  setOtp,
  setOtpSent,
  sendOtp,
  verifyOtp,
  loginWithPassword,
  onNavigate,
  t,
}: AuthPageProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const telegramBotUsername = "Hakim_bet_bot";
  const telegramLink = `https://t.me/${telegramBotUsername}?start=${encodeURIComponent(normalizeEthiopianPhone(phone) || "")}`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <button onClick={() => onNavigate("landing")} className="inline-flex items-center gap-2 mb-6">
            <ArrowLeft size={18} />
            {t.backToHome}
          </button>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>
            {otpSent ? "Check Telegram" : authMode === "signin" ? t.signIn : t.signUp}
          </h2>
          <p className={`mt-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {otpSent 
              ? (
                <>
                  We&apos;ve prepared your verification flow. <br />
                  Open our Telegram Bot <strong className="text-primary">@{telegramBotUsername}</strong> to get your OTP.
                </>
              )
              : authMode === "signin" ? t.signInPhone : t.signUpPhone}
          </p>
        </div>

        <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
          {!otpSent ? (
            <Tabs
              value={authMode}
              onValueChange={(value) => {
                setAuthMode(value as "signin" | "signup");
                setOtpSent(false);
                setOtp("");
                setConfirmPassword("");
              }}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-2 w-full bg-background/60">
                <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
                <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Enter your email or phone and password.
                </p>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>Email or Phone</label>
                  <div className="relative">
                    <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
                    <input
                      type="text"
                      placeholder="you@example.com or 09XXXXXXXXX"
                      value={email || phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.includes("@")) {
                          setEmail(value);
                          setPhone("");
                        } else {
                          setPhone(value);
                          setEmail("");
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-lg ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-4 pr-12 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-lg ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    loginWithPassword({
                      phone: phone || undefined,
                      email: email || undefined,
                      password,
                    });
                  }}
                  disabled={loading || (!phone && !email) || password.length < 6}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary text-primary-foreground rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <ArrowClockwise className="animate-spin" size={20} />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{t.phoneNumberLabel}</label>
                  <div className="relative">
                    <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
                    <input
                      type="tel"
                      placeholder="09XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-lg ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>Password</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-4 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-lg ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((prev) => !prev)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${darkMode ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showSignupConfirm ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-4 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-lg ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirm((prev) => !prev)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${darkMode ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      aria-label={showSignupConfirm ? "Hide password" : "Show password"}
                    >
                      {showSignupConfirm ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="mt-2 text-sm text-destructive">Passwords do not match.</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{t.nameOptionalLabel}</label>
                  <div className="relative">
                    <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`} />
                    <input
                      type="text"
                      placeholder={t.yourNamePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-lg ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!phone || password.length < 6 || password !== confirmPassword) return;
                    setOtpSent(true);
                  }}
                  disabled={loading || !phone || password.length < 6 || password !== confirmPassword}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary text-primary-foreground rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                Open the Telegram bot to get your OTP, then enter it below.
              </p>
              <a
                href={telegramLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-3 rounded-xl bg-primary text-primary-foreground text-center font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Open Telegram Bot
              </a>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{t.enterOTPLabel}</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`w-full text-center text-3xl tracking-widest py-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition font-mono ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary text-primary-foreground rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <ArrowClockwise className="animate-spin" size={20} />
                ) : (
                  <>
                    Verify & Login
                    <Check size={20} />
                  </>
                )}
              </button>
              <button
                onClick={() => setOtpSent(false)}
                className={`w-full py-3 transition flex items-center justify-center gap-2 ${darkMode ? "text-muted-foreground hover:text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <ArrowCounterClockwise size={16} />
                {t.changePhone}
              </button>
            </div>
          )}

          <div className={`mt-6 pt-6 border-t text-center ${darkMode ? "border-border" : "border-border"}`}>
            <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {t.byContinuing}{" "}
              <a href="#" className="text-primary hover:underline">{t.termsOfService}</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">{t.privacyPolicy}</a>
            </p>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-2xl border ${darkMode ? "bg-background/50 border-border" : "bg-primary/10 border-primary"}`}>
          <p className={`text-sm text-center ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
            Want to register your hospital?{" "}
            <button onClick={() => onNavigate("hospital-register")} className="text-primary hover:underline font-medium">
              {t.registerAsHospital}
            </button>
          </p>
        </div>

        <button
          onClick={() => onNavigate("landing")}
          className={`w-full mt-4 py-3 transition flex items-center justify-center gap-2 ${darkMode ? "text-muted-foreground hover:text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          <ArrowLeft size={16} />
          {t.backToHome}
        </button>
      </motion.div>
    </div>
  );
}
