'use client';

import { motion } from 'framer-motion';
import { Hospital, Stethoscope, Ticket, Bell } from '@phosphor-icons/react';

interface HowItWorksSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
}

export function HowItWorksSection({ darkMode, t }: HowItWorksSectionProps) {
  return (
    <section className={`py-24 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.howItWorks}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.howItWorksSubtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', icon: Hospital, title: t.step1Title, description: t.step1Desc },
            { step: '02', icon: Stethoscope, title: t.step2Title, description: t.step2Desc },
            { step: '03', icon: Ticket, title: t.step3Title, description: t.step3Desc },
            { step: '04', icon: Bell, title: t.step4Title, description: t.step4Desc },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              {index < 3 && (
                <div className={`hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 ${darkMode ? 'bg-gradient-to-r from-[#2D4B32] to-transparent' : 'bg-gradient-to-r from-[#2D4B32] to-transparent'}`} />
              )}

              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-3xl shadow-lg shadow-[#2D4B32]/20 mb-6">
                <item.icon size={40} className="text-white" />
                <span className={`absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center text-sm font-bold ${darkMode ? 'bg-gray-800 text-[#2D4B32]' : 'bg-white text-[#2D4B32]'}`}>
                  {item.step}
                </span>
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
