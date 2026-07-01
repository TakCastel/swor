'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/shared/utils/supabase';
import { Card, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Shield, MapPin, Wallet, Award, Loader2, Zap, BookOpen, Heart, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { CharacterProfile } from '@/features/profile/types';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';

export default function CharacterSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;
  const { activeCharacter, setActiveCharacter } = useActiveCharacter();
  
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<CharacterProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    fetchCharacter();
    fetchUser();
  }, [characterId]);

  async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  }

  async function fetchCharacter() {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select(`
          *,
          main_group:groups(*)
        `)
        .eq('id', characterId)
        .single();

      if (error) throw error;
      setCharacter(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement du personnage:', err);
      setError('Personnage non trouvé.');
    } finally {
      setLoading(false);
    }
  }

  const handleSwitchCharacter = async () => {
    if (switching || !character) return;
    setSwitching(true);
    try {
      await setActiveCharacter(character.id);
      // On recharge pour mettre à jour les menus et l'ère
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du changement de personnage');
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (error || !character) {
    return (
      <Card className="p-12 text-center border-red-500/20 bg-red-500/5">
        <CardTitle className="text-red-500 mb-2">Erreur</CardTitle>
        <CardDescription>{error || 'Une erreur est survenue.'}</CardDescription>
        <button 
          onClick={() => router.push('/profile')}
          className="mt-6 text-sm text-zinc-400 hover:text-white underline transition-colors"
        >
          Retour au profil
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header du Personnage */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative shrink-0">
          <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-zinc-800">
            {character.avatar ? (
              <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                <UserIcon className="w-20 h-20" />
              </div>
            )}
          </div>
          {character.main_group?.color && (
            <div 
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-black flex items-center justify-center shadow-lg"
              style={{ backgroundColor: character.main_group.color }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <div className="space-y-4 flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-5xl font-outfit text-white leading-tight" style={{ color: character.main_group?.color || 'white' }}>
                {character.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <span className="text-yellow-500 font-black tracking-[0.2em] text-xs uppercase">
                  {character.class}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
                  {character.species}
                </span>
              </div>
            </div>

            {currentUser?.id === character.user_id && (
              <div className="shrink-0 pt-2">
                {activeCharacter?.id === character.id ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    Personnage Actif
                  </div>
                ) : (
                  <Button 
                    onClick={handleSwitchCharacter}
                    disabled={switching}
                    variant="era-yellow"
                    size="sm"
                    className="rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)]"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {switching ? 'Synchronisation...' : 'Prendre le contrôle'}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
            <Badge variant="outline" className="border-white/10 text-zinc-400 text-[10px] uppercase tracking-tighter">
              {character.era}
            </Badge>
            {character.main_group && (
              <Badge 
                variant="outline" 
                style={{ color: character.main_group.color, borderColor: `${character.main_group.color}40` }}
                className="text-[10px] uppercase tracking-tighter font-black"
              >
                {character.main_group.name}
              </Badge>
            )}
          </div>

          <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed text-center md:text-left pt-2 italic">
            {character.physical_description?.slice(0, 200) || "Aucune description physique renseignée."}
            {character.physical_description && character.physical_description.length > 200 && "..."}
          </p>
        </div>
      </div>

      {/* Stats Rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 bg-zinc-900/40 border-white/5 shadow-inner group hover:border-yellow-500/20 transition-all">
          <div className="flex items-center gap-3 text-zinc-500">
            <Wallet className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] uppercase font-black tracking-widest group-hover:text-zinc-300">Crédits Galactiques</span>
          </div>
          <p className="text-3xl font-black text-white font-mono">{character.credits.toLocaleString()} <span className="text-yellow-500 text-lg">¤</span></p>
        </Card>

        <Card className="p-6 space-y-4 bg-zinc-900/40 border-white/5 shadow-inner group hover:border-blue-500/20 transition-all">
          <div className="flex items-center gap-3 text-zinc-500">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] uppercase font-black tracking-widest group-hover:text-zinc-300">Position Actuelle</span>
          </div>
          <p className="text-2xl font-bold text-white">Bordure Extérieure</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Secteur Inconnu</p>
        </Card>

        <Card className="p-6 space-y-4 bg-zinc-900/40 border-white/5 shadow-inner group hover:border-purple-500/20 transition-all">
          <div className="flex items-center gap-3 text-zinc-500">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="text-[10px] uppercase font-black tracking-widest group-hover:text-zinc-300">Item Spécial</span>
          </div>
          <p className="text-xl font-bold text-white leading-tight">{character.starting_item || "Aucun"}</p>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[100%]"></div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Lore & Histoire */}
        <Card className="md:col-span-2 p-8 space-y-6 bg-zinc-900/40 border-white/5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-xl">Archives & Origines</CardTitle>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-3">Biographie</h4>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {character.background_history || "L'histoire de ce personnage reste nimbée de mystère..."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-white/5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-green-500" />
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Affections</h4>
                </div>
                <p className="text-sm text-zinc-400">{character.likes || "Non spécifié"}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-red-500 rotate-180" />
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Aversions</h4>
                </div>
                <p className="text-sm text-zinc-400">{character.dislikes || "Non spécifié"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Compétences Maîtrisées */}
        <Card className="p-8 space-y-6 bg-zinc-900/40 border-white/5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-xl">Capacités</CardTitle>
          </div>
          <div className="space-y-4">
            {character.skills && character.skills.length > 0 ? character.skills.map((skill: string) => (
              <div key={skill} className="space-y-2 group">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-bold uppercase tracking-widest group-hover:text-yellow-500 transition-colors">{skill}</span>
                  <span className="text-yellow-500/50 font-black">NIV. 1</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full w-[33%] shadow-[0_0_10px_rgba(234,179,8,0.3)]"></div>
                </div>
              </div>
            )) : (
              <p className="text-xs text-zinc-500 italic">Aucune compétence enregistrée.</p>
            )}
            <div className="pt-6">
              <div className="p-4 rounded-xl bg-black/40 border border-yellow-500/10 text-center">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Point d'expérience</p>
                <p className="text-lg font-black text-white">0 XP</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
