'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import type { Hospital, Department, Appointment, QueueStatusResponse, TriageResult } from '@/types';
import { api } from './api';
import { fadeIn, slideIn, staggerContainer } from './animations';
import { getViewFromPath, viewRoutes, type ViewType } from './routes';
import { translations, type Language } from './translations';
import { Navigation } from './sections/Navigation';
import { Footer } from './sections/Footer';
import { LocationPermissionModal } from './sections/LocationPermissionModal';
import { HakimViewRenderer } from './HakimViewRenderer';
import { usePublicViewProps } from './hooks/use-public-view-props';
import { useAdminViewProps } from './hooks/use-admin-view-props';
import { useHospitalViewProps } from './hooks/use-hospital-view-props';
import { HakimViewProvider } from './context/hakim-view-context';
import { useLocationPicker } from './hooks/use-location-picker';
import { useHospitalsData } from './hooks/use-hospitals-data';
import { useNearestHospitals } from './hooks/use-nearest-hospitals';
import { useAuthOtp } from './hooks/use-auth-otp';
import { useBooking } from './hooks/use-booking';
import { useEmergencyTriage } from './hooks/use-emergency-triage';
import { useAdminQueue } from './hooks/use-admin-queue';
import { useQueueStatusPolling } from './hooks/use-queue-status-polling';
import { useListFilters } from './hooks/use-list-filters';
import { useHospitalRegistration } from './hooks/use-hospital-registration';
import { useHospitalDashboard } from './hooks/use-hospital-dashboard';
import { usePagination } from './hooks/use-pagination';
import { DEFAULT_LOCATION, REGION_AMBULANCE_DATA, REGION_COORDINATES } from './constants/regions';

interface HakimAppProps {
  initialView?: ViewType;
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
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
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
  const { viewMode, setViewMode, facilityTypeFilter, setFacilityTypeFilter, searchTerm, setSearchTerm, regionFilter, setRegionFilter } = useListFilters();
  const { page, setPage, pageSize, setPageSize } = usePagination();

  // Location states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { registrationStep, setRegistrationStep, showPassword, setShowPassword, registrationData, setRegistrationData } = useHospitalRegistration();

  const {
    dashboardSection,
    setDashboardSection,
    hospitalProfile,
    setHospitalProfile,
    dashboardStats,
    setDashboardStats,
    dashboardQueues,
    setDashboardQueues,
    showAddDepartment,
    setShowAddDepartment,
    newDepartment,
    setNewDepartment,
  } = useHospitalDashboard();

  const { hospitals, departments, totalHospitals, facilityCounts, totalDepartments, totalRegions, loadDepartments } = useHospitalsData({
    setLoading,
    page,
    pageSize,
    regionFilter,
    facilityTypeFilter,
    searchTerm,
  });

  const { getHospitalsByDistance } = useNearestHospitals({ hospitals, userLocation });

  const {
    showLocationModal,
    setShowLocationModal,
    locationNotice,
    locationError,
    locationLoading,
    selectedRegion,
    setSelectedRegion,
    getUserLocation,
    requestLocation,
    useSelectedRegion,
    useDefaultLocation,
    setLocationError,
  } = useLocationPicker({
    regionCoordinates: REGION_COORDINATES,
    defaultLocation: DEFAULT_LOCATION,
    onNavigate: navigateTo,
    setUserLocation,
  });

  // Get ambulance info based on selected region or user location
  const getAmbulanceInfo = useCallback(() => {
    // First try selected region
    if (selectedRegion && REGION_AMBULANCE_DATA[selectedRegion]) {
      return REGION_AMBULANCE_DATA[selectedRegion];
    }
    // Default to Addis Ababa
    return REGION_AMBULANCE_DATA['Addis Ababa'];
  }, [selectedRegion]);


  const { sendOtp, verifyOtp } = useAuthOtp({
    api,
    phone,
    otp,
    name,
    login,
    navigateTo,
    setPhone,
    setOtp,
    setOtpSent,
    setLoading,
  });

  const { bookAppointment } = useBooking({
    api,
    token,
    notes,
    isAuthenticated,
    phone,
    name,
    selectedHospital,
    selectedDepartment,
    setCurrentAppointment,
    setQueueStatus,
    navigateTo,
    setLoading,
  });

  const { reportEmergency } = useEmergencyTriage({
    api,
    token,
    symptoms,
    selectedHospitalId: selectedHospital?.id,
    phone,
    userPhone: user?.phone,
    name,
    setTriageResult,
    setLoading,
  });

  const { loadAdminQueue, callNextPatient } = useAdminQueue({
    api,
    token,
    selectedHospital,
    selectedDepartment,
    setAdminStats,
    setLoading,
  });

  useQueueStatusPolling({
    api,
    view,
    currentAppointment,
    setQueueStatus,
  });

  // Admin: Load data on view change
  useEffect(() => {
    if (view === 'admin-dashboard' && selectedHospital) {
      loadAdminQueue();
    }
  }, [view, selectedHospital, loadAdminQueue]);

