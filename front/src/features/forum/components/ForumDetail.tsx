'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, MessageSquare, ChevronRight, Loader2, Globe, User, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Card, CardTitle, CardDescription } from '@/shared/components/ui/Card';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { TopicRow } from '@/shared/components/forum/TopicRow';
import { ForumRow } from '@/shared/components/forum/ForumRow';
import { apiFetch, ApiError } from '@/shared/utils/api';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { cn } from '@/shared/utils/cn';
import TopicForm from './TopicForm';
import Breadcrumbs, { BreadcrumbSegment } from './Breadcrumbs';
import { useRouter } from 'next/navigation';

interface ForumDetailProps {
  forumId: number;
}

export default function ForumDetail({ forumId }: ForumDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forum, setForum] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);
  const { activeCharacter } = useActiveCharacter();
  const [isRP, setIsRP] = useState(false);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);

  useEffect(() => {
    fetchForumData();
  }, [forumId]);

  async function fetchForumData() {
    setLoading(true);
    try {
      const { forum: forumData, ancestors, topics: topicsData } = await apiFetch<{
        forum: any;
        ancestors: { id: number; name: string }[];
        topics: any[];
      }>(`/forums/${forumId}`);

      setForum(forumData);
      setIsRP(!!forumData.category?.era);

      const path: BreadcrumbSegment[] = [];
      if (forumData.category) {
        path.push({
          name: forumData.category.name,
          href: forumData.category.era ? `/forum/era/${forumData.category.id}` : undefined
        });
      }

      // Les ancêtres arrivent du plus proche à la racine : on remet la racine en premier.
      const parents = [...(ancestors || [])]
        .reverse()
        .map(parent => ({ name: parent.name, href: `/forum/${parent.id}` }));
      setBreadcrumbs([...path, ...parents, { name: forumData.name }]);

      // Transformer les sous-forums pour inclure lastPost
      const formattedSubForums = (forumData.children || []).map((sub: any) => {
        const lp = sub.last_post;
        let lastPost = null;

        if (lp) {
          lastPost = {
            id: lp.id,
            topicId: lp.topic?.id,
            title: lp.topic?.title,
            authorName: lp.character?.name || lp.author?.username || 'Anonyme',
            authorColor: lp.character?.main_group?.color,
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
          ...sub, 
          lastPost,
          // On utilise les compteurs de la base de données qui sont maintenant agrégés récursivement
          topics_count: sub.topics_count || 0,
          posts_count: sub.posts_count || 0
        };
      });

      setForum({ ...forumData, sub_forums: formattedSubForums });

      // Formatter les sujets pour inclure les infos du dernier message réel
      const formattedTopics = (topicsData || []).map((topic: any) => {
        const lastPostData = topic.last_post || null;

        const lastPost = {
          id: lastPostData?.id,
          authorName: lastPostData
            ? (lastPostData.character?.name || lastPostData.author?.username || 'Anonyme')
            : (topic.character?.name || topic.author?.username || 'Anonyme'),
          authorColor: lastPostData
            ? lastPostData.character?.main_group?.color
            : topic.character?.main_group?.color,
          date: new Date(topic.updated_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        return { ...topic, formattedLastPost: lastPost };
      });

      setTopics(formattedTopics);

    } catch (err: any) {
      console.error('Erreur chargement forum:', err);
      if (err instanceof ApiError) router.push('/forum');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>;
  if (!forum) return <div className="text-center py-20 text-zinc-500">Forum introuvable.</div>;

  const isGalaxyEntry = forum.name.includes('Galaxie');
  const ForumIcon = forum.type === 'planet' ? Globe : (forum.type === 'location' ? MapPin : MessageSquare);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Breadcrumbs segments={breadcrumbs} />
        {!showNewTopicForm && (
          <Button 
            variant="era-yellow"
            size="sm"
            className="rounded-sm uppercase tracking-widest px-6"
            onClick={() => setShowNewTopicForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Sujet
          </Button>
        )}
      </div>
      
      <header className="relative group overflow-hidden rounded-2xl bg-zinc-950 border border-white/5 shadow-2xl">
        {forum.header_image_url ? (
          <>
            <div className="relative h-72 md:h-96 w-full overflow-hidden">
              <img 
                src={forum.header_image_url} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Ombre portée plus profonde pour la lisibilité du texte */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              {/* Icône de la planète - En haut à droite */}
              {forum.image_url && (
                <div className="absolute top-6 right-6 md:top-8 md:right-8 group z-10">
                  <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-2xl group-hover:bg-yellow-500/20 transition-all duration-700" />
                  <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
                    <img src={forum.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              
              {/* Contenu textuel par-dessus l'image */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 pb-12">
                <div className="max-w-4xl space-y-4">
                  <div className="flex flex-col gap-2">
                    <Badge variant="outline" className="w-fit bg-black/40 backdrop-blur-md border-white/20 text-white py-0.5 px-3">
                      {forum.type || 'Forum'}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                      {forum.name}
                    </h1>
                  </div>
                  
                  {forum.description && (
                    <p className="text-[11px] md:text-xs text-zinc-300 font-medium leading-relaxed max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-4 md:line-clamp-none">
                      {forum.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {forum.image_url ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-zinc-900 shrink-0">
                <img src={forum.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl border border-white/10 shadow-xl bg-zinc-900/80 backdrop-blur-xl flex items-center justify-center shrink-0">
                <ForumIcon className="w-10 h-10 text-zinc-600" />
              </div>
            )}
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-widest text-zinc-400 py-0 h-5 w-fit mx-auto md:mx-0">
                  {forum.type || 'Forum'}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                {forum.name}
              </h1>
              {forum.description && (
                <p className="text-[11px] md:text-xs text-zinc-400 font-medium italic mt-3 max-w-3xl leading-relaxed mx-auto md:mx-0">
                  {forum.description}
                </p>
              )}
            </div>
          </div>
        )}
      </header>

      {showNewTopicForm && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <TopicForm forumId={forumId} isRP={isRP} onSuccess={() => { setShowNewTopicForm(false); fetchForumData(); }} onCancel={() => setShowNewTopicForm(false)} />
        </div>
      )}
      
      <div className="space-y-8">
        {/* Sous-sections */}
        {forum.sub_forums && forum.sub_forums.length > 0 && (
          <section className="space-y-0">
            <CategoryHeader 
              title="Sous-forums" 
              icon={Globe} 
              columns={['Forum', 'Sujets / Messages', 'Dernier Message']}
            />
            <div className="flex flex-col border-x border-b border-white/5 rounded-b-md overflow-hidden">
              {forum.sub_forums.map((sub: any) => (
                <ForumRow
                  key={sub.id}
                  id={sub.id}
                  name={sub.name}
                  description={sub.description}
                  imageUrl={sub.image_url}
                  headerImageUrl={sub.header_image_url}
                  topicsCount={sub.topics_count || 0}
                  postsCount={sub.posts_count || 0}
                  href={`/forum/${sub.id}`}
                  icon={sub.type === 'planet' ? Globe : MapPin}
                  lastPost={sub.lastPost}
                />
              ))}
            </div>
          </section>
        )}

        {/* Topics */}
        <section className="space-y-0">
          <CategoryHeader 
            title="Sujets" 
            icon={MessageSquare} 
            columns={['Sujet', 'Réponses / Vues', 'Dernier Message']}
            action={
              !showNewTopicForm && (
                <Button 
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[10px] uppercase tracking-[0.2em] font-bold text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/5 px-3"
                  onClick={() => {
                    setShowNewTopicForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Plus className="w-3 h-3 mr-1.5" />
                  Nouveau
                </Button>
              )
            }
          />
          <div className="flex flex-col border-x border-b border-white/5 rounded-b-md overflow-hidden">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  id={topic.id}
                  title={topic.title}
                  authorName={topic.character_id ? (topic.character?.name || 'Inconnu') : (topic.author?.username || 'Inconnu')}
                  authorAvatar={topic.character_id ? topic.character?.avatar : topic.author?.avatar_url}
                  authorColor={topic.character?.main_group?.color}
                  repliesCount={topic.replies_count}
                  viewsCount={topic.views_count}
                  createdAt={topic.created_at}
                  isPinned={topic.is_pinned}
                  isLocked={topic.is_locked}
                  href={`/topic/${topic.id}`}
                  lastPost={topic.formattedLastPost}
                />
              ))
            ) : (
              <div className="p-12 text-center forum-row rounded-b-md text-zinc-700 text-[10px] uppercase font-bold tracking-widest bg-black/20">
                Aucun sujet dans ce forum
              </div>
            )}
          </div>

          {!showNewTopicForm && topics.length > 0 && (
            <div className="flex justify-center pt-8">
              <Button 
                variant="era-yellow"
                size="md"
                className="rounded-sm uppercase tracking-[0.2em] px-8 shadow-xl shadow-yellow-500/10"
                onClick={() => {
                  setShowNewTopicForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un nouveau sujet
              </Button>
            </div>
          )}
        </section>

        {/* Forum Stats - phpBB Style */}
        <section className="mt-12 space-y-0">
          <CategoryHeader title="Statistiques du forum" icon={Globe} />
          <div className="forum-row p-6 rounded-b-md bg-black/20 border-x border-b border-white/5">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-300">
                    {topics.length} sujet{topics.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Total des sujets</p>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-8 bg-white/5" />
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-300">
                    {topics.reduce((acc, t) => acc + (t.replies_count || 0), 0)} message{topics.reduce((acc, t) => acc + (t.replies_count || 0), 0) > 1 ? 's' : ''}
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Total des messages</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
