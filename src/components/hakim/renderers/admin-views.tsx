"use client";

import type { AdminViewProps } from "./types";
import { AdminLoginPage } from "../views/AdminLoginPage";
import { AdminAnalyticsPage } from "../views/AdminAnalyticsPage";
import { AdminDashboardPage } from "../views/AdminDashboardPage";
import { AdminQueuePage } from "../views/AdminQueuePage";

export function AdminViews(props: AdminViewProps) {
  const {
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
    onNavigate,
    onLogin,
    navigation,
  } = props;

  if (view === "admin-login") {
    return <AdminLoginPage darkMode={darkMode} onLogin={onLogin} onNavigate={onNavigate} />;
  }

  if (view === "admin-dashboard") {
    return (
      <AdminDashboardPage
        darkMode={darkMode}
        loading={loading}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        setSelectedHospital={setSelectedHospital}
        loadAdminQueue={loadAdminQueue}
        adminStats={adminStats}
        departments={departments}
        setSelectedDepartment={setSelectedDepartment}
        onNavigate={onNavigate}
        navigation={navigation}
      />
    );
  }

  if (view === "admin-queue") {
    return (
      <AdminQueuePage
        darkMode={darkMode}
        loading={loading}
        departments={departments}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        callNextPatient={callNextPatient}
        onNavigate={onNavigate}
        navigation={navigation}
      />
    );
  }

  if (view === "admin-analytics") {
    return <AdminAnalyticsPage darkMode={darkMode} />;
  }

  return null;
}
