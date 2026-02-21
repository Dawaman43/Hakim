'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, MagnifyingGlass, Warning, Crosshair, ArrowClockwise, Hospital as HospitalIcon } from '@phosphor-icons/react';
import type { Hospital } from '@/types';
import type { ViewType } from '../routes';

interface MapPageProps {
  darkMode: boolean;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  loadDepartments: (hospitalId: string) => void;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
}

export function MapPage({
  darkMode,
  hospitals,
  selectedHospital,
  setSelectedHospital,
  loadDepartments,
  onNavigate,
  navigation,
  footer,
}: MapPageProps) {
  const [mapSearchTerm, setMapSearchTerm] = useState('');
  const [mapSelectedRegion, setMapSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<{ name: string; count: number }[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapMounted, setMapMounted] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    hospitals: Hospital[];
    selectedHospital: Hospital | null;
    onHospitalSelect: (hospital: Hospital) => void;
    userLocation?: { lat: number; lng: number } | null;
  }> | null>(null);

  useEffect(() => {
    const regionCounts = new Map<string, number>();
    hospitals.forEach((hospital) => {
      if (!hospital.region) return;
      regionCounts.set(hospital.region, (regionCounts.get(hospital.region) ?? 0) + 1);
    });
    const regionList = Array.from(regionCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
    setRegions(regionList);
  }, [hospitals]);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported on this device.');
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationError('Unable to access your location.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    setMapMounted(true);
    import('@/components/map/HospitalMap').then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(mapSearchTerm.toLowerCase()) ||
      h.address?.toLowerCase().includes(mapSearchTerm.toLowerCase());
    const matchesRegion = !mapSelectedRegion || h.region === mapSelectedRegion;
    return matchesSearch && matchesRegion;
  });

  const MAX_MAP_MARKERS = 400;
  const visibleHospitals = filteredHospitals.length > MAX_MAP_MARKERS
    ? filteredHospitals.slice(0, MAX_MAP_MARKERS)
    : filteredHospitals;

  return (
    <div className="min-h-screen bg-gray-50">
      {navigation}

      <section className="pt-8 pb-4 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate('hospitals')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#2D4B32] transition mb-6"
            >
              <ArrowLeft size={20} />
              Back to Hospitals
            </button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Find Hospitals Near You
                </h1>
                <p className="text-gray-600">
                  Interactive map of {filteredHospitals.length} facilities across Ethiopia
                </p>
              </div>
              {userLocation && (
                <div className="flex items-center gap-2 text-sm text-[#2D4B32] bg-[#2D4B32]/10 px-4 py-2 rounded-lg">
                  <MapPin size={16} />
                  <span>Location detected</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-4 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search hospitals by name or address..."
                value={mapSearchTerm}
                onChange={(e) => setMapSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition"
              />
            </div>
            <select
              value={mapSelectedRegion}
              onChange={(e) => setMapSelectedRegion(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition min-w-[200px]"
            >
              <option value="">All Regions ({filteredHospitals.length})</option>
              {regions.map((r) => (
                <option key={r.name} value={r.name}>{r.name} ({r.count})</option>
              ))}
            </select>
            <button
              onClick={requestUserLocation}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#2D4B32] text-white rounded-xl hover:bg-[#2D4B32] transition"
            >
              {locationLoading ? (
                <>
                  <ArrowClockwise size={18} className="animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <Crosshair size={18} />
                  Find My Location
                </>
              )}
            </button>
          </div>
          {locationError && (
            <div className="mt-3 text-sm text-[#2D4B32] bg-[#2D4B32]/10 border border-[#2D4B32]/20 rounded-lg px-3 py-2">
              {locationError}
            </div>
          )}
          {filteredHospitals.length > MAX_MAP_MARKERS && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#2D4B32] bg-[#2D4B32]/10 border border-[#2D4B32]/20 rounded-lg px-3 py-2">
              <Warning size={16} />
              <span>Showing the first {MAX_MAP_MARKERS} facilities. Use search or region to narrow results.</span>
            </div>
          )}
        </div>
      </section>

      <section className="h-[calc(100vh-300px)] min-h-[500px] relative">
        {!mapMounted || !MapComponent ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D4B32]/5 to-[#2D4B32]/10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4B32] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interactive map...</p>
            </div>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D4B32]/5 to-[#2D4B32]/10">
            <div className="text-center">
              <HospitalIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading hospitals...</p>
            </div>
          </div>
        ) : (
          <MapComponent
            hospitals={visibleHospitals}
            selectedHospital={selectedHospital}
            onHospitalSelect={(hospital) => {
              setSelectedHospital(hospital);
              loadDepartments(hospital.id);
              onNavigate('departments');
            }}
            userLocation={userLocation}
          />
        )}
      </section>

      <section className="py-6 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-semibold text-gray-900 mb-4">
            {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''} Found
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredHospitals.slice(0, 8).map((hospital) => (
              <button
                key={hospital.id}
                onClick={() => {
                  setSelectedHospital(hospital);
                  loadDepartments(hospital.id);
                  onNavigate('departments');
                }}
                className="p-3 bg-gray-50 rounded-lg text-left hover:bg-[#2D4B32]/10 hover:ring-2 hover:ring-[#2D4B32]/40 transition group"
              >
                <p className="font-medium text-gray-900 group-hover:text-[#2D4B32] truncate">
                  {hospital.name}
                </p>
                <p className="text-sm text-gray-500">{hospital.region}</p>
              </button>
            ))}
          </div>
          {filteredHospitals.length > 8 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              +{filteredHospitals.length - 8} more hospitals on the map
            </p>
          )}
        </div>
      </section>

      {footer}
    </div>
  );
}
