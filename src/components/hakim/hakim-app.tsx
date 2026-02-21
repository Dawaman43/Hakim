'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hospital, Clock, Users, Phone, CaretRight, CheckCircle,
  ArrowLeft, ArrowRight, ArrowClockwise, Gear, SignOut, User,
  MapPin, Heart, Shield, Bell, CellTower, Ticket,
  FirstAid, Ambulance, Stethoscope,
  HandHeart, ChatCircle, MagnifyingGlass, List,
  GridFour, Timer, Sparkle, Warning,
  Check, X, ArrowCounterClockwise,
  PaperPlaneTilt, EnvelopeSimple,
  Buildings, NavigationArrow, Crosshair, Brain, Info,
  Sun, Moon, Globe,
  House, IdentificationCard, Calendar, ChartBar, Eye, EyeSlash,
  Plus, Minus, Trash, PencilSimple, Upload, Image as ImageIcon,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth-store';
import { formatWaitTime, formatPhoneDisplay, getSeverityColor, getSeverityLabel, getStatusColor, getStatusLabel } from '@/lib/queue-utils';
import { MOCK_HOSPITALS } from '@/lib/mock-hospitals';
import type { Hospital, Department, Appointment, QueueStatusResponse, TriageResult } from '@/types';
import { api } from './api';
import { fadeIn, slideIn, staggerContainer } from './animations';
import { getViewFromPath, viewRoutes, type ViewType } from './routes';
import { translations, type Language } from './translations';

interface HakimAppProps {
  initialView?: ViewType;
}

// Dashboard section types
type DashboardSection = 
  | 'overview' 
  | 'profile' 
  | 'location' 
  | 'queues' 
  | 'departments' 
  | 'staff' 
  | 'analytics' 
  | 'settings';

// Hospital registration form data
interface HospitalRegistrationData {
  hospitalName: string;
  hospitalType: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | '';
  region: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  adminName: string;
  adminPhone: string;
  adminPassword: string;
  confirmPassword: string;
  operatingHours: string;
  services: string[];
  agreeToTerms: boolean;
}

