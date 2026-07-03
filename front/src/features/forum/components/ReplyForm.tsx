'use client';

import React, { useState } from 'react';
import { apiMutate } from '@/shared/utils/api';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Textarea } from '@/shared/components/ui/Textarea';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { Loader2, Send } from 'lucide-react';

interface ReplyFormProps {
  topicId: number;
  isRP: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReplyForm({ topicId, isRP, onSuccess, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { activeCharacter } = useActiveCharacter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await apiMutate(`/topics/${topicId}/posts`, 'POST', {
        content: content.trim(),
        character_id: isRP ? activeCharacter?.id : null,
      });

      setContent('');
      onSuccess();
    } catch (err: any) {
      console.error('Erreur réponse:', err);
      alert(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-zinc-900/60 border-white/10 space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-outfit text-white">Publier une réponse</h3>
        <p className="text-xs text-zinc-500">
          Identité utilisée : 
          {isRP && activeCharacter ? (
            <b className="text-yellow-500 ml-1">{activeCharacter.name}</b>
          ) : !isRP ? (
            <b className="text-blue-500 ml-1">Compte Utilisateur (HRP)</b>
          ) : (
            <span className="text-red-500 ml-1">Aucun personnage incarné !</span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre réponse ici..."
          className="min-h-[150px] bg-black/40"
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={loading || (isRP && !activeCharacter)}
            className="bg-yellow-500 text-black font-black px-8"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Envoyer la réponse</>}
          </Button>
        </div>
      </form>
    </Card>
  );
}


