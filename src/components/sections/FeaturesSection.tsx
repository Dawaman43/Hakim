'use client';

import { motion } from 'framer-motion';
import {
  Ticket, Clock, CellTower, Ambulance, Buildings, Shield,
} from '@phosphor-icons/react';
import { staggerContainer, fadeIn } from '@/utils/animations';

const features = [
  {
    icon: Ticket,
    title: 'Digital Token System',
    description: 'Get your queue token instantly without standing in line. Simply book from your phone.',
    color: 'emerald',
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'Track your position in queue live. Know exactly when it\'s your turn.',
    color: 'blue',
  },
  {
    icon: CellTower,
    title: 'SMS Notifications',
    description: 'Receive SMS alerts when you\'re next in line. Works on any phone.',
    color: 'purple',
  },
  {
    icon: Ambulance,
    title: 'Emergency Assist',
    description: 'Quick triage assessment for emergencies. Get guidance when you need it most.',
    color: 'red',
  },
  {
    icon: Buildings,
    title: 'Multiple Hospitals',
    description: 'Access to hospitals across Ethiopia. Find the nearest one to you.',
    color: 'orange',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is protected. OTP-based secure authentication.',
    color: 'teal',
  },
];

/**
 * Features section component
 */
export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Better Healthcare
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Designed specifically for Ethiopian hospitals, Hakim brings modern queue management to your fingertips.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Individual feature card
 */
function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-[#2D4B32] text-[#2D4B32]',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <motion.div
      variants={fadeIn}
      className="group p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
    >
      <div className={`w-14 h-14 ${colorClasses[feature.color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <feature.icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}
