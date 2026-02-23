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
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        {navigation}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No active token found.</p>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      {navigation}

      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              <ArrowLeft size={20} />
              {t.backToHome}
            </button>

            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.tokenTitle}
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {t.tokenSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="text-center mb-8">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.yourTokenNumber}</p>
              <p className={`text-6xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>#{currentAppointment.tokenNumber}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.status}</p>
                <p className="text-lg font-semibold text-[#2D4B32]">{currentAppointment.status}</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.queuePosition}</p>
                <p className="text-lg font-semibold text-[#2D4B32]">{queueStatus?.totalWaiting ?? '--'}</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.estimatedWait}</p>
                <p className="text-lg font-semibold text-[#2D4B32]">{formatWaitTime(queueStatus?.estimatedWaitMinutes || 0)}</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.currentlyServing}</p>
                <p className="text-lg font-semibold text-[#2D4B32]">#{queueStatus?.currentToken ?? '--'}</p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#E7EDDF] border border-[#2D4B32]/30 flex items-center gap-3">
              <CheckCircle size={20} className="text-[#2D4B32]" weight="fill" />
              <div>
                <p className="font-medium text-[#2D4B32]">{t.smsNotificationsActive}</p>
                <p className="text-sm text-[#2D4B32]">{t.smsDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
