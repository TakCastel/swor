'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/shared/utils/supabase';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Trash2, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
      }
      setChecking(false);
    };
    checkUser();
  }, [router]);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'SUPPRIMER') return;
    
    setLoading(true);
    setError(null);

    try {
      // Pour supprimer un compte dans Supabase côté client, 
      // on utilise généralement une Edge Function car auth.admin est requis.
      // Mais ici on va simuler ou expliquer que c'est une action critique.
      // Note: supabase.auth.admin.deleteUser(id) n'est pas dispo côté client sans clé service role.
      
      // Alternative: appeler une route d'API qui fait la suppression
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      await supabase.auth.signOut();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Action impossible sans configuration serveur appropriée.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

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
              Pour confirmer la suppression de votre compte <strong>{user?.email}</strong>, veuillez taper <span className="text-white font-mono font-bold">SUPPRIMER</span> ci-dessous :
            </p>
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
            disabled={confirmText !== 'SUPPRIMER' || loading}
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



