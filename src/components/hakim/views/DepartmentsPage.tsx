'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CaretRight, MapPin, Stethoscope } from '@phosphor-icons/react';
import type { Hospital, Department } from '@/types';
import type { ViewType } from '../routes';

interface DepartmentsPageProps {
  darkMode: boolean;
  loading: boolean;
  selectedHospital: Hospital | null;
  departments: Department[];
  onNavigate: (view: ViewType) => void;
  onSelectDepartment: (department: Department) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  t: Record<string, string>;
}

export function DepartmentsPage({
  darkMode,
  loading,
  selectedHospital,
  departments,
  onNavigate,
  onSelectDepartment,
  navigation,
  footer,
  t,
}: DepartmentsPageProps) {
  const getFacilityBadge = (type: string | undefined) => {
    switch (type) {
      case 'HOSPITAL':
        return { label: 'Hospital', color: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'HEALTH_CENTER':
        return { label: 'Health Center', color: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      case 'CLINIC':
        return { label: 'Clinic', color: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
      default:
        return { label: 'Facility', color: 'bg-[#2D4B32]/10 text-[#2D4B32]' };
    }
  };

  const facilityBadge = getFacilityBadge(selectedHospital?.facilityType);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      {navigation}

      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate('hospitals')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              <ArrowLeft size={20} />
              {t.backToHospitals}
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t.selectDepartment}
                </h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {t.chooseDepartmentToken}
                </p>
              </div>
              {selectedHospital && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-950 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                    <Stethoscope size={20} className="text-[#2D4B32]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Selected Hospital</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedHospital.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${facilityBadge.color}`}>
                    {facilityBadge.label}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <span className="h-6 w-6 rounded-full bg-[#2D4B32] animate-pulse" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department, index) => (
                <motion.button
                  key={department.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  onClick={() => {
                    onSelectDepartment(department);
                    onNavigate('booking');
                  }}
                  className={`rounded-2xl border transition-all text-left group overflow-hidden p-6 ${darkMode ? 'bg-gray-950 border-gray-800 hover:border-[#2D4B32]/60' : 'bg-white border-gray-200 hover:border-[#2D4B32]'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                      <Stethoscope size={24} className="text-[#2D4B32]" />
                    </div>
                    <CaretRight size={20} className={`group-hover:text-[#2D4B32] group-hover:translate-x-1 transition-all ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 group-hover:text-[#2D4B32] transition ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {department.name}
                  </h3>
                  <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {department.description || 'No description provided'}
                  </p>
                  {selectedHospital && (
                    <div className={`flex items-center gap-2 text-xs mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      <MapPin size={12} />
                      <span>{selectedHospital.region}</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {footer}
    </div>
  );
}
