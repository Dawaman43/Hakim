'use client';

import { motion } from 'framer-motion';
import { Ambulance } from '@phosphor-icons/react';

interface CTASectionProps {
  onNavigate: (view: string) => void;
}

/**
 * Call to action section component
 */
export function CTASection({ onNavigate }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-r from-[#2D4B32] to-teal-600 dark:from-gray-950 dark:to-gray-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 dark:bg-gray-900/50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 dark:bg-gray-900/40" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Skip the Queue?
          </h2>
          <p className="text-xl text-white/80 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Ethiopians who are saving time with Hakim. Book your hospital visit today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('hospitals')}
              className="px-8 py-4 bg-white text-[#2D4B32] rounded-2xl font-semibold text-lg hover:shadow-xl transition-all"
            >
              Book Your Token Now
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-[#2D4B32]"
            >
              <Ambulance size={20} />
              Emergency Assist
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
