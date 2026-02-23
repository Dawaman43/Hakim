'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Sun, Moon, User, Gear, SignOut, List, X,
} from '@phosphor-icons/react';
import type { User } from '@/types';
import type { ViewType } from '../routes';

interface NavigationProps {
  transparent?: boolean;
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
  t: {
    home: string;
    features: string;
    download: string;
    about: string;
    contact: string;
    signIn: string;
    bookQueue: string;
    dashboard: string;
  };
}

export function Navigation({
  transparent = false,
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
  t,
}: NavigationProps) {
  const homeTarget: ViewType = isAuthenticated ? 'dashboard' : 'landing';

  return (
    <nav className={`relative z-50 transition-all duration-300 ${
      transparent
        ? 'bg-background/70 backdrop-blur-md border-b border-border/40'
        : 'bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm'
    }`}>
      {!transparent && (
        <div className="h-0.5 bg-primary/80" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate(homeTarget)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm overflow-hidden group-hover:-translate-y-0.5 group-hover:shadow-md transition-all border border-border">
              <img src="/logo.png" alt="Hakim Logo" className="w-[120%] h-[120%] object-cover object-center object-top" />
            </div>
          </button>

          <div className="hidden md:flex items-center rounded-full px-2 py-1 border border-border/70 bg-muted/70 shadow-sm">
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  view === 'dashboard'
                    ? 'bg-background text-foreground border border-border shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                {t.dashboard}
              </button>
            )}
            <button
              onClick={() => onNavigate('landing')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'landing'
                  ? 'bg-background text-foreground border border-border shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => onNavigate('features')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'features'
                  ? 'bg-background text-foreground border border-border shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              {t.features}
            </button>
            <button
              onClick={() => onNavigate('download')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'download'
                  ? 'bg-background text-foreground border border-border shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              {t.download}
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'about'
                  ? 'bg-background text-foreground border border-border shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              {t.about}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'contact'
                  ? 'bg-background text-foreground border border-border shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              {t.contact}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 p-2.5 rounded-xl transition-all bg-muted text-foreground hover:bg-muted/80"
              title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
            >
              <Globe size={18} />
              <span className="text-xs font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl transition-all bg-muted text-foreground hover:bg-muted/80"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-foreground hover:bg-muted/70"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
                    <User size={16} className="text-primary-foreground" />
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                {user?.role === 'HOSPITAL_ADMIN' && (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                  >
                    <Gear size={18} />
                    {t.dashboard}
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); onNavigate('landing'); }}
                  className="p-2.5 rounded-xl transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <SignOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2.5 rounded-xl transition font-medium text-foreground hover:text-primary hover:bg-muted/70"
                >
                  {t.signIn}
                </button>
                <button
                  onClick={() => onNavigate('hospitals')}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  {t.bookQueue}
                </button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 p-2 rounded-xl transition-all bg-muted text-foreground"
            >
              <Globe size={18} />
              <span className="text-xs font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl transition-all bg-muted text-foreground"
            >
              {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl transition-all text-foreground hover:text-primary hover:bg-muted/70"
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t shadow-lg bg-background/95 backdrop-blur-md border-border/60"
          >
            <div className="px-4 py-4 space-y-1">
              {isAuthenticated && (
                <button
                  onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                    view === 'dashboard'
                      ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                      : 'hover:bg-muted/70 text-foreground'
                  }`}
                >
                  {t.dashboard}
                </button>
              )}
              <button
                onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                  view === 'landing'
                    ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                    : 'hover:bg-muted/70 text-foreground'
                }`}
              >
                {t.home}
              </button>
              <button
                onClick={() => { onNavigate('features'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                  view === 'features'
                    ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                    : 'hover:bg-muted/70 text-foreground'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => { onNavigate('download'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                  view === 'download'
                    ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                    : 'hover:bg-muted/70 text-foreground'
                }`}
              >
                {t.download}
              </button>
              <button
                onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                  view === 'about'
                    ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                    : 'hover:bg-muted/70 text-foreground'
                }`}
              >
                About
              </button>
              <button
                onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                  view === 'contact'
                    ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                    : 'hover:bg-muted/70 text-foreground'
                }`}
              >
                Contact
              </button>
              <hr className="my-3 border-border/60" />
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 rounded-xl transition-all hover:bg-muted/70 text-foreground"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { onLogout(); onNavigate('landing'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 rounded-xl transition-all text-destructive hover:bg-destructive/10"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                    className="block w-full text-center px-4 py-3 border border-border rounded-xl transition-all hover:bg-muted/70 text-foreground"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onNavigate('hospitals'); setMobileMenuOpen(false); }}
                    className="block w-full text-center px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm"
                  >
                    Book Queue
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
