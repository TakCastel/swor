'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, loginUser } from '@/shared/utils/api';
import { useAuth } from '@/shared/hooks/useAuth';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { useToast } from '@/shared/contexts/ToastContext';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const { refreshActiveCharacter } = useActiveCharacter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser({ email, password });
      // Propager la session dans toute l'app (Header, personnage actif…)
      await Promise.all([refresh(), refreshActiveCharacter()]);
      showToast('Connexion réussie ! Heureux de vous revoir.', 'success');
      router.push('/');
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Une erreur est survenue lors de la connexion';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black">
      <Card className="w-full max-w-md border-white/5 bg-zinc-900/40 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-outfit text-yellow-500">Connexion</CardTitle>
          <CardDescription>
            Heureux de vous revoir dans la galaxie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/40"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mot de passe</label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70 hover:text-yellow-500 transition-colors"
                >
                  Oublié ?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/40"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-black mt-2" 
              disabled={loading}
            >
              {loading ? 'Connexion...' : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-zinc-500">
            Pas encore de compte ?{' '}
            <Link href="/auth/signup" className="text-yellow-500 hover:underline font-bold">
              Inscrivez-vous
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
