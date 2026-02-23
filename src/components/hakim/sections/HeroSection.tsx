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
    <section className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-background' : 'bg-background'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-32 -right-24 w-80 h-80 rounded-full blur-2xl ${darkMode ? 'bg-primary/10' : 'bg-primary/10'}`} />
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,_1px,transparent_1px),linear-gradient(to_bottom,_1px,transparent_1px)] bg-[size:24px_24px] ${darkMode ? 'bg-background/15' : 'bg-muted/40'}`} />
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
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium mb-8 border ${darkMode ? 'bg-primary/15 border-primary/50 text-primary' : 'bg-muted border-primary/40 text-primary'}`}
            >
              <Sparkle size={16} weight="fill" className="text-primary" />
              <span>{t.madeForEthiopia}</span>
              <span className="text-lg">🇪🇹</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              {t.skipWait}
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
                {t.getCareFaster}
              </span>
            </h1>

            <p className="text-lg sm:text-xl mb-10 leading-relaxed max-w-xl text-foreground/80">
              {t.heroDesc} <span className="text-foreground font-semibold">{t.noMoreWaiting}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => onNavigate('hospitals')}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {t.bookYourToken}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={onFindNearest}
                disabled={locationLoading}
                className={`group px-8 py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 border-2 ${darkMode ? 'bg-background border-border text-foreground hover:border-primary hover:bg-muted' : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary hover:shadow-lg'}`}
              >
                {locationLoading ? (
                  <>
                    <ArrowClockwise size={20} className="animate-spin" />
                    {t.locating}
                  </>
                ) : (
                  <>
                    <Crosshair size={20} className="text-primary group-hover:text-foreground group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-foreground">{t.findNearestHospital}</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">1,600+</p>
                <p className="text-sm mt-1 text-muted-foreground">Facilities</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">8,000+</p>
                <p className="text-sm mt-1 text-muted-foreground">{t.departments}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">13</p>
                <p className="text-sm mt-1 text-muted-foreground">{t.regions}</p>
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
              <div className={`absolute inset-0 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col justify-center border ${darkMode ? 'bg-background/90 border-border shadow-primary/20' : 'bg-background border-border shadow-primary/20'}`}>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-inner ${darkMode ? 'bg-muted' : 'bg-muted'}`}>
                    <Ticket size={40} className="text-primary" weight="duotone" />
                  </div>
                  <p className={darkMode ? 'text-muted-foreground text-sm' : 'text-muted-foreground text-sm'}>{t.yourTokenNumber}</p>
                  <p className={`text-6xl font-bold mt-2 ${darkMode ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'}`}>#042</p>
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-xl transition ${darkMode ? 'bg-muted' : 'bg-muted'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted border border-primary/30">
                        <Hospital size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className={darkMode ? 'text-xs text-muted-foreground' : 'text-xs text-muted-foreground'}>{t.hospitalLabel}</p>
                        <p className={darkMode ? 'font-medium text-foreground' : 'font-medium text-foreground'}>Tikur Anbessa</p>
                      </div>
                    </div>
                    <CaretRight size={18} className={darkMode ? 'text-muted-foreground' : 'text-muted-foreground'} />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl transition ${darkMode ? 'bg-muted' : 'bg-muted'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted border border-primary/30">
                        <Stethoscope size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className={darkMode ? 'text-xs text-muted-foreground' : 'text-xs text-muted-foreground'}>{t.departmentLabel}</p>
                        <p className={darkMode ? 'font-medium text-foreground' : 'font-medium text-foreground'}>{t.generalMedicine}</p>
                      </div>
                    </div>
                    <CaretRight size={18} className={darkMode ? 'text-muted-foreground' : 'text-muted-foreground'} />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-muted border-primary/40' : 'bg-muted border-primary/40'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted border border-primary/30">
                        <Timer size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-primary">{t.estimatedWait}</p>
                        <p className="font-bold text-primary">{t.minutesShort}</p>
                      </div>
                    </div>
                    <div className="text-right rounded-lg px-3 py-1 bg-muted border border-primary/30">
                      <p className="text-2xl font-bold text-primary">5</p>
                      <p className="text-xs text-primary">{t.ahead}</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute -top-4 -right-4 rounded-2xl shadow-xl p-4 border ${darkMode ? 'bg-muted border-primary/30' : 'bg-muted border-primary/30'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted border border-primary/30">
                    <Bell size={16} className="text-primary" weight="fill" />
                  </div>
                  <span className="text-sm font-medium text-primary">{t.smsAlert}</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className={`absolute -bottom-4 -left-4 rounded-2xl shadow-xl p-4 border ${darkMode ? 'bg-muted border-primary/30' : 'bg-muted border-primary/30'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted border border-primary/30">
                    <CheckCircle size={16} className="text-primary" weight="fill" />
                  </div>
                  <span className="text-sm font-medium text-primary">{t.confirmed}</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/3 -left-8 bg-muted rounded-2xl shadow-xl shadow-primary/20 p-3 border border-primary/30"
              >
                <div className="flex items-center gap-2 text-primary">
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
