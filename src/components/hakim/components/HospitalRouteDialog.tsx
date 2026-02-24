'use client';

import { useMemo } from 'react';
import type { Hospital } from '@/types';
import { MapPin, NavigationArrow, Hospital as HospitalIcon } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HospitalRouteMap from '@/components/map/HospitalRouteMap';

interface HospitalRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospital: Hospital | null;
  userLocation?: { lat: number; lng: number } | null;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

function getFacilityLabel(type?: string) {
  switch (type) {
    case 'HOSPITAL':
      return 'Hospital';
    case 'HEALTH_CENTER':
      return 'Health Center';
    case 'CLINIC':
      return 'Clinic';
    case 'HEALTH_POST':
      return 'Health Post';
    case 'SPECIALIZED_CENTER':
      return 'Specialized';
    case 'PHARMACY':
      return 'Pharmacy';
    case 'LABORATORY':
      return 'Laboratory';
    default:
      return 'Facility';
  }
}

export function HospitalRouteDialog({
  open,
  onOpenChange,
  hospital,
  userLocation,
  primaryActionLabel,
  onPrimaryAction,
}: HospitalRouteDialogProps) {
  const directionsUrl = useMemo(() => {
    if (!hospital?.latitude || !hospital?.longitude) return null;
    if (!userLocation) {
      return `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.latitude},${hospital.longitude}&travelmode=driving`;
  }, [hospital?.latitude, hospital?.longitude, userLocation]);

  if (!hospital) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="flex flex-col gap-0">
          <div className="border-b border-border bg-card px-6 py-5">
            <DialogHeader className="gap-3">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <HospitalIcon size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-semibold text-foreground">
                    {hospital.name}
                  </DialogTitle>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    <span>{hospital.address || hospital.region}</span>
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/10">
                  {getFacilityLabel(hospital.facilityType)}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <div className="px-6 py-5">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <HospitalRouteMap hospital={hospital} userLocation={userLocation} height={320} />
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Facility
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Your location
                </div>
                <span className="text-xs text-muted-foreground">Route line is approximate. Use Maps for turn-by-turn directions.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            {directionsUrl && (
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => window.open(directionsUrl, '_blank', 'noopener,noreferrer')}
              >
                <NavigationArrow size={18} className="mr-2" />
                Open in Maps
              </Button>
            )}
            {primaryActionLabel && onPrimaryAction && (
              <Button className="rounded-xl" onClick={onPrimaryAction}>
                {primaryActionLabel}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
