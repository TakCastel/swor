'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, MessageSquare, Shield, Globe, Terminal, 
  Activity, Info, Gift, BarChart3, Clock, Signal, 
  UserPlus
} from 'lucide-react';
import { apiFetch, apiMutate } from '@/shared/utils/api';
import { cn } from '@/shared/utils/cn';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { Badge } from '@/shared/components/ui/Badge';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';

export default function Footer() {
  const [stats, setStats] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchOnlineUsers();
    fetchGroups();
    
    // Refresh every minute
    const interval = setInterval(() => {
      fetchStats();
      fetchOnlineUsers();
      updateLastSeen();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  async function updateLastSeen() {
    // Silencieux si l'utilisateur n'est pas connecté (401)
    await apiMutate('/me/heartbeat', 'POST').catch(() => {});
  }

  async function fetchStats() {
    try {
      setStats(await apiFetch<any>('/stats'));
    } catch (err: unknown) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOnlineUsers() {
    try {
      setOnlineUsers(await apiFetch<any[]>('/online-users'));
    } catch (err: unknown) {
      console.error('Error fetching online users:', err);
    }
  }

  async function fetchGroups() {
    try {
      setGroups(await apiFetch<any[]>('/groups'));
    } catch (err: unknown) {
      console.error('Error fetching groups:', err);
    }
  }

  const eraNames: Record<string, string> = {
    'Old Republic': 'Guerre des Clones',
    'CLONE_WARS': 'Guerre des Clones',
    'GDC': 'Guerre des Clones',
    'Galactic Empire': 'Guerre Civile Galactique',
    'GALACTIC_CIVIL_WAR': 'Guerre Civile Galactique',
    'GCC': 'Guerre Civile Galactique',
    'New Republic': 'Nouvelle République',
    'NEW_REPUBLIC': 'Nouvelle République',
    'NR': 'Nouvelle République'
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <footer className="mt-20 border-t border-white/5 bg-black/40 pb-16 pt-16 relative">
      <div className="forum-container px-4 space-y-16">
        
        {/* 1. Statistics Grid (phpBB style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-white/5 pb-8">
          
          {/* Main Column: Online & Birthdays */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Qui est en ligne ? */}
            <div className="flex flex-col">
              <CategoryHeader 
                title="Qui est en ligne ?" 
                icon={Users} 
                className="rounded-t-md border-b-0"
              />
              <div className="forum-row p-5 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Il y a en tout <span className="text-white font-bold">{onlineUsers.length + (stats?.guests_count || 0)}</span> utilisateur(s) en ligne :: 
                    <span className="text-white font-bold mx-1">{onlineUsers.length}</span> Enregistré(s), 
                    <span className="text-white font-bold mx-1">0</span> Invisible et 
                    <span className="text-white font-bold mx-1">{stats?.guests_count || 2}</span> Invité(s)
                  </p>
                  
                  {stats?.online_record && (
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-white/[0.02] px-3 py-1.5 rounded border border-white/5">
                      Record : <span className="text-yellow-500">{stats.online_record.count}</span> le {formatDate(stats.online_record.date)}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5 pb-2">
                    <Signal className="w-3 h-3" />
                    Utilisateurs enregistrés
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {onlineUsers.length > 0 ? onlineUsers.map((u, i) => {
                      const groupColor = u.active_character?.main_group?.color || '#71717a';
                      return (
                        <Link 
                          key={i} 
                          href={`/profile/${u.id}`}
                          className="text-xs font-bold hover:underline transition-all"
                          style={{ color: groupColor }}
                        >
                          {u.username}{i < onlineUsers.length - 1 ? ',' : ''}
                        </Link>
                      );
                    }) : (
                      <span className="text-xs text-zinc-700 italic">Aucun membre enregistré en ligne</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mr-2">Légende :</span>
                    {groups.map((group, i) => (
                      <div key={i} className="flex items-center gap-1 group">
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: group.color }}>
                          [{group.name}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Anniversaires */}
            <div className="flex flex-col">
              <CategoryHeader 
                title="Anniversaires" 
                icon={Gift} 
                className="rounded-t-md border-b-0"
              />
              <div className="forum-row p-5 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-400">
                    <span className="font-bold text-zinc-500 uppercase text-[10px] tracking-widest mr-2">Membres fêtant leur anniversaire aujourd'hui :</span>
                    {stats?.birthdays_today?.length > 0 ? stats.birthdays_today.map((u: any, i: number) => (
                      <Link key={i} href={`/profile/${u.id}`} className="text-white hover:underline font-bold">
                        {u.username} ({u.age}){i < stats.birthdays_today.length - 1 ? ', ' : ''}
                      </Link>
                    )) : <span className="text-zinc-700 italic">Aucun</span>}
                  </p>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-zinc-400">
                    <span className="font-bold text-zinc-500 uppercase text-[10px] tracking-widest mr-2">Dans les 7 prochains jours :</span>
                    {stats?.birthdays_week?.length > 0 ? stats.birthdays_week.map((u: any, i: number) => (
                      <Link key={i} href={`/profile/${u.id}`} className="text-zinc-400 hover:text-white transition-colors">
                        {u.username} ({u.age}){i < stats.birthdays_week.length - 1 ? ', ' : ''}
                      </Link>
                    )) : <span className="text-zinc-700 italic">Aucun</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Global Stats */}
          <div className="lg:col-span-4 lg:pl-6 flex flex-col gap-6">
            <div className="flex flex-col h-full">
              <CategoryHeader 
                title="Statistiques" 
                icon={BarChart3} 
                className="rounded-t-md border-b-0"
              />
              <div className="forum-row p-5 space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total des messages</span>
                    <span className="text-sm font-mono font-black text-white">{stats?.total_posts?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total des sujets</span>
                    <span className="text-sm font-mono font-black text-white">{stats?.total_topics?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total des membres</span>
                    <span className="text-sm font-mono font-black text-white">{stats?.total_users?.toLocaleString() || 0}</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] p-4 rounded-md border border-white/5 space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500/70 uppercase tracking-widest">
                    <UserPlus className="w-3 h-3" />
                    Dernier membre inscrit
                  </div>
                  <Link 
                    href={`/profile/${stats?.latest_user?.id}`} 
                    className="text-sm font-black text-white hover:text-yellow-500 transition-colors block"
                  >
                    {stats?.latest_user?.username || 'Inconnu'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Factions repartiton by Era (phpBB style list) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.factions_by_era && Object.entries(stats.factions_by_era).map(([era, factions]: [string, any]) => (
            <div key={era} className="flex flex-col">
              <div className="forum-header-bar flex items-center gap-2 text-[10px] rounded-t-md border-b-0">
                <Shield className="w-3 h-3 text-zinc-500" />
                {eraNames[era] || era}
              </div>
              <div className="forum-row p-3 space-y-1">
                {factions.map((faction: any, i: number) => {
                  const groupInfo = groups.find(g => g.name === faction.name);
                  return (
                    <Link 
                      key={i} 
                      href={groupInfo ? `/factions/${groupInfo.id}` : '/factions'}
                      className="flex justify-between items-center px-3 py-1.5 rounded hover:bg-white/[0.03] transition-colors group/faction"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: faction.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover/faction:text-white transition-colors">
                          {faction.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-black text-zinc-600 group-hover/faction:text-yellow-500 transition-colors">
                        {faction.member_count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Branding & Links Section (SEO Focus) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-t border-white/5 pt-16">
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center group transition-transform active:scale-95">
              <div className="flex flex-col items-center justify-center leading-[0] font-starwars text-yellow-500 lowercase">
                <span className="text-2xl tracking-tighter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">sw</span>
                <span className="text-2xl tracking-tighter -mt-3 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">or</span>
              </div>
            </Link>
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-outfit text-white uppercase tracking-wider">Star Wars Online Roleplay</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                SWOR est une plateforme de <strong>jeu de rôle textuel</strong> (Forum RP) dédiée à l'univers de <strong>Star Wars</strong>. 
                Incarnez votre propre personnage, choisissez votre camp entre les Jedi, les Sith ou les Mandaloriens, 
                et participez à des aventures épiques à travers la galaxie.
              </p>
            </div>
            <div className="flex gap-4">
              <Tooltip content="Rejoindre notre Discord">
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-500/20 hover:text-yellow-500 transition-all border border-white/5">
                  <MessageSquare className="w-5 h-5" />
                </Link>
              </Tooltip>
              <Tooltip content="Nous suivre sur X">
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-500/20 hover:text-yellow-500 transition-all border border-white/5">
                  <Globe className="w-5 h-5" />
                </Link>
              </Tooltip>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">La Galaxie</h4>
              <ul className="space-y-2">
                <li><Link href="/forum" className="text-sm text-zinc-400 hover:text-white transition-colors">Forum RP</Link></li>
                <li><Link href="/universe" className="text-sm text-zinc-400 hover:text-white transition-colors">L'Univers</Link></li>
                <li><Link href="/atlas" className="text-sm text-zinc-400 hover:text-white transition-colors">Atlas Galactique</Link></li>
                <li><Link href="/factions" className="text-sm text-zinc-400 hover:text-white transition-colors">Factions</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Communauté</h4>
              <ul className="space-y-2">
                <li><Link href="/members" className="text-sm text-zinc-400 hover:text-white transition-colors">Membres</Link></li>
                <li><Link href="/staff" className="text-sm text-zinc-400 hover:text-white transition-colors">L'Équipe</Link></li>
                <li><Link href="/discord" className="text-sm text-zinc-400 hover:text-white transition-colors">Discord</Link></li>
                <li><Link href="/partners" className="text-sm text-zinc-400 hover:text-white transition-colors">Partenaires</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Aide & Infos</h4>
              <ul className="space-y-2">
                <li><Link href="/rules" className="text-sm text-zinc-400 hover:text-white transition-colors">Règlement</Link></li>
                <li><Link href="/guide" className="text-sm text-zinc-400 hover:text-white transition-colors">Guide du Débutant</Link></li>
                <li><Link href="/legal" className="text-sm text-zinc-400 hover:text-white transition-colors">Mentions Légales</Link></li>
                <li><Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-1">
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] text-center md:text-left">
              &copy; {new Date().getFullYear()} STAR WARS OPEN ROLEPLAY. TOUS DROITS RÉSERVÉS.
            </p>
            <p className="text-[8px] text-zinc-800 font-medium uppercase tracking-[0.15em] text-center md:text-left">
              STAR WARS EST UNE MARQUE DÉPOSÉE DE DISNEY & LUCASFILM LTD. CE SITE N'EST PAS AFFILIÉ À DISNEY OU LUCASFILM.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded border border-white/5 bg-white/[0.01]">
              <Terminal className="w-3 h-3 text-zinc-700" />
              <span className="text-[9px] font-mono font-bold text-zinc-700 uppercase tracking-widest">v0.2.0</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
