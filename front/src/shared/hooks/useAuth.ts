'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '@/shared/types/auth';
import { fetchCurrentUser, logoutUser } from '@/shared/utils/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * État d'authentification global : un seul fetch de l'utilisateur courant,
 * partagé par toute l'app (Header inclus). Après login/inscription, appeler
 * refresh() (ou setUser) pour propager la session partout.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
    setLoading(false);
    return currentUser;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, refresh, logout, setUser } },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
