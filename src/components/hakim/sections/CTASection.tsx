'use client';

import { motion } from 'framer-motion';
import { Ambulance } from '@phosphor-icons/react';
import type { ViewType } from '../routes';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  t: Record<string, string>;
  onNavigate: (view: ViewType) => void;
  darkMode: boolean;
}

export function CTASection({ t, onNavigate, darkMode }: CTASectionProps) {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-0 w-64 h-64 rounded-full -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'bg-muted/40' : 'bg-muted/40'}`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/2 translate-y-1/2 ${darkMode ? 'bg-muted/40' : 'bg-muted/40'}`} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            {t.readyToSkip}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            {t.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('hospitals')}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all"
            >
              {t.bookYourTokenNow}
            </Button>
            <Button
              onClick={() => onNavigate('emergency')}
              variant="outline"
              className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-border text-foreground bg-background/60 hover:bg-muted transition-all flex items-center justify-center gap-2"
            >
              <Ambulance size={20} />
              {t.emergencyAssist}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
