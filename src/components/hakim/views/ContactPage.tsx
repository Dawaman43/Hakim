"use client";

import { motion } from "framer-motion";
import {
  Ambulance,
  EnvelopeSimple,
  MapPin,
  PaperPlaneTilt,
  Phone,
} from "@phosphor-icons/react";

interface ContactPageProps {
  darkMode: boolean;
  t: Record<string, string>;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  selectedRegion: string;
  getAmbulanceInfo: () => { primaryNumber: string; secondaryNumber?: string | null };
}

export function ContactPage({
  darkMode,
  t,
  navigation,
  footer,
  selectedRegion,
  getAmbulanceInfo,
}: ContactPageProps) {
  const tr = t;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}

      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? "text-foreground" : "text-foreground"}`}>
              {tr.contactTitle}
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.contactSubtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.sendMessage}</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.nameLabel}</label>
                    <input
                      type="text"
                      placeholder={tr.namePlaceholder}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.phoneLabel}</label>
                    <input
                      type="tel"
                      placeholder="09XXXXXXXXX"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.emailLabel}</label>
                  <input
                    type="email"
                    placeholder={tr.emailPlaceholder}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.subjectLabel}</label>
                  <select className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground" : "border-border"}`}>
                    <option>{tr.generalInquiry}</option>
                    <option>{tr.technicalSupport}</option>
                    <option>{tr.hospitalPartnership}</option>
                    <option>{tr.feedback}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{tr.messageLabel}</label>
                  <textarea
                    rows={4}
                    placeholder={tr.messagePlaceholder}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "border-border"}`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <PaperPlaneTilt size={20} />
                  {tr.sendButton}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.getInTouch}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                      <MapPin size={24} className="text-current" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.location}</h3>
                      <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{tr.locationValue}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                      <Phone size={24} className="text-current" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.phoneLabel}</h3>
                      <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>+251 911 000 000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                      <EnvelopeSimple size={24} className="text-current" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-foreground" : "text-foreground"}`}>{tr.emailAddress}</h3>
                      <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{tr.emailValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-3xl p-8 ${darkMode ? "bg-red-900/30 border border-red-700/50" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Ambulance size={24} className="text-red-600" />
                  <h3 className={`text-lg font-bold ${darkMode ? "text-red-400" : "text-red-800"}`}>{tr.medicalEmergency}</h3>
                </div>
                <p className={`mb-4 ${darkMode ? "text-red-400" : "text-red-700"}`}>
                  {tr.emergencyDesc}
                </p>

                <div className="mb-4 p-4 bg-background rounded-xl">
                  <p className={`text-sm font-medium mb-2 ${darkMode ? "text-primary" : "text-primary"}`}>
                    {tr.localAmbulance} ({selectedRegion})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${getAmbulanceInfo().primaryNumber}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary transition"
                    >
                      <Ambulance size={18} />
                      {getAmbulanceInfo().primaryNumber}
                    </a>
                    {getAmbulanceInfo().secondaryNumber && (
                      <a
                        href={`tel:${getAmbulanceInfo().secondaryNumber}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary transition"
                      >
                        <Phone size={18} />
                        {getAmbulanceInfo().secondaryNumber}
                      </a>
                    )}
                  </div>
                </div>

                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-foreground rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  <Phone size={20} />
                  {tr.call911}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
