"use client";

import { useEffect, useState } from "react";
import type { DashboardQueue, DashboardSection, DashboardStats, HospitalProfile, NewDepartment, DashboardAppointment } from "./hospital-dashboard/types";
import { Sidebar } from "./hospital-dashboard/Sidebar";
import { Header } from "./hospital-dashboard/Header";
import { OverviewSection } from "./hospital-dashboard/OverviewSection";
import { ProfileSection } from "./hospital-dashboard/ProfileSection";
import { LocationSection } from "./hospital-dashboard/LocationSection";
import { QueuesSection } from "./hospital-dashboard/QueuesSection";
import { AppointmentsSection } from "./hospital-dashboard/AppointmentsSection";
import { DepartmentsSection } from "./hospital-dashboard/DepartmentsSection";
import { StaffSection } from "./hospital-dashboard/StaffSection";
import { PlaceholderSection } from "./hospital-dashboard/PlaceholderSection";

interface HospitalDashboardPageProps {
  darkMode: boolean;
  language: string;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
  t: Record<string, string>;
  user: { name?: string } | null;
  token: string | null;
  dashboardSection: DashboardSection;
  setDashboardSection: (section: DashboardSection) => void;
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (value: HospitalProfile | null) => void;
  dashboardStats: DashboardStats;
  setDashboardStats: (stats: DashboardStats) => void;
  dashboardQueues: DashboardQueue[];
  setDashboardQueues: (queues: DashboardQueue[]) => void;
  dashboardAppointments: DashboardAppointment[];
  setDashboardAppointments: (appointments: DashboardAppointment[]) => void;
  showAddDepartment: boolean;
  setShowAddDepartment: (value: boolean) => void;
  newDepartment: NewDepartment;
  setNewDepartment: (value: NewDepartment) => void;
  apiGet: (path: string, token?: string) => Promise<any>;
  apiPost: (path: string, body: unknown, token?: string) => Promise<any>;
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
  token,
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
  onNavigate,
  onLogout,
}: HospitalDashboardPageProps) {
  useEffect(() => {
    if (!token) return;
    apiGet("/api/hospital/dashboard", token).then((res) => {
      if (res?.success) {
        const data = res.data;
        setHospitalProfile({
          name: data.hospital?.name,
          type: data.hospital?.facilityType || "HOSPITAL",
          region: data.hospital?.region || "",
          city: data.hospital?.city || "",
          address: data.hospital?.address || "",
          phone: data.hospital?.emergencyContactNumber || "",
          email: "",
          latitude: data.hospital?.latitude ?? null,
          longitude: data.hospital?.longitude ?? null,
          operatingHours: "24/7",
          services: [],
          isActive: data.hospital?.isActive,
          facilityType: data.hospital?.facilityType,
        });
        setDashboardStats(data.stats);
        setDashboardQueues(data.queues || []);
        setDashboardAppointments(data.appointments || []);
      }
    }).catch((err) => {
      console.error("Failed to load hospital dashboard", err);
    });
  }, [apiGet, token, setDashboardQueues, setDashboardStats, setHospitalProfile, setDashboardAppointments]);

  useEffect(() => {
    if (!token) return;
    loadStaff();
  }, [token]);

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    if (!token) return;
    const res = await apiPost("/api/admin/appointments/update", { appointmentId, status }, token);
    if (res?.success) {
      const updated = dashboardAppointments.map((a) => a.id === appointmentId ? { ...a, status } : a);
      setDashboardAppointments(updated);
    } else {
      alert(res?.error || "Failed to update appointment");
    }
  };

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [staff, setStaff] = useState<Array<{ id: string; name: string; phone: string; role: string; createdAt: string }>>([]);
  const [staffLoading, setStaffLoading] = useState(false);

  const saveHospitalProfile = async () => {
    if (!token || !hospitalProfile) return;
    setSavingProfile(true);
    try {
      const res = await apiPost("/api/hospital/update", {
        name: hospitalProfile.name,
        region: hospitalProfile.region,
        city: hospitalProfile.city,
        address: hospitalProfile.address,
        emergencyContactNumber: hospitalProfile.phone,
        facilityType: hospitalProfile.type,
      }, token);
      if (!res?.success) {
        alert(res?.error || "Failed to save profile");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const saveHospitalLocation = async () => {
    if (!token || !hospitalProfile) return;
    setSavingLocation(true);
    try {
      const res = await apiPost("/api/hospital/update", {
        latitude: hospitalProfile.latitude,
        longitude: hospitalProfile.longitude,
      }, token);
      if (!res?.success) {
        alert(res?.error || "Failed to save location");
      }
    } finally {
      setSavingLocation(false);
    }
  };

  const loadStaff = async () => {
    if (!token) return;
    setStaffLoading(true);
    try {
      const res = await apiGet("/api/hospital/staff", token);
      if (res?.success) setStaff(res.data || []);
    } finally {
      setStaffLoading(false);
    }
  };

  const addStaff = async (payload: { name: string; phone: string; role: string }) => {
    if (!token) return;
    setStaffLoading(true);
    try {
      const res = await apiPost("/api/hospital/staff", payload, token);
      if (!res?.success) {
        alert(res?.error || "Failed to add staff");
      }
      await loadStaff();
    } finally {
      setStaffLoading(false);
    }
  };

  const removeStaff = async (id: string) => {
    if (!token) return;
    setStaffLoading(true);
    try {
      const res = await fetch(`/api/hospital/staff?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data?.success) {
        alert(data?.error || "Failed to remove staff");
      }
      await loadStaff();
    } finally {
      setStaffLoading(false);
    }
  };

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
            onSave={saveHospitalProfile}
            saving={savingProfile}
          />
        );
      case "location":
        return (
          <LocationSection
            darkMode={darkMode}
            t={t}
            hospitalProfile={hospitalProfile}
            setHospitalProfile={setHospitalProfile}
            onSave={saveHospitalLocation}
            saving={savingLocation}
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
      case "appointments":
        return (
          <AppointmentsSection
            darkMode={darkMode}
            t={t}
            appointments={dashboardAppointments}
            onUpdateStatus={updateAppointmentStatus}
            loading={false}
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
      case "staff":
        return (
          <StaffSection
            darkMode={darkMode}
            t={t}
            staff={staff}
            onAdd={addStaff}
            onRemove={removeStaff}
            loading={staffLoading}
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
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
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
