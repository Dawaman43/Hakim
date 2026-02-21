// Hakim - Authentication Store (Zustand)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'hakim-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Queue store for managing queue state
interface QueueState {
  currentAppointmentId: string | null;
  hospitalId: string | null;
  departmentId: string | null;
  lastRefresh: Date | null;
  
  setCurrentAppointment: (id: string | null) => void;
  setQueueContext: (hospitalId: string, departmentId: string) => void;
  setLastRefresh: (date: Date) => void;
  clearQueue: () => void;
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set) => ({
      currentAppointmentId: null,
      hospitalId: null,
      departmentId: null,
      lastRefresh: null,
      
      setCurrentAppointment: (id) => set({ currentAppointmentId: id }),
      
      setQueueContext: (hospitalId, departmentId) => set({ hospitalId, departmentId }),
      
      setLastRefresh: (lastRefresh) => set({ lastRefresh }),
      
      clearQueue: () => set({
        currentAppointmentId: null,
        hospitalId: null,
        departmentId: null,
      }),
    }),
    {
      name: 'hakim-queue',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Emergency store
interface EmergencyState {
  lastEmergencyId: string | null;
  emergencyContact: string;
  setLastEmergencyId: (id: string | null) => void;
  setEmergencyContact: (contact: string) => void;
}

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set) => ({
      lastEmergencyId: null,
      emergencyContact: '911',
      
      setLastEmergencyId: (id) => set({ lastEmergencyId: id }),
      setEmergencyContact: (emergencyContact) => set({ emergencyContact }),
    }),
    {
      name: 'hakim-emergency',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
