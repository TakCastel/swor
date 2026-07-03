'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Globe, 
  ChevronRight,
  TrendingUp,
  Gamepad2
} from 'lucide-react';
import { apiFetch } from '@/shared/utils/api';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Avatar } from '@/shared/components/ui/Avatar';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';

// Types
interface PortalStats {
  total_posts: number;
  total_topics: number;
  total_users: number;
  online_count: number;
}

interface LatestTopic {
  id: number;
  title: string;
  author_name: string;
  era: string;
  created_at: string;
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_name: string;
}

interface StaffMember {
  username: string;
  role: string;
  avatar_url: string;
}

// Section Hero - Inspirée Landing Page
export function HeroSection() {
  return (
    <section className="relative py-24 px-8 overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950">
      <Image 
        src="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=2574&auto=format&fit=crop"
        alt="Star Wars Background"
        fill
        className="object-cover opacity-10"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
      
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="font-normal font-starwars uppercase tracking-[-0.05em] select-none text-6xl md:text-8xl lg:text-9xl
            bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent drop-shadow-2xl">
            Star Wars
          </h1>
          <h2 className="text-xl md:text-2xl font-black font-outfit text-zinc-500 tracking-[0.5em] uppercase opacity-80">
            Online Roleplay
          </h2>
        </div>
        
        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light italic max-w-2xl mx-auto">
          "La galaxie vous appartient, c'est à vous d'en tracer le chemin."
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/forum">
            <Button variant="era-yellow" size="lg" className="px-10 h-14 rounded-2xl font-bold tracking-widest uppercase text-xs shadow-2xl shadow-yellow-500/10">
              Rejoindre l'Aventure
            </Button>
          </Link>
          <Link href="/universe">
            <Button variant="secondary" size="lg" className="px-10 h-14 rounded-2xl font-bold tracking-widest uppercase text-xs border-white/10 hover:bg-white/5">
              Explorer l'Univers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Widget de Statistiques
function StatsWidget({ stats }: { stats: PortalStats | null }) {
  const displayStats = [
    { label: 'En ligne', value: stats?.online_count || '0', icon: Users, color: 'text-green-400' },
    { label: 'Citoyens', value: stats?.total_users || '0', icon: Gamepad2, color: 'text-blue-400' },
    { label: 'Archives', value: stats?.total_posts || '0', icon: MessageSquare, color: 'text-yellow-400' },
  ];

  return (
    <div className="flex flex-col">
      <CategoryHeader 
        title="Statistiques Galactiques" 
        icon={TrendingUp} 
      />
      <div className="forum-row p-6 rounded-b-md grid grid-cols-3 gap-4 border-t-0">
        {displayStats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-2">
            <div className={`p-2 rounded-lg bg-black/20 border border-white/5 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-base font-black font-outfit text-white leading-none">{stat.value}</span>
              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dernières Discussions
function LatestTopicsWidget({ topics }: { topics: LatestTopic[] }) {
  const eraNames: Record<string, string> = {
    'CLONE_WARS': 'GDC',
    'GALACTIC_CIVIL_WAR': 'GCG',
    'NEW_REPUBLIC': 'NR'
  };

  return (
    <div className="flex flex-col">
      <CategoryHeader 
        title="Derniers Échanges" 
        icon={MessageSquare} 
      />
      <div className="border-x border-b border-white/5 rounded-b-md overflow-hidden divide-y divide-white/5 bg-black/20">
        {topics.map((topic, i) => (
          <Link key={i} href={`/topic/${topic.id}`} className="block">
            <div className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-all group/item">
              <div className="flex-shrink-0 w-1 h-8 rounded-full bg-zinc-800 group-hover/item:bg-yellow-500 transition-colors" />
              <div className="flex-grow min-w-0">
                <h4 className="text-[13px] font-bold text-zinc-300 line-clamp-1 group-hover/item:text-yellow-500 transition-colors">
                  {topic.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest truncate">
                    {topic.author_name}
                  </span>
                  {topic.era && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/5 ${
                      topic.era === 'CLONE_WARS' ? 'text-blue-400' : topic.era === 'GALACTIC_CIVIL_WAR' ? 'text-red-400' : 'text-yellow-500'
                    }`}>
                      {eraNames[topic.era] || topic.era}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-800 group-hover/item:text-yellow-500 transition-colors" />
            </div>
          </Link>
        ))}
        {topics.length === 0 && (
          <div className="p-8 text-center text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
            Aucun signal...
          </div>
        )}
        <Link href="/forum" className="block p-3 bg-black/40 text-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors border-t border-white/5">
          Accéder au forum
        </Link>
      </div>
    </div>
  );
}

