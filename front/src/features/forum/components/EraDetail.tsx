'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare,
  Globe,
  Lock,
  MessageCircle,
  Users,
  Compass
} from 'lucide-react';
import { Category } from '../types';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { ForumRow } from '@/shared/components/forum/ForumRow';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { Badge } from '@/shared/components/ui/Badge';
import { cn } from '@/shared/utils/cn';

interface EraDetailProps {
  era: Category;
}

export default function EraDetail({ era }: EraDetailProps) {
  const eraNames: Record<string, string> = {
    'Ancienne République': 'Guerre des Clones',
    'Old Republic': 'Guerre des Clones',
    'CLONE_WARS': 'Guerre des Clones',
    'Empire Galactique': 'Guerre Civile Galactique',
    'Galactic Empire': 'Guerre Civile Galactique',
    'GALACTIC_CIVIL_WAR': 'Guerre Civile Galactique',
    'Nouvelle République': 'Nouvelle République',
    'New Republic': 'Nouvelle République',
    'NEW_REPUBLIC': 'Nouvelle République'
  };

  const displayName = eraNames[era.name] || era.name;

  return (
    <div className="space-y-12">
      <header className="space-y-8">
        <Link 
          href="/forum" 
          className="inline-flex items-center text-[10px] font-black text-zinc-500 hover:text-yellow-500 transition-colors gap-2 uppercase tracking-[0.3em]"
        >
          <ChevronLeft className="w-3 h-3 text-yellow-500" />
          Retour au centre galactique
        </Link>
        
        <SectionHeader 
          title={displayName} 
          subtitle="Exploration Galactique"
          font="cinzel"
          description={era.description || "Naviguez à travers les différents secteurs et systèmes de cette ère galactique."}
        />
      </header>

      <div className="space-y-16">
        {era.forums.map((region) => (
          <section key={region.id} className="space-y-6">
            {region.header_image_url && (
              <div className="space-y-6">
                <div className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden border border-white/5 shadow-xl group/region">
                  <img 
                    src={region.header_image_url} 
                    alt={region.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="px-2">
                  <div className="flex items-center gap-4">
                    {region.image_url && (
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <img src={region.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                        {region.name}
                      </h3>
                      {region.description && (
                        <p className="text-[10px] text-zinc-400 font-medium italic line-clamp-1 max-w-xl uppercase tracking-wider">
                          {region.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!region.header_image_url && (
              <CategoryHeader 
                title={region.name} 
                icon={region.type === 'planet' ? Globe : Compass}
                imageUrl={region.image_url}
                action={<Badge variant="outline" className="text-[8px] border-white/10 text-zinc-500 uppercase">{region.type}</Badge>}
              />
            )}

            {region.header_image_url && (
              <div className="flex items-center justify-between px-2 mb-2">
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">Secteurs & Systèmes de {region.name}</p>
                <Badge variant="outline" className="text-[8px] border-white/10 text-zinc-600 uppercase">{region.type}</Badge>
              </div>
            )}

            {region.description && (
              <div className="px-6 py-4 bg-black/40 border-x border-white/5 border-b-px border-b-white/5">
                <p className="text-xs leading-relaxed text-zinc-400 italic font-medium">
                  {region.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-px bg-white/5 rounded-b-xl overflow-hidden border border-white/5 shadow-2xl">
              {region.sub_forums && region.sub_forums.length > 0 ? (
                region.sub_forums.map((sector: any) => (
                  <ForumRow
                    key={sector.id}
                    id={sector.id}
                    name={sector.name}
                    description={sector.description}
                    imageUrl={sector.image_url}
                    topicsCount={sector.topics_count || 0}
                    postsCount={sector.posts_count || 0}
                    href={`/forum/${sector.id}`}
                    lastPost={sector.lastPost}
                  />
                ))
              ) : (
                <div className="p-12 text-center bg-black/40 text-zinc-600 italic text-xs">
                  Aucun système répertorié dans ce secteur pour le moment.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

