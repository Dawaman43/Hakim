'use client';

import {
  ShieldCheck,
  Ticket,
  CalendarBlank,
  Bell,
  MapPin,
  ArrowRight,
  CaretRight,
  Buildings,
  Lightning,
  FirstAid,
  UserCircle,
} from '@phosphor-icons/react';
import type { Appointment, QueueStatusResponse, Hospital, User } from '@/types';

interface DashboardPageProps {
  darkMode: boolean;
  t: Record<string, string>;
  user: User | null;
  navigation: React.ReactNode;
  onNavigate: (view: string) => void;
  currentAppointment: Appointment | null;
  queueStatus: QueueStatusResponse | null;
  nearestHospitals: Array<Hospital & { distance: number }>;
  nearestLoading: boolean;
}

export function DashboardPage({
  darkMode,
  t,
  user,
  navigation,
  onNavigate,
  currentAppointment,
  queueStatus,
  nearestHospitals,
  nearestLoading,
}: DashboardPageProps) {
  const bg = darkMode ? 'bg-background' : 'bg-background';
  const card = darkMode ? 'bg-background border-border' : 'bg-card border-border';
  const text = darkMode ? 'text-foreground' : 'text-foreground';
  const muted = darkMode ? 'text-muted-foreground' : 'text-muted-foreground';

  const quickActions = [
    { label: t.bookQueue, icon: Ticket, view: 'hospitals' },
    { label: t.currentQueueStatus, icon: Lightning, view: 'token' },
    { label: t.findNearestHospital, icon: MapPin, view: 'nearest-hospitals' },
    { label: t.emergencyAssist, icon: FirstAid, view: 'emergency' },
    { label: t.profile, icon: UserCircle, view: 'profile' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg}`}>
      {navigation}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className={`text-sm ${muted}`}>{t.userDashboardSubtitle}</p>
              <h1 className={`text-3xl sm:text-4xl font-bold ${text}`}>
                {t.userDashboardTitle}
                {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${card}`}>
              <ShieldCheck size={18} className="text-primary" />
              <span className={`text-sm ${muted}`}>{t.hipaaCompliant}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-6">
            <aside className={`rounded-2xl border p-4 ${card}`}>
              <p className={`text-xs uppercase tracking-widest ${muted} mb-3`}>{t.dashboard}</p>
              <nav className="space-y-1">
                {[
                  { label: t.dashboard, view: 'dashboard' },
                  { label: t.bookQueue, view: 'hospitals' },
                  { label: t.currentQueueStatus, view: 'token' },
                  { label: t.emergencyAssist, view: 'emergency' },
                  { label: t.profile, view: 'profile' },
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                      item.view === 'dashboard'
                        ? 'bg-primary/10 text-primary'
                        : darkMode
                          ? 'text-muted-foreground hover:bg-background'
                          : 'text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    <CaretRight size={14} className="opacity-60" />
                  </button>
                ))}
              </nav>
            </aside>

            <main className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    label: t.inQueue,
                    value: currentAppointment ? `#${currentAppointment.tokenNumber}` : '--',
                    icon: Ticket,
                  },
                  {
                    label: t.estimatedWait,
                    value: queueStatus ? `~${queueStatus.estimatedWaitMinutes} min` : '--',
                    icon: CalendarBlank,
                  },
                  {
                    label: t.departments,
                    value: queueStatus ? queueStatus.departmentName : t.noActiveToken,
                    icon: Buildings,
                  },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-2xl border p-4 ${card}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm ${muted}`}>{stat.label}</span>
                      <stat.icon size={18} className="text-primary" />
                    </div>
                    <p className={`text-xl font-semibold ${text}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className={`text-lg font-semibold mb-3 ${text}`}>{t.quickActions}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.view}
                      onClick={() => onNavigate(action.view)}
                      className={`rounded-xl border p-3 text-left transition ${
                        darkMode ? 'bg-background border-border hover:border-primary/50' : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      <action.icon size={20} className="text-primary mb-2" />
                      <p className={`text-sm font-medium ${text}`}>{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl border p-5 ${card}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${text}`}>{t.activeToken}</h3>
                    <button onClick={() => onNavigate('token')} className="text-sm text-primary font-medium flex items-center gap-1">
                      {t.currentQueueStatus}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  {currentAppointment ? (
                    <div className="space-y-3">
                      <div className={`rounded-xl p-4 ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                        <p className={`text-sm ${muted}`}>{currentAppointment.hospital?.name || t.hospitals}</p>
                        <p className={`text-base font-semibold ${text}`}>{currentAppointment.department?.name || t.departments}</p>
                        <div className="flex items-center gap-3 mt-3 text-sm">
                          <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>
                            #{currentAppointment.tokenNumber}
                          </span>
                          <span className={muted}>{t.status}: {currentAppointment.status}</span>
                        </div>
                      </div>
                      {queueStatus && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className={`rounded-xl p-3 ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                            <p className={muted}>{t.queuePosition}</p>
                            <p className={`font-semibold ${text}`}>{queueStatus.totalWaiting}</p>
                          </div>
                          <div className={`rounded-xl p-3 ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                            <p className={muted}>{t.estimatedWait}</p>
                            <p className={`font-semibold ${text}`}>~{queueStatus.estimatedWaitMinutes} min</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className={muted}>{t.noActiveToken}</p>
                  )}
                </div>

                <div className={`rounded-2xl border p-5 ${card}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${text}`}>{t.notifications}</h3>
                    <Bell size={18} className="text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className={`rounded-xl p-4 ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                      <p className={`text-sm ${muted}`}>{t.noNotifications}</p>
                    </div>
                    <button onClick={() => onNavigate('profile')} className="text-sm text-primary font-medium">
                      {t.profile}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl border p-5 ${card}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${text}`}>{t.upcomingAppointments}</h3>
                    <CalendarBlank size={18} className="text-primary" />
                  </div>
                  <div className={`rounded-xl p-4 ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                    <p className={muted}>{t.noAppointments}</p>
                  </div>
                </div>

                <div className={`rounded-2xl border p-5 ${card}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${text}`}>{t.nearbyHospitals}</h3>
                    <button onClick={() => onNavigate('hospitals')} className="text-sm text-primary font-medium flex items-center gap-1">
                      {t.viewAllHospitals}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  {nearestLoading ? (
                    <p className={muted}>{t.locating}</p>
                  ) : (
                    <div className="space-y-3">
                      {(nearestHospitals || []).slice(0, 3).map((hospital) => (
                        <div key={hospital.id} className={`rounded-xl p-4 flex items-center justify-between ${darkMode ? 'bg-background' : 'bg-muted/40'}`}>
                          <div>
                            <p className={`text-sm font-medium ${text}`}>{hospital.name}</p>
                            <p className={`text-xs ${muted}`}>{hospital.region}</p>
                          </div>
                          <button onClick={() => onNavigate('hospitals')} className="text-sm text-primary font-medium">
                            {t.bookQueue}
                          </button>
                        </div>
                      ))}
                      {(!nearestHospitals || nearestHospitals.length === 0) && (
                        <p className={muted}>{t.noHospitalsFound}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
