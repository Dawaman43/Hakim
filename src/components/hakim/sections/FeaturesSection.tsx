'use client';

import { motion } from 'framer-motion';
import { Ticket, Clock, CellTower, Ambulance, Buildings, Shield } from '@phosphor-icons/react';
import { fadeIn, staggerContainer } from '@/components/hakim/animations';

interface FeaturesSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
}

export function FeaturesSection({ darkMode, t }: FeaturesSectionProps) {
  return (
    <section className={`py-24 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.featuresTitle}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.featuresSubtitle}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            { icon: Ticket, title: t.digitalToken, description: t.digitalTokenDesc },
            { icon: Clock, title: t.realTimeUpdates, description: t.realTimeUpdatesDesc },
            { icon: CellTower, title: t.smsNotifications, description: t.smsNotificationsDesc },
            { icon: Ambulance, title: t.emergencyAssistFeature, description: t.emergencyAssistDesc },
            { icon: Buildings, title: t.multipleHospitals, description: t.multipleHospitalsDesc },
            { icon: Shield, title: t.securePrivate, description: t.securePrivateDesc },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className={`group p-8 rounded-3xl transition-all duration-300 border ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-[#2D4B32]/60' : 'bg-white border-gray-200 hover:border-[#2D4B32]'}`}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#E7EDDF] border border-[#2D4B32]/30">
                <feature.icon size={28} className="text-[#2D4B32]" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
              <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
