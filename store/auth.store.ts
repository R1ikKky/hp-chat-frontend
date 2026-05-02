'use client';
import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  login: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setAuth: (data: { userId: string; login: string; role: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  login: null,
  role: null,
  isAuthenticated: false,
  setAuth: ({ userId, login, role }) => set({ userId, login, role, isAuthenticated: true }),
  clearAuth: () => set({ userId: null, login: null, role: null, isAuthenticated: false }),
}));
