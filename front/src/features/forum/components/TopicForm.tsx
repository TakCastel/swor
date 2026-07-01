'use client';

import React, { useState } from 'react';
import { supabase } from '@/shared/utils/supabase';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { Textarea } from '@/shared/components/ui/Textarea';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { Loader2, Send } from 'lucide-react';

interface TopicFormProps {
  forumId: number;
  isRP: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TopicForm({ forumId, isRP, onSuccess, onCancel }: TopicFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { activeCharacter } = useActiveCharacter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      // 1. Créer le sujet
      const { data: topic, error: topicError } = await supabase
        .from('topics')
        .insert({
          forum_id: forumId,
          author_id: user.id,
          character_id: isRP ? activeCharacter?.id : null,
          title: title.trim()
        })
        .select()
        .single();

      if (topicError) throw topicError;

      // 2. Créer le premier message (post)
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          topic_id: topic.id,
          author_id: user.id,
          character_id: isRP ? activeCharacter?.id : null,
          content: content.trim()
        });

      if (postError) throw postError;

      onSuccess();
    } catch (err: any) {
      console.error('Erreur creation sujet:', err);
      alert(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-zinc-900/60 border-white/10 space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-outfit text-white">Nouvelle Transmission</h3>
        <p className="text-xs text-zinc-500">
          Vous allez publier dans un secteur {isRP ? 'RP' : 'HRP'}. 
          {isRP && activeCharacter ? (
            <span> Identité utilisée : <b className="text-yellow-500">{activeCharacter.name}</b></span>
          ) : !isRP ? (
            <span> Identité utilisée : <b className="text-blue-500">Compte Utilisateur</b></span>
          ) : (
            <span className="text-red-500"> Attention : Aucun personnage incarné !</span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Titre du sujet</label>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: [Mission] Rapport de patrouille sur Coruscant"
            className="bg-black/40 border-white/5 h-12 text-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Message</label>
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre message ici..."
            className="min-h-[200px] bg-black/40"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={loading || (isRP && !activeCharacter)}
            className="bg-yellow-500 text-black font-black px-8"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Envoyer</>}
          </Button>
        </div>
      </form>
    </Card>
  );
}


