'use client';

import {
  Ambulance,
  CellTower,
  CheckCircle,
  Ticket,
  Warning,
} from '@phosphor-icons/react';

interface FeaturesPageProps {
  darkMode: boolean;
  t: Record<string, string>;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  cta: React.ReactNode;
}

export function FeaturesPage({
  darkMode,
  t,
  navigation,
  footer,
  cta,
}: FeaturesPageProps) {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      {navigation}

      <section className="pt-8 pb-16 transition-colors duration-300 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
              {t.featuresPageTitle}
              <span className="bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">
                {' '}{t.featuresPageTitleHighlight}
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
              {t.featuresPageDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 transition-colors duration-300 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-white'}`}>
                <Ticket size={16} weight="fill" />
                {t.queueManagement}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                {t.digitalTokenTitle}
              </h2>
              <p className="text-lg mb-6 text-muted-foreground">
                {t.digitalTokenPageDesc}
              </p>
              <ul className="space-y-4">
                {[
                  t.instantToken,
                  t.estimatedWaitCalc,
                  t.realTimePosition,
                  t.multipleDepts,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#2D4B32]" weight="fill" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gradient-to-br from-[#2D4B32]/30 to-[#2D4B32]/30' : 'bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]'}`}>
              <div className="rounded-2xl shadow-xl p-6 bg-card text-card-foreground">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">{t.tokenNumber}</p>
                  <p className="text-5xl font-bold text-foreground">#042</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/60">
                    <span className="text-muted-foreground">{t.position}</span>
                    <span className="font-bold text-[#2D4B32]">{t.fifthInLine}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/60">
                    <span className="text-muted-foreground">{t.estWaitShort}</span>
                    <span className="font-bold text-foreground">~25 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`order-2 lg:order-1 rounded-3xl p-8 ${darkMode ? 'bg-gradient-to-br from-[#2D4B32]/30 to-[#2D4B32]/30' : 'bg-gradient-to-br from-[#2D4B32] to-[#2D4B32]'}`}>
              <div className="space-y-4">
                {[
                  { title: t.tokenConfirmed, message: t.tokenConfirmedMsg },
                  { title: t.tenPatientsAhead, message: t.tenPatientsAheadMsg },
                  { title: t.itsYourTurn, message: t.itsYourTurnMsg },
                ].map((sms, i) => (
                  <div
                    key={i}
                    className="rounded-xl shadow-lg p-4 bg-card text-card-foreground"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-white'}`}>
                        <CellTower size={20} className="text-current" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{sms.title}</p>
                        <p className="text-sm text-muted-foreground">{sms.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32]' : 'bg-[#2D4B32] text-white'}`}>
                <CellTower size={16} weight="fill" className="text-current" />
                {t.smsSystem}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                {t.smsNotificationsTitle}
              </h2>
              <p className="text-lg mb-6 text-muted-foreground">
                {t.smsNotificationsPageDesc}
              </p>
              <ul className="space-y-4">
                {[
                  t.worksOnBasicPhones,
                  t.noAppRequired,
                  t.automatedReminders,
                  t.emergencyAlerts,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#2D4B32]" weight="fill" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'}`}>
                <Ambulance size={16} weight="fill" />
                {t.emergencySupport}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                {t.emergencyTriageTitle}
              </h2>
              <p className="text-lg mb-6 text-muted-foreground">
                {t.emergencyTriageDesc}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { level: t.critical, color: 'bg-red-500', desc: t.criticalDesc },
                  { level: t.high, color: 'bg-[#2D4B32]', desc: t.highDesc },
                  { level: t.medium, color: 'bg-yellow-500', desc: t.mediumDesc },
                  { level: t.low, color: 'bg-green-500', desc: t.lowDesc },
                ].map((severity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card">
                    <div className={`w-3 h-3 ${severity.color} rounded-full`} />
                    <div>
                      <p className="font-semibold text-foreground">{severity.level}</p>
                      <p className="text-xs text-muted-foreground">{severity.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <Warning size={20} className="text-red-600 flex-shrink-0" />
                  <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                    {t.emergencyWarning}
                  </p>
                </div>
              </div>
            </div>
            <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gradient-to-br from-red-900/20 to-[#2D4B32]/20' : 'bg-gradient-to-br from-red-50 to-[#2D4B32]'}`}>
              <div className="rounded-2xl shadow-xl p-6 bg-card text-card-foreground">
                <h4 className="font-semibold mb-4 text-foreground">{t.describeSymptoms}</h4>
                <div className="rounded-lg p-4 mb-4 bg-muted/60">
                  <p className="text-sm italic text-muted-foreground">
                    {t.describeSymptomsExample}
                  </p>
                </div>
                <div className={`rounded-xl p-4 ${darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{t.highSeverity}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                    {t.highSeverityMsg}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {cta}
      {footer}
    </div>
  );
}
