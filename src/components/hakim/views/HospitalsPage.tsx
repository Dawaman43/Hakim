'use client';

import {
  ArrowLeft, MagnifyingGlass, GridFour, List, MapPin, Hospital as HospitalIcon,
  Buildings, FirstAid, Stethoscope, Heart, Brain, CaretRight,
} from '@phosphor-icons/react';
import type { Hospital } from '@/types';
import type { ViewType } from '../routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        return { label: 'Hospital' };
      case 'HEALTH_CENTER':
        return { label: 'Health Center' };
      case 'CLINIC':
        return { label: 'Clinic' };
      case 'HEALTH_POST':
        return { label: 'Health Post' };
      case 'SPECIALIZED_CENTER':
        return { label: 'Specialized' };
      case 'PHARMACY':
        return { label: 'Pharmacy' };
      case 'LABORATORY':
        return { label: 'Laboratory' };
      default:
        return { label: 'Hospital' };
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      {navigation}

      <section className="pt-8 pb-8 transition-colors duration-300 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Button
              onClick={() => onNavigate('landing')}
              variant="ghost"
              className="flex items-center gap-2 transition mb-6 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={20} />
              {t.backToHome}
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
              Healthcare Facilities
            </h1>
            <p className="text-muted-foreground">
              Choose a hospital, clinic, or health center to book your queue token
            </p>
            {loading ? (
              <div className="mt-4 inline-flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner size={14} />
                <span>Loading facilities...</span>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-muted-foreground">{totalHospitals} total facilities</Badge>
                <Badge variant="secondary" className="text-primary">
                  {facilityCounts.HOSPITAL ?? hospitals.filter(h => h.facilityType === 'HOSPITAL').length} Hospitals
                </Badge>
                <Badge variant="secondary" className="text-primary">
                  {facilityCounts.CLINIC ?? hospitals.filter(h => h.facilityType === 'CLINIC').length} Clinics
                </Badge>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search hospitals, clinics, health centers..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-xl"
                />
              </div>
              <Select
                value={regionFilter}
                onValueChange={(value) => {
                  setRegionFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-12 rounded-xl w-full lg:w-[220px]">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'All Regions',
                    'Addis Ababa',
                    'Afar',
                    'Amhara',
                    'Benishangul-Gumuz',
                    'Dire Dawa',
                    'Gambela',
                    'Harari',
                    'Oromia',
                    'Sidama',
                    'Somali',
                    'South West Ethiopia',
                    'SNNPR',
                    'Tigray',
                  ].map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
                className="justify-start rounded-xl border border-border bg-background"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view" className="h-12 w-12">
                  <GridFour size={20} />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view" className="h-12 w-12">
                  <List size={20} />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button
                onClick={() => onNavigate('map')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl"
              >
                <MapPin size={20} />
                <span className="hidden sm:inline">Map View</span>
              </Button>
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
                <Button
                  key={type.value}
                  onClick={() => {
                    setFacilityTypeFilter(type.value);
                    setPage(1);
                  }}
                  variant={facilityTypeFilter === type.value ? 'default' : 'outline'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${facilityTypeFilter === type.value ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                >
                  <type.icon size={16} />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded mb-3" />
                  <Skeleton className="h-4 w-1/2 rounded mb-2" />
                  <Skeleton className="h-4 w-full rounded" />
                  <div className="mt-4 pt-4 border-t border-border">
                    <Skeleton className="h-4 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm">
                <p className="text-muted-foreground">
                  Showing {hospitals.length} of {totalHospitals} facilities
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Per page</span>
                  <Select
                    value={pageSize}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 w-[88px] rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 24, 36, 48].map((size) => (
                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {hospitals.map((hospital, index) => {
                  const badge = getFacilityBadge(hospital.facilityType);
                  const deptCount = hospital.departmentCount ?? hospital.departments?.length ?? 0;

                  return (
                    <button
                      key={hospital.id}
                      onClick={() => {
                        onSelectHospital(hospital);
                        if (typeof window !== 'undefined') {
                          sessionStorage.setItem('hakim_selected_hospital', JSON.stringify(hospital));
                        }
                        onLoadDepartments(hospital.id);
                        onNavigate('departments');
                      }}
                      className={`rounded-2xl border border-border bg-card transition-all text-left group overflow-hidden hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center gap-4'
                      }`}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform bg-primary/10 border border-primary/20">
                              <HospitalIcon size={28} className="text-primary" />
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/10">
                              {badge.label}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-bold mb-2 transition line-clamp-2 text-foreground group-hover:text-primary">
                            {hospital.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm mb-2 text-muted-foreground">
                            <MapPin size={16} />
                            <span>{hospital.region}</span>
                          </div>
                          <p className="text-sm line-clamp-2 text-muted-foreground">{hospital.address}</p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Stethoscope size={16} />
                              <span>{deptCount} departments</span>
                            </div>
                            <CaretRight size={20} className="transition-all text-muted-foreground group-hover:text-primary group-hover:translate-x-1" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20">
                            <HospitalIcon size={24} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-base font-semibold truncate text-foreground">
                                {hospital.name}
                              </h3>
                              <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/10">
                                {badge.label}
                              </Badge>
                            </div>
                            <p className="text-sm truncate text-muted-foreground">{hospital.address}</p>
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  variant="outline"
                  className="rounded-xl"
                >
                  Previous
                </Button>
                <span className="text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  variant="outline"
                  className="rounded-xl"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {footer}
    </div>
  );
}
