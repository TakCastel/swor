'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, Calendar, MessageSquare, Shield, ArrowUpDown } from 'lucide-react';
import { apiFetch } from '@/shared/utils/api';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { Group, CharacterProfile } from '@/features/profile/types';

interface FactionDetailProps {
  id: string;
}

type SortOption = 'newest' | 'posts' | 'name';

export default function FactionDetail({ id }: FactionDetailProps) {
  const [faction, setFaction] = useState<Group | null>(null);
  const [members, setMembers] = useState<(CharacterProfile & { posts_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    fetchFactionData();
  }, [id, sortBy]);

  async function fetchFactionData() {
    try {
      const group = await apiFetch<any>(`/groups/${id}`);
      setFaction(group);

      const membersWithStats = (group.characters || []).map((char: any) => ({
        ...char,
        posts_count: char.posts_count || 0
      }));

      // Sorting
      const sortedMembers = [...membersWithStats].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'posts') return b.posts_count - a.posts_count;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });

      setMembers(sortedMembers);
    } catch (err) {
      console.error('Error fetching faction details:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Chargement de la faction...</div>;
  }

  if (!faction) {
    return <div className="py-20 text-center text-red-500 font-bold uppercase tracking-widest">Faction introuvable</div>;
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="space-y-6">
        <Link href="/factions" className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors group">
          <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          Retour aux factions
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: faction.color }} />
              <Shield className="w-10 h-10 relative z-10 transition-transform group-hover:scale-110 duration-500" style={{ color: faction.color }} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black font-outfit text-white uppercase tracking-tight">{faction.name}</h1>
                {faction.is_official && (
                  <Badge variant="yellow" className="text-[10px] uppercase tracking-widest">Officiel</Badge>
                )}
              </div>
              <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: faction.color }} />
                Faction de l'ère {faction.era || 'Général'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="text-center px-4 border-r border-white/5">
              <p className="text-2xl font-black font-mono text-white leading-none">{members.length}</p>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Membres</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-black font-mono text-white leading-none">
                {members.reduce((acc, m) => acc + m.posts_count, 0)}
              </p>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <CategoryHeader title="Description de la faction" icon={Shield} />
        <div className="forum-row p-8 rounded-b-md">
          <p className="text-zinc-400 leading-relaxed italic text-lg max-w-4xl">
            {faction.description || "Aucune description détaillée n'est disponible pour cette faction."}
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <CategoryHeader title="Membres de la faction" icon={Users} className="flex-grow" />
          <div className="flex items-center gap-4 px-4 h-[38px] bg-black/40 border border-white/5 rounded-tr-md border-l-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span className="flex items-center gap-2"><ArrowUpDown className="w-3 h-3" /> Trier par :</span>
            <button 
              onClick={() => setSortBy('newest')}
              className={sortBy === 'newest' ? 'text-yellow-500' : 'hover:text-white transition-colors'}
            >
              Récents
            </button>
            <button 
              onClick={() => setSortBy('posts')}
              className={sortBy === 'posts' ? 'text-yellow-500' : 'hover:text-white transition-colors'}
            >
              Messages
            </button>
            <button 
              onClick={() => setSortBy('name')}
              className={sortBy === 'name' ? 'text-yellow-500' : 'hover:text-white transition-colors'}
            >
              Nom
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Link key={member.id} href={`/profile/character/${member.id}`}>
              <Card hover className="p-4 flex items-center gap-4 bg-white/[0.02] border-white/5 group transition-all hover:border-yellow-500/20">
                <Avatar src={member.avatar} fallback={member.name} size="md" className="rounded-xl ring-1 ring-white/10 group-hover:ring-yellow-500/50 transition-all" />
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors truncate">
                    {member.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">
                    {member.class}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                      <MessageSquare className="w-2.5 h-2.5" /> {member.posts_count}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                      <Calendar className="w-2.5 h-2.5" /> {new Date(member.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {members.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-xl">
              <p className="text-zinc-700 text-sm font-bold uppercase tracking-widest italic">
                Aucun membre n'a encore rejoint cette faction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


