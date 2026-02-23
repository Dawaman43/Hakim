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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}

      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              {tr.contactTitle}
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {tr.contactSubtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.sendMessage}</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.nameLabel}</label>
                    <input
                      type="text"
                      placeholder={tr.namePlaceholder}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-950 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.phoneLabel}</label>
                    <input
                      type="tel"
                      placeholder="09XXXXXXXXX"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-950 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.emailLabel}</label>
                  <input
                    type="email"
                    placeholder={tr.emailPlaceholder}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-950 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.subjectLabel}</label>
                  <select className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-950 border-gray-700 text-white" : "border-gray-200"}`}>
                    <option>{tr.generalInquiry}</option>
                    <option>{tr.technicalSupport}</option>
                    <option>{tr.hospitalPartnership}</option>
                    <option>{tr.feedback}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{tr.messageLabel}</label>
                  <textarea
                    rows={4}
                    placeholder={tr.messagePlaceholder}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-950 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all flex items-center justify-center gap-2"
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
              <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.getInTouch}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
                      <MapPin size={24} className="text-current" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.location}</h3>
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{tr.locationValue}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
                      <Phone size={24} className="text-current" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.phoneLabel}</h3>
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>+251 911 000 000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-white"}`}>
                      <EnvelopeSimple size={24} className="text-current" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{tr.emailAddress}</h3>
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{tr.emailValue}</p>
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
                  <p className={`text-sm font-medium mb-2 ${darkMode ? "text-[#2D4B32]" : "text-[#2D4B32]"}`}>
                    {tr.localAmbulance} ({selectedRegion})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${getAmbulanceInfo().primaryNumber}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
                    >
                      <Ambulance size={18} />
                      {getAmbulanceInfo().primaryNumber}
                    </a>
                    {getAmbulanceInfo().secondaryNumber && (
                      <a
                        href={`tel:${getAmbulanceInfo().secondaryNumber}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
                      >
                        <Phone size={18} />
                        {getAmbulanceInfo().secondaryNumber}
                      </a>
                    )}
                  </div>
                </div>

                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
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
