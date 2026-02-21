'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Phone, User, Stethoscope, MapPin } from '@phosphor-icons/react';
import type { Hospital, Department } from '@/types';
import type { ViewType } from '../routes';

interface BookingPageProps {
  darkMode: boolean;
  loading: boolean;
  selectedHospital: Hospital | null;
  selectedDepartment: Department | null;
  phone: string;
  setPhone: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  isAuthenticated: boolean;
  onBook: () => void;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  t: Record<string, string>;
}

export function BookingPage({
  darkMode,
  loading,
  selectedHospital,
  selectedDepartment,
  phone,
  setPhone,
  name,
  setName,
  notes,
  setNotes,
  isAuthenticated,
  onBook,
  onNavigate,
  navigation,
  footer,
  t,
}: BookingPageProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      {navigation}

      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate('departments')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              <ArrowLeft size={20} />
              {t.backToDepartments}
            </button>

            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.completeBooking}
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {t.bookingSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                  <MapPin size={20} className="text-[#2D4B32]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hospital</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedHospital?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                  <Stethoscope size={20} className="text-[#2D4B32]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDepartment?.name}</p>
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.phoneNumber}
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                      placeholder="09xxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.yourName}
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                      placeholder={t.nameOptional}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.notesOptional}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition min-h-[120px] ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                placeholder={t.notesPlaceholder}
              />
            </div>

            <div className="mt-8">
              <button
                onClick={onBook}
                disabled={loading}
                className="w-full py-4 bg-[#2D4B32] text-white rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
              >
                {loading ? t.bookingSubmitting : t.getMyToken}
              </button>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
