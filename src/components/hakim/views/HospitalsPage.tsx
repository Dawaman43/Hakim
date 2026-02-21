'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft, MagnifyingGlass, GridFour, List, MapPin, Hospital as HospitalIcon,
  Buildings, FirstAid, Stethoscope, Heart, Brain, CaretRight,
} from '@phosphor-icons/react';
import type { Hospital } from '@/types';
import type { ViewType } from '../routes';

interface HospitalsPageProps {
  darkMode: boolean;
  loading: boolean;
  hospitals: Hospital[];
  totalHospitals: number;
  facilityCounts: Record<string, number>;
  totalDepartments: number;
  totalRegions: number;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
  facilityTypeFilter: string;
  setFacilityTypeFilter: (value: string) => void;
  onNavigate: (view: ViewType) => void;
  onSelectHospital: (hospital: Hospital) => void;
  onLoadDepartments: (hospitalId: string) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  t: Record<string, string>;
}

export function HospitalsPage({
  darkMode,
  loading,
  hospitals,
  totalHospitals,
  facilityCounts,
  totalDepartments,
  totalRegions,
  page,
  pageSize,
  setPage,
  setPageSize,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  regionFilter,
  setRegionFilter,
  facilityTypeFilter,
  setFacilityTypeFilter,
  onNavigate,
  onSelectHospital,
  onLoadDepartments,
  navigation,
  footer,
  t,
}: HospitalsPageProps) {
  const totalPages = Math.max(1, Math.ceil(totalHospitals / pageSize));

  const getFacilityBadge = (type: string | undefined) => {
    switch (type) {
      case 'HOSPITAL':
        return { label: 'Hospital', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'HEALTH_CENTER':
        return { label: 'Health Center', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'CLINIC':
        return { label: 'Clinic', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'HEALTH_POST':
        return { label: 'Health Post', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'SPECIALIZED_CENTER':
        return { label: 'Specialized', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'PHARMACY':
        return { label: 'Pharmacy', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'LABORATORY':
        return { label: 'Laboratory', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      default:
        return { label: 'Hospital', color: 'bg-[#2D4B32] text-[#2D4B32]', darkColor: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      {navigation}

      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              <ArrowLeft size={20} />
              {t.backToHome}
            </button>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Healthcare Facilities
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Choose a hospital, clinic, or health center to book your queue token
            </p>
            {loading ? (
              <div className={`mt-4 inline-flex items-center gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="h-3 w-3 rounded-full bg-[#2D4B32] animate-pulse" />
                <span>Loading facilities...</span>
              </div>
            ) : (
              <div className={`mt-4 flex flex-wrap gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {totalHospitals} total facilities
                </span>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32]/10 text-[#2D4B32]'}`}>
                  {facilityCounts.HOSPITAL ?? hospitals.filter(h => h.facilityType === 'HOSPITAL').length} Hospitals
                </span>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32]/10 text-[#2D4B32]'}`}>
                  {facilityCounts.CLINIC ?? hospitals.filter(h => h.facilityType === 'CLINIC').length} Clinics
                </span>
              </div>
            )}
          </motion.div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <MagnifyingGlass size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search hospitals, clinics, health centers..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`}
                />
              </div>
              <select
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setPage(1);
                }}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
              >
                <option>All Regions</option>
                <option>Addis Ababa</option>
                <option>Afar</option>
                <option>Amhara</option>
                <option>Benishangul-Gumuz</option>
                <option>Dire Dawa</option>
                <option>Gambela</option>
                <option>Harari</option>
                <option>Oromia</option>
                <option>Sidama</option>
                <option>Somali</option>
                <option>South West Ethiopia</option>
                <option>SNNPR</option>
                <option>Tigray</option>
              </select>
              <div className={`flex border rounded-xl overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? (darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32]/10 text-[#2D4B32]') : (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400')}`}
                >
                  <GridFour size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? (darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32]/10 text-[#2D4B32]') : (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400')}`}
                >
                  <List size={20} />
                </button>
              </div>
              <button
                onClick={() => onNavigate('map')}
                className="flex items-center gap-2 px-4 py-3 bg-[#2D4B32] text-white rounded-xl hover:bg-[#2D4B32] transition"
              >
                <MapPin size={20} />
                <span className="hidden sm:inline">Map View</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: 'ALL', label: 'All Types', icon: Buildings },
                { value: 'HOSPITAL', label: 'Hospitals', icon: HospitalIcon },
                { value: 'HEALTH_CENTER', label: 'Health Centers', icon: FirstAid },
                { value: 'CLINIC', label: 'Clinics', icon: Stethoscope },
                { value: 'PHARMACY', label: 'Pharmacies', icon: Heart },
                { value: 'LABORATORY', label: 'Laboratories', icon: Brain },
                { value: 'HEALTH_POST', label: 'Health Posts', icon: Heart },
                { value: 'SPECIALIZED_CENTER', label: 'Specialized', icon: Brain },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFacilityTypeFilter(type.value);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    facilityTypeFilter === type.value
                      ? darkMode
                        ? 'bg-[#2D4B32]/10 text-[#2D4B32] border border-[#2D4B32]/50'
                        : 'bg-[#2D4B32]/10 text-[#2D4B32] border border-[#2D4B32]/50'
                      : darkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <type.icon size={16} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-6 animate-pulse ${
                    darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#E7EDDF]" />
                    <div className="h-5 w-20 rounded-full bg-[#E7EDDF]" />
                  </div>
                  <div className="h-5 w-3/4 rounded bg-[#E7EDDF] mb-3" />
                  <div className="h-4 w-1/2 rounded bg-[#E7EDDF] mb-2" />
                  <div className="h-4 w-full rounded bg-[#E7EDDF]" />
                  <div className="mt-4 pt-4 border-t border-[#E7EDDF]">
                    <div className="h-4 w-2/3 rounded bg-[#E7EDDF]" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm">
                <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                  Showing {hospitals.length} of {totalHospitals} facilities
                </p>
                <div className="flex items-center gap-2">
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Per page</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className={`px-2 py-1 border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                  >
                    {[12, 24, 36, 48].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
              >
                {hospitals.map((hospital, index) => {
                  const badge = getFacilityBadge(hospital.facilityType);
                  const deptCount = hospital.departmentCount ?? hospital.departments?.length ?? 0;

                  return (
                    <motion.button
                      key={hospital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.02, 0.5) }}
                      onClick={() => {
                        onSelectHospital(hospital);
                        onLoadDepartments(hospital.id);
                        onNavigate('departments');
                      }}
                      className={`rounded-2xl border transition-all text-left group overflow-hidden ${
                        darkMode ? 'bg-gray-900 border-gray-800 hover:border-[#2D4B32]/60' : 'bg-white border-gray-200 hover:border-[#2D4B32]'
                      } ${viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center gap-4'}`}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform bg-[#E7EDDF] border border-[#2D4B32]/30">
                              <HospitalIcon size={28} className="text-[#2D4B32]" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? badge.darkColor : badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                          <h3 className={`text-lg font-bold mb-2 group-hover:text-[#2D4B32] transition line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {hospital.name}
                          </h3>
                          <div className={`flex items-center gap-2 text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <MapPin size={16} />
                            <span>{hospital.region}</span>
                          </div>
                          <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{hospital.address}</p>
                          <div className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Stethoscope size={16} />
                              <span>{deptCount} departments</span>
                            </div>
                            <CaretRight size={20} className={`group-hover:text-[#2D4B32] group-hover:translate-x-1 transition-all ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#E7EDDF] border border-[#2D4B32]/30">
                            <HospitalIcon size={24} className="text-[#2D4B32]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`text-base font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {hospital.name}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? badge.darkColor : badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{hospital.address}</p>
                          </div>
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className={`px-4 py-2 rounded-xl border text-sm transition ${
                    page <= 1
                      ? darkMode ? 'bg-gray-900 border-gray-800 text-gray-600' : 'bg-gray-100 border-gray-200 text-gray-400'
                      : darkMode ? 'bg-gray-900 border-gray-700 text-white hover:border-[#2D4B32]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#2D4B32]'
                  }`}
                >
                  Previous
                </button>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className={`px-4 py-2 rounded-xl border text-sm transition ${
                    page >= totalPages
                      ? darkMode ? 'bg-gray-900 border-gray-800 text-gray-600' : 'bg-gray-100 border-gray-200 text-gray-400'
                      : darkMode ? 'bg-gray-900 border-gray-700 text-white hover:border-[#2D4B32]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#2D4B32]'
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {footer}
    </div>
  );
}