// Les Époques (Chronologies)
function ErasSection() {
  const eras = [
    {
      name: "Guerre des Clones",
      desc: "La République contre les Séparatistes.",
      image: "/images/eras/gdc.webp",
      color: "blue",
      id: "clone-wars"
    },
    {
      name: "Guerre Civile",
      desc: "L'Empire face à la Rébellion.",
      image: "/images/eras/gcg.webp",
      color: "red",
      id: "galactic-civil-war"
    },
    {
      name: "Nouvelle République",
      desc: "La reconstruction d'une galaxie.",
      image: "/images/eras/nr.jpg",
      color: "yellow",
      id: "new-republic"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h3 className="text-[10px] font-black font-outfit tracking-[0.3em] text-zinc-500 uppercase whitespace-nowrap">
          Choisissez votre Époque
        </h3>
        <div className="h-px bg-zinc-800 w-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eras.map((era) => (
          <Link key={era.id} href={`/forum/era/${era.id}`} className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-yellow-500/20 transition-all shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
            <Image 
              src={era.image} 
              alt={era.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-40 group-hover:opacity-60 grayscale-[50%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 z-20 p-10 flex flex-col justify-end">
              <h4 className="font-outfit font-black text-2xl uppercase text-white mb-2 leading-tight tracking-tight">
                {era.name}
              </h4>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {era.desc}
              </p>
              
              <div className="mt-6 flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-yellow-500 transition-colors">
                Explorer la Timeline <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Widget Équipe
function StaffWidget({ staff }: { staff: StaffMember[] }) {
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'admin': return { color: 'text-yellow-500', name: 'ADMIN' };
      case 'moderator': return { color: 'text-blue-400', name: 'MODO' };
      case 'game_master': return { color: 'text-red-400', name: 'GM' };
      default: return { color: 'text-zinc-500', name: 'MEMBRE' };
    }
  };

  return (
    <div className="flex flex-col">
      <CategoryHeader 
        title="Conseil Suprême" 
        icon={ShieldCheck} 
      />
      <div className="forum-row p-4 rounded-b-md border-t-0 grid grid-cols-2 gap-3">
        {staff.map((member, i) => {
          const style = getRoleStyle(member.role);
          return (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-black/20 border border-white/5 group hover:border-white/10 transition-colors">
              <Avatar 
                src={member.avatar_url} 
                alt={member.username} 
                fallback={member.username}
                size="sm"
                className="rounded-lg ring-1 ring-white/10 group-hover:ring-yellow-500/30 transition-all" 
              />
              <div className="min-w-0">
                <span className="block text-[11px] font-bold text-white truncate">{member.username}</span>
                <span className={`block text-[7px] font-black uppercase tracking-widest ${style.color}`}>{style.name}</span>
              </div>
            </div>
          );
        })}
        {staff.length === 0 && <p className="col-span-2 text-center text-[10px] text-zinc-600 uppercase py-4 italic">En séance...</p>}
      </div>
    </div>
  );
}

// Holonews / Annonces
function NewsBlock({ news, newsForumId }: { news: NewsItem[], newsForumId: number | null }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date).toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h3 className="text-[10px] font-black font-outfit tracking-[0.3em] text-zinc-500 uppercase whitespace-nowrap">
          Annonces & Actualités
        </h3>
        <div className="h-px bg-zinc-800 w-full" />
        <Link href={`/forum/${newsForumId || 1}`} className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-yellow-500 transition-colors whitespace-nowrap">
          Archives
        </Link>
      </div>
      
      <div className="space-y-6">
        {news.map((item) => (
          <Link key={item.id} href={`/topic/${item.id}`} className="block">
            <Card className="group overflow-hidden border-white/5 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all cursor-pointer rounded-[2rem]">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden">
                  <Image 
                    src={`https://images.unsplash.com/photo-1472457897821-70d3819a0e24?q=80&w=2669&auto=format&fit=crop&sig=${item.id}`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-40 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
                </div>
                <div className="p-10 md:w-3/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-[8px] font-black border-white/10 text-zinc-500 rounded-full px-3">{formatDate(item.created_at)}</Badge>
                    <span className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em]">Transmission</span>
                  </div>
                  <h4 className="text-2xl font-black font-outfit text-white group-hover:text-yellow-500 transition-colors leading-tight tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 font-medium">
                    {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                    Lire la suite <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {news.length === 0 && (
          <div className="py-12 text-center border border-dashed border-white/5 rounded-[2rem]">
            <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Aucune annonce récente</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PortalContent() {
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [latestTopics, setLatestTopics] = useState<LatestTopic[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [newsForumId, setNewsForumId] = useState<number | null>(null);

  useEffect(() => {
    fetchPortalData();
  }, []);

  async function fetchPortalData() {
    try {
      const [globalStats, portal, staffMembers] = await Promise.all([
        apiFetch<any>('/stats'),
        apiFetch<any>('/portal'),
        apiFetch<any[]>('/staff'),
      ]);

      setStats(globalStats);

      setLatestTopics((portal.latest_topics || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        author_name: t.author?.username || 'Inconnu',
        era: t.forum?.category?.era || '',
        created_at: t.created_at
      })));

      setNews((portal.news || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        content: n.posts?.[0]?.content || '',
        created_at: n.created_at,
        author_name: n.author?.username || 'Inconnu'
      })));
      setNewsForumId(portal.news_forum_id || null);

      setStaff(staffMembers || []);

    } catch (err) {
      console.error('Error fetching portal data:', err);
    }
  }

  return (
    <div className="space-y-20 py-8">
      <HeroSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Colonne Principale */}
        <div className="lg:col-span-8 space-y-24">
          <ErasSection />
          <NewsBlock news={news} newsForumId={newsForumId} />
          
          <Card className="p-16 bg-zinc-900/20 border-white/5 rounded-[3rem] relative overflow-hidden group hover:border-yellow-500/10 transition-colors">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Globe className="w-80 h-84 text-yellow-500" />
            </div>
            <div className="max-w-xl space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-5xl font-outfit font-black uppercase text-white leading-none tracking-tighter">
                  L'aventure vous attend, <br />
                  <span className="text-yellow-500">jeune voyageur.</span>
                </h2>
                <p className="text-lg text-zinc-400 leading-relaxed font-medium italic">
                  Swor est une communauté de passionnés qui font vivre la saga Star Wars à travers l'écriture. 
                </p>
              </div>
              <div className="flex gap-6">
                <Link href="/forum">
                  <Button variant="era-yellow" className="rounded-2xl px-10 h-14 font-bold uppercase text-[10px] tracking-widest shadow-2xl shadow-yellow-500/10">
                    Rejoindre
                  </Button>
                </Link>
                <Link href="/rules">
                  <Button variant="outline" className="rounded-2xl px-10 h-14 font-bold uppercase text-[10px] tracking-widest border-white/10 hover:bg-white/5 transition-all">
                    Règlement
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <StatsWidget stats={stats} />
          <LatestTopicsWidget topics={latestTopics} />
          <StaffWidget staff={staff} />
          
          <div className="flex flex-col">
            <CategoryHeader 
              title="Communauté Discord" 
              className="bg-[#5865F2]/20 border-[#5865F2]/20"
            />
            <div className="forum-row p-6 rounded-b-md border-t-0 flex items-center gap-6 bg-[#5865F2]/5 hover:bg-[#5865F2]/10 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-lg shadow-[#5865F2]/20 shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base text-white font-black leading-none mb-1.5 uppercase tracking-tighter truncate">Rejoindre le Discord</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Rejoignez la communauté</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