  const AppNavigation = ({ transparent = false }: { transparent?: boolean }) => (
    <Navigation
      transparent={transparent}
      darkMode={darkMode}
      language={language}
      view={view}
      user={user}
      isAuthenticated={isAuthenticated}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      onNavigate={navigateTo}
      onToggleLanguage={toggleLanguage}
      onToggleDarkMode={toggleDarkMode}
      onLogout={logout}
      t={{
        home: tr.home,
        features: tr.features,
        about: tr.about,
        contact: tr.contact,
        signIn: tr.signIn,
        bookQueue: tr.bookQueue,
        dashboard: tr.dashboard,
      }}
    />
  );

  const AppFooter = () => (
    <Footer
      t={tr}
      selectedRegion={selectedRegion}
      getAmbulanceInfo={getAmbulanceInfo}
      onNavigate={navigateTo}
      stats={{
        facilities: totalHospitals,
        departments: totalDepartments,
        regions: totalRegions,
      }}
    />
  );

  // ===============================
  // PAGE VIEWS
  // ===============================

  // Main Render
  const publicProps = usePublicViewProps({
    view,
    darkMode,
    language,
    user,
    token,
    isAuthenticated,
    mobileMenuOpen,
    setMobileMenuOpen,
    onNavigate: navigateTo,
    onToggleLanguage: toggleLanguage,
    onToggleDarkMode: toggleDarkMode,
    onLogout: logout,
    onLogin: login,
    onFindNearest: getUserLocation,
    locationLoading,
    t: tr,
    selectedRegion,
    getAmbulanceInfo,
    loading,
    otpSent,
    phone,
    setPhone,
    name,
    setName,
    otp,
    setOtp,
    setOtpSent,
    sendOtp,
    verifyOtp,
    hospitals,
    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    regionFilter,
    setRegionFilter,
    facilityTypeFilter,
    setFacilityTypeFilter,
    facilityCounts,
    totalDepartments,
    totalRegions,
    totalHospitals,
    page,
    pageSize,
    setPage,
    setPageSize,
    selectedHospital,
    setSelectedHospital,
    loadDepartments,
    departments,
    selectedDepartment,
    setSelectedDepartment,
    notes,
    setNotes,
    onBook: bookAppointment,
    currentAppointment,
    queueStatus,
    symptoms,
    setSymptoms,
    triageResult,
    setTriageResult,
    reportEmergency,
    apiGet: api.get,
    setCurrentAppointment,
    userLocation,
    locationNotice,
    getHospitalsByDistance,
    navigation: <AppNavigation />,
    footer: <AppFooter />,
    adminStats,
    loadAdminQueue,
    callNextPatient,
    registrationStep,
    setRegistrationStep,
    showPassword,
    setShowPassword,
    registrationData,
    setRegistrationData,
    setLoading,
    regionOptions: Object.keys(REGION_COORDINATES),
    dashboardSection,
    setDashboardSection,
    hospitalProfile,
    setHospitalProfile,
    dashboardStats,
    setDashboardStats,
    dashboardQueues,
    setDashboardQueues,
    showAddDepartment,
    setShowAddDepartment,
    newDepartment,
    setNewDepartment,
  });

  const adminProps = useAdminViewProps({
    view,
    darkMode,
    loading,
    hospitals,
    departments,
    selectedHospital,
    setSelectedHospital,
    selectedDepartment,
    setSelectedDepartment,
    loadAdminQueue,
    adminStats,
    callNextPatient,
    onNavigate: navigateTo,
    onLogin: login,
    navigation: <AppNavigation />,
  });

  const hospitalProps = useHospitalViewProps({
    view,
    darkMode,
    language,
    t: tr,
    user,
    onNavigate: navigateTo,
    onLogout: logout,
    onToggleLanguage: toggleLanguage,
    onToggleDarkMode: toggleDarkMode,
    registrationStep,
    setRegistrationStep,
    showPassword,
    setShowPassword,
    registrationData,
    setRegistrationData,
    loading,
    setLoading,
    regionOptions: Object.keys(REGION_COORDINATES),
    dashboardSection,
    setDashboardSection,
    hospitalProfile,
    setHospitalProfile,
    dashboardStats,
    setDashboardStats,
    dashboardQueues,
    setDashboardQueues,
    showAddDepartment,
    setShowAddDepartment,
    newDepartment,
    setNewDepartment,
  });

  return (
    <div className={`${darkMode ? 'dark bg-gray-950' : ''} min-h-screen transition-colors duration-300`}>
      <HakimViewProvider value={{ publicProps, adminProps, hospitalProps }}>
        <HakimViewRenderer />
      </HakimViewProvider>

      <LocationPermissionModal
        open={showLocationModal}
        darkMode={darkMode}
        locationError={locationError}
        locationLoading={locationLoading}
        selectedRegion={selectedRegion}
        regionOptions={Object.keys(REGION_COORDINATES)}
        onRequestLocation={() => requestLocation(false)}
        onSelectRegion={setSelectedRegion}
        onUseSelectedRegion={useSelectedRegion}
        onUseDefaultLocation={useDefaultLocation}
        onClose={() => {
          setShowLocationModal(false);
          setLocationError(null);
        }}
      />
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
