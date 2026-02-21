'use client';

import { motion } from 'framer-motion';
import { Ambulance } from '@phosphor-icons/react';
import type { ViewType } from '../routes';

interface CTASectionProps {
  t: Record<string, string>;
  onNavigate: (view: ViewType) => void;
}

export function CTASection({ t, onNavigate }: CTASectionProps) {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-background rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-background rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t.readyToSkip}
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            {t.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('hospitals')}
              className="px-8 py-4 bg-[#2D4B32] text-white rounded-2xl font-semibold text-lg transition-all"
            >
              {t.bookYourTokenNow}
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="px-8 py-4 bg-background text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-400/40 transition-all flex items-center justify-center gap-2"
            >
              <Ambulance size={20} />
              {t.emergencyAssist}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
