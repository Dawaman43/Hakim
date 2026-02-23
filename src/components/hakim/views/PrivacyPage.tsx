"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";

interface PrivacyPageProps {
  darkMode: boolean;
  t: Record<string, string>;
  navigation: React.ReactNode;
  footer: React.ReactNode;
}

export function PrivacyPage({
  darkMode,
  t,
  navigation,
  footer,
}: PrivacyPageProps) {
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
              {tr.privacyTitle}
            </h1>
            <p className={`text-xl ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.privacySubtitle}
            </p>
          </motion.div>

          <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
            <p className={`text-lg mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.privacyIntro}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.privacyCollectTitle}
            </h2>
            <ul className={`space-y-3 mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyCollect1}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyCollect2}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyCollect3}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyCollect4}</span></li>
            </ul>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.privacyUseTitle}
            </h2>
            <ul className={`space-y-3 mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyUse1}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyUse2}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyUse3}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-primary flex-shrink-0 mt-1" /><span>{tr.privacyUse4}</span></li>
            </ul>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.privacySecurityTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.privacySecurity}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-primary" : "text-primary"}`}>
              {tr.privacyShareTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.privacyShare}
            </p>

            <div className={`p-4 rounded-xl ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
              <p className={darkMode ? "text-primary" : "text-primary"}>
                {tr.privacyContact}
              </p>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
