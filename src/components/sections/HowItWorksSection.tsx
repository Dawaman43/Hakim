'use client';

import { motion } from 'framer-motion';
import { Hospital, Stethoscope, Ticket, Bell } from '@phosphor-icons/react';

const steps = [
  { step: '01', icon: Hospital, title: 'Select Hospital', description: 'Choose from hospitals near you' },
  { step: '02', icon: Stethoscope, title: 'Pick Department', description: 'Select your medical department' },
  { step: '03', icon: Ticket, title: 'Get Token', description: 'Receive your queue number instantly' },
  { step: '04', icon: Bell, title: 'Wait Comfortably', description: 'Get notified when it\'s your turn' },
];

/**
 * How it works section component
 */
export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book your hospital visit in four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {index < 3 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-300 to-transparent" />
              )}
              
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-lg shadow-emerald-500/25 mb-6">
                <item.icon size={40} className="text-white" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-sm font-bold text-emerald-600">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