// Main Component
export function HakimApp({ initialView = 'landing' }: HakimAppProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const view = useMemo(() => getViewFromPath(pathname, initialView), [pathname, initialView]);

  const navigateTo = useCallback((next: ViewType) => {
    const target = viewRoutes[next] ?? '/';
    if (pathname !== target) {
      router.push(target);
    }
  }, [router, pathname]);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);
  
  // Language state
  const [language, setLanguage] = useState<Language>('en');
  
  // Toggle language
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'am' : 'en');
  }, []);
  
  // Get current translation
  const tr = translations[language];
  
  // Data states
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatusResponse | null>(null);
  
  // Form states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  
  // Admin states
  const [adminStats, setAdminStats] = useState<unknown>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All Regions');

  // Location states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Hospital Registration states
  const [registrationStep, setRegistrationStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationData, setRegistrationData] = useState<HospitalRegistrationData>({
    hospitalName: '',
    hospitalType: '',
    region: 'Addis Ababa',
    city: '',
    address: '',
    phone: '',
    email: '',
    adminName: '',
    adminPhone: '',
    adminPassword: '',
    confirmPassword: '',
    operatingHours: '24/7',
    services: [],
    agreeToTerms: false,
  });

  // Hospital Dashboard states
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>('overview');
  const [hospitalProfile, setHospitalProfile] = useState<{
    name: string;
    type: string;
    region: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    latitude: number | null;
    longitude: number | null;
    operatingHours: string;
    services: string[];
  } | null>(null);
  const [dashboardStats, setDashboardStats] = useState<{
    todayPatients: number;
    waiting: number;
    served: number;
    avgWaitTime: number;
  }>({ todayPatients: 0, waiting: 0, served: 0, avgWaitTime: 0 });
  const [dashboardQueues, setDashboardQueues] = useState<Array<{
    departmentId: string;
    departmentName: string;
    currentToken: number;
    waiting: number;
    served: number;
    status: string;
  }>>([]);
  const [hospitalDepartments, setHospitalDepartments] = useState<Department[]>([]);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '', capacity: 50, avgTime: 15 });

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Get sorted hospitals by distance
  const getHospitalsByDistance = useCallback(() => {
    if (!userLocation) return [];
    
    return hospitals
      .filter(h => h.latitude && h.longitude)
      .map(h => ({
        ...h,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          h.latitude!,
          h.longitude!
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [hospitals, userLocation]);

  // Default location (Addis Ababa)
  const DEFAULT_LOCATION = { lat: 9.0320, lng: 38.7469 };
  
  // Ethiopian region coordinates (approximate centers)
  const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'Addis Ababa': { lat: 9.0320, lng: 38.7469 },
    'Oromia': { lat: 8.5400, lng: 39.2700 },
    'Amhara': { lat: 11.6000, lng: 37.3800 },
    'Tigray': { lat: 14.0000, lng: 38.8000 },
    'SNNPR': { lat: 7.0000, lng: 38.0000 },
    'Somali': { lat: 8.0000, lng: 44.0000 },
    'Afar': { lat: 12.0000, lng: 41.0000 },
    'Djibouti': { lat: 11.5886, lng: 43.1456 },
    'Harari': { lat: 9.3100, lng: 42.1300 },
    'Dire Dawa': { lat: 9.6000, lng: 41.8500 },
    'Benishangul-Gumuz': { lat: 10.5000, lng: 34.5000 },
    'Gambela': { lat: 8.2500, lng: 34.5000 },
  };

  // Ethiopian regional ambulance and emergency numbers
  const REGION_AMBULANCE_DATA: Record<string, { 
    primaryNumber: string; 
    primaryName: string; 
    secondaryNumber?: string; 
    secondaryName?: string;
    redCrossNumber: string;
  }> = {
    'Addis Ababa': { 
      primaryNumber: '939', 
      primaryName: 'Addis Ababa Fire & Emergency',
      secondaryNumber: '907',
      secondaryName: 'Red Cross Ambulance',
      redCrossNumber: '907'
    },
    'Oromia': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Amhara': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Tigray': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'SNNPR': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Somali': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Afar': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Harari': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Dire Dawa': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Benishangul-Gumuz': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Gambela': { 
      primaryNumber: '907', 
      primaryName: 'Red Cross Ambulance',
      secondaryNumber: '911',
      secondaryName: 'General Emergency',
      redCrossNumber: '907'
    },
    'Djibouti': { 
      primaryNumber: '18', 
      primaryName: 'Emergency Services',
      redCrossNumber: '907'
    },
  };
  
  // State for location permission modal
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('Addis Ababa');

  // Get ambulance info based on selected region or user location
  const getAmbulanceInfo = useCallback(() => {
    // First try selected region
    if (selectedRegion && REGION_AMBULANCE_DATA[selectedRegion]) {
      return REGION_AMBULANCE_DATA[selectedRegion];
    }
    // Default to Addis Ababa
    return REGION_AMBULANCE_DATA['Addis Ababa'];
  }, [selectedRegion]);

  // Get user's current location with proper permission handling
  const getUserLocation = useCallback(async () => {
    // Clear any previous errors/notices
    setLocationError(null);
    setLocationNotice(null);

    if (!navigator.geolocation) {
      // No geolocation support, show region selector
      setShowLocationModal(true);
      return;
    }

    // Show permission request modal
    setShowLocationModal(true);
  }, []);

  // Actual location request function
  const requestLocation = useCallback((forceLowAccuracy: boolean = false) => {
    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
        setShowLocationModal(false);
        setLocationNotice(null);
        navigateTo('nearest-hospitals');
      },
      (error) => {
        console.log('Geolocation error:', {
          code: error.code,
          message: error.message,
          forcedLowAccuracy: forceLowAccuracy,
        });
        if (!forceLowAccuracy && (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT)) {
          // Retry once with lower accuracy for faster fallback
          requestLocation(true);
          return;
        }
        setLocationLoading(false);
        // Show error in modal instead of auto-fallback
        let errorMsg = 'Could not get your location. ';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please allow location access in your browser and device settings, or select your region below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          if (typeof window !== 'undefined' && !window.isSecureContext) {
            errorMsg = 'Location is only available on HTTPS or localhost. Please use a secure connection or select your region below.';
          } else {
            errorMsg = 'Your device could not determine its location. Make sure location services are enabled, or select your region below.';
          }
        } else {
          errorMsg = 'Location request timed out. Please try again or select your region below.';
        }
        setLocationError(errorMsg);
      },
      forceLowAccuracy
        ? { enableHighAccuracy: false, timeout: 12000, maximumAge: 120000 }
        : { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
    );
  }, []);

  // Use selected region's location
  const useSelectedRegion = useCallback(() => {
    const coords = REGION_COORDINATES[selectedRegion] || DEFAULT_LOCATION;
    setUserLocation(coords);
    setLocationError(null);
    setShowLocationModal(false);
    setLocationNotice(`Showing hospitals near ${selectedRegion}`);
    navigateTo('nearest-hospitals');
  }, [selectedRegion]);

  // Use default location (Addis Ababa)
  const useDefaultLocation = useCallback(() => {
    setUserLocation(DEFAULT_LOCATION);
    setLocationError(null);
    setShowLocationModal(false);
    setLocationNotice('Using Addis Ababa as your location');
    navigateTo('nearest-hospitals');
  }, []);

  // Load hospitals and clinics
  const loadHospitals = useCallback(async () => {
    setLoading(true);
    try {
      // Use mock data (2000+ healthcare facilities including hospitals and clinics)
      const mockHospitals: Hospital[] = MOCK_HOSPITALS.map((h, index) => ({
        id: h.id,
        name: h.name,
        region: h.region,
        address: h.address,
        latitude: h.latitude,
        longitude: h.longitude,
        emergencyContactNumber: h.emergencyContactNumber,
        isActive: h.isActive,
        adminId: null,
        facilityType: h.facilityType,
        facilityTypeDisplay: h.facilityType === 'HOSPITAL' ? 'Hospital' :
                            h.facilityType === 'HEALTH_CENTER' ? 'Health Center' :
                            h.facilityType === 'CLINIC' ? 'Clinic' :
                            h.facilityType === 'HEALTH_POST' ? 'Health Post' :
                            h.facilityType === 'PHARMACY' ? 'Pharmacy' :
                            h.facilityType === 'LABORATORY' ? 'Laboratory' :
                            'Specialized Center',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        departments: h.departments.map((d, i) => ({
          id: `dept-${h.id}-${i}`,
          hospitalId: h.id,
          name: d.name,
          description: `${d.name} department`,
          averageServiceTimeMin: d.avgTime,
          dailyCapacity: d.capacity,
          currentQueueCount: Math.floor(Math.random() * 30),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      }));
      setHospitals(mockHospitals);
    } catch (error) {
      console.error('Failed to load healthcare facilities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load departments
  const loadDepartments = useCallback(async (hospitalId: string) => {
    setLoading(true);
    try {
      // Get departments from the already loaded hospital data
      const hospital = hospitals.find(h => h.id === hospitalId);
      if (hospital && hospital.departments) {
        setDepartments(hospital.departments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
    } finally {
      setLoading(false);
    }
  }, [hospitals]);

  // Send OTP
  const sendOtp = async (purpose: 'LOGIN' | 'REGISTRATION' = 'LOGIN') => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/send-otp', { phone, purpose });
      if (res.success) {
        setOtpSent(true);
        if (res.otpCode) {
          alert(`Development mode: Your OTP is ${res.otpCode}`);
        }
      } else {
        alert(res.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      alert('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and login
  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/verify-otp', { phone, otpCode: otp, name });
      if (res.success) {
        login(res.user, res.token);
        navigateTo('landing');
        setPhone('');
        setOtp('');
        setOtpSent(false);
      } else {
        alert(res.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      alert('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Book appointment
  const bookAppointment = async () => {
    if (!selectedHospital || !selectedDepartment) return;
    
    setLoading(true);
    try {
      const res = await api.post('/api/queue/book', {
        hospitalId: selectedHospital.id,
        departmentId: selectedDepartment.id,
        notes,
        guestPhone: !isAuthenticated ? phone : undefined,
        guestName: !isAuthenticated ? name : undefined,
      }, token || undefined);
      
      if (res.success) {
        setCurrentAppointment(res.appointment);
        setQueueStatus({
          departmentId: selectedDepartment.id,
          departmentName: selectedDepartment.name,
          currentToken: res.currentToken || 0,
          lastTokenIssued: res.tokenNumber,
          totalWaiting: res.queuePosition,
          estimatedWaitMinutes: res.estimatedWaitMinutes,
          nextAvailableSlot: '',
        });
        navigateTo('token');
      } else {
        alert(res.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Book appointment error:', error);
      alert('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Report emergency
  const reportEmergency = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/emergency/report', {
        symptomsText: symptoms,
        hospitalId: selectedHospital?.id,
        contactPhone: phone || user?.phone,
        guestName: name,
      }, token || undefined);
      
      if (res.success) {
        setTriageResult(res.triage);
      } else {
        alert(res.error || 'Failed to report emergency');
      }
    } catch (error) {
      console.error('Emergency report error:', error);
      alert('Failed to report emergency. Please call 911 directly.');
    } finally {
      setLoading(false);
    }
  };

  // Admin: Call next patient
  const callNextPatient = async () => {
    if (!selectedDepartment) return;
    
    setLoading(true);
    try {
      const res = await api.post('/api/admin/call-next', {
        hospitalId: selectedHospital?.id,
        departmentId: selectedDepartment.id,
      }, token || undefined);
      
      if (res.success) {
        alert(`Called patient: Token #${res.data.appointment.tokenNumber}`);
        loadAdminQueue();
      } else {
        alert(res.error || 'Failed to call next patient');
      }
    } catch (error) {
      console.error('Call next error:', error);
      alert('Failed to call next patient');
    } finally {
      setLoading(false);
    }
  };

  // Load admin queue
  const loadAdminQueue = useCallback(async () => {
    if (!selectedHospital) return;
    
    try {
      const res = await api.get(`/api/admin/analytics?hospitalId=${selectedHospital.id}`, token || undefined);
      if (res.success) {
        setAdminStats(res.data);
      }
    } catch (error) {
      console.error('Load admin queue error:', error);
    }
  }, [selectedHospital, token]);

  // Load hospitals on mount
  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  // Refresh queue status periodically
  useEffect(() => {
    if (view === 'token' && currentAppointment) {
      const interval = setInterval(async () => {
        const res = await api.get(`/api/queue/status?appointmentId=${currentAppointment.id}`);
        if (res.success) {
          setQueueStatus(res.data);
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [view, currentAppointment]);

  // Admin: Load data on view change
  useEffect(() => {
    if (view === 'admin-dashboard' && selectedHospital) {
      loadAdminQueue();
    }
  }, [view, selectedHospital, loadAdminQueue]);

  // Loading Spinner Component
  const Spinner = ({ size = 32 }: { size?: number }) => (
    <div className="flex items-center justify-center p-8">
      <ArrowClockwise size={size} className="animate-spin text-[#2D4B32]" />
    </div>
  );

  // Navigation Component
  const Navigation = ({ transparent = false }: { transparent?: boolean }) => (
    <nav className={`relative z-50 transition-all duration-300 ${transparent ? 'bg-transparent' : darkMode ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-sm' : 'bg-background backdrop-blur-md border-b border-gray-200/50 shadow-sm'}`}>
      {/* Top accent bar */}
      {!transparent && (
        <div className="h-1 bg-gradient-to-r from-[#2D4B32] via-[#2D4B32] to-[#2D4B32]" />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D4B32]/20 group-hover:shadow-[#2D4B32]/20 group-hover:scale-105 transition-all">
              <Heart weight="fill" className="text-white" size={22} />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent`}>
              Hakim
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center rounded-full px-2 py-1 border ${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-gray-100/80 border-gray-200/50'}`}>
            <button 
              onClick={() => navigateTo('landing')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'landing' ? darkMode ? 'bg-gray-700 text-[#2D4B32] shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {tr.home}
            </button>
            <button 
              onClick={() => navigateTo('features')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'features' ? darkMode ? 'bg-gray-700 text-[#2D4B32] shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {tr.features}
            </button>
            <button 
              onClick={() => navigateTo('about')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'about' ? darkMode ? 'bg-gray-700 text-[#2D4B32] shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {tr.about}
            </button>
            <button 
              onClick={() => navigateTo('contact')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'contact' ? darkMode ? 'bg-gray-700 text-[#2D4B32] shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {tr.contact}
            </button>
          </div>

          {/* Right side - Language toggle + Dark mode toggle + Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
              title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
            >
              <Globe size={18} />
              <span className="text-xs font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-yellow-500'}`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigateTo('profile')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100/80'}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-full flex items-center justify-center shadow-sm">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                {user?.role === 'HOSPITAL_ADMIN' && (
                  <button
                    onClick={() => navigateTo('admin-dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium border ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10 border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] hover:from-[#2D4B32] hover:to-[#2D4B32] border-[#2D4B32]/50'}`}
                  >
                    <Gear size={18} />
                    {tr.dashboard}
                  </button>
                )}
                <button
                  onClick={() => { logout(); navigateTo('landing'); }}
                  className={`p-2.5 rounded-xl transition-all ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <SignOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('auth')}
                  className={`px-4 py-2.5 rounded-xl transition font-medium ${darkMode ? 'text-gray-300 hover:text-[#2D4B32] hover:bg-gray-800' : 'text-gray-700 hover:text-[#2D4B32] hover:bg-gray-100/80'}`}
                >
                  {tr.signIn}
                </button>
                <button
                  onClick={() => { navigateTo('hospitals'); }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#2D4B32]/20 hover:-translate-y-0.5 transition-all"
                >
                  {tr.bookQueue}
                </button>
              </>
            )}
          </div>

          {/* Mobile - Language toggle + Dark mode toggle + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1 p-2 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              <Globe size={18} />
              <span className="text-xs font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'text-gray-300 hover:text-[#2D4B32] hover:bg-gray-800' : 'text-gray-600 hover:text-[#2D4B32] hover:bg-gray-100/80'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t shadow-lg ${darkMode ? 'bg-gray-900/95 backdrop-blur-md border-gray-700/50' : 'bg-background backdrop-blur-md border-gray-200/50'}`}
          >
            <div className="px-4 py-4 space-y-1">
              <button 
                onClick={() => { navigateTo('landing'); setMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'landing' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                Home
              </button>
              <button 
                onClick={() => { navigateTo('features'); setMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'features' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                Features
              </button>
              <button 
                onClick={() => { navigateTo('about'); setMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'about' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                About
              </button>
              <button 
                onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'contact' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                Contact
              </button>
              <hr className={`my-3 ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`} />
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => { navigateTo('profile'); setMobileMenuOpen(false); }} 
                    className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100/80'}`}
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => { logout(); navigateTo('landing'); setMobileMenuOpen(false); }} 
                    className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <button 
                    onClick={() => { navigateTo('auth'); setMobileMenuOpen(false); }} 
                    className={`block w-full text-center px-4 py-3 border rounded-xl transition-all ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { navigateTo('hospitals'); setMobileMenuOpen(false); }} 
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-medium shadow-lg shadow-[#2D4B32]/20"
                  >
                    Book Queue
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  // Hero Section for Landing
  const HeroSection = () => (
    <section className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-32 -right-24 w-80 h-80 rounded-full blur-2xl ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]/10'}`} />
        {/* Grid pattern */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,_1px,transparent_1px),linear-gradient(to_bottom,_1px,transparent_1px)] bg-[size:24px_24px] ${darkMode ? 'bg-gray-800/15' : 'bg-gray-400/10'}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium mb-8 border ${darkMode ? 'bg-[#2D4B32]/15 border-[#2D4B32]/50 text-[#2D4B32]' : 'bg-[#E7EDDF] border-[#2D4B32]/40 text-[#2D4B32]'}`}
            >
              <Sparkle size={16} weight="fill" className={darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'} />
              <span>{tr.madeForEthiopia}</span>
              <span className="text-lg">🇪🇹</span>
            </motion.div>

            {/* Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.skipWait}
              <br />
              <span className="bg-gradient-to-r from-[#2D4B32] via-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                {tr.getCareFaster}
              </span>
            </h1>

            {/* Description */}
            <p className={`text-lg sm:text-xl mb-10 leading-relaxed max-w-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {tr.heroDesc} <span className={darkMode ? 'text-[#2D4B32] font-medium' : 'text-[#2D4B32] font-medium'}>{tr.noMoreWaiting}</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigateTo('hospitals')}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {tr.bookYourToken}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={getUserLocation}
                disabled={locationLoading}
                className={`group px-8 py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 border-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-[#2D4B32] hover:bg-gray-750' : 'bg-white border-gray-200 text-gray-700 hover:text-white hover:border-[#2D4B32] hover:bg-[#2D4B32] hover:shadow-lg'}`}
              >
                {locationLoading ? (
                  <>
                    <ArrowClockwise size={20} className="animate-spin" />
                    {tr.locating}
                  </>
                ) : (
                  <>
                    <Crosshair size={20} className="text-[#2D4B32] group-hover:text-white group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-white">{tr.findNearestHospital}</span>
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-8 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">1,600+</p>
                <p className={darkMode ? 'text-gray-500 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Facilities</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">8,000+</p>
                <p className={darkMode ? 'text-gray-500 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>{tr.departments}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">13</p>
                <p className={darkMode ? 'text-gray-500 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>{tr.regions}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Card */}
              <div className={`absolute inset-0 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col justify-center border ${darkMode ? 'bg-gray-900/90 border-gray-700 shadow-[#2D4B32]/20' : 'bg-background border-gray-100 shadow-[#2D4B32]/20'}`}>
                <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-inner ${darkMode ? 'bg-[#E7EDDF]' : 'bg-[#E7EDDF]'}`}>
                  <Ticket size={40} className="text-[#2D4B32]" weight="duotone" />
                </div>
                  <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>{tr.yourTokenNumber}</p>
                  <p className={`text-6xl font-bold mt-2 ${darkMode ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'}`}>#042</p>
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-xl transition ${darkMode ? 'bg-[#E7EDDF]' : 'bg-[#E7EDDF]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                        <Hospital size={20} className="text-[#2D4B32]" />
                      </div>
                      <div>
                        <p className={darkMode ? 'text-xs text-gray-500' : 'text-xs text-gray-500'}>{tr.hospitalLabel}</p>
                        <p className={darkMode ? 'font-medium text-gray-200' : 'font-medium text-gray-900'}>Tikur Anbessa</p>
                      </div>
                    </div>
                    <CaretRight size={18} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl transition ${darkMode ? 'bg-[#E7EDDF]' : 'bg-[#E7EDDF]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                        <Stethoscope size={20} className="text-[#2D4B32]" />
                      </div>
                      <div>
                        <p className={darkMode ? 'text-xs text-gray-500' : 'text-xs text-gray-500'}>{tr.departmentLabel}</p>
                        <p className={darkMode ? 'font-medium text-gray-200' : 'font-medium text-gray-900'}>{tr.generalMedicine}</p>
                      </div>
                    </div>
                    <CaretRight size={18} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-[#E7EDDF] border-[#2D4B32]/40' : 'bg-[#E7EDDF] border-[#2D4B32]/40'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                        <Timer size={20} className="text-[#2D4B32]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#2D4B32]">{tr.estimatedWait}</p>
                        <p className="font-bold text-[#2D4B32]">{tr.minutesShort}</p>
                      </div>
                    </div>
                    <div className="text-right rounded-lg px-3 py-1 bg-[#E7EDDF] border border-[#2D4B32]/30">
                      <p className="text-2xl font-bold text-[#2D4B32]">5</p>
                      <p className="text-xs text-[#2D4B32]">{tr.ahead}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute -top-4 -right-4 rounded-2xl shadow-xl p-4 border ${darkMode ? 'bg-[#E7EDDF] border-[#2D4B32]/30' : 'bg-[#E7EDDF] border-[#2D4B32]/30'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                    <Bell size={16} className="text-[#2D4B32]" weight="fill" />
                  </div>
                  <span className="text-sm font-medium text-[#2D4B32]">{tr.smsAlert}</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className={`absolute -bottom-4 -left-4 rounded-2xl shadow-xl p-4 border ${darkMode ? 'bg-[#E7EDDF] border-[#2D4B32]/30' : 'bg-[#E7EDDF] border-[#2D4B32]/30'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E7EDDF] border border-[#2D4B32]/30">
                    <CheckCircle size={16} className="text-[#2D4B32]" weight="fill" />
                  </div>
                  <span className="text-sm font-medium text-[#2D4B32]">{tr.confirmed}</span>
                </div>
              </motion.div>

              {/* Additional floating element */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/3 -left-8 bg-[#E7EDDF] rounded-2xl shadow-xl shadow-[#2D4B32]/20 p-3 border border-[#2D4B32]/30"
              >
                <div className="flex items-center gap-2 text-[#2D4B32]">
                  <Clock size={16} weight="fill" />
                  <span className="text-xs font-medium">{tr.realTimeLabel}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  // Features Section
  const FeaturesSection = () => (
    <section className={`py-24 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {tr.featuresTitle}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {tr.featuresSubtitle}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Ticket,
              title: tr.digitalToken,
              description: tr.digitalTokenDesc,
            },
            {
              icon: Clock,
              title: tr.realTimeUpdates,
              description: tr.realTimeUpdatesDesc,
            },
            {
              icon: CellTower,
              title: tr.smsNotifications,
              description: tr.smsNotificationsDesc,
            },
            {
              icon: Ambulance,
              title: tr.emergencyAssistFeature,
              description: tr.emergencyAssistDesc,
            },
            {
              icon: Buildings,
              title: tr.multipleHospitals,
              description: tr.multipleHospitalsDesc,
            },
            {
              icon: Shield,
              title: tr.securePrivate,
              description: tr.securePrivateDesc,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className={`group p-8 rounded-3xl transition-all duration-300 border ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-[#2D4B32]/60' : 'bg-white border-gray-200 hover:border-[#2D4B32]'}`}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#E7EDDF] border border-[#2D4B32]/30">
                <feature.icon size={28} className="text-[#2D4B32]" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
              <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );

  // How It Works Section
  const HowItWorksSection = () => (
    <section className={`py-24 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {tr.howItWorks}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {tr.howItWorksSubtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', icon: Hospital, title: tr.step1Title, description: tr.step1Desc },
            { step: '02', icon: Stethoscope, title: tr.step2Title, description: tr.step2Desc },
            { step: '03', icon: Ticket, title: tr.step3Title, description: tr.step3Desc },
            { step: '04', icon: Bell, title: tr.step4Title, description: tr.step4Desc },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {index < 3 && (
                <div className={`hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 ${darkMode ? 'bg-gradient-to-r from-[#2D4B32] to-transparent' : 'bg-gradient-to-r from-[#2D4B32] to-transparent'}`} />
              )}
              
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-3xl shadow-lg shadow-[#2D4B32]/20 mb-6">
                <item.icon size={40} className="text-white" />
                <span className={`absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center text-sm font-bold ${darkMode ? 'bg-gray-800 text-[#2D4B32]' : 'bg-white text-[#2D4B32]'}`}>
                  {item.step}
                </span>
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // CTA Section
  const CTASection = () => (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-background rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-background rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {tr.readyToSkip}
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            {tr.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('hospitals')}
              className="px-8 py-4 bg-[#2D4B32] text-white rounded-2xl font-semibold text-lg transition-all"
            >
              {tr.bookYourTokenNow}
            </button>
            <button
              onClick={() => navigateTo('emergency')}
              className="px-8 py-4 bg-background text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-400/40 transition-all flex items-center justify-center gap-2"
            >
              <Ambulance size={20} />
              {tr.emergencyAssist}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Footer
  const Footer = () => (
    <footer className="relative bg-background text-gray-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#2D4B32]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#2D4B32]/5 rounded-full blur-3xl" />
      </div>

      {/* Top gradient line */}
      <div className="h-1 bg-gradient-to-r from-[#2D4B32] via-[#2D4B32] to-[#2D4B32]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D4B32]/20">
                <Heart weight="fill" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">Hakim</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {tr.footerDesc}
            </p>
            <div className="flex gap-3">
              <button onClick={() => navigateTo('contact')} className="w-10 h-10 bg-background border border-gray-300/60 rounded-xl flex items-center justify-center hover:border-[#2D4B32] transition-all group">
                <ChatCircle size={18} className="text-gray-600 group-hover:text-[#2D4B32] transition" />
              </button>
              <a href="tel:+251911000000" className="w-10 h-10 bg-background border border-gray-300/60 rounded-xl flex items-center justify-center hover:border-[#2D4B32] transition-all group">
                <Phone size={18} className="text-gray-600 group-hover:text-[#2D4B32] transition" />
              </a>
              <a href="mailto:support@hakim.et" className="w-10 h-10 bg-background border border-gray-300/60 rounded-xl flex items-center justify-center hover:border-[#2D4B32] transition-all group">
                <EnvelopeSimple size={18} className="text-gray-600 group-hover:text-[#2D4B32] transition" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D4B32] rounded-full"></span>
              {tr.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li><button onClick={() => navigateTo('hospitals')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.bookQueue}</button></li>
              <li><button onClick={() => navigateTo('emergency')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.emergencyAssist}</button></li>
              <li><button onClick={() => navigateTo('features')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.features}</button></li>
              <li><button onClick={() => navigateTo('about')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.about}</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D4B32] rounded-full"></span>
              {tr.support}
            </h4>
            <ul className="space-y-3">
              <li><button onClick={() => navigateTo('contact')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.contactUs}</button></li>
              <li><button onClick={() => navigateTo('faq')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.faq}</button></li>
              <li><button onClick={() => navigateTo('privacy')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.privacyPolicy}</button></li>
              <li><button onClick={() => navigateTo('terms')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{tr.termsOfService}</button></li>
              <li><button onClick={() => navigateTo('admin-login')} className="text-gray-600 hover:text-[#2D4B32] transition text-sm mt-2">{tr.hospitalAdminPortal} →</button></li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D4B32] rounded-full"></span>
              {tr.emergencyContact}
            </h4>
            <div className="space-y-4">
              {/* Local Ambulance for Region */}
              <div className="p-3 bg-[#2D4B32]/10 border border-[#2D4B32]/20 rounded-xl">
                <p className="text-xs text-[#2D4B32] mb-2">{tr.localAmbulance} ({selectedRegion})</p>
                <a href={`tel:${getAmbulanceInfo().primaryNumber}`} className="group flex items-center gap-3 hover:bg-[#2D4B32]/10 rounded-lg transition -mx-1 px-1 py-1">
                  <div className="w-10 h-10 bg-[#2D4B32]/10 rounded-lg flex items-center justify-center group-hover:bg-[#2D4B32]/10 transition">
                    <Ambulance size={20} className="text-[#2D4B32]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D4B32]">{getAmbulanceInfo().primaryNumber}</p>
                    <p className="text-xs text-gray-500">{getAmbulanceInfo().primaryName}</p>
                  </div>
                </a>
                {getAmbulanceInfo().secondaryNumber && (
                  <a href={`tel:${getAmbulanceInfo().secondaryNumber}`} className="group flex items-center gap-3 hover:bg-[#2D4B32]/10 rounded-lg transition -mx-1 px-1 py-1 mt-2">
                    <div className="w-8 h-8 bg-[#2D4B32]/10 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-[#2D4B32]/70" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D4B32]/80 text-sm">{getAmbulanceInfo().secondaryNumber}</p>
                      <p className="text-xs text-gray-600">{getAmbulanceInfo().secondaryName}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* National Emergency */}
              <a href="tel:911" className="group flex items-center gap-3 p-3 bg-[#2D4B32]/10 border border-[#2D4B32]/20 rounded-xl hover:bg-[#2D4B32]/10 transition">
                <div className="w-10 h-10 bg-[#2D4B32]/10 rounded-lg flex items-center justify-center group-hover:bg-[#2D4B32]/10 transition">
                  <Phone size={20} className="text-[#2D4B32]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D4B32]">911</p>
                  <p className="text-xs text-gray-600">{tr.nationalEmergency}</p>
                </div>
              </a>
              <p className="text-xs text-gray-600 leading-relaxed">
                {tr.emergencyDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="py-8 border-y border-gray-400/60 grid grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">1,600+</p>
            <p className="text-gray-600 text-sm">Facilities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">8,000+</p>
            <p className="text-gray-600 text-sm">{tr.departments}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">13</p>
            <p className="text-gray-600 text-sm">{tr.regions}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-2">
            © 2026 Hakim Health. {tr.madeWith} 
            <Heart size={14} weight="fill" className="text-red-500" /> 
            {tr.forEthiopia} 
            <span className="text-lg">🇪🇹</span>
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full text-gray-700 text-sm border border-gray-300/60">
            <Shield size={14} className="text-[#2D4B32]" />
            <span>{tr.hipaaCompliant}</span>
          </div>
        </div>
      </div>
    </footer>
  );

  // ===============================
  // PAGE VIEWS
  // ===============================

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen">
      <Navigation transparent />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );

  // Features Page
  const FeaturesPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      {/* Hero */}
      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.featuresPageTitle}
              <span className="bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                {' '}{tr.featuresPageTitleHighlight}
              </span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.featuresPageDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className={`py-24 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {/* Token System */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                <Ticket size={16} weight="fill" />
                {tr.queueManagement}
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {tr.digitalTokenTitle}
              </h2>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tr.digitalTokenPageDesc}
              </p>
              <ul className="space-y-4">
                {[
                  tr.instantToken,
                  tr.estimatedWaitCalc,
                  tr.realTimePosition,
                  tr.multipleDepts,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#2D4B32]" weight="fill" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gradient-to-br from-[#2D4B32]/30 to-[#2D4B32]/30' : 'bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]'}`}>
              <div className={`rounded-2xl shadow-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <div className="text-center mb-6">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.tokenNumber}</p>
                  <p className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>#042</p>
                </div>
                <div className="space-y-3">
                  <div className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-background'}`}>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{tr.position}</span>
                    <span className="font-bold text-[#2D4B32]">{tr.fifthInLine}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-background'}`}>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{tr.estWaitShort}</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>~25 min</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SMS Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className={`order-2 lg:order-1 rounded-3xl p-8 ${darkMode ? 'bg-gradient-to-br from-[#2D4B32]/30 to-[#2D4B32]/30' : 'bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]'}`}>
              <div className="space-y-4">
                {[
                  { title: tr.tokenConfirmed, message: tr.tokenConfirmedMsg },
                  { title: tr.tenPatientsAhead, message: tr.tenPatientsAheadMsg },
                  { title: tr.itsYourTurn, message: tr.itsYourTurnMsg },
                ].map((sms, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-xl shadow-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                        <CellTower size={20} className="text-[#2D4B32]" />
                      </div>
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sms.title}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{sms.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                <CellTower size={16} weight="fill" />
                {tr.smsSystem}
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {tr.smsNotificationsTitle}
              </h2>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tr.smsNotificationsPageDesc}
              </p>
              <ul className="space-y-4">
                {[
                  tr.worksOnBasicPhones,
                  tr.noAppRequired,
                  tr.automatedReminders,
                  tr.emergencyAlerts,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#2D4B32]" weight="fill" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Emergency Triage */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'}`}>
                <Ambulance size={16} weight="fill" />
                {tr.emergencySupport}
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {tr.emergencyTriageTitle}
              </h2>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tr.emergencyTriageDesc}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { level: tr.critical, color: 'bg-red-500', desc: tr.criticalDesc },
                  { level: tr.high, color: 'bg-[#2D4B32]', desc: tr.highDesc },
                  { level: tr.medium, color: 'bg-yellow-500', desc: tr.mediumDesc },
                  { level: tr.low, color: 'bg-green-500', desc: tr.lowDesc },
                ].map((severity, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                    <div className={`w-3 h-3 ${severity.color} rounded-full`} />
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{severity.level}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{severity.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <Warning size={20} className="text-red-600 flex-shrink-0" />
                  <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                    {tr.emergencyWarning}
                  </p>
                </div>
              </div>
            </div>
            <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gradient-to-br from-red-900/20 to-[#2D4B32]/20' : 'bg-gradient-to-br from-red-50 to-[#2D4B32]'}`}>
              <div className={`rounded-2xl shadow-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.describeSymptoms}</h4>
                <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-background'}`}>
                  <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tr.describeSymptomsExample}
                  </p>
                </div>
                <div className={`rounded-xl p-4 ${darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{tr.highSeverity}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                    {tr.highSeverityMsg}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      {/* Hero */}
      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.aboutTitle}
              <span className="bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                {' '}Hakim
              </span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.aboutSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className={`py-24 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {tr.ourMission}
              </h2>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tr.missionPara1}
              </p>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tr.missionPara2}
              </p>
              <div className={`flex items-center gap-4 p-4 rounded-xl ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                <HandHeart size={32} className="text-[#2D4B32]" />
                <p className={`font-medium ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
                  {tr.missionBelief}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gradient-to-br from-[#2D4B32]/30 to-[#2D4B32]/30' : 'bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]'}`}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, value: '120M+', label: tr.populationServed },
                    { icon: Buildings, value: '1,600+', label: 'Facilities' },
                    { icon: Clock, value: '2-4 hrs', label: tr.avgWaitReduced },
                    { icon: MapPin, value: '13', label: tr.regions },
                  ].map((stat, i) => (
                    <div key={i} className={`rounded-2xl p-6 text-center shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                      <stat.icon size={28} className="text-[#2D4B32] mx-auto mb-3" />
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ethiopian Context */}
      <section className={`py-24 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.builtForEthiopia}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.builtForEthiopiaDesc}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CellTower,
                title: tr.smsFirstDesign,
                description: tr.smsFirstDesignDesc,
              },
              {
                icon: Brain,
                title: tr.lowBandwidth,
                description: tr.lowBandwidthDesc,
              },
              {
                icon: MapPin,
                title: tr.regionalCoverage,
                description: tr.regionalCoverageDesc,
              },
              {
                icon: Shield,
                title: tr.offlineSupport,
                description: tr.offlineSupportDesc,
              },
              {
                icon: Clock,
                title: tr.availability247,
                description: tr.availability247Desc,
              },
              {
                icon: Heart,
                title: tr.ethiopianMade,
                description: tr.ethiopianMadeDesc,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-background'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                  <item.icon size={28} className="text-[#2D4B32]" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );

  // Contact Page
  const ContactPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.contactTitle}
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.contactSubtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.sendMessage}</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.nameLabel}</label>
                    <input
                      type="text"
                      placeholder={tr.namePlaceholder}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.phoneLabel}</label>
                    <input
                      type="tel"
                      placeholder="09XXXXXXXXX"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.emailLabel}</label>
                  <input
                    type="email"
                    placeholder={tr.emailPlaceholder}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.subjectLabel}</label>
                  <select className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}>
                    <option>{tr.generalInquiry}</option>
                    <option>{tr.technicalSupport}</option>
                    <option>{tr.hospitalPartnership}</option>
                    <option>{tr.feedback}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.messageLabel}</label>
                  <textarea
                    rows={4}
                    placeholder={tr.messagePlaceholder}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all flex items-center justify-center gap-2"
                >
                  <PaperPlaneTilt size={20} />
                  {tr.sendButton}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.getInTouch}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                      <MapPin size={24} className="text-[#2D4B32]" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.location}</h3>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{tr.locationValue}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                      <Phone size={24} className="text-[#2D4B32]" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.phoneLabel}</h3>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>+251 911 000 000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                      <EnvelopeSimple size={24} className="text-[#2D4B32]" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.emailAddress}</h3>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{tr.emailValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-3xl p-8 ${darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Ambulance size={24} className="text-red-600" />
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-800'}`}>{tr.medicalEmergency}</h3>
                </div>
                <p className={`mb-4 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                  {tr.emergencyDesc}
                </p>
                
                {/* Local Ambulance */}
                <div className="mb-4 p-4 bg-background rounded-xl">
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
                    {tr.localAmbulance} ({selectedRegion})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${getAmbulanceInfo().primaryNumber}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
                    >
                      <Ambulance size={18} />
                      {getAmbulanceInfo().primaryNumber}
                    </a>
                    {getAmbulanceInfo().secondaryNumber && (
                      <a
                        href={`tel:${getAmbulanceInfo().secondaryNumber}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
                      >
                        <Phone size={18} />
                        {getAmbulanceInfo().secondaryNumber}
                      </a>
                    )}
                  </div>
                </div>

                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  <Phone size={20} />
                  {tr.call911}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );

  // FAQ Page
  const FAQPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.faqTitle}
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.faqSubtitle}
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              { q: tr.faqQ1, a: tr.faqA1 },
              { q: tr.faqQ2, a: tr.faqA2 },
              { q: tr.faqQ3, a: tr.faqA3 },
              { q: tr.faqQ4, a: tr.faqA4 },
              { q: tr.faqQ5, a: tr.faqA5 },
              { q: tr.faqQ6, a: tr.faqA6 },
              { q: tr.faqQ7, a: tr.faqA7 },
              { q: tr.faqQ8, a: tr.faqA8 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}
              >
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
                  {item.q}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {tr.contactUs}?{' '}
              <button onClick={() => navigateTo('contact')} className="text-[#2D4B32] hover:underline font-medium">
                {tr.contactUs}
              </button>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );

  // Privacy Policy Page
  const PrivacyPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.privacyTitle}
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.privacySubtitle}
            </p>
          </motion.div>

          <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {tr.privacyIntro}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.privacyCollectTitle}
            </h2>
            <ul className={`space-y-3 mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyCollect1}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyCollect2}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyCollect3}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyCollect4}</span></li>
            </ul>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.privacyUseTitle}
            </h2>
            <ul className={`space-y-3 mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyUse1}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyUse2}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyUse3}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.privacyUse4}</span></li>
            </ul>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.privacySecurityTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.privacySecurity}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.privacyShareTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.privacyShare}
            </p>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
              <p className={darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}>
                {tr.privacyContact}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );

  // Terms of Service Page
  const TermsPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.termsTitle}
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.termsSubtitle}
            </p>
          </motion.div>

          <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {tr.termsIntro}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.termsServiceTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.termsService}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.termsUserTitle}
            </h2>
            <ul className={`space-y-3 mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser1}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser2}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser3}</span></li>
              <li className="flex items-start gap-3"><CheckCircle size={20} className="text-[#2D4B32] flex-shrink-0 mt-1" /><span>{tr.termsUser4}</span></li>
            </ul>

            <div className={`p-4 rounded-xl mb-8 ${darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-bold mb-2 ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                {tr.termsDisclaimerTitle}
              </h3>
              <p className={darkMode ? 'text-red-400' : 'text-red-700'}>
                {tr.termsDisclaimer}
              </p>
            </div>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.termsLimitationTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.termsLimitation}
            </p>

            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
              {tr.termsChangesTitle}
            </h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.termsChanges}
            </p>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
              <p className={darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}>
                {tr.termsContact}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );

  // Auth Page
  const AuthPage = () => (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg">
              <Heart weight="fill" className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
              Hakim
            </span>
          </button>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {otpSent ? tr.verifyOTP : tr.signIn}
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {otpSent 
              ? `${tr.weSentCode} ${phone}` 
              : tr.signInPhone
            }
          </p>
        </div>

        {/* Form */}
        <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
          {!otpSent ? (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.phoneNumberLabel}</label>
                <div className="relative">
                  <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="tel"
                    placeholder="09XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition text-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.nameOptionalLabel}</label>
                <div className="relative">
                  <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder={tr.yourNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition text-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                  />
                </div>
              </div>
              <button
                onClick={() => sendOtp(name ? 'REGISTRATION' : 'LOGIN')}
                disabled={loading || !phone}
                className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <ArrowClockwise className="animate-spin" size={20} />
                ) : (
                  <>
                    {tr.continue}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.enterOTPLabel}</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`w-full text-center text-3xl tracking-widest py-4 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition font-mono ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <ArrowClockwise className="animate-spin" size={20} />
                ) : (
                  <>
                    {tr.verifySignInBtn}
                    <Check size={20} />
                  </>
                )}
              </button>
              <button
                onClick={() => setOtpSent(false)}
                className={`w-full py-3 transition flex items-center justify-center gap-2 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
              >
                <ArrowCounterClockwise size={16} />
                {tr.changePhone}
              </button>
            </div>
          )}

          <div className={`mt-6 pt-6 border-t text-center ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {tr.byContinuing}{' '}
              <a href="#" className="text-[#2D4B32] hover:underline">{tr.termsOfService}</a>
              {' '}and{' '}
              <a href="#" className="text-[#2D4B32] hover:underline">{tr.privacyPolicy}</a>
            </p>
          </div>
        </div>

        {/* Register as Hospital Link */}
        <div className={`mt-4 p-4 rounded-2xl border ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-[#2D4B32]/10 border-[#2D4B32]'}`}>
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Want to register your hospital?{' '}
            <button onClick={() => navigateTo('hospital-register')} className="text-[#2D4B32] hover:underline font-medium">
              {tr.registerAsHospital}
            </button>
          </p>
        </div>

        {/* Back to home */}
        <button
          onClick={() => navigateTo('landing')}
          className={`w-full mt-4 py-3 transition flex items-center justify-center gap-2 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
        >
          <ArrowLeft size={16} />
          {tr.backToHome}
        </button>
      </motion.div>
    </div>
  );

  // Hospitals Page
  const HospitalsPage = () => {
    // Filter hospitals based on search, region, and facility type
    const filteredHospitals = hospitals.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === 'All Regions' || hospital.region === regionFilter;
      const matchesFacilityType = facilityTypeFilter === 'ALL' || hospital.facilityType === facilityTypeFilter;
      return matchesSearch && matchesRegion && matchesFacilityType;
    });

    // Get facility type badge color
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
        <Navigation />
        
        <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => navigateTo('landing')}
                className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Healthcare Facilities
              </h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Choose a hospital, clinic, or health center to book your queue token
              </p>
              {loading ? (
                <div className={`mt-4 inline-flex items-center gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <ArrowClockwise size={16} className="animate-spin" />
                  <span>Loading facilities...</span>
                </div>
              ) : (
                <div className={`mt-4 flex flex-wrap gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                    {hospitals.length} total facilities
                  </span>
                  <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                    {hospitals.filter(h => h.facilityType === 'HOSPITAL').length} Hospitals
                  </span>
                  <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                    {hospitals.filter(h => h.facilityType === 'CLINIC').length} Clinics
                  </span>
                  <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                    {hospitals.filter(h => h.facilityType === 'HEALTH_CENTER').length} Health Centers
                  </span>
                  <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                    {hospitals.filter(h => h.facilityType === 'PHARMACY').length} Pharmacies
                  </span>
                  <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                    {hospitals.filter(h => h.facilityType === 'LABORATORY').length} Laboratories
                  </span>
                </div>
              )}
            </motion.div>

            {/* Search & Filter */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlass size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search hospitals, clinics, health centers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`}
                  />
                </div>
                <select 
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
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
                    className={`p-3 ${viewMode === 'grid' ? (darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]') : (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400')}`}
                  >
                    <GridFour size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? (darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]') : (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400')}`}
                  >
                    <List size={20} />
                  </button>
                </div>
                <button
                  onClick={() => navigateTo('map')}
                  className="flex items-center gap-2 px-4 py-3 bg-[#2D4B32] text-white rounded-xl hover:bg-[#2D4B32] transition"
                >
                  <MapPin size={20} />
                  <span className="hidden sm:inline">Map View</span>
                </button>
              </div>
              
              {/* Facility Type Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'ALL', label: 'All Types', icon: Buildings },
                  { value: 'HOSPITAL', label: 'Hospitals', icon: Hospital },
                  { value: 'HEALTH_CENTER', label: 'Health Centers', icon: FirstAid },
                  { value: 'CLINIC', label: 'Clinics', icon: Stethoscope },
                  { value: 'PHARMACY', label: 'Pharmacies', icon: Heart },
                  { value: 'LABORATORY', label: 'Laboratories', icon: Brain },
                  { value: 'HEALTH_POST', label: 'Health Posts', icon: Heart },
                  { value: 'SPECIALIZED_CENTER', label: 'Specialized', icon: Brain },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFacilityTypeFilter(type.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      facilityTypeFilter === type.value
                        ? darkMode 
                          ? 'bg-[#2D4B32]/10 text-[#2D4B32] border border-[#2D4B32]/50' 
                          : 'bg-[#2D4B32] text-[#2D4B32] border border-[#2D4B32]'
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
              <Spinner />
            ) : (
              <>
                <p className={`mb-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Showing {filteredHospitals.length} of {hospitals.length} facilities
                </p>
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredHospitals.map((hospital, index) => {
                    const badge = getFacilityBadge(hospital.facilityType);
                    const deptCount = hospital.departments?.length || 0;
                    
                    return (
                      <motion.button
                        key={hospital.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.02, 0.5) }}
                        onClick={() => {
                          setSelectedHospital(hospital);
                          loadDepartments(hospital.id);
                          navigateTo('departments');
                        }}
                        className={`rounded-2xl border transition-all text-left group overflow-hidden ${
                          darkMode ? 'bg-gray-900 border-gray-800 hover:border-[#2D4B32]/60' : 'bg-white border-gray-200 hover:border-[#2D4B32]'
                        } ${viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center gap-4'}`}
                      >
                        {viewMode === 'grid' ? (
                          <>
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${darkMode ? 'bg-gradient-to-br from-[#2D4B32]/50 to-[#2D4B32]/50' : 'bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]'}`}>
                                <Hospital size={28} className="text-[#2D4B32]" />
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
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gradient-to-br from-[#2D4B32]/50 to-[#2D4B32]/50' : 'bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]'}`}>
                              <Hospital size={24} className="text-[#2D4B32]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-bold group-hover:text-[#2D4B32] transition truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {hospital.name}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${darkMode ? badge.darkColor : badge.color}`}>
                                  {badge.label}
                                </span>
                              </div>
                              <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <MapPin size={14} />
                                <span>{hospital.region}</span>
                                <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                                <span>{deptCount} departments</span>
                              </div>
                            </div>
                            <CaretRight size={20} className={`group-hover:text-[#2D4B32] transition ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  };

  // Map Page - Interactive Hospital Map
  const MapPage = () => {
    const [mapSearchTerm, setMapSearchTerm] = useState('');
    const [mapSelectedRegion, setMapSelectedRegion] = useState<string>('');
    const [regions, setRegions] = useState<{name: string; count: number}[]>([]);
    const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [mapMounted, setMapMounted] = useState(false);
    const [MapComponent, setMapComponent] = useState<React.ComponentType<{
      hospitals: Hospital[];
      selectedHospital: Hospital | null;
      onHospitalSelect: (hospital: Hospital) => void;
      userLocation?: {lat: number; lng: number} | null;
    }> | null>(null);

    // Load regions from local hospital data (avoids missing API route)
    useEffect(() => {
      const regionCounts = new Map<string, number>();
      hospitals.forEach((hospital) => {
        if (!hospital.region) return;
        regionCounts.set(
          hospital.region,
          (regionCounts.get(hospital.region) ?? 0) + 1
        );
      });
      const regionList = Array.from(regionCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setRegions(regionList);
    }, [hospitals]);

    const requestUserLocation = useCallback(() => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported on this device.');
        return;
      }
      setLocationLoading(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        () => {
          setLocationError('Unable to access your location.');
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }, []);

    // Dynamically load map component
    useEffect(() => {
      setMapMounted(true);
      import('@/components/map/HospitalMap').then((mod) => {
        setMapComponent(() => mod.default);
      });
    }, []);

    // Filter hospitals
    const filteredHospitals = hospitals.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(mapSearchTerm.toLowerCase()) ||
                            h.address?.toLowerCase().includes(mapSearchTerm.toLowerCase());
      const matchesRegion = !mapSelectedRegion || h.region === mapSelectedRegion;
      return matchesSearch && matchesRegion;
    });
    const MAX_MAP_MARKERS = 400;
    const visibleHospitals =
      filteredHospitals.length > MAX_MAP_MARKERS
        ? filteredHospitals.slice(0, MAX_MAP_MARKERS)
        : filteredHospitals;

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <section className="pt-8 pb-4 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => navigateTo('hospitals')}
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
                  <div className="flex items-center gap-2 text-sm text-[#2D4B32] bg-[#2D4B32] px-4 py-2 rounded-lg">
                    <MapPin size={16} />
                    <span>Location detected</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search Controls */}
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
                {regions.map(r => (
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
              <div className="mt-3 text-sm text-[#2D4B32] bg-[#2D4B32] border border-[#2D4B32] rounded-lg px-3 py-2">
                {locationError}
              </div>
            )}
            {filteredHospitals.length > MAX_MAP_MARKERS && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#2D4B32] bg-[#2D4B32] border border-[#2D4B32] rounded-lg px-3 py-2">
                <Warning size={16} />
                <span>
                  Showing the first {MAX_MAP_MARKERS} facilities. Use search or region to narrow results.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Map Container */}
        <section className="h-[calc(100vh-300px)] min-h-[500px] relative">
          {!mapMounted || !MapComponent ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4B32] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading interactive map...</p>
              </div>
            </div>
          ) : hospitals.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]">
              <div className="text-center">
                <Hospital size={48} className="text-gray-400 mx-auto mb-4" />
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
                navigateTo('departments');
              }}
              userLocation={userLocation}
            />
          )}
        </section>

        {/* Hospital Quick List */}
        <section className="py-6 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''} Found
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredHospitals.slice(0, 8).map(hospital => (
                <button
                  key={hospital.id}
                  onClick={() => {
                    setSelectedHospital(hospital);
                    loadDepartments(hospital.id);
                    navigateTo('departments');
                  }}
                  className="p-3 bg-gray-50 rounded-lg text-left hover:bg-[#2D4B32] hover:ring-2 hover:ring-[#2D4B32] transition group"
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

        <Footer />
      </div>
    );
  };

  // Departments Page
  const DepartmentsPage = () => {
    // Get facility type badge
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

    const facilityBadge = getFacilityBadge(selectedHospital?.facilityType);
    
    // Generate Google Maps URL for directions
    const getDirectionsUrl = () => {
      if (selectedHospital?.latitude && selectedHospital?.longitude) {
        return `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}`;
      }
      // Fallback to address-based search
      const address = encodeURIComponent(selectedHospital?.address || selectedHospital?.name || '');
      return `https://www.google.com/maps/search/?api=1&query=${address}`;
    };

    // Generate embedded map URL
    const getEmbedMapUrl = () => {
      if (selectedHospital?.latitude && selectedHospital?.longitude) {
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedHospital.latitude},${selectedHospital.longitude}&zoom=15`;
      }
      const address = encodeURIComponent(selectedHospital?.address || selectedHospital?.name || 'Adama, Ethiopia');
      return `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${address}&zoom=15`;
    };

    // Open in Google Maps
    const openInGoogleMaps = () => {
      window.open(getDirectionsUrl(), '_blank');
    };

    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <Navigation />
        
        <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => navigateTo('hospitals')}
                className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
              >
                <ArrowLeft size={20} />
                Back to Hospitals
              </button>
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2D4B32]/20 flex-shrink-0">
                    <Hospital size={32} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedHospital?.name}
                      </h1>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? facilityBadge.darkColor : facilityBadge.color}`}>
                        {facilityBadge.label}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin size={16} />
                      <span>{selectedHospital?.address}</span>
                    </div>
                    {selectedHospital?.emergencyContactNumber && (
                      <div className={`flex items-center gap-2 mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Phone size={16} />
                        <a href={`tel:${selectedHospital.emergencyContactNumber}`} className="text-[#2D4B32] hover:underline">
                          {selectedHospital.emergencyContactNumber}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Directions Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={openInGoogleMaps}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all"
                >
                  <NavigationArrow size={20} />
                  Get Directions
                </motion.button>
              </div>

              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6"
              >
                <div className={`rounded-2xl overflow-hidden shadow-lg border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="relative h-[300px] sm:h-[350px]">
                    <iframe
                      src={getEmbedMapUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                    {/* Overlay with directions hint */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                      <div className={`px-4 py-2 rounded-xl shadow-lg pointer-events-auto ${darkMode ? 'bg-gray-900/90' : 'bg-background'} backdrop-blur-sm`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          📍 {selectedHospital?.name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Click "Get Directions" to navigate
                        </p>
                      </div>
                      <button
                        onClick={openInGoogleMaps}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg pointer-events-auto transition-all ${
                          darkMode 
                            ? 'bg-[#2D4B32] hover:bg-[#2D4B32] text-white' 
                            : 'bg-[#2D4B32] hover:bg-[#2D4B32] text-white'
                        }`}
                      >
                        <NavigationArrow size={16} />
                        <span className="text-sm font-medium">Navigate</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <h2 className={`text-xl font-semibold mt-8 mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Department</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Choose a department to book your queue token</p>
            </motion.div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <Spinner />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept: Record<string, unknown>, index) => (
                  <motion.button
                    key={dept.id as string}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedDepartment(dept as unknown as Department);
                      navigateTo('booking');
                    }}
                    className={`rounded-2xl shadow-lg hover:shadow-xl p-6 text-left group transition-all ${darkMode ? 'bg-gray-900' : 'bg-background'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                        <Stethoscope size={24} className="text-[#2D4B32]" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                        {(dept.waitingCount as number) || 0} waiting
                      </span>
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-1 group-hover:text-[#2D4B32] transition ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dept.name as string}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {dept.description as string || 'Medical consultations and treatment'}
                    </p>
                    
                    <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex items-center gap-1">
                          <Timer size={14} />
                          <span>~{dept.averageServiceTimeMin as number}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{dept.dailyCapacity as number}/day</span>
                        </div>
                      </div>
                      <CaretRight size={20} className={`group-hover:text-[#2D4B32] transition ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  };

  // Booking Page
  const BookingPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className="pt-8 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigateTo('departments')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              <ArrowLeft size={20} />
              Back to Departments
            </button>

            {/* Hospital & Department Info */}
            <div className="bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-3xl p-6 text-white mb-6 shadow-xl shadow-[#2D4B32]/20">
              <div className="flex items-center gap-3 mb-4">
                <Hospital size={24} />
                <span className="font-medium">{selectedHospital?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Stethoscope size={24} />
                <span className="text-xl font-bold">{selectedDepartment?.name}</span>
              </div>
            </div>

            {/* Queue Info */}
            <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Current Queue Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <Users size={24} className="text-[#2D4B32] mx-auto mb-2" />
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {departments.find(d => d.id === selectedDepartment?.id)?.currentQueueCount || 0}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>In Queue</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <Timer size={24} className="text-[#2D4B32] mx-auto mb-2" />
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatWaitTime((departments.find(d => d.id === selectedDepartment?.id)?.currentQueueCount || 0) * 15)}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Est. Wait</p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Complete Your Booking</h3>
              
              {!isAuthenticated && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number *</label>
                    <div className="relative">
                      <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="tel"
                        placeholder="09XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Name</label>
                    <div className="relative">
                      <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes (optional)</label>
                <textarea
                  placeholder="Any notes for the medical staff..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                />
              </div>

              <button
                onClick={bookAppointment}
                disabled={loading || (!isAuthenticated && !phone)}
                className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <ArrowClockwise className="animate-spin" size={20} />
                ) : (
                  <>
                    <Ticket size={20} weight="fill" />
                    Get My Token
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Token Page
  const TokenPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className="pt-8 pb-8">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Token Card */}
            <div className="bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-3xl p-8 text-white text-center shadow-2xl shadow-[#2D4B32]/20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-2xl mb-4">
                <Ticket size={32} weight="fill" />
              </div>
              <p className="text-[#2D4B32] text-sm mb-1">Your Token Number</p>
              <p className="text-6xl font-bold mb-4">
                #{currentAppointment?.tokenNumber || queueStatus?.lastTokenIssued}
              </p>
              <p className="text-[#2D4B32]">{selectedDepartment?.name || queueStatus?.departmentName}</p>
            </div>

            {/* Status Card */}
            <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
              <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentAppointment?.status || 'WAITING')}`}>
                  {getStatusLabel(currentAppointment?.status || 'WAITING')}
                </span>
              </div>
              <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Queue Position</span>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{queueStatus?.queuePosition || 0}</span>
              </div>
              <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Estimated Wait</span>
                <span className="text-xl font-bold text-[#2D4B32]">
                  {formatWaitTime(queueStatus?.estimatedWaitMinutes || 0)}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Currently Serving</span>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>#{queueStatus?.currentToken || 0}</span>
              </div>
            </div>

            {/* Hospital Info */}
            <div className={`rounded-2xl shadow-lg p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                  <Hospital size={20} className="text-[#2D4B32]" />
                </div>
                <div>
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedHospital?.name}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedHospital?.address}</p>
                  {selectedHospital?.emergencyContactNumber && (
                    <a
                      href={`tel:${selectedHospital.emergencyContactNumber}`}
                      className="inline-flex items-center gap-1 mt-2 text-sm text-[#2D4B32]"
                    >
                      <Phone size={14} />
                      {selectedHospital.emergencyContactNumber}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Info */}
            <div className={`rounded-2xl p-4 ${darkMode ? 'bg-[#2D4B32]/10 border border-[#2D4B32]/50' : 'bg-[#2D4B32] border border-[#2D4B32]'}`}>
              <div className="flex items-start gap-3">
                <Bell size={20} className={`flex-shrink-0 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>SMS Notifications Active</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-[#2D4B32]' : 'text-[#2D4B32]'}`}>
                    You'll receive an SMS when you're next in line and when it's your turn.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentAppointment(null);
                setQueueStatus(null);
                navigateTo('landing');
              }}
              className={`w-full py-3 border rounded-xl transition flex items-center justify-center gap-2 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Emergency Page
  const EmergencyPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className="pt-8 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigateTo('landing')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                <Ambulance size={24} className="text-red-600" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Assist</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Get triage guidance for your symptoms</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className={`rounded-2xl p-4 mb-6 ${darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start gap-3">
                <Warning size={24} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className={`font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>IMPORTANT DISCLAIMER</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                    This system does NOT replace emergency services. If this is a life-threatening 
                    emergency, call <strong>911</strong> immediately or proceed to the nearest emergency room.
                  </p>
                </div>
              </div>
            </div>

            {!triageResult ? (
              <>
                {/* Symptom Input */}
                <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                  <label className={`block font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Describe Your Symptoms</label>
                  <textarea
                    placeholder="Please describe your symptoms in detail. For example: 'I have severe chest pain and difficulty breathing for the past 30 minutes'"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                  />
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Be as specific as possible for better triage assessment.
                  </p>
                </div>

                {/* Contact Info for Guests */}
                {!isAuthenticated && (
                  <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="09XXXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hospital Selection */}
                <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                  <label className={`block font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nearest Hospital (Optional)</label>
                  <select
                    value={selectedHospital?.id || ''}
                    onChange={(e) => {
                      const hospital = hospitals.find(h => h.id === e.target.value);
                      setSelectedHospital(hospital || null);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
                  >
                    <option value="">Select hospital (optional)</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={reportEmergency}
                  disabled={loading || symptoms.length < 10}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <ArrowClockwise className="animate-spin" size={20} />
                  ) : (
                    <>
                      <FirstAid size={20} />
                      Get Triage Assessment
                    </>
                  )}
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Severity Result */}
                <div className={`rounded-2xl p-6 ${getSeverityColor(triageResult.severityLevel)}`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-2xl mb-4">
                      {triageResult.isEmergency ? (
                        <Warning size={32} weight="fill" />
                      ) : (
                        <FirstAid size={32} weight="fill" />
                      )}
                    </div>
                    <p className="text-sm opacity-80">Severity Level</p>
                    <p className="text-3xl font-bold">{getSeverityLabel(triageResult.severityLevel)}</p>
                    <p className="text-sm opacity-80 mt-1">
                      Confidence: {Math.round(triageResult.confidence * 100)}%
                    </p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recommendation</h3>
                  <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{triageResult.recommendation}</p>
                  {triageResult.keywords.length > 0 && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Identified keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {triageResult.keywords.map((keyword, i) => (
                          <span key={i} className={`px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Emergency Actions */}
                {triageResult.isEmergency && (
                  <a
                    href="tel:911"
                    className="block w-full py-4 bg-red-600 text-white rounded-xl font-semibold text-lg text-center hover:bg-red-700 transition"
                  >
                    <Phone size={20} className="inline mr-2" />
                    Call Emergency Services (911)
                  </a>
                )}

                <button
                  onClick={() => {
                    setTriageResult(null);
                    setSymptoms('');
                  }}
                  className={`w-full py-3 border rounded-xl transition flex items-center justify-center gap-2 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <ArrowCounterClockwise size={16} />
                  Report Another Symptom
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Admin Dashboard
  const AdminDashboardPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage hospital queues and view analytics</p>
              </div>
              <button
                onClick={loadAdminQueue}
                disabled={loading}
                className={`px-4 py-2 border rounded-xl transition flex items-center gap-2 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <ArrowClockwise size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {/* Hospital Selector */}
            <div className={`rounded-2xl shadow-lg p-4 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
              <select
                value={selectedHospital?.id || ''}
                onChange={(e) => {
                  const hospital = hospitals.find(h => h.id === e.target.value);
                  setSelectedHospital(hospital || null);
                  if (hospital) loadAdminQueue();
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              >
                <option value="">Select a hospital</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            {adminStats && (
              <>
                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Today</span>
                      <Users size={20} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {(adminStats as Record<string, unknown>).summary?.totalPatientsToday as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Waiting</span>
                      <Timer size={20} className="text-[#2D4B32]" />
                    </div>
                    <p className="text-3xl font-bold text-[#2D4B32]">
                      {(adminStats as Record<string, unknown>).summary?.totalWaiting as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Served</span>
                      <CheckCircle size={20} className="text-[#2D4B32]" />
                    </div>
                    <p className="text-3xl font-bold text-[#2D4B32]">
                      {(adminStats as Record<string, unknown>).summary?.totalServed as number || 0}
                    </p>
                  </div>
                  <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Avg Wait</span>
                      <Clock size={20} className="text-[#2D4B32]" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {(adminStats as Record<string, unknown>).summary?.averageWaitTime as number || 0} min
                    </p>
                  </div>
                </div>

                {/* Department Stats */}
                <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                  <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Department Queue Status</h3>
                  <div className="space-y-3">
                    {((adminStats as Record<string, unknown>).departmentStats as unknown[])?.map((dept: unknown) => (
                      <div
                        key={(dept as Record<string, unknown>).departmentId as string}
                        className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-background'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                            <Stethoscope size={20} className="text-[#2D4B32]" />
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {(dept as Record<string, unknown>).departmentName as string}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Token #{(dept as Record<string, unknown>).currentToken as number} serving
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-[#2D4B32]">{(dept as Record<string, unknown>).totalWaiting as number}</p>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>waiting</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-[#2D4B32]">{(dept as Record<string, unknown>).totalServed as number}</p>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>served</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedDepartment(departments.find(d => d.id === (dept as Record<string, unknown>).departmentId) || null);
                              navigateTo('admin-queue');
                            }}
                            className={`px-4 py-2 rounded-lg transition font-medium ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10' : 'bg-[#2D4B32] text-[#2D4B32] hover:bg-[#2D4B32]'}`}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Admin Queue Management
  const AdminQueuePage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className="pt-8 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigateTo('admin-dashboard')}
              className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>

            <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Queue Management</h1>

            {/* Department Selector */}
            <div className={`rounded-2xl shadow-lg p-4 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
              <select
                value={selectedDepartment?.id || ''}
                onChange={(e) => {
                  const dept = departments.find(d => d.id === e.target.value);
                  setSelectedDepartment(dept as unknown as Department || null);
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              >
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {selectedDepartment && (
              <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                <div className="text-center mb-6">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Currently Serving</p>
                  <p className={`text-5xl font-bold my-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    #{departments.find(d => d.id === selectedDepartment.id)?.currentQueueCount || 0}
                  </p>
                </div>
                <button
                  onClick={callNextPatient}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <ArrowClockwise className="animate-spin" size={20} />
                  ) : (
                    <>
                      <ArrowRight size={20} />
                      Call Next Patient
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                <ArrowClockwise size={24} className="text-[#2D4B32] mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skip Patient</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                <FirstAid size={24} className="text-red-500 mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Insert</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                <Check size={24} className="text-[#2D4B32] mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mark Complete</p>
              </button>
              <button className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition text-center ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
                <Clock size={24} className="text-[#2D4B32] mx-auto mb-2" />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>View History</p>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Profile Page
  const ProfilePage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
      <Navigation />
      
      <section className="pt-8 pb-8">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-3xl p-8 text-white text-center shadow-xl shadow-[#2D4B32]/20">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} />
              </div>
              <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
              <p className="text-[#2D4B32]">{formatPhoneDisplay(user?.phone || '')}</p>
              <span className="inline-block mt-4 px-4 py-1 bg-background rounded-full text-sm">
                {user?.role === 'HOSPITAL_ADMIN' ? 'Hospital Admin' : 'Patient'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
              <button
                onClick={async () => {
                  const res = await api.get('/api/queue/my-tokens?status=WAITING', token || undefined);
                  if (res.success && res.data.length > 0) {
                    setCurrentAppointment(res.data[0]);
                    navigateTo('token');
                  } else {
                    alert('No active appointments found');
                  }
                }}
                className={`w-full p-4 flex items-center gap-4 transition border-b ${darkMode ? 'hover:bg-gray-800 border-gray-800' : 'hover:bg-gray-50 border-gray-100'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                  <Ticket size={20} className="text-[#2D4B32]" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Active Token</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>View your current queue position</p>
                </div>
                <CaretRight size={20} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
              </button>

              <button className={`w-full p-4 flex items-center gap-4 transition border-b ${darkMode ? 'hover:bg-gray-800 border-gray-800' : 'hover:bg-gray-50 border-gray-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                  <Clock size={20} className="text-[#2D4B32]" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Appointment History</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>View past appointments</p>
                </div>
                <CaretRight size={20} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
              </button>

              <button className={`w-full p-4 flex items-center gap-4 transition ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                  <Bell size={20} className="text-[#2D4B32]" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage notification settings</p>
                </div>
                <CaretRight size={20} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
              </button>
            </div>

            {/* Sign Out */}
            <button
              onClick={() => { logout(); navigateTo('landing'); }}
              className={`w-full py-4 border rounded-xl font-medium transition flex items-center justify-center gap-2 ${darkMode ? 'border-red-800 text-red-400 hover:bg-red-900/30' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
            >
              <SignOut size={20} />
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Hospital Registration Page - using stable render to prevent input focus issues
  const renderHospitalRegistrationPage = useCallback(() => {
    const services = [
      { id: 'emergency', label: tr.emergencyServices },
      { id: 'outpatient', label: tr.outpatientServices },
      { id: 'inpatient', label: tr.inpatientServices },
      { id: 'laboratory', label: tr.laboratoryServices },
      { id: 'radiology', label: tr.radiologyServices },
      { id: 'pharmacy', label: tr.pharmacyServices },
      { id: 'maternal', label: tr.maternalHealth },
      { id: 'pediatric', label: tr.pediatricCare },
      { id: 'surgical', label: tr.surgicalServices },
    ];

    const handleServiceToggle = (serviceId: string) => {
      setRegistrationData(prev => ({
        ...prev,
        services: prev.services.includes(serviceId)
          ? prev.services.filter(s => s !== serviceId)
          : [...prev.services, serviceId]
      }));
    };

    const handleRegister = async () => {
      if (registrationData.adminPassword !== registrationData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (registrationData.adminPassword.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }
      if (!registrationData.agreeToTerms) {
        alert('Please agree to the terms and conditions');
        return;
      }
      
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(tr.registrationSuccess);
        navigateTo('auth');
        setRegistrationStep(1);
      }, 1500);
    };

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg">
                <Heart weight="fill" className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                Hakim
              </span>
            </button>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tr.registerHospital}
            </h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {tr.registerHospitalDesc}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  registrationStep >= step 
                    ? 'bg-[#2D4B32] text-white' 
                    : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded transition-all ${
                    registrationStep > step ? 'bg-[#2D4B32]' : darkMode ? 'bg-gray-800' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
            {/* Step 1: Hospital Information */}
            {registrationStep === 1 && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tr.hospitalInfo}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.hospitalName} *
                    </label>
                    <div className="relative">
                      <Hospital size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="e.g., Tikur Anbessa General Hospital"
                        value={registrationData.hospitalName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, hospitalName: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.hospitalType} *
                    </label>
                    <select
                      value={registrationData.hospitalType}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, hospitalType: e.target.value as 'GOVERNMENT' | 'PRIVATE' | 'NGO' }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
                    >
                      <option value="">Select type</option>
                      <option value="GOVERNMENT">{tr.government}</option>
                      <option value="PRIVATE">{tr.privateHospital}</option>
                      <option value="NGO">{tr.ngoHospital}</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.region} *
                    </label>
                    <select
                      value={registrationData.region}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, region: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
                    >
                      {Object.keys(REGION_COORDINATES).map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.city} *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Addis Ababa"
                      value={registrationData.city}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, city: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.operatingHoursLabel}
                    </label>
                    <select
                      value={registrationData.operatingHours}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, operatingHours: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
                    >
                      <option value="24/7">{tr.hours247}</option>
                      <option value="business">{tr.hoursBusiness}</option>
                      <option value="extended">{tr.hoursExtended}</option>
                      <option value="custom">{tr.hoursCustom}</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.address}
                    </label>
                    <input
                      type="text"
                      placeholder="Full address"
                      value={registrationData.address}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, address: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.phoneLabel} *
                    </label>
                    <div className="relative">
                      <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="tel"
                        placeholder="011XXXXXXXX"
                        value={registrationData.phone}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.emailAddress}
                    </label>
                    <div className="relative">
                      <EnvelopeSimple size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="email"
                        placeholder="hospital@example.com"
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setRegistrationStep(2)}
                  disabled={!registrationData.hospitalName || !registrationData.hospitalType || !registrationData.region || !registrationData.city || !registrationData.phone}
                  className="w-full py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {tr.continueBtn}
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Step 2: Services */}
            {registrationStep === 2 && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tr.servicesOffered}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceToggle(service.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        registrationData.services.includes(service.id)
                          ? 'border-[#2D4B32] bg-[#2D4B32] dark:bg-[#2D4B32]/10'
                          : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${
                          registrationData.services.includes(service.id)
                            ? 'bg-[#2D4B32] text-white'
                            : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {registrationData.services.includes(service.id) && <Check size={14} />}
                        </div>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {service.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRegistrationStep(1)}
                    className={`flex-1 py-4 border rounded-xl font-semibold transition flex items-center justify-center gap-2 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <ArrowLeft size={20} />
                    {tr.backBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegistrationStep(3)}
                    className="flex-1 py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all flex items-center justify-center gap-2"
                  >
                    {tr.continueBtn}
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Admin Account */}
            {registrationStep === 3 && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tr.adminInfo}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.adminName} *
                    </label>
                    <div className="relative">
                      <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={registrationData.adminName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, adminName: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.adminPhone} *
                    </label>
                    <div className="relative">
                      <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="tel"
                        placeholder="09XXXXXXXXX"
                        value={registrationData.adminPhone}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, adminPhone: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.createPassword} *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        value={registrationData.adminPassword}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, adminPassword: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition pr-12 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{tr.passwordRequirements}</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tr.confirmPassword} *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={registrationData.confirmPassword}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registrationData.agreeToTerms}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                      className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#2D4B32] focus:ring-[#2D4B32]"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {tr.agreeToTerms}
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRegistrationStep(2)}
                    className={`flex-1 py-4 border rounded-xl font-semibold transition flex items-center justify-center gap-2 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <ArrowLeft size={20} />
                    {tr.backBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading || !registrationData.adminName || !registrationData.adminPhone || !registrationData.adminPassword}
                    className="flex-1 py-4 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <ArrowClockwise className="animate-spin" size={20} />
                    ) : (
                      <>
                        {tr.registerBtn}
                        <Check size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className={`mt-6 pt-6 border-t text-center ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {tr.alreadyHaveAccount}{' '}
                <button type="button" onClick={() => navigateTo('auth')} className="text-[#2D4B32] hover:underline font-medium">
                  {tr.signInInstead}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }, [darkMode, language, registrationData, registrationStep, showPassword, loading, tr, REGION_COORDINATES]);

  // Hospital Dashboard Page
  const HospitalDashboardPage = () => {
    // Mock data for demo
    useEffect(() => {
      // Initialize mock data
      setHospitalProfile({
        name: 'Tikur Anbessa General Hospital',
        type: 'GOVERNMENT',
        region: 'Addis Ababa',
        city: 'Addis Ababa',
        address: 'Churchill Road, P.O. Box 1176',
        phone: '0115-515125',
        email: 'info@tikuranbessa.gov.et',
        latitude: 9.0320,
        longitude: 38.7469,
        operatingHours: '24/7',
        services: ['emergency', 'outpatient', 'inpatient', 'laboratory', 'radiology'],
      });
      setDashboardStats({
        todayPatients: 156,
        waiting: 23,
        served: 133,
        avgWaitTime: 32,
      });
      setDashboardQueues([
        { departmentId: '1', departmentName: 'General Medicine', currentToken: 45, waiting: 8, served: 37, status: 'normal' },
        { departmentId: '2', departmentName: 'Pediatrics', currentToken: 23, waiting: 5, served: 18, status: 'normal' },
        { departmentId: '3', departmentName: 'Emergency', currentToken: 67, waiting: 12, served: 55, status: 'busy' },
        { departmentId: '4', departmentName: 'Obstetrics', currentToken: 12, waiting: 3, served: 9, status: 'normal' },
      ]);
    }, []);

    const sidebarItems = [
      { id: 'overview', icon: House, label: tr.overview },
      { id: 'profile', icon: Hospital, label: tr.profile },
      { id: 'location', icon: MapPin, label: tr.location },
      { id: 'queues', icon: Users, label: tr.queues },
      { id: 'departments', icon: Stethoscope, label: tr.departments },
      { id: 'staff', icon: IdentificationCard, label: tr.staff },
      { id: 'analytics', icon: ChartBar, label: tr.analytics },
      { id: 'settings', icon: Gear, label: tr.settings },
    ];

    const renderContent = () => {
      switch (dashboardSection) {
        case 'overview':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] rounded-2xl p-6 text-white shadow-xl">
                <h2 className="text-2xl font-bold mb-2">{tr.welcomeBack}, {user?.name?.split(' ')[0] || 'Admin'}!</h2>
                <p className="text-[#2D4B32]">{tr.manageYourHospital}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.todayPatients}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                      <Users size={20} className="text-[#2D4B32]" />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardStats.todayPatients}</p>
                </div>
                <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.currentlyWaiting}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                      <Timer size={20} className="text-[#2D4B32]" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#2D4B32]">{dashboardStats.waiting}</p>
                </div>
                <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.servedToday}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                      <CheckCircle size={20} className="text-[#2D4B32]" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#2D4B32]">{dashboardStats.served}</p>
                </div>
                <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.averageWaitTime}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                      <Clock size={20} className="text-[#2D4B32]" />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardStats.avgWaitTime}<span className="text-lg font-normal">min</span></p>
                </div>
              </div>

              {/* Queue Status Table */}
              <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.queueStatus}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-700/50' : 'bg-background'}>
                      <tr>
                        <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.departmentName}</th>
                        <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.currentToken}</th>
                        <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.waitingCount}</th>
                        <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.servedCount}</th>
                        <th className={`text-center py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.status}</th>
                        <th className={`text-right py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardQueues.map((queue, index) => (
                        <tr key={queue.departmentId} className={index % 2 === 0 ? '' : darkMode ? 'bg-gray-750/30' : 'bg-background'}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                                <Stethoscope size={16} className="text-[#2D4B32]" />
                              </div>
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{queue.departmentName}</span>
                            </div>
                          </td>
                          <td className={`py-4 px-6 text-center font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>#{queue.currentToken}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              queue.waiting > 10 ? (darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700') :
                              queue.waiting > 5 ? (darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]') :
                              (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700')
                            }`}>
                              {queue.waiting}
                            </span>
                          </td>
                          <td className={`py-4 px-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{queue.served}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              queue.status === 'busy' ? (darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700') : (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700')
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${queue.status === 'busy' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              {queue.status === 'busy' ? tr.busy : tr.normal}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button className="px-4 py-2 bg-[#2D4B32] text-white rounded-lg text-sm font-medium hover:bg-[#2D4B32] transition">
                              {tr.callNext}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.quickActions}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button onClick={() => setDashboardSection('queues')} className={`p-4 rounded-xl transition text-center ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10' : 'bg-[#2D4B32] text-[#2D4B32] hover:bg-[#2D4B32]'}`}>
                    <Users size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{tr.manageQueues}</span>
                  </button>
                  <button className={`p-4 rounded-xl transition text-center ${darkMode ? 'bg-red-900/50 text-red-400 hover:bg-red-900/70' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                    <FirstAid size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{tr.addEmergency}</span>
                  </button>
                  <button className={`p-4 rounded-xl transition text-center ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10' : 'bg-[#2D4B32] text-[#2D4B32] hover:bg-[#2D4B32]'}`}>
                    <Bell size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{tr.broadcastAlert}</span>
                  </button>
                  <button onClick={() => setDashboardSection('analytics')} className={`p-4 rounded-xl transition text-center ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10' : 'bg-[#2D4B32] text-[#2D4B32] hover:bg-[#2D4B32]'}`}>
                    <ChartBar size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{tr.viewReports}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );

        case 'profile':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.editProfile}</h3>
                  <button className="px-4 py-2 bg-[#2D4B32] text-white rounded-lg text-sm font-medium hover:bg-[#2D4B32] transition">
                    {tr.saveChanges}
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.hospitalName}</label>
                    <input
                      type="text"
                      value={hospitalProfile?.name || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.hospitalType}</label>
                    <select
                      value={hospitalProfile?.type || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, type: e.target.value } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    >
                      <option value="GOVERNMENT">{tr.government}</option>
                      <option value="PRIVATE">{tr.privateHospital}</option>
                      <option value="NGO">{tr.ngoHospital}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.region}</label>
                    <input
                      type="text"
                      value={hospitalProfile?.region || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, region: e.target.value } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.city}</label>
                    <input
                      type="text"
                      value={hospitalProfile?.city || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, city: e.target.value } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.address}</label>
                    <input
                      type="text"
                      value={hospitalProfile?.address || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.phoneLabel}</label>
                    <input
                      type="tel"
                      value={hospitalProfile?.phone || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.emailAddress}</label>
                    <input
                      type="email"
                      value={hospitalProfile?.email || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );

        case 'location':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.hospitalLocation}</h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{tr.clickMapToSet}</p>
                
                {/* Map Placeholder */}
                <div className={`w-full h-80 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-background'}`}>
                  <div className="text-center">
                    <MapPin size={48} className={`mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Interactive Map</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Click to set hospital location</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.latitude}</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={hospitalProfile?.latitude || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, latitude: parseFloat(e.target.value) } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.longitude}</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={hospitalProfile?.longitude || ''}
                      onChange={(e) => setHospitalProfile(prev => prev ? { ...prev, longitude: parseFloat(e.target.value) } : null)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                  </div>
                </div>

                <button className="mt-4 w-full py-3 bg-[#2D4B32] text-white rounded-xl font-medium hover:bg-[#2D4B32] transition flex items-center justify-center gap-2">
                  <Crosshair size={20} />
                  {tr.useCurrentLocation}
                </button>
              </div>
            </motion.div>
          );

        case 'queues':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.manageQueues}</h3>
                
                {dashboardQueues.map((queue) => (
                  <div key={queue.departmentId} className={`mb-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-background'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{queue.departmentName}</h4>
                      <span className="text-2xl font-bold text-[#2D4B32]">#{queue.currentToken}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{queue.waiting} {tr.waitingCount}</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{queue.served} {tr.servedCount}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-[#2D4B32] text-white rounded-lg text-sm font-medium hover:bg-[#2D4B32] transition">
                        {tr.callNext}
                      </button>
                      <button className={`py-2 px-4 rounded-lg text-sm font-medium transition ${darkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {tr.viewQueue}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );

        case 'departments':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.departments}</h3>
                <button
                  onClick={() => setShowAddDepartment(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
                >
                  <Plus size={20} />
                  {tr.addDepartment}
                </button>
              </div>

              {showAddDepartment && (
                <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <h4 className={`font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.addDepartment}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.departmentNameLabel}</label>
                      <input
                        type="text"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                        placeholder="e.g., Cardiology"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.departmentDesc}</label>
                      <input
                        type="text"
                        value={newDepartment.description}
                        onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                        placeholder="Brief description"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.dailyCapacity}</label>
                      <input
                        type="number"
                        value={newDepartment.capacity}
                        onChange={(e) => setNewDepartment({ ...newDepartment, capacity: parseInt(e.target.value) })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tr.avgServiceTime}</label>
                      <input
                        type="number"
                        value={newDepartment.avgTime}
                        onChange={(e) => setNewDepartment({ ...newDepartment, avgTime: parseInt(e.target.value) })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setShowAddDepartment(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {tr.cancel}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddDepartment(false);
                        setNewDepartment({ name: '', description: '', capacity: 50, avgTime: 15 });
                      }}
                      className="px-4 py-2 bg-[#2D4B32] text-white rounded-lg font-medium hover:bg-[#2D4B32] transition"
                    >
                      {tr.saveChanges}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardQueues.map((dept) => (
                  <div key={dept.departmentId} className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dept.departmentName}</h4>
                      <div className="flex gap-1">
                        <button className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                          <PencilSimple size={16} />
                        </button>
                      </div>
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <p>Current Token: <span className="font-bold text-[#2D4B32]">#{dept.currentToken}</span></p>
                      <p>{tr.waitingCount}: {dept.waiting}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );

        case 'analytics':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.analytics}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Analytics dashboard coming soon...</p>
              </div>
            </motion.div>
          );

        case 'staff':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.staff}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Staff management coming soon...</p>
              </div>
            </motion.div>
          );

        case 'settings':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.settings}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Settings panel coming soon...</p>
              </div>
            </motion.div>
          );

        default:
          return null;
      }
    };

    return (
      <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        {/* Sidebar */}
        <aside className={`w-64 fixed left-0 top-0 h-full z-40 flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'}`}>
          {/* Logo */}
          <div className="p-6">
            <button onClick={() => navigateTo('landing')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg">
                <Heart weight="fill" className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                Hakim
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setDashboardSection(item.id as DashboardSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                  dashboardSection === item.id
                    ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium' : 'bg-[#2D4B32] text-[#2D4B32] font-medium'
                    : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-full flex items-center justify-center shadow-sm">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'Admin'}</p>
                <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{hospitalProfile?.name}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigateTo('landing'); }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
            >
              <SignOut size={18} />
              {tr.signOut}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 min-h-screen">
          {/* Header */}
          <header className={`sticky top-0 z-30 px-6 py-4 border-b backdrop-blur-sm ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-background border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tr.dashboardTitle}</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{hospitalProfile?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
                </button>
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Globe size={18} />
                  <span className="text-xs font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    );
  };

  // Nearest Hospitals Page
  const NearestHospitalsPage = () => {
    const nearestHospitals = getHospitalsByDistance();
    
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <Navigation />
        
        <section className={`pt-8 pb-8 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-background'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => navigateTo('landing')}
                className={`flex items-center gap-2 transition mb-6 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10' : 'bg-[#2D4B32]'}`}>
                  <Crosshair size={24} className="text-[#2D4B32]" />
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Nearest Hospitals
                  </h1>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Hospitals sorted by distance from your location
                  </p>
                </div>
              </div>

              {/* Location Info */}
              {locationNotice ? (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                  <Info size={16} />
                  <span>{locationNotice}</span>
                </div>
              ) : userLocation && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-[#2D4B32]'}`}>
                  <MapPin size={16} />
                  <span>Location detected</span>
                  <span className="text-[#2D4B32]">
                    ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <Spinner />
            ) : nearestHospitals.length === 0 ? (
              <div className="text-center py-16">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-800' : 'bg-background'}`}>
                  <Hospital size={40} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Hospitals Found</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Unable to find hospitals near your location. Please try searching manually.
                </p>
                <button
                  onClick={() => navigateTo('hospitals')}
                  className="px-6 py-3 bg-[#2D4B32] text-white rounded-xl font-medium hover:bg-[#2D4B32] transition"
                >
                  Browse All Hospitals
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top 3 Nearest - Featured Cards */}
                <div className="mb-8">
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <NavigationArrow size={20} className="text-[#2D4B32]" />
                    Closest to You
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {nearestHospitals.slice(0, 3).map((hospital, index) => (
                      <motion.button
                        key={hospital.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setSelectedHospital(hospital);
                          loadDepartments(hospital.id);
                          navigateTo('departments');
                        }}
                        className="bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-2xl p-6 text-left text-white shadow-xl shadow-[#2D4B32]/20 hover:shadow-2xl hover:shadow-[#2D4B32]/20 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-4 right-4 w-8 h-8 bg-background rounded-full flex items-center justify-center text-lg font-bold">
                          {index + 1}
                        </div>
                        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Hospital size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">{hospital.name}</h3>
                        <div className="flex items-center gap-2 text-[#2D4B32] text-sm mb-3">
                          <MapPin size={14} />
                          <span>{hospital.region}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/20">
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
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  };

  // Admin Login Page
  const AdminLoginPage = () => {
    const [adminPhone, setAdminPhone] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminLoading, setAdminLoading] = useState(false);

    const handleAdminLogin = async () => {
      setAdminLoading(true);
      try {
        // Simulate admin login
        await new Promise(resolve => setTimeout(resolve, 1000));
        login({ id: 'admin', name: 'Hospital Admin', phone: adminPhone, role: 'admin' });
        navigateTo('hospital-dashboard');
      } catch (error) {
        alert('Login failed. Please try again.');
      } finally {
        setAdminLoading(false);
      }
    };

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg">
                <Heart weight="fill" className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                Hakim
              </span>
            </button>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Hospital Admin Login
            </h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to manage your hospital
            </p>
          </div>

          <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="tel"
                    placeholder="09XXXXXXXXX"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
                />
              </div>
              <button
                onClick={handleAdminLogin}
                disabled={adminLoading || !adminPhone || !adminPassword}
                className="w-full py-3 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adminLoading ? (
                  <ArrowClockwise className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            <div className={`mt-6 pt-6 border-t text-center ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Don't have an account?{' '}
                <button onClick={() => navigateTo('hospital-register')} className="text-[#2D4B32] hover:underline font-medium">
                  Register your hospital
                </button>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('landing')}
            className={`w-full mt-6 py-3 transition flex items-center justify-center gap-2 ${darkMode ? 'text-gray-400 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  };

  // Admin Analytics Page
  const AdminAnalyticsPage = () => {
    return (
      <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-background'}`}>
        <p>Admin Analytics Page</p>
      </div>
    );
  };
  // Main Render
  return (
    <div className={`${darkMode ? 'dark bg-gray-950' : ''} min-h-screen transition-colors duration-300`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'landing' && <LandingPage />}
          {view === 'features' && <FeaturesPage />}
          {view === 'about' && <AboutPage />}
          {view === 'contact' && <ContactPage />}
          {view === 'faq' && <FAQPage />}
          {view === 'privacy' && <PrivacyPage />}
          {view === 'terms' && <TermsPage />}
          {view === 'auth' && <AuthPage />}
          {view === 'hospitals' && <HospitalsPage />}
          {view === 'map' && <MapPage />}
          {view === 'nearest-hospitals' && <NearestHospitalsPage />}
          {view === 'departments' && <DepartmentsPage />}
          {view === 'booking' && <BookingPage />}
          {view === 'token' && <TokenPage />}
          {view === 'emergency' && <EmergencyPage />}
          {view === 'admin-login' && <AdminLoginPage />}
          {view === 'admin-dashboard' && <AdminDashboardPage />}
          {view === 'admin-queue' && <AdminQueuePage />}
          {view === 'admin-analytics' && <AdminAnalyticsPage />}
          {view === 'profile' && <ProfilePage />}
          {view === 'hospital-register' && renderHospitalRegistrationPage()}
          {view === 'hospital-dashboard' && <HospitalDashboardPage />}
        </motion.div>
      </AnimatePresence>

      {/* Location Permission Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl shadow-2xl max-w-md w-full p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-background'}`}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#E7EDDF] border border-[#2D4B32]/30">
                <Crosshair size={32} className="text-[#2D4B32]" />
              </div>

              {/* Title */}
              <h3 className={`text-xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Find Nearest Hospital
              </h3>

              {/* Error message if any */}
              {locationError && (
                <div className={`mb-4 p-3 border rounded-xl text-sm flex items-start gap-2 ${darkMode ? 'bg-[#2D4B32]/10 border-[#2D4B32]/50 text-[#2D4B32]' : 'bg-[#2D4B32] border border-[#2D4B32] text-[#2D4B32]'}`}>
                  <Warning size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{locationError}</span>
                </div>
              )}

              {/* Use My Location Button */}
              <button
                onClick={() => requestLocation(false)}
                disabled={locationLoading}
                className="w-full px-4 py-3 bg-[#2D4B32] text-white rounded-xl font-semibold hover:bg-[#2D4B32] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mb-4"
              >
                {locationLoading ? (
                  <>
                    <ArrowClockwise size={20} className="animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <NavigationArrow size={20} />
                    Use My Current Location
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <span className="text-sm text-[#2D4B32]">or select your region</span>
                <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>

              {/* Region Selector */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2D4B32] focus:border-transparent transition cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                >
                  {Object.keys(REGION_COORDINATES).map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Use Selected Region Button */}
              <button
                onClick={useSelectedRegion}
                className="w-full px-4 py-3 bg-[#2D4B32] text-white rounded-xl font-semibold hover:bg-[#2D4B32] transition flex items-center justify-center gap-2 cursor-pointer mb-3"
              >
                <MapPin size={20} />
                Show Hospitals in {selectedRegion}
              </button>

              {/* Use Default Location */}
              <button
                onClick={useDefaultLocation}
                className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition border mb-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-[#2D4B32]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#2D4B32]'}`}
              >
                Use Addis Ababa Instead
              </button>

              {/* Cancel */}
              <button
                onClick={() => {
                  setShowLocationModal(false);
                  setLocationError(null);
                }}
                className={`w-full px-4 py-2 transition text-sm cursor-pointer ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// PlayCircle icon (missing from Phosphor)
function PlayCircle({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}
