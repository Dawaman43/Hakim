'use client';

import { Navigation, HeroSection, FeaturesSection, HowItWorksSection, CTASection, Footer } from '@/components/sections';

interface LandingPageProps {
  currentView: string;
  isAuthenticated: boolean;
  user: { name?: string; role?: string } | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onFindNearest: () => void;
  locationLoading: boolean;
  locationError: string | null;
  onUseDefaultLocation?: () => void;
}

/**
 * Landing page component
 */
export function LandingPage({
  currentView,
  isAuthenticated,
  user,
  onNavigate,
  onLogout,
  onFindNearest,
  locationLoading,
  locationError,
  onUseDefaultLocation,
}: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <Navigation
        transparent
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <HeroSection
        onNavigate={onNavigate}
        onFindNearest={onFindNearest}
        locationLoading={locationLoading}
        locationError={locationError}
        onUseDefaultLocation={onUseDefaultLocation}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
