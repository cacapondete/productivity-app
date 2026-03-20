'use client';

import { createContext, useContext, useMemo } from 'react';
import client from '@/lib/pocketbase';

interface AuthContextValue {
  authenticated: boolean;
  user: unknown;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    () => ({
      authenticated: client.authStore.isValid,
      user: client.authStore.model,
      logout: () => {
        client.authStore.clear();
      },
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
