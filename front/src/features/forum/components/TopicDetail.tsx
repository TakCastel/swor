'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Share2, MoreHorizontal, Loader2, User, MessageSquare, ShieldCheck, Zap, Reply } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardTitle } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { PostView } from '@/shared/components/forum/PostView';
import { supabase } from '@/shared/utils/supabase';
import { cn } from '@/shared/utils/cn';
import ReplyForm from './ReplyForm';
import Breadcrumbs, { BreadcrumbSegment } from './Breadcrumbs';

interface TopicDetailProps {
  topicId: number;
}

export default function TopicDetail({ topicId }: TopicDetailProps) {
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    fetchTopicData();
  }, [topicId]);

  async function fetchTopicData() {
    setLoading(true);
    try {
      // 1. Fetch topic info with forum and category
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select(`
          *,
          forum:forums(id, name, parent_id, category:forum_categories(id, name, era))
        `)
        .eq('id', topicId)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // 2. Build Breadcrumbs
      const path: BreadcrumbSegment[] = [];
      const forumData = topicData.forum;

      if (forumData) {
        // Add category
        if (forumData.category) {
          path.push({ name: forumData.category.name });
        }

        // Fetch parents recursively
        let currentParentId = forumData.parent_id;
        const parents = [];
        
        while (currentParentId) {
          const { data: parent } = await supabase
            .from('forums')
            .select('id, name, parent_id')
            .eq('id', currentParentId)
            .single();
          
          if (parent) {
            parents.unshift({
              name: parent.name,
              href: `/forum/${parent.id}`
            });
            currentParentId = parent.parent_id;
          } else {
            currentParentId = null;
          }
        }
        
        setBreadcrumbs([
          ...path, 
          ...parents, 
          { name: forumData.name, href: `/forum/${forumData.id}` },
          { name: topicData.title }
        ]);
      }

      // 3. Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username, avatar_url, role, title_hrp),
          character:characters(
            name, 
            avatar, 
            class, 
            main_group:groups(name, color)
          )
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // 4. Increment views
      await supabase.rpc('increment_topic_views', { topic_id: topicId });

    } catch (err: any) {
      console.error('--- ERREUR FETCH TOPIC ---');
      console.error('MESSAGE: ' + (err.message || 'n/a'));
      console.error('CODE: ' + (err.code || 'n/a'));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (!topic) return <div className="text-center py-20 text-zinc-500">Sujet introuvable.</div>;

  const isRP = !!topic.forum?.category?.era;

  return (
    <div className="space-y-6">
      <Breadcrumbs segments={breadcrumbs} />
      
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white leading-tight uppercase tracking-tight">{topic.title}</h1>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>Publié le {new Date(topic.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              <span className="text-zinc-800">|</span>
              <span>{topic.views_count} vues</span>
              {isRP && (
                <>
                  <span className="text-zinc-800">|</span>
                  <span className="text-yellow-500/70">CHRONOLOGIE : {topic.forum?.category?.era?.replace(/_/g, ' ')}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 border-white/5 bg-white/[0.02] text-[10px] uppercase font-bold tracking-widest">
              <Share2 className="w-3 h-3 mr-1.5" /> Partager
            </Button>
            <Button 
              className="h-8 bg-yellow-500 text-black hover:bg-yellow-400 text-[10px] uppercase font-bold tracking-widest px-4"
              onClick={() => setShowReplyForm(true)}
            >
              <Reply className="w-3 h-3 mr-1.5" /> Répondre
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostView
            key={post.id}
            id={post.id}
            author={{
              name: post.character_id ? (post.character?.name || 'Inconnu') : (post.author?.username || 'Inconnu'),
            avatar: post.character_id ? post.character?.avatar : post.author?.avatar_url,
            title: post.character_id ? post.character?.class : post.author?.title_hrp,
              groupName: post.character?.main_group?.name,
              groupColor: post.character?.main_group?.color,
              isAdmin: post.author?.role === 'admin' || post.author?.role === 'game_master',
              isOnline: false
            }}
            content={post.content}
            createdAt={post.created_at}
            isFirstPost={index === 0}
            onReply={() => setShowReplyForm(true)}
            onQuote={() => {
              // Quote logic here
            }}
          />
        ))}
      </div>
      
      {/* Zone de réponse rapide */}
      {showReplyForm ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ReplyForm 
            topicId={topicId} 
            isRP={isRP} 
            onSuccess={() => {
              setShowReplyForm(false);
              fetchTopicData();
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      ) : (
        <div className="forum-row p-6 text-center rounded-md flex flex-col items-center gap-4 border-dashed border-zinc-800">
          <p className="text-xs text-zinc-500 font-medium">
            {isRP 
              ? `Vous postez en tant que personnage (RP)`
              : "Vous postez avec votre compte utilisateur (HRP)"
            }
          </p>
          <Button 
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white font-bold px-8 h-9 text-xs uppercase tracking-widest rounded-sm"
            onClick={() => setShowReplyForm(true)}
          >
            Répondre au sujet
          </Button>
        </div>
      )}
    </div>
  );
}
