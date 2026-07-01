'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, ChevronRight, Globe, Shield, Users, Sparkles, Lock, Info, MessageSquare, Loader2, Zap } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Card, CardTitle, CardDescription } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { ForumRow } from '@/shared/components/forum/ForumRow';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { supabase } from '@/shared/utils/supabase';

export default function ForumIndex() {
  const { activeCharacter, userRole, loading: loadingChar } = useActiveCharacter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForumData();
  }, [activeCharacter, userRole]);

  const roleHierarchy: Record<string, number> = {
    'user': 1,
    'moderator': 2,
    'game_master': 3,
    'admin': 4
  };

  const hasAccess = (required: string | null, current: string | null) => {
    if (!required) return true;
    if (!current) return false;
    return roleHierarchy[current] >= roleHierarchy[required];
  };

  async function fetchForumData() {
    setLoading(true);
    try {
      const { data: categoriesData } = await supabase.from('forum_categories').select('*').order('display_order', { ascending: true });
      
      // On récupère les forums avec les infos agrégées récursivement
      const { data: forumsData, error: forumsError } = await supabase
        .from('forums')
        .select(`
          *,
          last_post:last_post_id (
            id,
            created_at,
            topic:topics (id, title),
            author:profiles (username),
            character:characters (
              name,
              main_group:groups (color)
            )
          )
        `)
        .order('display_order', { ascending: true });

      if (forumsError) {
        console.error('Erreur forumsData détaillée:', JSON.stringify(forumsError, null, 2));
      }
      
      console.log('Nombre de forums récupérés:', forumsData?.length);

      const filteredCats = (categoriesData || []).filter(cat => {
        if (!hasAccess(cat.required_role, userRole)) return false;
        if (cat.era) {
          // Les administrateurs voient toutes les ères
          if (userRole === 'admin') return true;

          if (activeCharacter) {
            // Normalisation pour la comparaison (supporte les anciens IDs et les nouveaux)
            const eraMap: Record<string, string> = {
              'Old Republic': 'CLONE_WARS',
              'GDC': 'CLONE_WARS',
              'CLONE_WARS': 'CLONE_WARS',
              'Galactic Empire': 'GALACTIC_CIVIL_WAR',
              'GCC': 'GALACTIC_CIVIL_WAR',
              'GALACTIC_CIVIL_WAR': 'GALACTIC_CIVIL_WAR',
              'New Republic': 'NEW_REPUBLIC',
              'NR': 'NEW_REPUBLIC',
              'NEW_REPUBLIC': 'NEW_REPUBLIC'
            };

            const charEra = eraMap[activeCharacter.era] || activeCharacter.era;
            const catEra = eraMap[cat.era] || cat.era;
            
            // Fallback par ID si l'era ne matche pas (ID 2=GDC, 3=GCC, 4=NR)
            if (charEra === 'CLONE_WARS' && cat.id === 2) return true;
            if (charEra === 'GALACTIC_CIVIL_WAR' && cat.id === 3) return true;
            if (charEra === 'NEW_REPUBLIC' && cat.id === 4) return true;

            return catEra === charEra;
          }
          return cat.id === 2 || cat.id === 3 || cat.id === 4; 
        }
        return true;
      });

      const finalData = filteredCats.map(cat => {
        const catForums = (forumsData || []).filter(f => f.category_id === cat.id && !f.parent_id);
        const rootForums = catForums.filter(f => hasAccess(f.required_role, userRole)).map(forum => {
          // Extraire le dernier message via la nouvelle colonne aggregée
          const lp = forum.last_post;
          let lastPost = null;

          if (lp) {
            lastPost = {
              id: lp.id,
              topicId: lp.topic?.id,
              title: lp.topic?.title,
              authorName: lp.character?.name || lp.author?.username || 'Anonyme',
              authorColor: lp.character?.main_group?.color,
              rawDate: lp.created_at, // Ajouté pour le tri
              date: new Date(lp.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            };
          }

          return { 
            ...forum, 
            lastPost,
            // On utilise les compteurs de la base de données qui sont maintenant agrégés récursivement
            topics_count: forum.topics_count || 0,
            posts_count: forum.posts_count || 0
          };
        });
        return { ...cat, forums: rootForums };
      });

      setCategories(finalData);
    } catch (err: any) {
      console.error('Erreur critique forum:', err);
    } finally {
      setLoading(false);
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

  if (loading || loadingChar) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        <p className="text-zinc-500 font-outfit text-xs tracking-widest animate-pulse">CHARGEMENT DU FORUM...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec bouton admin discret */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Forums</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Discussion communautaire</p>
        </div>
        <div className="flex items-center gap-3">
          {userRole === 'admin' && (
            <Link href="/forum/admin">
              <Button variant="outline" size="sm" className="border-white/5 bg-white/[0.02] text-[10px] tracking-widest uppercase h-7 px-2">
                <Lock className="w-3 h-3 mr-1" /> Admin
              </Button>
            </Link>
          )}
          {activeCharacter && (
            <div className={cn(
              "px-3 py-1 border text-[9px] font-bold tracking-widest uppercase rounded-sm",
              activeCharacter.era === 'Old Republic' || activeCharacter.era === 'CLONE_WARS' ? "border-blue-500/20 text-blue-400 bg-blue-500/5" :
              activeCharacter.era === 'Galactic Empire' || activeCharacter.era === 'GALACTIC_CIVIL_WAR' ? "border-red-500/20 text-red-400 bg-red-500/5" :
              "border-green-500/20 text-green-400 bg-green-500/5"
            )}>
              {eraNames[activeCharacter.era] || activeCharacter.era.replace(/_/g, ' ')}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Forums HRP du haut (ex: Holonews) */}
        {categories.filter(c => !c.era && c.display_order < 10).map((cat) => renderCategory(cat))}

        {/* 2. Le forum RP (Univers Roleplay) */}
        {categories.filter(c => !!c.era).map((eraCategory) => {
          const eraNamesDb: Record<string, string> = {
            'Ancienne République': 'Guerre des Clones',
            'Empire Galactique': 'Guerre Civile Galactique',
            'Nouvelle République': 'Nouvelle République'
          };
          const displayName = (!activeCharacter && userRole !== 'admin') ? "Univers Roleplay" : (eraNamesDb[eraCategory.name] || eraCategory.name);

          // Trouver le dernier message de toute la catégorie era via les forums déjà processés
          let categoryLastPost = null;
          if (eraCategory.forums && eraCategory.forums.length > 0) {
            // On récupère tous les lastPost des forums de la catégorie et on prend le plus récent
            const lastPosts = eraCategory.forums
              .map((f: any) => f.lastPost)
              .filter((lp: any) => lp !== null)
              .sort((a: any, b: any) => {
                // Pour trier par date, on a besoin d'un objet Date. 
                // Comme on l'a formaté en string, on va utiliser lp.rawDate si on l'ajoute ou comparer les strings si format constant
                // Le mieux est de rajouter rawDate lors du processing
                return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
              });
            
            categoryLastPost = lastPosts[0] || null;
          }

          return (
            <section key={eraCategory.id} className="space-y-0">
              <CategoryHeader 
                title={displayName} 
                icon={Globe} 
                columns={['Galaxie', 'Sujets / Messages', 'Dernier Message']}
              />

              {(!activeCharacter && userRole !== 'admin') ? (
                <Link href="/profile">
                  <div className="forum-row flex items-center p-6 group transition-all rounded-b-md">
                    <div className="w-10 h-10 flex items-center justify-center mr-5 shrink-0 text-zinc-600 group-hover:text-yellow-500 transition-colors bg-white/5 rounded-lg">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-tight">
                        Accès Restreint : {eraNamesDb[eraCategory.name] || eraCategory.name}
                      </h3>
                      <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                        Incarnez un personnage pour accéder au contenu RP de cette ère
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-yellow-500 text-[10px] uppercase tracking-widest font-bold h-8">
                      S'IDENTIFIER
                    </Button>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col border-x border-b border-white/5 rounded-b-md overflow-hidden">
                  <ForumRow
                    id={`era-${eraCategory.id}`}
                    name="Entrer dans la galaxie"
                    description={eraCategory.description || "Explorez les différents secteurs, planètes et avant-postes de cette ère galactique."}
                    imageUrl={eraCategory.image_url}
                    headerImageUrl={eraCategory.header_image_url}
                    href={`/forum/era/${eraCategory.id}`}
                    icon={Globe}
                    topicsCount={eraCategory.forums?.reduce((acc: number, f: any) => acc + (f.topics_count || 0), 0) || 0}
                    postsCount={eraCategory.forums?.reduce((acc: number, f: any) => acc + (f.posts_count || 0), 0) || 0}
                    lastPost={categoryLastPost}
                  />
                </div>
              )}
            </section>
          );
        })}

        {/* 3. Forums HRP du bas (ex: Social, Administratif) */}
        {categories.filter(c => !c.era && c.display_order >= 40).map((cat) => renderCategory(cat))}
      </div>
    </div>
  );

  function renderCategory(cat: any) {
    const Icon = cat.name === 'Holonews' ? Sparkles : (cat.name === 'Administratif' ? Lock : MessageSquare);
    
    return (
      <section key={cat.id} className="space-y-0">
        <CategoryHeader 
          title={cat.name} 
          icon={Icon} 
          columns={['Forum', 'Sujets / Messages', 'Dernier Message']}
        />
        
        <div className="flex flex-col border-x border-b border-white/5 rounded-b-md overflow-hidden">
          {cat.forums && cat.forums.length > 0 ? (
            cat.forums.map((forum: any) => (
              <ForumRow
                key={forum.id}
                id={forum.id}
                name={forum.name}
                description={forum.description}
                imageUrl={forum.image_url}
                headerImageUrl={forum.header_image_url}
                topicsCount={forum.topics_count}
                postsCount={forum.posts_count}
                href={`/forum/${forum.id}`}
                lastPost={forum.lastPost}
              />
            ))
          ) : (
            <div className="p-8 text-center forum-row rounded-b-md text-zinc-700 text-[10px] uppercase font-bold tracking-widest bg-black/20">
              Aucun forum disponible
            </div>
          )}
        </div>
      </section>
    );
  }
}
