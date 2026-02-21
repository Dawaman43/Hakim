'use client';

import { motion } from 'framer-motion';
import {
  Sparkle, ArrowRight, Crosshair, ArrowClockwise,
  Hospital, Stethoscope, Ticket, Timer, CaretRight, Bell, CheckCircle, MapPin, Warning,
} from '@phosphor-icons/react';
import { fadeIn } from '@/utils/animations';

interface HeroSectionProps {
  onNavigate: (view: string) => void;
  onFindNearest: () => void;
  locationLoading: boolean;
  locationError: string | null;
  onUseDefaultLocation?: () => void;
}

/**
 * Hero section component for the landing page
 */
export function HeroSection({ onNavigate, onFindNearest, locationLoading, locationError, onUseDefaultLocation }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-300 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Sparkle size={16} weight="fill" />
              <span>Made for Ethiopia 🇪🇹</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Skip the Wait,
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {' '}Get Care Faster
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Hakim transforms Ethiopian hospital queues with digital token booking, 
              real-time updates, and SMS notifications. No more waiting rooms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('hospitals')}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                Book Your Token
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onFindNearest}
                disabled={locationLoading}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {locationLoading ? (
                  <>
                    <ArrowClockwise size={20} className="animate-spin" />
                    Locating...
                  </>
                ) : (
                  <>
                    <Crosshair size={20} />
                    Find Nearest Hospital
                  </>
                )}
              </button>
            </div>

            {/* Location Error */}
            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800"
              >
                <div className="flex items-start gap-3">
                  <Warning size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{locationError}</p>
                    {onUseDefaultLocation && (
                      <button
                        onClick={onUseDefaultLocation}
                        className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition cursor-pointer"
                      >
                        Use Default Location (Addis Ababa)
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-emerald-600">292+</p>
                <p className="text-gray-500 text-sm">Hospitals</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">4,088+</p>
                <p className="text-gray-500 text-sm">Departments</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">13</p>
                <p className="text-gray-500 text-sm">Regions</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

/**
 * Hero illustration card showing token preview
 */
function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative hidden lg:block"
    >
      <div className="relative w-full aspect-square max-w-lg mx-auto">
        {/* Main Card */}
        <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-4">
              <Ticket size={40} className="text-emerald-600" weight="duotone" />
            </div>
            <p className="text-gray-500 text-sm">Your Token Number</p>
            <p className="text-6xl font-bold text-gray-900 mt-2">#042</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Hospital size={24} className="text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Hospital</p>
                  <p className="font-medium">Tikur Anbessa</p>
                </div>
              </div>
              <CaretRight size={20} className="text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Stethoscope size={24} className="text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">General Medicine</p>
                </div>
              </div>
              <CaretRight size={20} className="text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Timer size={24} className="text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-600">Estimated Wait</p>
                  <p className="font-bold text-emerald-700">~25 minutes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">5</p>
                <p className="text-xs text-emerald-600">ahead</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4"
        >
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-amber-500" weight="fill" />
            <span className="text-sm font-medium">SMS Alert</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-emerald-500" weight="fill" />
            <span className="text-sm font-medium">Confirmed!</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
