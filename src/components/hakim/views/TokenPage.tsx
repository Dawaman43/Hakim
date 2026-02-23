'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import type { Appointment, QueueStatusResponse } from '@/types';
import type { ViewType } from '../routes';
import { formatWaitTime } from '@/lib/queue-utils';

interface TokenPageProps {
  darkMode: boolean;
  currentAppointment: Appointment | null;
  queueStatus: QueueStatusResponse | null;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  t: Record<string, string>;
}

export function TokenPage({
  darkMode,
  currentAppointment,
  queueStatus,
  onNavigate,
  navigation,
  footer,
  t,
}: TokenPageProps) {
  if (!currentAppointment) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-background' : 'bg-background'}`}>
        {navigation}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className={darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}>No active token found.</p>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-background' : 'bg-background'}`}>
      {navigation}

      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-background' : 'bg-background'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-muted-foreground hover:text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <ArrowLeft size={20} />
              {t.backToHome}
            </button>

            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-foreground' : 'text-foreground'}`}>
              {t.tokenTitle}
            </h1>
            <p className={darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}>
              {t.tokenSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-background border-border' : 'bg-card border-border'}`}>
            <div className="text-center mb-8">
              <p className={`text-sm ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{t.yourTokenNumber}</p>
              <p className={`text-6xl font-bold mt-2 ${darkMode ? 'text-foreground' : 'text-foreground'}`}>#{currentAppointment.tokenNumber}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                <p className={`text-xs ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{t.status}</p>
                <p className="text-lg font-semibold text-primary">{currentAppointment.status}</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                <p className={`text-xs ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{t.queuePosition}</p>
                <p className="text-lg font-semibold text-primary">{queueStatus?.totalWaiting ?? '--'}</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                <p className={`text-xs ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{t.estimatedWait}</p>
                <p className="text-lg font-semibold text-primary">{formatWaitTime(queueStatus?.estimatedWaitMinutes || 0)}</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                <p className={`text-xs ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{t.currentlyServing}</p>
                <p className="text-lg font-semibold text-primary">#{queueStatus?.currentToken ?? '--'}</p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-muted border border-primary/30 flex items-center gap-3">
              <CheckCircle size={20} className="text-primary" weight="fill" />
              <div>
                <p className="font-medium text-primary">{t.smsNotificationsActive}</p>
                <p className="text-sm text-primary">{t.smsDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
