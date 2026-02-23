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
            className={`rounded-3xl shadow-2xl max-w-md w-full p-8 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-muted border border-primary/30">
              <Crosshair size={32} className="text-primary" />
            </div>

            <h3 className={`text-xl font-bold mb-2 text-center ${darkMode ? "text-foreground" : "text-foreground"}`}>
              Find Nearest Hospital
            </h3>

            {locationError && (
              <div className={`mb-4 p-3 border rounded-xl text-sm flex items-start gap-2 ${darkMode ? "bg-primary/10 border-primary/50 text-[#283026]" : "bg-muted border-primary/30 text-[#283026]"}`}>
                <Warning size={18} className="flex-shrink-0 mt-0.5" />
                <span>{locationError}</span>
              </div>
            )}

            <button
              onClick={onRequestLocation}
              disabled={locationLoading}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mb-4"
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
              <div className={`flex-1 h-px ${darkMode ? "bg-card" : "bg-muted"}`}></div>
              <span className="text-sm text-primary">or select your region</span>
              <div className={`flex-1 h-px ${darkMode ? "bg-card" : "bg-muted"}`}></div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                Select Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => onSelectRegion(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition cursor-pointer ${darkMode ? "bg-background border-border text-foreground" : "bg-muted/40 border-border"}`}
              >
                {regionOptions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onUseSelectedRegion}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary transition flex items-center justify-center gap-2 cursor-pointer mb-6"
            >
              <MapPin size={20} />
              Show Hospitals in {selectedRegion}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-px ${darkMode ? "bg-card" : "bg-muted"}`}></div>
              <span className="text-sm text-primary">or type a city/address</span>
              <div className={`flex-1 h-px ${darkMode ? "bg-card" : "bg-muted"}`}></div>
            </div>

            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Bishoftu, Adama..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition ${darkMode ? "bg-background border-border text-foreground placeholder:text-muted-foreground" : "bg-muted/40 border-border placeholder:text-muted-foreground"}`}
              />
              <button 
                type="submit"
                disabled={!searchQuery.trim() || locationLoading}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-opacity-90 transition disabled:opacity-60 flex items-center justify-center cursor-pointer"
              >
                {locationLoading ? <ArrowClockwise className="animate-spin" /> : <MagnifyingGlass size={20} />}
              </button>
            </form>

            <button
              onClick={onUseDefaultLocation}
              className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition border mb-2 ${darkMode ? "bg-background border-border text-muted-foreground hover:border-primary" : "bg-muted/40 border-border text-muted-foreground hover:border-primary"}`}
            >
              Use Addis Ababa Instead
            </button>

            <button
              onClick={onClose}
              className={`w-full px-4 py-2 transition text-sm cursor-pointer ${darkMode ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
