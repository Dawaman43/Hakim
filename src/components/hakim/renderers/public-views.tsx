"use client";

import type { PublicViewProps } from "./types";
import { CTASection } from "../sections/CTASection";
import { LandingPage } from "../views/LandingPage";
import { HospitalsPage } from "../views/HospitalsPage";
import { MapPage } from "../views/MapPage";
import { DepartmentsPage } from "../views/DepartmentsPage";
import { BookingPage } from "../views/BookingPage";
import { TokenPage } from "../views/TokenPage";
import { FeaturesPage } from "../views/FeaturesPage";
import { AboutPage } from "../views/AboutPage";
import { AuthPage } from "../views/AuthPage";
import { EmergencyPage } from "../views/EmergencyPage";
import { ContactPage } from "../views/ContactPage";
import { FAQPage } from "../views/FAQPage";
import { PrivacyPage } from "../views/PrivacyPage";
import { TermsPage } from "../views/TermsPage";
import { ProfilePage } from "../views/ProfilePage";
import { NearestHospitalsPage } from "../views/NearestHospitalsPage";
import { getSeverityColor, getSeverityLabel } from "@/lib/queue-utils";

export function PublicViews(props: PublicViewProps) {
  const {
    view,
    darkMode,
    language,
    user,
    token,
    isAuthenticated,
    mobileMenuOpen,
    setMobileMenuOpen,
    onNavigate,
    onToggleLanguage,
    onToggleDarkMode,
    onLogout,
    onFindNearest,
    locationLoading,
    t,
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
    selectedHospital,
    setSelectedHospital,
    loadDepartments,
    departments,
    selectedDepartment,
    setSelectedDepartment,
    notes,
    setNotes,
    onBook,
    currentAppointment,
    queueStatus,
    symptoms,
    setSymptoms,
    triageResult,
    setTriageResult,
    reportEmergency,
    apiGet,
    setCurrentAppointment,
    userLocation,
    locationNotice,
    getHospitalsByDistance,
    navigation,
    footer,
  } = props;

  if (view === "landing") {
    return (
      <LandingPage
        darkMode={darkMode}
        language={language}
        view={view}
        user={user}
        isAuthenticated={isAuthenticated}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavigate={onNavigate}
        onToggleLanguage={onToggleLanguage}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
        onFindNearest={onFindNearest}
        locationLoading={locationLoading}
        t={t}
        selectedRegion={selectedRegion}
        getAmbulanceInfo={getAmbulanceInfo}
      />
    );
  }

  if (view === "features") {
    return <FeaturesPage darkMode={darkMode} t={t} navigation={navigation} footer={footer} cta={<CTASection t={t} onNavigate={onNavigate} />} />;
  }

  if (view === "about") {
    return <AboutPage darkMode={darkMode} t={t} navigation={navigation} footer={footer} cta={<CTASection t={t} onNavigate={onNavigate} />} />;
  }

  if (view === "contact") {
    return <ContactPage darkMode={darkMode} t={t} navigation={navigation} footer={footer} selectedRegion={selectedRegion} getAmbulanceInfo={getAmbulanceInfo} />;
  }

  if (view === "faq") {
    return <FAQPage darkMode={darkMode} t={t} navigation={navigation} footer={footer} onNavigate={onNavigate} />;
  }

  if (view === "privacy") {
    return <PrivacyPage darkMode={darkMode} t={t} navigation={navigation} footer={footer} />;
  }

  if (view === "terms") {
    return <TermsPage darkMode={darkMode} t={t} navigation={navigation} footer={footer} />;
  }

  if (view === "auth") {
    return (
      <AuthPage
        darkMode={darkMode}
        loading={loading}
        otpSent={otpSent}
        phone={phone}
        setPhone={setPhone}
        name={name}
        setName={setName}
        otp={otp}
        setOtp={setOtp}
        setOtpSent={setOtpSent}
        sendOtp={sendOtp}
        verifyOtp={verifyOtp}
        onNavigate={onNavigate}
        t={t}
      />
    );
  }

  if (view === "hospitals") {
    return (
      <HospitalsPage
        darkMode={darkMode}
        loading={loading}
        hospitals={hospitals}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        facilityTypeFilter={facilityTypeFilter}
        setFacilityTypeFilter={setFacilityTypeFilter}
        onNavigate={onNavigate}
        onSelectHospital={setSelectedHospital}
        onLoadDepartments={loadDepartments}
        navigation={navigation}
        footer={footer}
        t={t}
      />
    );
  }

  if (view === "map") {
    return (
      <MapPage
        darkMode={darkMode}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        setSelectedHospital={setSelectedHospital}
        loadDepartments={loadDepartments}
        onNavigate={onNavigate}
        navigation={navigation}
        footer={footer}
      />
    );
  }

  if (view === "nearest-hospitals") {
    return (
      <NearestHospitalsPage
        darkMode={darkMode}
        loading={loading}
        locationNotice={locationNotice}
        userLocation={userLocation}
        getHospitalsByDistance={getHospitalsByDistance}
        onNavigate={onNavigate}
        onSelectHospital={setSelectedHospital}
        onLoadDepartments={loadDepartments}
        navigation={navigation}
        footer={footer}
      />
    );
  }

  if (view === "departments") {
    return (
      <DepartmentsPage
        darkMode={darkMode}
        loading={loading}
        selectedHospital={selectedHospital}
        departments={departments}
        onNavigate={onNavigate}
        onSelectDepartment={setSelectedDepartment}
        navigation={navigation}
        footer={footer}
        t={t}
      />
    );
  }

  if (view === "booking") {
    return (
      <BookingPage
        darkMode={darkMode}
        loading={loading}
        selectedHospital={selectedHospital}
        selectedDepartment={selectedDepartment}
        phone={phone}
        setPhone={setPhone}
        name={name}
        setName={setName}
        notes={notes}
        setNotes={setNotes}
        isAuthenticated={isAuthenticated}
        onBook={onBook}
        onNavigate={onNavigate}
        navigation={navigation}
        footer={footer}
        t={t}
      />
    );
  }

  if (view === "token") {
    return (
      <TokenPage
        darkMode={darkMode}
        currentAppointment={currentAppointment}
        queueStatus={queueStatus}
        onNavigate={onNavigate}
        navigation={navigation}
        footer={footer}
        t={t}
      />
    );
  }

  if (view === "emergency") {
    return (
      <EmergencyPage
        darkMode={darkMode}
        loading={loading}
        isAuthenticated={isAuthenticated}
        symptoms={symptoms}
        setSymptoms={setSymptoms}
        phone={phone}
        setPhone={setPhone}
        name={name}
        setName={setName}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        setSelectedHospital={setSelectedHospital}
        triageResult={triageResult}
        setTriageResult={setTriageResult}
        reportEmergency={reportEmergency}
        getSeverityColor={getSeverityColor}
        getSeverityLabel={getSeverityLabel}
        onNavigate={onNavigate}
        navigation={navigation}
        footer={footer}
      />
    );
  }

  if (view === "profile") {
    return (
      <ProfilePage
        darkMode={darkMode}
        user={user}
        token={token}
        apiGet={apiGet}
        setCurrentAppointment={setCurrentAppointment}
        onNavigate={onNavigate}
        onLogout={onLogout}
        navigation={navigation}
      />
    );
  }

  return null;
}
