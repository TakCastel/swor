'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Users, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/shared/utils/api';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { Card } from '@/shared/components/ui/Card';
import { Group } from '@/features/profile/types';

const eraNames: Record<string, string> = {
  'CLONE_WARS': 'Guerre des Clones',
  'GALACTIC_CIVIL_WAR': 'Guerre Civile Galactique',
  'NEW_REPUBLIC': 'Nouvelle République',
  'GDC': 'Guerre des Clones',
  'GCC': 'Guerre Civile Galactique',
  'NR': 'Nouvelle République'
};

export default function FactionsIndex() {
  const [factionsByEra, setFactionsByEra] = useState<Record<string, (Group & { member_count: number })[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFactions();
  }, []);

  async function fetchFactions() {
    try {
      const groups = await apiFetch<any[]>('/groups');

      const grouped = (groups || []).reduce((acc: any, group: any) => {
        const era = group.era || 'Général';
        if (!acc[era]) acc[era] = [];
        acc[era].push({
          ...group,
          member_count: group.characters_count || 0
        });
        return acc;
      }, {});

      setFactionsByEra(grouped);
    } catch (err) {
      console.error('Error fetching factions:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Chargement des factions...</div>;
  }

  return (
    <div className="space-y-12 py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-black font-outfit text-white uppercase tracking-wider">Factions de la Galaxie</h1>
        <p className="text-zinc-500 max-w-2xl leading-relaxed">
          Découvrez les différentes organisations, armées et groupes d'influence qui façonnent le destin de la galaxie à travers les âges.
        </p>
      </div>

      <div className="grid gap-12">
        {Object.entries(factionsByEra).map(([era, groups]) => (
          <div key={era} className="space-y-4">
            <CategoryHeader 
              title={eraNames[era] || era} 
              icon={Shield}
            />
            <div className="grid md:grid-cols-2 gap-4">
              {groups.map((faction) => (
                <Link key={faction.id} href={`/factions/${faction.id}`}>
                  <Card hover className="p-6 bg-black/20 border-white/5 group transition-all hover:border-yellow-500/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: faction.color }} />
                        <div>
                          <h3 className="text-lg font-black text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">
                            {faction.name}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                            <Users className="w-3 h-3" />
                            {faction.member_count} membre(s)
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-yellow-500 transition-all group-hover:translate-x-1" />
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed italic">
                      {faction.description || "Aucune description disponible pour cette faction."}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


