'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, User, Gear, SignOut, List, X,
} from '@phosphor-icons/react';

// View types that can be navigated to
type ViewType = string;

interface NavigationProps {
  transparent?: boolean;
  currentView: ViewType;
  isAuthenticated: boolean;
  user: { name?: string; role?: string } | null;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
}

/**
 * Main navigation component
 */
export function Navigation({
  transparent = false,
  currentView,
  isAuthenticated,
  user,
  onNavigate,
  onLogout,
}: NavigationProps) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      transparent
        ? 'bg-transparent dark:bg-gray-950/95 dark:backdrop-blur-sm dark:border-b dark:border-gray-800/60'
        : 'bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-950/95 dark:border-b dark:border-gray-800/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D4B32] to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#2D4B32]/20 transition-shadow">
              <Heart weight="fill" className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#2D4B32] to-teal-600 bg-clip-text text-transparent">
              Hakim
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('landing')} className="text-gray-600 hover:text-[#2D4B32] transition font-medium dark:text-gray-300">Home</button>
            <button onClick={() => onNavigate('features')} className="text-gray-600 hover:text-[#2D4B32] transition font-medium dark:text-gray-300">Features</button>
            <button onClick={() => onNavigate('about')} className="text-gray-600 hover:text-[#2D4B32] transition font-medium dark:text-gray-300">About</button>
            <button onClick={() => onNavigate('contact')} className="text-gray-600 hover:text-[#2D4B32] transition font-medium dark:text-gray-300">Contact</button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#2D4B32] transition dark:text-gray-300"
                >
                  <User size={20} />
                  <span>{user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                {user?.role === 'HOSPITAL_ADMIN' && (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2D4B32] text-white rounded-lg hover:bg-[#2D4B32] transition font-medium"
                  >
                    <Gear size={20} />
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); onNavigate('landing'); }}
                  className="p-2 text-gray-400 hover:text-red-500 transition dark:text-gray-500"
                >
                  <SignOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('auth')}
                  className="text-gray-600 hover:text-[#2D4B32] transition font-medium dark:text-gray-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('hospitals')}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#2D4B32] to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#2D4B32]/20 transition-all"
                >
                  Book Queue
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton currentView={currentView} isAuthenticated={isAuthenticated} onNavigate={onNavigate} onLogout={onLogout} />
        </div>
      </div>
    </nav>
  );
}

/**
 * Mobile menu button and dropdown
 */
function MobileMenuButton({
  currentView,
  isAuthenticated,
  onNavigate,
  onLogout,
}: {
  currentView: ViewType;
  isAuthenticated: boolean;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-300"
      >
        {isOpen ? <X size={24} /> : <List size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t absolute left-0 right-0 top-16 dark:bg-gray-950 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-2">
              <button onClick={() => { onNavigate('landing'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-200">Home</button>
              <button onClick={() => { onNavigate('features'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-200">Features</button>
              <button onClick={() => { onNavigate('about'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-200">About</button>
              <button onClick={() => { onNavigate('contact'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-200">Contact</button>
              <hr className="my-2 dark:border-gray-800" />
              {isAuthenticated ? (
                <>
                  <button onClick={() => { onNavigate('profile'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-200">Profile</button>
                  <button onClick={() => { onLogout(); onNavigate('landing'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-red-500 dark:hover:bg-gray-900">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { onNavigate('auth'); setIsOpen(false); }} className="block w-full text-center px-4 py-2 bg-[#2D4B32] text-white rounded-lg">Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
