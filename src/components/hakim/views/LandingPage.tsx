'use client';

import { Navigation } from '../sections/Navigation';
import { HeroSection } from '../sections/HeroSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { CTASection } from '../sections/CTASection';
import { Footer } from '../sections/Footer';
import type { ViewType } from '../routes';
import type { User } from '@/types';

interface LandingPageProps {
  darkMode: boolean;
  language: 'en' | 'am';
  view: ViewType;
  user: User | null;
  isAuthenticated: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigate: (view: ViewType) => void;
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onFindNearest: () => void;
  locationLoading: boolean;
  t: Record<string, string>;
  selectedRegion: string;
  getAmbulanceInfo: () => {
    primaryNumber: string;
    primaryName: string;
    secondaryNumber?: string;
    secondaryName?: string;
  };
}

export function LandingPage(props: LandingPageProps) {
  const {
    darkMode,
    language,
    view,
    user,
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
  } = props;

  return (
    <div className="min-h-screen">
      <Navigation
        transparent
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
        t={{
          home: t.home,
          features: t.features,
          about: t.about,
          contact: t.contact,
          signIn: t.signIn,
          bookQueue: t.bookQueue,
          dashboard: t.dashboard,
        }}
      />
      <HeroSection
        darkMode={darkMode}
        t={t}
        onNavigate={() => onNavigate('hospitals')}
        onFindNearest={onFindNearest}
        locationLoading={locationLoading}
      />
      <FeaturesSection darkMode={darkMode} t={t} />
      <HowItWorksSection darkMode={darkMode} t={t} />
      <CTASection t={t} onNavigate={onNavigate} />
      <Footer t={t} selectedRegion={selectedRegion} getAmbulanceInfo={getAmbulanceInfo} onNavigate={onNavigate} />
    </div>
  );
}
