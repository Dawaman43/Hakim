"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowClockwise, Crosshair, MapPin, MagnifyingGlass, NavigationArrow, Warning } from "@phosphor-icons/react";

interface LocationPermissionModalProps {
  open: boolean;
  darkMode: boolean;
  locationError: string | null;
  locationLoading: boolean;
  selectedRegion: string;
  regionOptions: string[];
  onRequestLocation: () => void;
  onSelectRegion: (region: string) => void;
  onUseSelectedRegion: () => void;
  onUseDefaultLocation: () => void;
  onSearchLocation: (query: string) => void;
  onClose: () => void;
}

export function LocationPermissionModal({
  open,
  darkMode,
  locationError,
  locationLoading,
  selectedRegion,
  regionOptions,
  onRequestLocation,
  onSelectRegion,
  onUseSelectedRegion,
  onUseDefaultLocation,
  onSearchLocation,
  onClose,
}: LocationPermissionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchLocation(searchQuery);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`rounded-3xl shadow-2xl max-w-md w-full p-8 transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#E7EDDF] border border-[#2D4B32]/30">
              <Crosshair size={32} className="text-[#2D4B32]" />
            </div>

            <h3 className={`text-xl font-bold mb-2 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
              Find Nearest Hospital
            </h3>

            {locationError && (
              <div className={`mb-4 p-3 border rounded-xl text-sm flex items-start gap-2 ${darkMode ? "bg-[#2D4B32]/10 border-[#2D4B32]/50 text-[#283026]" : "bg-[#E7EDDF] border-[#2D4B32]/30 text-[#283026]"}`}>
                <Warning size={18} className="flex-shrink-0 mt-0.5" />
                <span>{locationError}</span>
              </div>
            )}

            <button
              onClick={onRequestLocation}
              disabled={locationLoading}
              className="w-full px-4 py-3 bg-[#2D4B32] text-white rounded-xl font-semibold hover:bg-[#2D4B32] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mb-4"
            >
              {locationLoading ? (
                <>
                  <ArrowClockwise size={20} className="animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <NavigationArrow size={20} />
                  Use My Current Location
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
              <span className="text-sm text-[#2D4B32]">or select your region</span>
              <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Select Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => onSelectRegion(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition cursor-pointer ${darkMode ? "bg-gray-950 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}`}
              >
                {regionOptions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onUseSelectedRegion}
              className="w-full px-4 py-3 bg-[#2D4B32] text-white rounded-xl font-semibold hover:bg-[#2D4B32] transition flex items-center justify-center gap-2 cursor-pointer mb-6"
            >
              <MapPin size={20} />
              Show Hospitals in {selectedRegion}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
              <span className="text-sm text-[#2D4B32]">or type a city/address</span>
              <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
            </div>

            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Bishoftu, Adama..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? "bg-gray-950 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 placeholder-gray-400"}`}
              />
              <button 
                type="submit"
                disabled={!searchQuery.trim() || locationLoading}
                className="px-4 py-3 bg-[#2D4B32] text-white rounded-xl font-semibold hover:bg-opacity-90 transition disabled:opacity-60 flex items-center justify-center cursor-pointer"
              >
                {locationLoading ? <ArrowClockwise className="animate-spin" /> : <MagnifyingGlass size={20} />}
              </button>
            </form>

            <button
              onClick={onUseDefaultLocation}
              className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition border mb-2 ${darkMode ? "bg-gray-950 border-gray-700 text-gray-300 hover:border-[#2D4B32]" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#2D4B32]"}`}
            >
              Use Addis Ababa Instead
            </button>

            <button
              onClick={onClose}
              className={`w-full px-4 py-2 transition text-sm cursor-pointer ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
