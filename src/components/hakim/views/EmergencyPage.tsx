"use client";

import { motion } from "framer-motion";
import {
  Ambulance,
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowLeft,
  FirstAid,
  Phone,
  Warning,
} from "@phosphor-icons/react";
import type { Hospital, TriageResult } from "@/types";
import type { ViewType } from "../routes";

interface EmergencyPageProps {
  darkMode: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  symptoms: string;
  setSymptoms: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  triageResult: TriageResult | null;
  setTriageResult: (value: TriageResult | null) => void;
  reportEmergency: () => void;
  getSeverityColor: (level: string) => string;
  getSeverityLabel: (level: string) => string;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer?: React.ReactNode;
}

export function EmergencyPage({
  darkMode,
  loading,
  isAuthenticated,
  symptoms,
  setSymptoms,
  phone,
  setPhone,
  name,
  setName,
  hospitals,
  selectedHospital,
  setSelectedHospital,
  triageResult,
  setTriageResult,
  reportEmergency,
  getSeverityColor,
  getSeverityLabel,
  onNavigate,
  navigation,
  footer,
}: EmergencyPageProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => onNavigate("landing")}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? "bg-red-900/50" : "bg-red-100"}`}>
                <Ambulance size={24} className="text-red-600" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Emergency Assist</h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Get triage guidance for your symptoms</p>
              </div>
            </div>

            <div className={`rounded-2xl p-4 mb-6 ${darkMode ? "bg-red-900/30 border border-red-700/50" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-start gap-3">
                <Warning size={24} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className={`font-bold ${darkMode ? "text-red-300" : "text-red-800"}`}>IMPORTANT DISCLAIMER</p>
                  <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-700"}`}>
                    This system does NOT replace emergency services. If this is a life-threatening
                    emergency, call <strong>911</strong> immediately or proceed to the nearest emergency room.
                  </p>
                </div>
              </div>
            </div>

            {!triageResult ? (
              <>
                <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                  <label className={`block font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Describe Your Symptoms</label>
                  <textarea
                    placeholder="Please describe your symptoms in detail. For example: 'I have severe chest pain and difficulty breathing for the past 30 minutes'"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                  />
                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Be as specific as possible for better triage assessment.
                  </p>
                </div>

                {!isAuthenticated && (
                  <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Your Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="09XXXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Your Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                  <label className={`block font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Nearest Hospital (Optional)</label>
                  <select
                    value={selectedHospital?.id || ""}
                    onChange={(e) => {
                      const hospital = hospitals.find(h => h.id === e.target.value);
                      setSelectedHospital(hospital || null);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-200"}`}
                  >
                    <option value="">Select hospital (optional)</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={reportEmergency}
                  disabled={loading || symptoms.length < 10}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <ArrowClockwise className="animate-spin" size={20} />
                  ) : (
                    <>
                      <FirstAid size={20} />
                      Get Triage Assessment
                    </>
                  )}
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className={`rounded-2xl p-6 ${getSeverityColor(triageResult.severityLevel)}`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-2xl mb-4">
                      {triageResult.isEmergency ? (
                        <Warning size={32} weight="fill" />
                      ) : (
                        <FirstAid size={32} weight="fill" />
                      )}
                    </div>
                    <p className="text-sm opacity-80">Severity Level</p>
                    <p className="text-3xl font-bold">{getSeverityLabel(triageResult.severityLevel)}</p>
                    <p className="text-sm opacity-80 mt-1">
                      Confidence: {Math.round(triageResult.confidence * 100)}%
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Recommendation</h3>
                  <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{triageResult.recommendation}</p>
                  {triageResult.keywords.length > 0 && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                      <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Identified keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {triageResult.keywords.map((keyword, i) => (
                          <span key={i} className={`px-2 py-1 rounded-full text-sm ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {triageResult.isEmergency && (
                  <a
                    href="tel:911"
                    className="block w-full py-4 bg-red-600 text-white rounded-xl font-semibold text-lg text-center hover:bg-red-700 transition"
                  >
                    <Phone size={20} className="inline mr-2" />
                    Call Emergency Services (911)
                  </a>
                )}

                <button
                  onClick={() => {
                    setTriageResult(null);
                    setSymptoms("");
                  }}
                  className={`w-full py-3 border rounded-xl transition flex items-center justify-center gap-2 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  <ArrowCounterClockwise size={16} />
                  Report Another Symptom
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {footer}
    </div>
  );
}
