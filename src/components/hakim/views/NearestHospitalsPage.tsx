"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CaretRight, Crosshair, Hospital as HospitalIcon, Info, MapPin, NavigationArrow } from "@phosphor-icons/react";
import type { Hospital } from "@/types";
import type { ViewType } from "../routes";

interface NearestHospitalsPageProps {
  darkMode: boolean;
  loading: boolean;
  locationNotice: string | null;
  userLocation: { lat: number; lng: number; city?: string } | null;
  nearestHospitals: Array<Hospital & { distance: number }>;
  nearestLoading: boolean;
  nearestError: string | null;
  onNavigate: (view: ViewType) => void;
  onSelectHospital: (hospital: Hospital) => void;
  onLoadDepartments: (hospitalId: string) => void;
  onChangeLocation: () => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
}

export function NearestHospitalsPage({
  darkMode,
  loading,
  locationNotice,
  userLocation,
  nearestHospitals,
  nearestLoading,
  nearestError,
  onNavigate,
  onSelectHospital,
  onLoadDepartments,
  onChangeLocation,
  navigation,
  footer,
}: NearestHospitalsPageProps) {
  const loadingNearest = loading || nearestLoading;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      {navigation}

      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" : "bg-background"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate("landing")}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? "text-gray-400 hover:text-[#2D4B32]" : "text-gray-600 hover:text-[#2D4B32]"}`}
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#2D4B32]/10" : "bg-[#2D4B32]"}`}>
                <Crosshair size={24} className="text-[#2D4B32]" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Nearest Hospitals {userLocation?.city ? `in ${userLocation.city}` : ''}
                </h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Hospitals sorted by distance from your location
                </p>
              </div>
            </div>

            {locationNotice ? (
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-[#2D4B32]"}`}>
                  <Info size={16} />
                  <span>{locationNotice}</span>
                </div>
                <button onClick={onChangeLocation} className={`text-sm font-medium underline ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>Change Location</button>
              </div>
            ) : userLocation && (
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-[#2D4B32]/10 text-[#2D4B32]" : "bg-[#2D4B32] text-[#2D4B32]"}`}>
                  <MapPin size={16} />
                  <span>Location detected</span>
                  <span className="text-[#2D4B32]">
                    ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                  </span>
                </div>
                <button onClick={onChangeLocation} className={`text-sm font-medium underline ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>Change Location</button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingNearest ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2D4B32]" />
            </div>
          ) : nearestHospitals.length === 0 ? (
            <div className="text-center py-16">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? "bg-gray-800" : "bg-background"}`}>
                <HospitalIcon size={40} className={darkMode ? "text-gray-500" : "text-gray-400"} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>No Hospitals Found</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {nearestError ? nearestError : "Unable to find hospitals near your location. Please try searching manually."}
              </p>
              <button
                onClick={() => onNavigate("hospitals")}
                className="px-6 py-3 bg-[#2D4B32] text-white rounded-xl font-medium hover:bg-[#2D4B32] transition"
              >
                Browse All Hospitals
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-8">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <NavigationArrow size={20} className="text-[#2D4B32]" />
                  Closest to You
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {nearestHospitals.slice(0, 3).map((hospital, index) => (
                    <motion.button
                      key={hospital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        onSelectHospital(hospital);
                        onLoadDepartments(hospital.id);
                        onNavigate("departments");
                      }}
                      className="bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-2xl p-6 text-left text-white shadow-xl shadow-[#2D4B32]/20 hover:shadow-2xl hover:shadow-[#2D4B32]/20 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-4 right-4 w-8 h-8 bg-background rounded-full flex items-center justify-center text-lg font-bold">
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <HospitalIcon size={24} />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{hospital.name}</h3>
                      <div className="flex items-center gap-2 text-[#2D4B32] text-sm mb-3">
                        <MapPin size={14} />
                        <span>{hospital.region}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/20">
                        <div className="flex items-center gap-2">
                          <NavigationArrow size={16} />
                          <span className="font-bold">
                            {hospital.distance < 1
                              ? `${Math.round(hospital.distance * 1000)} m`
                              : `${hospital.distance.toFixed(1)} km`}
                          </span>
                        </div>
                        <CaretRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {footer}
    </div>
  );
}
