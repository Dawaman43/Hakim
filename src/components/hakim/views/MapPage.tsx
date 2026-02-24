'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, MagnifyingGlass, Warning, Crosshair, ArrowClockwise, Hospital as HospitalIcon } from '@phosphor-icons/react';
import type { Hospital } from '@/types';
import type { ViewType } from '../routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MapPageProps {
  darkMode: boolean;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  loadDepartments: (hospitalId: string) => void;
  onNavigate: (view: ViewType) => void;
  userLocation: { lat: number; lng: number } | null;
  locationLoading: boolean;
  onFindNearest: (shouldNavigate?: boolean) => void;
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
  userLocation,
  locationLoading,
  onFindNearest,
  navigation,
  footer,
}: MapPageProps) {
  const [mapSearchTerm, setMapSearchTerm] = useState('');
  const [mapSelectedRegion, setMapSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<{ name: string; count: number }[]>([]);
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

  useEffect(() => {
    setMapMounted(true);
    import('@/components/map/HospitalMap').then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(mapSearchTerm.toLowerCase()) ||
      h.address?.toLowerCase().includes(mapSearchTerm.toLowerCase());
    const matchesRegion = !mapSelectedRegion || mapSelectedRegion === 'ALL' || h.region === mapSelectedRegion;
    return matchesSearch && matchesRegion;
  });

  const MAX_MAP_MARKERS = 400;
  const regionFiltered = !!mapSelectedRegion && mapSelectedRegion !== 'ALL';
  const visibleHospitals = filteredHospitals.length > MAX_MAP_MARKERS && !regionFiltered
    ? filteredHospitals.slice(0, MAX_MAP_MARKERS)
    : filteredHospitals;

  return (
    <div className="min-h-screen bg-background">
      {navigation}

      <section className="pt-8 pb-4 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Button
              onClick={() => onNavigate('hospitals')}
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft size={20} />
              Back to Hospitals
            </Button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Find Hospitals Near You
                </h1>
                <p className="text-muted-foreground">
                  Interactive map of {filteredHospitals.length} facilities across Ethiopia
                </p>
              </div>
              {userLocation && (
                <Badge variant="secondary" className="gap-2 bg-primary/10 text-primary border border-primary/10">
                  <MapPin size={16} />
                  <span>Location detected</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search hospitals by name or address..."
                value={mapSearchTerm}
                onChange={(e) => setMapSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl"
              />
            </div>
            <Select value={mapSelectedRegion} onValueChange={setMapSelectedRegion}>
              <SelectTrigger className="h-12 rounded-xl min-w-[200px]">
                <SelectValue placeholder={`All Regions (${filteredHospitals.length})`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Regions ({filteredHospitals.length})</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r.name} value={r.name}>{r.name} ({r.count})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => onFindNearest(false)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
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
            </Button>
          </div>
          {filteredHospitals.length > MAX_MAP_MARKERS && !regionFiltered && (
            <div className="mt-4 flex items-center gap-2 text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
              <Warning size={16} />
              <span>Showing the first {MAX_MAP_MARKERS} facilities. Use search or region to narrow results.</span>
            </div>
          )}
        </div>
      </section>

      <section className="h-[calc(100vh-300px)] min-h-[500px] relative">
        {!mapMounted || !MapComponent ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <Spinner size={28} className="mx-auto mb-4" />
              <p className="text-muted-foreground">Loading interactive map...</p>
            </div>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <HospitalIcon size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading hospitals...</p>
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

      <section className="py-6 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-semibold text-foreground mb-4">
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
                className="p-3 bg-card border border-border rounded-lg text-left hover:bg-primary/10 hover:border-primary/40 transition group"
              >
                <p className="font-medium text-foreground group-hover:text-primary truncate">
                  {hospital.name}
                </p>
                <p className="text-sm text-muted-foreground">{hospital.region}</p>
              </button>
            ))}
          </div>
          {filteredHospitals.length > 8 && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              +{filteredHospitals.length - 8} more hospitals on the map
            </p>
          )}
        </div>
      </section>

      {footer}
    </div>
  );
}
