'use client';

import { motion } from 'framer-motion';
import {
  Sparkle, ArrowRight, Crosshair, ArrowClockwise,
  Hospital, Stethoscope, Ticket, Timer, CaretRight, Bell, CheckCircle, Clock,
} from '@phosphor-icons/react';

interface HeroSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  onNavigate: (view: 'hospitals') => void;
  onFindNearest: () => void;
  locationLoading: boolean;
}

export function HeroSection({ darkMode, t, onNavigate, onFindNearest, locationLoading }: HeroSectionProps) {
  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-32 -right-24 w-80 h-80 rounded-full blur-2xl ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]/10'}`} />
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,_1px,transparent_1px),linear-gradient(to_bottom,_1px,transparent_1px)] bg-[size:24px_24px] ${darkMode ? 'bg-gray-950/15' : 'bg-gray-400/10'}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium mb-8 border ${darkMode ? 'bg-[#2D4B32]/15 border-[#2D4B32]/50 text-[#2D4B32]' : 'bg-[#E7EDDF] border-[#2D4B32]/40 text-[#2D4B32]'}`}
            >
              <Sparkle size={16} weight="fill" className="text-[#2D4B32]" />
              <span>{t.madeForEthiopia}</span>
              <span className="text-lg">🇪🇹</span>
            </motion.div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.skipWait}
              <br />
              <span className="bg-gradient-to-r from-[#2D4B32] via-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                {t.getCareFaster}
              </span>
            </h1>

            <p className={`text-lg sm:text-xl mb-10 leading-relaxed max-w-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.heroDesc} <span className={darkMode ? 'text-[#2D4B32] font-medium' : 'text-[#2D4B32] font-medium'}>{t.noMoreWaiting}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => onNavigate('hospitals')}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {t.bookYourToken}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={onFindNearest}
                disabled={locationLoading}
                className={`group px-8 py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 border-2 ${darkMode ? 'bg-gray-950 border-gray-700 text-gray-200 hover:border-[#2D4B32] hover:bg-gray-750' : 'bg-white border-gray-200 text-gray-700 hover:text-white hover:border-[#2D4B32] hover:bg-[#2D4B32] hover:shadow-lg'}`}
              >
                {locationLoading ? (
                  <>
                    <ArrowClockwise size={20} className="animate-spin" />
                    {t.locating}
                  </>
                ) : (
                  <>
                    <Crosshair size={20} className="text-[#2D4B32] group-hover:text-white group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-white">{t.findNearestHospital}</span>
                  </>
                )}
              </button>
            </div>

            <div className={`grid grid-cols-3 gap-8 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">1,600+</p>
                <p className={darkMode ? 'text-gray-500 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Facilities</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">8,000+</p>
                <p className={darkMode ? 'text-gray-500 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>{t.departments}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">13</p>
                <p className={darkMode ? 'text-gray-500 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>{t.regions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className={`absolute inset-0 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col justify-center border ${darkMode ? 'bg-gray-950/90 border-gray-700 shadow-[#2D4B32]/20' : 'bg-background border-gray-100 shadow-[#2D4B32]/20'}`}>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-inner ${darkMode ? 'bg-[#E7EDDF]' : 'bg-[#E7EDDF]'}`}>
                    <Ticket size={40} className="text-[#2D4B32]" weight="duotone" />
                  </div>
                  <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>{t.yourTokenNumber}</p>
                  <p className={`text-6xl font-bold mt-2 ${darkMode ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'}`}>#042</p>
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-xl transition ${darkMode ? 'bg-[#E7EDDF]' : 'bg-[#E7EDDF]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                        <Hospital size={20} className="text-[#2D4B32]" />
                      </div>
                      <div>
                        <p className={darkMode ? 'text-xs text-gray-500' : 'text-xs text-gray-500'}>{t.hospitalLabel}</p>
                        <p className={darkMode ? 'font-medium text-gray-200' : 'font-medium text-gray-900'}>Tikur Anbessa</p>
                      </div>
                    </div>
                    <CaretRight size={18} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl transition ${darkMode ? 'bg-[#E7EDDF]' : 'bg-[#E7EDDF]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                        <Stethoscope size={20} className="text-[#2D4B32]" />
                      </div>
                      <div>
                        <p className={darkMode ? 'text-xs text-gray-500' : 'text-xs text-gray-500'}>{t.departmentLabel}</p>
                        <p className={darkMode ? 'font-medium text-gray-200' : 'font-medium text-gray-900'}>{t.generalMedicine}</p>
                      </div>
                    </div>
                    <CaretRight size={18} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-[#E7EDDF] border-[#2D4B32]/40' : 'bg-[#E7EDDF] border-[#2D4B32]/40'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                        <Timer size={20} className="text-[#2D4B32]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#2D4B32]">{t.estimatedWait}</p>
                        <p className="font-bold text-[#2D4B32]">{t.minutesShort}</p>
                      </div>
                    </div>
                    <div className="text-right rounded-lg px-3 py-1 bg-[#E7EDDF] border border-[#2D4B32]/30">
                      <p className="text-2xl font-bold text-[#2D4B32]">5</p>
                      <p className="text-xs text-[#2D4B32]">{t.ahead}</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute -top-4 -right-4 rounded-2xl shadow-xl p-4 border ${darkMode ? 'bg-[#E7EDDF] border-[#2D4B32]/30' : 'bg-[#E7EDDF] border-[#2D4B32]/30'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                    <Bell size={16} className="text-[#2D4B32]" weight="fill" />
                  </div>
                  <span className="text-sm font-medium text-[#2D4B32]">{t.smsAlert}</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className={`absolute -bottom-4 -left-4 rounded-2xl shadow-xl p-4 border ${darkMode ? 'bg-[#E7EDDF] border-[#2D4B32]/30' : 'bg-[#E7EDDF] border-[#2D4B32]/30'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                    <CheckCircle size={16} className="text-[#2D4B32]" weight="fill" />
                  </div>
                  <span className="text-sm font-medium text-[#2D4B32]">{t.confirmed}</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/3 -left-8 bg-[#E7EDDF] rounded-2xl shadow-xl shadow-[#2D4B32]/20 p-3 border border-[#2D4B32]/30"
              >
                <div className="flex items-center gap-2 text-[#2D4B32]">
                  <Clock size={16} weight="fill" />
                  <span className="text-xs font-medium">{t.realTimeLabel}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
