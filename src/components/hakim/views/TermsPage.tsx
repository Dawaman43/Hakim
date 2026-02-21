"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";

interface TermsPageProps {
  darkMode: boolean;
  t: Record<string, string>;
  navigation: React.ReactNode;
  footer: React.ReactNode;
}

export function TermsPage({
  darkMode,
  t,
  navigation,
  footer,
}: TermsPageProps) {
  const tr = t;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}

      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" : "bg-background"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              {tr.termsTitle}
            </h1>
            <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {tr.termsSubtitle}
            </p>
          </motion.div>

          <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
            <p className={`text-lg mb-8 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {tr.termsIntro}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-[#2D4B32]" : "text-[#2D4B32]"}`}>
              {tr.termsServiceTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {tr.termsService}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-[#2D4B32]" : "text-[#2D4B32]"}`}>
              {tr.termsUserTitle}
            </h2>
            <ul className={`space-y-3 mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser1}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser2}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser3}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser4}</span></li>
            </ul>

            <div className={`p-4 rounded-xl mb-8 ${darkMode ? "bg-red-900/30 border border-red-700/50" : "bg-red-50 border border-red-200"}`}>
              <h3 className={`font-bold mb-2 ${darkMode ? "text-red-400" : "text-red-800"}`}>
                {tr.termsDisclaimerTitle}
              </h3>
              <p className={darkMode ? "text-red-400" : "text-red-700"}>
                {tr.termsDisclaimer}
              </p>
            </div>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-[#2D4B32]" : "text-[#2D4B32]"}`}>
              {tr.termsLimitationTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {tr.termsLimitation}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-[#2D4B32]" : "text-[#2D4B32]"}`}>
              {tr.termsChangesTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {tr.termsChanges}
            </p>

            <div className={`p-4 rounded-xl ${darkMode ? "bg-[#2D4B32]/10" : "bg-[#2D4B32]"}`}>
              <p className={darkMode ? "text-[#2D4B32]" : "text-[#2D4B32]"}>
                {tr.termsContact}
              </p>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
