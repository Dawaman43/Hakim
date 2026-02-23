'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CaretRight, MapPin, Stethoscope } from '@phosphor-icons/react';
import type { Hospital, Department } from '@/types';
import type { ViewType } from '../routes';

interface DepartmentsPageProps {
  darkMode: boolean;
  loading: boolean;
  isAuthenticated: boolean;
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
  isAuthenticated,
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
        return { label: 'Hospital', color: 'bg-primary/10 text-primary' };
      case 'HEALTH_CENTER':
        return { label: 'Health Center', color: 'bg-primary/10 text-primary' };
      case 'CLINIC':
        return { label: 'Clinic', color: 'bg-primary/10 text-primary' };
      default:
        return { label: 'Facility', color: 'bg-primary/10 text-primary' };
    }
  };

  const facilityBadge = getFacilityBadge(selectedHospital?.facilityType);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-background' : 'bg-background'}`}>
      {navigation}

      <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-background' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => onNavigate('hospitals')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-muted-foreground hover:text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <ArrowLeft size={20} />
              {t.backToHospitals}
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-foreground' : 'text-foreground'}`}>
                  {t.selectDepartment}
                </h1>
                <p className={darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}>
                  {t.chooseDepartmentToken}
                </p>
              </div>
              {selectedHospital && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${darkMode ? 'bg-background border-border' : 'bg-card border-border'}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted border border-primary/30">
                    <Stethoscope size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Selected Hospital</p>
                    <p className={`font-semibold ${darkMode ? 'text-foreground' : 'text-foreground'}`}>{selectedHospital.name}</p>
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
          {!selectedHospital ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-lg font-semibold text-foreground">Select a hospital first</p>
              <p className="text-sm text-muted-foreground mt-2">
                Departments are loaded after you choose a hospital.
              </p>
              <button
                onClick={() => onNavigate('hospitals')}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Browse Hospitals
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center p-8">
              <span className="h-6 w-6 rounded-full bg-primary animate-pulse" />
            </div>
          ) : departments.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-lg font-semibold text-foreground">No departments found</p>
              <p className="text-sm text-muted-foreground mt-2">
                This facility does not have departments listed yet.
              </p>
              <button
                onClick={() => selectedHospital?.id && onNavigate('hospitals')}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Back to Hospitals
              </button>
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
                    onNavigate(isAuthenticated ? 'booking' : 'auth');
                  }}
                  className={`rounded-2xl border transition-all text-left group overflow-hidden p-6 ${darkMode ? 'bg-background border-border hover:border-primary/60' : 'bg-card border-border hover:border-primary'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted border border-primary/30">
                      <Stethoscope size={24} className="text-primary" />
                    </div>
                    <CaretRight size={20} className={`group-hover:text-primary group-hover:translate-x-1 transition-all ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 group-hover:text-primary transition ${darkMode ? 'text-foreground' : 'text-foreground'}`}>
                    {department.name}
                  </h3>
                  <p className={`text-sm line-clamp-2 ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {department.description || 'No description provided'}
                  </p>
                  {selectedHospital && (
                    <div className={`flex items-center gap-2 text-xs mt-4 ${darkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
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
