'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, apiMutate } from '@/shared/utils/api';

interface Character {
  id: string;
  name: string;
  avatar: string;
  era: string;
  faction: string;
  credits: number;
}

type UserRole = 'user' | 'moderator' | 'admin' | 'game_master';

interface MeResponse {
  id: string;
  role: UserRole;
  active_character: Character | null;
}

interface CharacterContextType {
  activeCharacter: Character | null;
  userRole: UserRole | null;
  loading: boolean;
  setActiveCharacter: (characterId: string | null) => Promise<void>;
  refreshActiveCharacter: () => Promise<void>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [activeCharacter, setActiveCharacterState] = useState<Character | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshActiveCharacter();
  }, []);

  async function refreshActiveCharacter() {
    try {
      const me = await apiFetch<MeResponse>('/me');
      setUserRole(me.role ?? null);
      setActiveCharacterState(me.active_character ?? null);
    } catch {
      // Non connecté (401) : pas de personnage actif.
      setActiveCharacterState(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  }

  async function setActiveCharacter(characterId: string | null) {
    setLoading(true);
    try {
      const me = await apiMutate<MeResponse>('/me/active-character', 'PUT', {
        character_id: characterId,
      });
      setUserRole(me.role ?? null);
      setActiveCharacterState(me.active_character ?? null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CharacterContext.Provider value={{ activeCharacter, userRole, loading, setActiveCharacter, refreshActiveCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useActiveCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useActiveCharacter must be used within a CharacterProvider');
  }
  return context;
}
