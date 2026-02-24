"use client";

import { ArrowLeft, CaretRight, Crosshair, Hospital as HospitalIcon, Info, MapPin, NavigationArrow } from "@phosphor-icons/react";
import type { Hospital } from "@/types";
import type { ViewType } from "../routes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

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
  onFindNearest: (shouldNavigate?: boolean) => void;
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
  onFindNearest,
  navigation,
  footer,
}: NearestHospitalsPageProps) {
  const loadingNearest = loading || nearestLoading;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      {navigation}

      <section className="pt-8 pb-8 transition-colors duration-300 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Button
              onClick={() => onNavigate("landing")}
              variant="ghost"
              className="flex items-center gap-2 transition mb-6 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary border border-primary/20">
                <Crosshair size={24} className="text-current" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Nearest Hospitals {userLocation?.city ? `in ${userLocation.city}` : ''}
                </h1>
                <p className="text-muted-foreground">
                  Hospitals sorted by distance from your location
                </p>
              </div>
            </div>

            {locationNotice ? (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/10">
                  <Info size={16} />
                  <span>{locationNotice}</span>
                </Badge>
                <div className="flex items-center gap-2">
                  <Button onClick={() => onFindNearest(true)} variant="link" className="text-sm font-medium px-0">Use Current Location</Button>
                  <Button onClick={onChangeLocation} variant="link" className="text-sm font-medium px-0">Change Location</Button>
                </div>
              </div>
            ) : userLocation && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/10">
                  <MapPin size={16} />
                  <span>Location detected</span>
                  <span className="text-primary">
                    ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                  </span>
                </Badge>
                <div className="flex items-center gap-2">
                  <Button onClick={() => onFindNearest(true)} variant="link" className="text-sm font-medium px-0">Refresh GPS</Button>
                  <Button onClick={onChangeLocation} variant="link" className="text-sm font-medium px-0">Change Location</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingNearest ? (
            <div className="flex items-center justify-center p-8">
              <Spinner size={24} />
            </div>
          ) : nearestHospitals.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-muted/30">
                <HospitalIcon size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Hospitals Found</h3>
              <p className="mb-6 text-muted-foreground">
                {nearestError ? nearestError : "Unable to find hospitals near your location. Please try searching manually."}
              </p>
              <Button
                onClick={() => onNavigate("hospitals")}
                className="rounded-xl"
              >
                Browse All Hospitals
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <NavigationArrow size={20} className="text-primary" />
                  Closest to You
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {nearestHospitals.slice(0, 3).map((hospital, index) => (
                    <button
                      key={hospital.id}
                      onClick={() => {
                        onSelectHospital(hospital);
                        onLoadDepartments(hospital.id);
                        onNavigate("departments");
                      }}
                      className="bg-primary text-primary-foreground rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-4 right-4 w-8 h-8 bg-background/90 text-foreground rounded-full flex items-center justify-center text-lg font-bold">
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 bg-background/90 text-foreground rounded-xl flex items-center justify-center mb-4">
                        <HospitalIcon size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{hospital.name}</h3>
                      <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-3">
                        <MapPin size={14} />
                        <span>{hospital.region}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-primary-foreground/20">
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
                    </button>
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
