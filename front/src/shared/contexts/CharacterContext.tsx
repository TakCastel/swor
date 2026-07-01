'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/shared/utils/supabase';

interface Character {
  id: string;
  name: string;
  avatar: string;
  era: string;
  faction: string;
  credits: number;
}

type UserRole = 'user' | 'moderator' | 'admin' | 'game_master';

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

    // Écouter les changements d'authentification pour rafraîchir le perso
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        refreshActiveCharacter();
      } else if (event === 'SIGNED_OUT') {
        setActiveCharacterState(null);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function refreshActiveCharacter() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setActiveCharacterState(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('active_character_id, role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role) {
        setUserRole(profile.role);
      }

      if (profile?.active_character_id) {
        const { data: character } = await supabase
          .from('characters')
          .select('id, name, avatar, era, faction, credits')
          .eq('id', profile.active_character_id)
          .maybeSingle();
        
        setActiveCharacterState(character || null);
      } else {
        setActiveCharacterState(null);
      }
    } catch (err) {
      console.error('[CharacterContext] Erreur:', err);
    } finally {
      setLoading(false);
    }
  }

  async function setActiveCharacter(characterId: string | null) {
    try {
      console.log("Tentative de changement de personnage vers:", characterId);
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non identifié');

      const { data, error } = await supabase
        .from('profiles')
        .update({ active_character_id: characterId })
        .eq('id', user.id)
        .select();

      if (error) {
        console.error("Erreur lors de l'update du profil:", error);
        throw error;
      }

      console.log("Profil mis à jour avec succès:", data);
      
      // On force le rafraîchissement immédiat
      await refreshActiveCharacter();
    } catch (err) {
      console.error('Erreur fatale setActiveCharacter:', err);
      throw err;
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

