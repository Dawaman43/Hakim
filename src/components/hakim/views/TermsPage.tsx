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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}

      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? "text-foreground" : "text-foreground"}`}>
              {tr.termsTitle}
            </h1>
            <p className={`text-xl ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.termsSubtitle}
            </p>
          </motion.div>

          <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
            <p className={`text-lg mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.termsIntro}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.termsServiceTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.termsService}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.termsUserTitle}
            </h2>
            <ul className={`space-y-3 mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.termsUser1}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.termsUser2}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.termsUser3}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.termsUser4}</span></li>
            </ul>

            <div className={`p-4 rounded-xl mb-8 ${darkMode ? "bg-red-900/30 border border-red-700/50" : "bg-red-50 border border-red-200"}`}>
              <h3 className={`font-bold mb-2 ${darkMode ? "text-red-400" : "text-red-800"}`}>
                {tr.termsDisclaimerTitle}
              </h3>
              <p className={darkMode ? "text-red-400" : "text-red-700"}>
                {tr.termsDisclaimer}
              </p>
            </div>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.termsLimitationTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.termsLimitation}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.termsChangesTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.termsChanges}
            </p>

            <div className={`p-4 rounded-xl ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
              <p className={darkMode ? "text-primary" : "text-primary"}>
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
