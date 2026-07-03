'use client';

import React, { useState, useEffect } from 'react';
import { User, Shield, Calendar, Award, Plus, LogOut, Settings, Info, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Avatar } from '@/shared/components/ui/Avatar';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { cn } from '@/shared/utils/cn';
import { apiFetch, fetchCurrentUser } from '@/shared/utils/api';
import { useAuth } from '@/shared/hooks/useAuth';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';

// Système de grades forum (HRP)
const getForumRank = (posts: number) => {
  if (posts >= 1000) return { name: 'Légende du Forum', color: 'text-purple-500' };
  if (posts >= 500) return { name: 'Vétéran Galactique', color: 'text-red-500' };
  if (posts >= 250) return { name: 'Explorateur Confirmé', color: 'text-yellow-500' };
  if (posts >= 100) return { name: 'Habitué', color: 'text-blue-500' };
  if (posts >= 50) return { name: 'Membre Actif', color: 'text-green-500' };
  if (posts >= 10) return { name: 'Contributeur', color: 'text-zinc-300' };
  return { name: 'Nouvel Arrivant', color: 'text-zinc-500' };
};

interface ProfileContentProps {
  userId?: string;
}

export default function ProfileContent({ userId }: ProfileContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const { logout } = useAuth();
  const { activeCharacter, setActiveCharacter } = useActiveCharacter();
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function init() {
      setLoading(true);
      try {
        const authUser = await fetchCurrentUser();

        if (isMounted) setCurrentUser(authUser || null);

        const targetId = userId || authUser?.id;
        if (!targetId) {
          if (isMounted) setLoading(false);
          return;
        }

        const [profileRes, charsRes] = await Promise.all([
          apiFetch<any>(`/profiles/${targetId}`).catch(() => null),
          apiFetch<any[]>(`/profiles/${targetId}/characters`).catch(() => []),
        ]);

        if (isMounted) {
          if (profileRes) {
            setProfileData(profileRes);
          }
          setCharacters(charsRes || []);
        }
      } catch (err) {
        console.error("Error in ProfileContent:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();
    return () => { isMounted = false; };
  }, [userId]);

  const isOwnProfile = !userId || userId === currentUser?.id;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleSwitchCharacter = async (e: React.MouseEvent, charId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (switchingId) return;
    
    setSwitchingId(charId);
    try {
      await setActiveCharacter(charId);
      // On force un rafraîchissement complet pour mettre à jour l'ère dans tout le site
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Échec de la prise de contrôle');
    } finally {
      setSwitchingId(null);
    }
  };

  const eraNames: Record<string, string> = {
    'Old Republic': 'Guerre des Clones',
    'CLONE_WARS': 'Guerre des Clones',
    'Galactic Empire': 'Guerre Civile Galactique',
    'GALACTIC_CIVIL_WAR': 'Guerre Civile Galactique',
    'New Republic': 'Nouvelle République',
    'NEW_REPUBLIC': 'Nouvelle République'
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Plus className="w-8 h-8 text-yellow-500 animate-spin" /></div>;

  const forumRank = getForumRank(profileData?.posts_count || 0);
  const joinDate = profileData?.created_at 
    ? new Date(profileData.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '--/--/----';

  return (
    <div className="py-8 space-y-8">
      {/* HEADER SIMPLIFIÉ */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Profil Utilisateur</h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Informations du compte membre</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLONNE GAUCHE (SIDEBAR PHPBB STYLE) */}
        <aside className="lg:col-span-4 space-y-4">
          <Card className="bg-zinc-900/40 border-white/5 rounded-none overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <Avatar 
                src={profileData?.avatar_url} 
                fallback={profileData?.username || 'U'} 
                size="xl"
                status="online"
                className="rounded-none ring-1 ring-white/5"
              />
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">
                  {profileData?.username || 'Utilisateur'}
                </h2>
                <div className="flex flex-col gap-1 items-center">
                  {profileData?.title_hrp && (
                    <Badge variant="outline" className="text-zinc-500 border-zinc-500/20 text-[8px] uppercase tracking-widest px-3 py-0.5 rounded-none">
                      {profileData.title_hrp}
                    </Badge>
                  )}
                  <Badge className={cn("text-[8px] uppercase tracking-widest px-3 py-0.5 rounded-none", 
                    profileData?.role === 'admin' ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                    profileData?.role === 'moderator' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : 
                    "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20")}>
                    {profileData?.role || 'Membre'}
                  </Badge>
                </div>
              </div>

              <div className="w-full pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-zinc-600">
                  <span>Grade</span>
                  <span className={cn("font-black", forumRank.color)}>{forumRank.name}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-zinc-600">
                  <span>Messages</span>
                  <span className="text-zinc-400">{profileData?.posts_count || 0}</span>
                </div>
              </div>

              {isOwnProfile && (
                <div className="w-full pt-4 flex flex-col gap-2">
                  <Link href="/settings" className="w-full">
                    <Button variant="outline" size="sm" className="w-full rounded-none border-white/5 bg-white/[0.02] text-[9px] tracking-widest uppercase h-9">
                      <Settings className="w-3.5 h-3.5 mr-2" /> Paramètres
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full rounded-none text-zinc-600 hover:text-red-500 text-[9px] tracking-widest uppercase h-9">
                    <LogOut className="w-3.5 h-3.5 mr-2" /> Déconnexion
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* ACTIONS */}
          {!isOwnProfile && (
            <Card className="bg-zinc-900/40 border-white/5 rounded-none p-4 space-y-3">
              <h3 className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-zinc-500 group cursor-pointer hover:text-red-500 transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Signaler</span>
                </div>
              </div>
            </Card>
          )}
        </aside>

        {/* COLONNE DROITE (CONTENU PRINCIPAL) */}
        <main className="lg:col-span-8 space-y-6">
          {/* BIOGRAPHIE */}
          {profileData?.bio_hrp && (
            <section className="space-y-3">
              <CategoryHeader title="Présentation" icon={Info} />
              <Card className="bg-zinc-900/40 border-white/5 rounded-none p-6">
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {profileData.bio_hrp}
                </p>
              </Card>
            </section>
          )}

          {/* PERSONNAGES */}
          <section className="space-y-4">
            <CategoryHeader 
              title="Personnages" 
              icon={Zap} 
              action={
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                  {characters.length} / 6
                </span>
              }
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characters.map((char) => {
                const isActive = activeCharacter?.id === char.id;
                
                return (
                  <Link key={char.id} href={`/profile/character/${char.id}`}>
                    <Card className={cn(
                      "p-4 space-y-4 transition-all bg-zinc-900/60 border-white/5 rounded-none hover:border-yellow-500/20 group",
                      isActive && "border-yellow-500/30 bg-yellow-500/[0.01]"
                    )}>
                      <div className="flex items-center gap-4">
                        <Avatar 
                          src={char.avatar} 
                          fallback={char.name} 
                          size="lg"
                          className="rounded-none border-white/5 shrink-0"
                          style={{ backgroundColor: char.main_group?.color ? `${char.main_group.color}10` : 'rgba(255,255,255,0.02)' }}
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-[7px] font-black text-yellow-500 uppercase tracking-widest">{eraNames[char.era] || char.era}</span>
                            {isActive && <Badge className="bg-yellow-500 text-black text-[7px] px-1.5 py-0 rounded-none h-4 uppercase font-black">Actif</Badge>}
                          </div>
                          <h4 className="text-lg font-black font-outfit text-white group-hover:text-yellow-500 transition-colors truncate">
                            {char.name}
                          </h4>
                          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest truncate">
                            {char.main_group?.name || 'Indépendant'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                          <span className="block text-[7px] text-zinc-700 uppercase font-black tracking-widest">Classe</span>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase truncate">{char.class}</p>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <span className="block text-[7px] text-zinc-700 uppercase font-black tracking-widest">Crédits</span>
                          <p className="text-[9px] font-mono text-yellow-500/80">{char.credits} ¤</p>
                        </div>
                      </div>

                      {!isActive && isOwnProfile && (
                        <div className="pt-2">
                          <Button 
                            onClick={(e) => handleSwitchCharacter(e, char.id)}
                            disabled={switchingId === char.id}
                            variant="outline"
                            className="w-full h-8 text-[7px] font-black tracking-[0.2em] rounded-none border-white/5 hover:bg-yellow-500 hover:text-black"
                          >
                            {switchingId === char.id ? 'CONNEXION...' : 'INCARNER'}
                          </Button>
                        </div>
                      )}
                    </Card>
                  </Link>
                );
              })}
              
              {characters.length < 6 && isOwnProfile && (
                <Link href="/profile/character/new" className="h-full">
                  <div className="p-6 rounded-none border border-dashed border-white/5 hover:border-white/20 hover:bg-white/[0.01] transition-all flex flex-col items-center justify-center gap-3 group h-full min-h-[140px]">
                    <Plus className="w-6 h-6 text-zinc-800 group-hover:text-zinc-500 transition-all" />
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Nouveau Personnage</span>
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* DÉTAILS DU COMPTE */}
          <section className="space-y-3">
            <CategoryHeader title="Statistiques" icon={Zap} />
            <Card className="bg-zinc-900/40 border-white/5 rounded-none overflow-hidden">
              <div className="divide-y divide-white/5">
                <div className="flex items-center text-[9px] group hover:bg-white/[0.01]">
                  <div className="w-1/3 py-3 px-6 font-black text-zinc-700 uppercase tracking-widest border-r border-white/5">Inscription</div>
                  <div className="py-3 px-6 text-zinc-400 font-bold">{joinDate}</div>
                </div>
                {profileData?.last_seen && (
                  <div className="flex items-center text-[9px] group hover:bg-white/[0.01]">
                    <div className="w-1/3 py-3 px-6 font-black text-zinc-700 uppercase tracking-widest border-r border-white/5">Dernière visite</div>
                    <div className="py-3 px-6 text-zinc-400 font-bold">{new Date(profileData.last_seen).toLocaleString('fr-FR')}</div>
                  </div>
                )}
                <div className="flex items-center text-[9px] group hover:bg-white/[0.01]">
                  <div className="w-1/3 py-3 px-6 font-black text-zinc-700 uppercase tracking-widest border-r border-white/5">Total messages</div>
                  <div className="py-3 px-6 text-zinc-400 font-bold">{profileData?.posts_count || 0}</div>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
