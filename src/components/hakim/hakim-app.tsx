'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  initialTheme?: "light" | "dark";
  initialLanguage?: Language;
}

// Main Component
export function HakimApp({ initialView = 'landing', initialTheme = "light", initialLanguage = "en" }: HakimAppProps) {
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

  const [authHydrated, setAuthHydrated] = useState(false);

  useEffect(() => {
    const persist = (useAuthStore as any).persist;
    if (!persist) {
      setAuthHydrated(true);
      return;
    }
    if (persist.hasHydrated?.()) {
      setAuthHydrated(true);
    }
    const unsub = persist.onFinishHydration?.(() => setAuthHydrated(true));
    if (!persist.hasHydrated?.()) {
      persist.rehydrate?.();
    }
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  useEffect(() => {
    if (!authHydrated) return;
    if (!isAuthenticated && view === "dashboard") {
      navigateTo("landing");
    }
  }, [authHydrated, isAuthenticated, view, navigateTo]);

  useEffect(() => {
    if (!authHydrated) return;
    if (!isAuthenticated && view === "booking") {
      navigateTo("auth");
    }
  }, [authHydrated, isAuthenticated, view, navigateTo]);

  useEffect(() => {
    if (!authHydrated) return;
    if (!isAuthenticated && view === "assistant") {
      navigateTo("auth");
    }
  }, [authHydrated, isAuthenticated, view, navigateTo]);

  useEffect(() => {
    if (!authHydrated) return;
    if (isAuthenticated && view === "landing") {
      if (user?.role === "SUPER_ADMIN") {
        navigateTo("admin-dashboard");
      } else if (user?.role === "HOSPITAL_ADMIN") {
        navigateTo("hospital-dashboard");
      } else {
        navigateTo("dashboard");
      }
    }
  }, [authHydrated, isAuthenticated, view, navigateTo, user?.role]);

  useEffect(() => {
    if (!authHydrated) return;
    if (!isAuthenticated || !token) {
      setCurrentAppointment(null);
      setQueueStatus(null);
      return;
    }

    let cancelled = false;
    api.get("/api/patient/active-token", token).then((res) => {
      if (cancelled) return;
      if (res?.success) {
        setCurrentAppointment(res.appointment || null);
        setQueueStatus(res.queueStatus || null);
      }
    }).catch((err) => {
      console.error("Failed to load active token:", err);
    });

    return () => {
      cancelled = true;
    };
  }, [authHydrated, isAuthenticated, token]);
  
  // Dark mode state (use server-provided preference to avoid mismatch)
  const [darkMode, setDarkMode] = useState(initialTheme === "dark");
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);
  
  // Language state (use server-provided preference to avoid mismatch)
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // Persist UI preferences
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("hakim_theme", darkMode ? "dark" : "light");
    document.cookie = `hakim_theme=${darkMode ? "dark" : "light"}; path=/; max-age=31536000`;
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("hakim_lang", language);
    document.cookie = `hakim_lang=${language}; path=/; max-age=31536000`;
  }, [language]);
  
  // Toggle language
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'am' : 'en');
  }, []);
  
  // Get current translation
  const tr = translations[language];
  
  // Data states
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    if (view === "departments" && !selectedHospital) {
      if (typeof window !== "undefined") {
        const storedHospital = sessionStorage.getItem("hakim_selected_hospital");
        if (storedHospital) return;
      }
      navigateTo("hospitals");
    }
  }, [view, selectedHospital, navigateTo]);
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Admin states
  const [adminStats, setAdminStats] = useState<unknown>(null);
  const { viewMode, setViewMode, facilityTypeFilter, setFacilityTypeFilter, searchTerm, setSearchTerm, regionFilter, setRegionFilter } = useListFilters();
  const { page, setPage, pageSize, setPageSize } = usePagination();

  // Location states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city?: string } | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (userLocation) {
      localStorage.setItem("hakim_user_location", JSON.stringify(userLocation));
      return;
    }
    const stored = localStorage.getItem("hakim_user_location");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed?.lat === "number" && typeof parsed?.lng === "number") {
          setUserLocation(parsed);
        }
      } catch {
        // ignore invalid
      }
    }
  }, [userLocation]);

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
    dashboardAppointments,
    setDashboardAppointments,
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
  const lastDepartmentsHospitalId = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedHospital?.id) {
      sessionStorage.setItem("hakim_selected_hospital", JSON.stringify(selectedHospital));
    }
  }, [selectedHospital?.id]);

  useEffect(() => {
    if (view !== "departments" || selectedHospital) return;
    if (typeof window === "undefined") return;
    const storedHospital = sessionStorage.getItem("hakim_selected_hospital");
    if (!storedHospital) return;
    try {
      const parsed = JSON.parse(storedHospital) as Hospital;
      if (parsed?.id) {
        setSelectedHospital(parsed);
        loadDepartments(parsed.id);
      }
    } catch {
      // ignore invalid storage
    }
  }, [view, selectedHospital, hospitals, loadDepartments]);

  useEffect(() => {
    if (view !== "departments") return;
    if (!selectedHospital?.id) return;
    if (lastDepartmentsHospitalId.current === selectedHospital.id && departments.length > 0) return;
    lastDepartmentsHospitalId.current = selectedHospital.id;
    loadDepartments(selectedHospital.id);
  }, [view, selectedHospital?.id, departments.length, loadDepartments]);

  const { nearestHospitals, nearestLoading, nearestError } = useNearestHospitals({ userLocation });

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
    searchCustomLocation,
    setLocationError,
  } = useLocationPicker({
    regionCoordinates: REGION_COORDINATES,
    defaultLocation: DEFAULT_LOCATION,
    onNavigate: navigateTo,
    setUserLocation,
  });

  useEffect(() => {
    if (view === "nearest-hospitals" && !userLocation) {
      // Don't auto-open the location modal; user can trigger it manually.
      return;
    }
  }, [userLocation, view]);

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

  const loginWithPassword = async (payload: { phone?: string; email?: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", payload);
      if (res?.success) {
        login(res.user, res.token);
        if (res.user?.role === "SUPER_ADMIN") {
          navigateTo("admin-dashboard");
        } else if (res.user?.role === "HOSPITAL_ADMIN") {
          navigateTo("hospital-dashboard");
        } else {
          navigateTo("dashboard");
        }
        setPassword("");
        setEmail("");
        setOtpSent(false);
        setOtp("");
      } else {
        alert(res?.error || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

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
        download: tr.download,
        about: tr.about,
        contact: tr.contact,
        signIn: tr.signIn,
        bookQueue: tr.bookQueue,
        dashboard: tr.dashboard,
        hospitals: tr.hospitals,
        appointments: tr.appointments,
        notifications: tr.notifications,
        emergencyAssist: tr.emergencyAssist,
        aiDoctor: tr.aiDoctor,
      }}
    />
  );

  const AppFooter = () => (
    <Footer
      t={tr}
      darkMode={darkMode}
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
    onChangeLocation: () => setShowLocationModal(true),
    locationLoading,
    t: tr,
    selectedRegion,
    getAmbulanceInfo,
    loading,
    otpSent,
    phone,
    setPhone,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    otp,
    setOtp,
    setOtpSent,
    sendOtp,
    verifyOtp,
    loginWithPassword,
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
    apiPost: api.post,
    apiPost: api.post,
    setCurrentAppointment,
    userLocation,
    locationNotice,
    nearestHospitals,
    nearestLoading,
    nearestError,
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
    token,
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
    apiGet: api.get,
    apiPost: api.post,
  });

  const hospitalProps = useHospitalViewProps({
    view,
    darkMode,
    language,
    t: tr,
    user,
    token,
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
    dashboardAppointments,
    setDashboardAppointments,
    showAddDepartment,
    setShowAddDepartment,
    newDepartment,
    setNewDepartment,
    apiGet: api.get,
    apiPost: api.post,
  });

  if (!authHydrated) {
    return (
      <div
        className={`${darkMode ? 'dark bg-background' : ''} min-h-screen transition-colors duration-300`}
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      className={`${darkMode ? 'dark bg-background' : ''} min-h-screen transition-colors duration-300`}
      suppressHydrationWarning
    >
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
        onSearchLocation={searchCustomLocation}
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
