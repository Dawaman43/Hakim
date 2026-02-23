"use client";

import type { ViewType } from "../routes";
import type { HospitalViewProps } from "./types";
import type { ViewType } from "../routes";
import { HospitalRegistrationPage } from "../views/HospitalRegistrationPage";
import { HospitalDashboardPage } from "../views/HospitalDashboardPage";

export function HospitalViews(props: HospitalViewProps) {
  const {
    view,
    darkMode,
    language,
    t,
    user,
    token,
    onNavigate,
    onLogout,
    onToggleLanguage,
    onToggleDarkMode,
    registrationStep,
    setRegistrationStep,
    showPassword,
    setShowPassword,
    registrationData,
    setRegistrationData,
    loading,
    setLoading,
    regionOptions,
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
    apiGet,
    apiPost,
  } = props;

  if (view === "hospital-register") {
    return (
      <HospitalRegistrationPage
        darkMode={darkMode}
        registrationStep={registrationStep}
        setRegistrationStep={setRegistrationStep}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        registrationData={registrationData}
        setRegistrationData={setRegistrationData}
        loading={loading}
        setLoading={setLoading}
        onNavigate={onNavigate}
        t={t}
        regionOptions={regionOptions}
      />
    );
  }

  if (view === "hospital-dashboard") {
    return (
      <HospitalDashboardPage
        darkMode={darkMode}
        language={language}
        toggleDarkMode={onToggleDarkMode}
        toggleLanguage={onToggleLanguage}
        t={t}
        user={user}
        token={token}
        dashboardSection={dashboardSection}
        setDashboardSection={setDashboardSection}
        hospitalProfile={hospitalProfile}
        setHospitalProfile={setHospitalProfile}
        dashboardStats={dashboardStats}
        setDashboardStats={setDashboardStats}
        dashboardQueues={dashboardQueues}
        setDashboardQueues={setDashboardQueues}
        dashboardAppointments={dashboardAppointments}
        setDashboardAppointments={setDashboardAppointments}
        showAddDepartment={showAddDepartment}
        setShowAddDepartment={setShowAddDepartment}
        newDepartment={newDepartment}
        setNewDepartment={setNewDepartment}
        apiGet={apiGet}
        apiPost={apiPost}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    );
  }

  return null;
}
