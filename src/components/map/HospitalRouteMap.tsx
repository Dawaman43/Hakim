'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Hospital } from '@/types';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

if (typeof window !== 'undefined' && L?.Icon?.Default?.mergeOptions) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface HospitalRouteMapProps {
  hospital: Hospital;
  userLocation?: { lat: number; lng: number } | null;
  height?: number;
}

const createHospitalIcon = () =>
  L.divIcon({
    className: 'hospital-route-marker',
    html: `
      <div style="
        background: #2D4B32;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6v12"/><path d="M8 10h8"/><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const createUserIcon = () =>
  L.divIcon({
    className: 'user-route-marker',
    html: `
      <div style="
        background: #2563eb;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.2), 0 3px 10px rgba(15, 23, 42, 0.2);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

function FitBounds({
  hospitalLat,
  hospitalLng,
  userLocation,
}: {
  hospitalLat: number;
  hospitalLng: number;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (userLocation) {
      const bounds = L.latLngBounds([
        [hospitalLat, hospitalLng],
        [userLocation.lat, userLocation.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView([hospitalLat, hospitalLng], 13);
    }
  }, [map, hospitalLat, hospitalLng, userLocation]);

  return null;
}

export default function HospitalRouteMap({ hospital, userLocation, height = 320 }: HospitalRouteMapProps) {
  const [mounted, setMounted] = useState(false);

  const hospitalLat = hospital.latitude ?? null;
  const hospitalLng = hospital.longitude ?? null;

  const path = useMemo(() => {
    if (!hospitalLat || !hospitalLng || !userLocation) return null;
    return [
      [userLocation.lat, userLocation.lng],
      [hospitalLat, hospitalLng],
    ] as [number, number][];
  }, [hospitalLat, hospitalLng, userLocation]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!hospitalLat || !hospitalLng) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40" style={{ height }}>
        <p className="text-sm text-muted-foreground">Location not available for this facility.</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-muted/30" style={{ height }}>
        <div className="text-sm text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border" style={{ height }}>
      <MapContainer
        center={[hospitalLat, hospitalLng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
        scrollWheelZoom={false}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds hospitalLat={hospitalLat} hospitalLng={hospitalLng} userLocation={userLocation} />
        <Marker position={[hospitalLat, hospitalLng]} icon={createHospitalIcon()} />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()} />
        )}
        {path && (
          <Polyline
            positions={path}
            pathOptions={{ color: '#2D4B32', weight: 4, opacity: 0.85 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
