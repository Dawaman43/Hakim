'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Hospital } from '@/types';

// Import Leaflet CSS - required for map tiles to render
import 'leaflet/dist/leaflet.css';

// Import react-leaflet components directly (client-side only via useEffect)
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Ethiopia center coordinates
const ETHIOPIA_CENTER: [number, number] = [9.1450, 40.4897];
const ETHIOPIA_ZOOM = 6;

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  onHospitalSelect: (hospital: Hospital) => void;
  userLocation?: { lat: number; lng: number } | null;
}

// Get color based on facility type
const getFacilityColor = (facilityType: string | undefined): string => {
  switch (facilityType) {
    case 'HOSPITAL':
      return '#059669'; // emerald
    case 'HEALTH_CENTER':
      return '#2563eb'; // blue
    case 'CLINIC':
      return '#9333ea'; // purple
    case 'HEALTH_POST':
      return '#ea580c'; // orange
    case 'SPECIALIZED_CENTER':
      return '#db2777'; // pink
    case 'PHARMACY':
      return '#0d9488'; // teal
    case 'LABORATORY':
      return '#6366f1'; // indigo
    default:
      return '#059669'; // emerald
  }
};

const createCustomIcon = (facilityType: string | undefined, isSelected: boolean = false) => {
  const color = isSelected ? '#dc2626' : getFacilityColor(facilityType);
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: ${isSelected ? '32px' : '24px'};
        height: ${isSelected ? '32px' : '24px'};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? '18' : '14'}" height="${isSelected ? '18' : '14'}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6v12"/><path d="M8 10h8"/><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/>
        </svg>
      </div>
    `,
    iconSize: isSelected ? [32, 32] : [24, 24],
    iconAnchor: isSelected ? [16, 16] : [12, 12],
  });
};

// User location marker
const createUserIcon = () => {
  return L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        background: #3b82f6;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Main map component
export default function HospitalMap({ 
  hospitals, 
  selectedHospital, 
  onHospitalSelect,
  userLocation 
}: HospitalMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  const iconCache = useMemo(() => new Map<string, L.DivIcon>(), []);
  const getIcon = (facilityType: string | undefined, isSelected: boolean) => {
    const key = `${facilityType ?? 'default'}:${isSelected ? 'selected' : 'base'}`;
    const cached = iconCache.get(key);
    if (cached) return cached;
    const icon = createCustomIcon(facilityType, isSelected);
    iconCache.set(key, icon);
    return icon;
  };

  const validHospitals = useMemo(
    () => hospitals.filter(h => h.latitude && h.longitude),
    [hospitals]
  );

  useEffect(() => {
    // Use requestAnimationFrame to defer setState
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
      <MapContainer
        center={ETHIOPIA_CENTER}
        zoom={ETHIOPIA_ZOOM}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        className="z-0"
        scrollWheelZoom={true}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
          />
        )}
        
        {/* Hospital markers */}
        {validHospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.latitude!, hospital.longitude!]}
            icon={getIcon(hospital.facilityType, selectedHospital?.id === hospital.id)}
            eventHandlers={{
              click: () => onHospitalSelect(hospital),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-emerald-700">{hospital.name}</h3>
                <p className="text-sm text-gray-600">{hospital.region}</p>
                {hospital.address && (
                  <p className="text-xs text-gray-500 mt-1">{hospital.address}</p>
                )}
                {hospital.emergencyContactNumber && (
                  <p className="text-xs text-emerald-600 mt-2">
                    📞 {hospital.emergencyContactNumber}
                  </p>
                )}
                <button
                  onClick={() => onHospitalSelect(hospital)}
                  className="w-full mt-2 px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition"
                >
                  Select Facility
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <p className="text-xs font-semibold text-gray-700 mb-2">Legend</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs text-gray-600">Hospital</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs text-gray-600">Health Center</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs text-gray-600">Clinic</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-teal-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs text-gray-600">Pharmacy</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs text-gray-600">Laboratory</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs text-gray-600">Selected</span>
        </div>
        {userLocation && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs text-gray-600">Your Location</span>
          </div>
        )}
      </div>

      {/* Facility Count */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 z-[1000]">
        <p className="text-xs text-gray-500">Facilities Shown</p>
        <p className="text-lg font-bold text-emerald-600">{validHospitals.length}</p>
      </div>
    </div>
  );
}
