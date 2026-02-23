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
        ? darkMode
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800/60 shadow-sm'
          : 'bg-transparent'
        : darkMode
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800/60 shadow-sm'
          : 'bg-background backdrop-blur-md border-b border-gray-200/50 shadow-sm'
    }`}>
      {!transparent && (
        <div className="h-1 bg-gradient-to-r from-[#2D4B32] via-[#2D4B32] to-[#2D4B32]" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate(homeTarget)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden group-hover:-translate-y-0.5 group-hover:shadow-lg transition-all border border-gray-100">
              <img src="/logo.png" alt="Hakim Logo" className="w-[120%] h-[120%] object-cover object-center object-top" />
            </div>
          </button>

          <div className={`hidden md:flex items-center rounded-full px-2 py-1 border ${darkMode ? 'bg-gray-950/80 border-gray-700/50' : 'bg-gray-100/80 border-gray-200/50'}`}>
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'dashboard' ? darkMode ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
              >
                {t.dashboard}
              </button>
            )}
            <button
              onClick={() => onNavigate('landing')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'landing' ? darkMode ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {t.home}
            </button>
            <button
              onClick={() => onNavigate('features')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'features' ? darkMode ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {t.features}
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'about' ? darkMode ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {t.about}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'contact' ? darkMode ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-[#2D4B32] shadow-sm' : darkMode ? 'text-gray-300 hover:text-[#2D4B32]' : 'text-gray-600 hover:text-[#2D4B32]'}`}
            >
              {t.contact}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-950 text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
              title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
            >
              <Globe size={18} />
              <span className="text-xs font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>

            <button
              onClick={onToggleDarkMode}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-950 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-yellow-500'}`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${darkMode ? 'text-gray-200 hover:bg-gray-950' : 'text-gray-700 hover:bg-gray-100/80'}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-full flex items-center justify-center shadow-sm">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                {user?.role === 'HOSPITAL_ADMIN' && (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium border ${darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] hover:bg-[#2D4B32]/10 border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] hover:from-[#2D4B32] hover:to-[#2D4B32] border-[#2D4B32]/50'}`}
                  >
                    <Gear size={18} />
                    {t.dashboard}
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); onNavigate('landing'); }}
                  className={`p-2.5 rounded-xl transition-all ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <SignOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('auth')}
                  className={`px-4 py-2.5 rounded-xl transition font-medium ${darkMode ? 'text-gray-300 hover:text-[#2D4B32] hover:bg-gray-950' : 'text-gray-700 hover:text-[#2D4B32] hover:bg-gray-100/80'}`}
                >
                  {t.signIn}
                </button>
                <button
                  onClick={() => onNavigate('hospitals')}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#2D4B32]/20 hover:-translate-y-0.5 transition-all"
                >
                  {t.bookQueue}
                </button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className={`flex items-center gap-1 p-2 rounded-xl transition-all ${darkMode ? 'bg-gray-950 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              <Globe size={18} />
              <span className="text-xs font-medium">{language === 'en' ? 'አማ' : 'EN'}</span>
            </button>
            <button
              onClick={onToggleDarkMode}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-950 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'text-gray-300 hover:text-[#2D4B32] hover:bg-gray-950' : 'text-gray-600 hover:text-[#2D4B32] hover:bg-gray-100/80'}`}
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
            className={`md:hidden border-t shadow-lg ${darkMode ? 'bg-gray-950/95 backdrop-blur-md border-gray-700/50' : 'bg-background backdrop-blur-md border-gray-200/50'}`}
          >
            <div className="px-4 py-4 space-y-1">
              {isAuthenticated && (
                <button
                  onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-950 text-gray-300' : 'hover:bg-gray-100/80'}`}
                >
                  {t.dashboard}
                </button>
              )}
              <button
                onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'landing' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-950 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                {t.home}
              </button>
              <button
                onClick={() => { onNavigate('features'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'features' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-950 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                Features
              </button>
              <button
                onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'about' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-950 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                About
              </button>
              <button
                onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'contact' ? darkMode ? 'bg-[#2D4B32]/10 text-[#2D4B32] font-medium border border-[#2D4B32]/50' : 'bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-[#2D4B32] font-medium border border-[#2D4B32]' : darkMode ? 'hover:bg-gray-950 text-gray-300' : 'hover:bg-gray-100/80'}`}
              >
                Contact
              </button>
              <hr className={`my-3 ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`} />
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${darkMode ? 'hover:bg-gray-950 text-gray-300' : 'hover:bg-gray-100/80'}`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { onLogout(); onNavigate('landing'); setMobileMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                    className={`block w-full text-center px-4 py-3 border rounded-xl transition-all ${darkMode ? 'border-gray-700 hover:bg-gray-950 text-gray-300' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onNavigate('hospitals'); setMobileMenuOpen(false); }}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] text-white rounded-xl font-medium shadow-lg shadow-[#2D4B32]/20"
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
