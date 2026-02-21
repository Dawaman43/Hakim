'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Crosshair, MapPin, NavigationArrow, Hospital, CaretRight, Info } from '@phosphor-icons/react';
import { Navigation, Footer } from '@/components/sections';
import { formatDistance } from '@/utils/distance';
import type { Hospital as HospitalType } from '@/types';

interface HospitalWithDistance extends HospitalType {
  distance: number;
}

interface NearestHospitalsPageProps {
  currentView: string;
  isAuthenticated: boolean;
  user: { name?: string; role?: string } | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userLocation: { lat: number; lng: number } | null;
  locationNotice?: string | null;
  nearestHospitals: HospitalWithDistance[];
  loading: boolean;
  onSelectHospital: (hospital: HospitalType) => void;
}

/**
 * Nearest hospitals page - shows hospitals sorted by distance from user's location
 */
export function NearestHospitalsPage({
  currentView,
  isAuthenticated,
  user,
  onNavigate,
  onLogout,
  userLocation,
  locationNotice,
  nearestHospitals,
  loading,
  onSelectHospital,
}: NearestHospitalsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <section className="pt-24 pb-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition mb-6"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Crosshair size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Nearest Hospitals
                </h1>
                <p className="text-gray-600">
                  Hospitals sorted by distance from your location
                </p>
              </div>
            </div>

            {/* Location Info */}
            {locationNotice ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Info size={16} />
                <span>{locationNotice}</span>
              </div>
            ) : userLocation && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                <MapPin size={16} />
                <span>Location detected</span>
                <span className="text-emerald-600">
                  ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingSpinner />
          ) : nearestHospitals.length === 0 ? (
            <EmptyState onNavigate={onNavigate} />
          ) : (
            <HospitalsList
              nearestHospitals={nearestHospitals}
              onSelectHospital={onSelectHospital}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
}

/**
 * Empty state when no hospitals found
 */
function EmptyState({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Hospital size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hospitals Found</h3>
      <p className="text-gray-600 mb-6">
        Unable to find hospitals near your location. Please try searching manually.
      </p>
      <button
        onClick={() => onNavigate('hospitals')}
        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
      >
        Browse All Hospitals
      </button>
    </div>
  );
}

/**
 * Hospitals list with top 3 featured and full list
 */
function HospitalsList({
  nearestHospitals,
  onSelectHospital,
  onNavigate,
}: {
  nearestHospitals: HospitalWithDistance[];
  onSelectHospital: (hospital: HospitalType) => void;
  onNavigate: (view: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Top 3 Nearest - Featured Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <NavigationArrow size={20} className="text-blue-600" />
          Closest to You
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {nearestHospitals.slice(0, 3).map((hospital, index) => (
            <FeaturedHospitalCard
              key={hospital.id}
              hospital={hospital}
              rank={index + 1}
              onClick={() => onSelectHospital(hospital)}
            />
          ))}
        </div>
      </div>

      {/* All Hospitals List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Hospital size={20} className="text-emerald-600" />
            All Nearby Hospitals ({nearestHospitals.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {nearestHospitals.map((hospital, index) => (
            <HospitalListItem
              key={hospital.id}
              hospital={hospital}
              index={index}
              onClick={() => onSelectHospital(hospital)}
            />
          ))}
        </div>
      </div>

      {/* View on Map Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => onNavigate('map')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-200 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 hover:border-emerald-300 transition"
        >
          <MapPin size={20} />
          View All on Map
        </button>
      </div>
    </div>
  );
}

/**
 * Featured hospital card for top 3
 */
function FeaturedHospitalCard({
  hospital,
  rank,
  onClick,
}: {
  hospital: HospitalWithDistance;
  rank: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      onClick={onClick}
      className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-left text-white shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all group relative overflow-hidden"
    >
      {/* Rank Badge */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
        {rank}
      </div>

      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Hospital size={24} />
      </div>

      <h3 className="text-lg font-bold mb-1">{hospital.name}</h3>

      <div className="flex items-center gap-2 text-emerald-100 text-sm mb-3">
        <MapPin size={14} />
        <span>{hospital.region}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/20">
        <div className="flex items-center gap-2">
          <NavigationArrow size={16} />
          <span className="font-bold">{formatDistance(hospital.distance)}</span>
        </div>
        <CaretRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}

/**
 * Hospital list item
 */
function HospitalListItem({
  hospital,
  index,
  onClick,
}: {
  hospital: HospitalWithDistance;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="w-full p-4 flex items-center gap-4 hover:bg-emerald-50 transition text-left group"
    >
      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition">
        <Hospital size={24} className="text-emerald-600" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition truncate">
          {hospital.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{hospital.region}</span>
          {hospital.address && (
            <>
              <span className="text-gray-300">•</span>
              <span className="truncate">{hospital.address}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-emerald-600 font-bold">
          <NavigationArrow size={14} />
          <span>{formatDistance(hospital.distance)}</span>
        </div>
        <p className="text-xs text-gray-400">away</p>
      </div>

      <CaretRight size={20} className="text-gray-300 group-hover:text-emerald-600 transition flex-shrink-0" />
    </motion.button>
  );
}
