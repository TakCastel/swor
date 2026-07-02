'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, deleteAccount } from '@/shared/utils/api';
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { AlertTriangle, ArrowLeft, Loader2, Lock } from 'lucide-react';

export default function DeleteAccountPage() {
  const router = useRouter();
  const { user, loading: checking } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== 'SUPPRIMER' || !password) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteAccount(password);
      router.push('/');
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Erreur lors de la suppression du compte.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-md border-red-500/20 bg-red-500/5 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-outfit text-red-500">Zone de Danger</CardTitle>
          <CardDescription className="text-red-500/70">
            Cette action est irréversible. Toutes vos données (personnages, inventaire, messages) seront définitivement supprimées.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
            <p className="text-sm text-zinc-400">
              Pour confirmer la suppression de votre compte <strong>{user.email}</strong>, saisissez votre mot de passe puis tapez <span className="text-white font-mono font-bold">SUPPRIMER</span> :
            </p>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe actuel"
                className="w-full bg-black/60 border border-red-500/30 rounded-lg py-2 pl-10 pr-2 text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full bg-black/60 border border-red-500/30 rounded-lg p-2 text-center text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            variant="danger" 
            className="w-full h-12 font-black"
            disabled={confirmText !== 'SUPPRIMER' || !password || loading}
            onClick={handleDeleteAccount}
          >
            {loading ? 'Suppression...' : 'Supprimer définitivement mon compte'}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Annuler et retourner
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
