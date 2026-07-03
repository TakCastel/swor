import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, BookOpen } from 'lucide-react';
import { RULES_DATA } from '../data/rules-data';
import { Card, CardTitle } from '@/shared/components/ui/Card';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { WikiArticleHeader } from '@/shared/components/wiki/WikiArticle';

export default function RulesOverview() {
  return (
    <div className="space-y-12">
      <WikiArticleHeader
        badge="Code galactique"
        title="Règlement officiel"
        excerpt="Pour assurer une expérience de jeu de qualité et une ambiance saine, lisez attentivement chaque section avant de jouer."
      />

      <div className="space-y-8">
        <CategoryHeader title="Sections du Règlement" icon={BookOpen} />
        <div className="grid gap-4">
          {RULES_DATA.map((section) => (
            <Link 
              key={section.id} 
              href={`/rules/${section.id}`}
              className="group"
            >
              <Card hover className="p-8 flex items-center justify-between border-white/5 bg-zinc-900/40">
                <div className="flex items-center gap-8">
                  <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-yellow-500/20 transition-all">
                    <ShieldCheck className="w-6 h-6 text-zinc-600 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-white transition-colors uppercase tracking-tight">{section.title}</CardTitle>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{section.description}</p>
                    <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.2em] pt-1">
                      {section.rules.length} protocoles établis
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all duration-300">
                  <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-black" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="p-10 bg-yellow-500/[0.02] border-yellow-500/10 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck className="w-24 h-24 text-yellow-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-black font-outfit text-white uppercase tracking-widest">Engagement du Joueur</h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">
            En vous inscrivant et en créant un personnage sur Swor, vous acceptez de respecter ce règlement dans son intégralité. L'équipe administrative se réserve le droit de modifier ces règles à tout moment pour le bien de la communauté.
          </p>
        </div>
      </Card>
    </div>
  );
}

