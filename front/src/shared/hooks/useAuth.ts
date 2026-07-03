'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AuthUser } from '@/shared/types/auth';
import { fetchCurrentUser, logoutUser } from '@/shared/utils/api';

export function useAuth() {
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

  return { user, loading, refresh, logout, setUser };
}
