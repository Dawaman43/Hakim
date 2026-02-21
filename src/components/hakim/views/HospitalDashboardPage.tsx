"use client";

import { useEffect } from "react";
import type { DashboardQueue, DashboardSection, DashboardStats, HospitalProfile, NewDepartment } from "./hospital-dashboard/types";
import { Sidebar } from "./hospital-dashboard/Sidebar";
import { Header } from "./hospital-dashboard/Header";
import { OverviewSection } from "./hospital-dashboard/OverviewSection";
import { ProfileSection } from "./hospital-dashboard/ProfileSection";
import { LocationSection } from "./hospital-dashboard/LocationSection";
import { QueuesSection } from "./hospital-dashboard/QueuesSection";
import { DepartmentsSection } from "./hospital-dashboard/DepartmentsSection";
import { PlaceholderSection } from "./hospital-dashboard/PlaceholderSection";

interface HospitalDashboardPageProps {
  darkMode: boolean;
  language: string;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
  t: Record<string, string>;
  user: { name?: string } | null;
  dashboardSection: DashboardSection;
  setDashboardSection: (section: DashboardSection) => void;
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (updater: (prev: HospitalProfile | null) => HospitalProfile | null) => void;
  dashboardStats: DashboardStats;
  setDashboardStats: (stats: DashboardStats) => void;
  dashboardQueues: DashboardQueue[];
  setDashboardQueues: (queues: DashboardQueue[]) => void;
  showAddDepartment: boolean;
  setShowAddDepartment: (value: boolean) => void;
  newDepartment: NewDepartment;
  setNewDepartment: (value: NewDepartment) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function HospitalDashboardPage({
  darkMode,
  language,
  toggleDarkMode,
  toggleLanguage,
  t,
  user,
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
  onNavigate,
  onLogout,
}: HospitalDashboardPageProps) {
  useEffect(() => {
    setHospitalProfile({
      name: "Tikur Anbessa General Hospital",
      type: "GOVERNMENT",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Churchill Road, P.O. Box 1176",
      phone: "0115-515125",
      email: "info@tikuranbessa.gov.et",
      latitude: 9.032,
      longitude: 38.7469,
      operatingHours: "24/7",
      services: ["emergency", "outpatient", "inpatient", "laboratory", "radiology"],
    });
    setDashboardStats({
      todayPatients: 156,
      waiting: 23,
      served: 133,
      avgWaitTime: 32,
    });
    setDashboardQueues([
      { departmentId: "1", departmentName: "General Medicine", currentToken: 45, waiting: 8, served: 37, status: "normal" },
      { departmentId: "2", departmentName: "Pediatrics", currentToken: 23, waiting: 5, served: 18, status: "normal" },
      { departmentId: "3", departmentName: "Emergency", currentToken: 67, waiting: 12, served: 55, status: "busy" },
      { departmentId: "4", departmentName: "Obstetrics", currentToken: 12, waiting: 3, served: 9, status: "normal" },
    ]);
  }, [setDashboardQueues, setDashboardStats, setHospitalProfile]);

  const renderContent = () => {
    switch (dashboardSection) {
      case "overview":
        return (
          <OverviewSection
            darkMode={darkMode}
            t={t}
            user={user}
            dashboardStats={dashboardStats}
            dashboardQueues={dashboardQueues}
            setDashboardSection={setDashboardSection}
          />
        );
      case "profile":
        return (
          <ProfileSection
            darkMode={darkMode}
            t={t}
            hospitalProfile={hospitalProfile}
            setHospitalProfile={setHospitalProfile}
          />
        );
      case "location":
        return (
          <LocationSection
            darkMode={darkMode}
            t={t}
            hospitalProfile={hospitalProfile}
            setHospitalProfile={setHospitalProfile}
          />
        );
      case "queues":
        return (
          <QueuesSection
            darkMode={darkMode}
            t={t}
            dashboardQueues={dashboardQueues}
          />
        );
      case "departments":
        return (
          <DepartmentsSection
            darkMode={darkMode}
            t={t}
            showAddDepartment={showAddDepartment}
            setShowAddDepartment={setShowAddDepartment}
            newDepartment={newDepartment}
            setNewDepartment={setNewDepartment}
            dashboardQueues={dashboardQueues}
          />
        );
      case "analytics":
        return (
          <PlaceholderSection
            darkMode={darkMode}
            title={t.analytics}
            description="Analytics dashboard coming soon..."
          />
        );
      case "staff":
        return (
          <PlaceholderSection
            darkMode={darkMode}
            title={t.staff}
            description="Staff management coming soon..."
          />
        );
      case "settings":
        return (
          <PlaceholderSection
            darkMode={darkMode}
            title={t.settings}
            description="Settings panel coming soon..."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      <Sidebar
        darkMode={darkMode}
        t={t}
        user={user}
        hospitalProfile={hospitalProfile}
        dashboardSection={dashboardSection}
        setDashboardSection={setDashboardSection}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 ml-64 min-h-screen">
        <Header
          darkMode={darkMode}
          language={language}
          toggleDarkMode={toggleDarkMode}
          toggleLanguage={toggleLanguage}
          t={t}
          hospitalProfile={hospitalProfile}
        />

        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
