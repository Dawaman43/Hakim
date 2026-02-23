"use client";

import { motion } from "framer-motion";
import type { ViewType } from "../routes";

interface FAQPageProps {
  darkMode: boolean;
  t: Record<string, string>;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  onNavigate: (view: ViewType) => void;
}

export function FAQPage({
  darkMode,
  t,
  navigation,
  footer,
  onNavigate,
}: FAQPageProps) {
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
              {tr.faqTitle}
            </h1>
            <p className={`text-xl ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {tr.faqSubtitle}
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              { q: tr.faqQ1, a: tr.faqA1 },
              { q: tr.faqQ2, a: tr.faqA2 },
              { q: tr.faqQ3, a: tr.faqA3 },
              { q: tr.faqQ4, a: tr.faqA4 },
              { q: tr.faqQ5, a: tr.faqA5 },
              { q: tr.faqQ6, a: tr.faqA6 },
              { q: tr.faqQ7, a: tr.faqA7 },
              { q: tr.faqQ8, a: tr.faqA8 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}
              >
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? "text-primary" : "text-primary"}`}>
                  {item.q}
                </h3>
                <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>
              {tr.contactUs}?{" "}
              <button onClick={() => onNavigate("contact")} className="text-primary hover:underline font-medium">
                {tr.contactUs}
              </button>
            </p>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
