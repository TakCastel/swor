'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/shared/utils/supabase';
import { useToast } from '@/shared/contexts/ToastContext';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.session) {
        // Utilisateur auto-confirmé et connecté
        showToast('Bienvenue ! Votre compte a été créé avec succès.', 'success');
        router.push('/');
        router.refresh();
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-500/20 bg-green-500/5 backdrop-blur-xl text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-outfit text-green-500">Inscription réussie !</CardTitle>
            <CardDescription className="text-green-500/70">
              Veuillez vérifier vos emails pour confirmer votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm">
              Une fois votre email confirmé, vous pourrez vous connecter et commencer votre aventure galactique.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full p-0">
              <Link href="/auth/login" className="w-full h-full flex items-center justify-center">
                Retour à la connexion
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black">
      <Card className="w-full max-w-md border-white/5 bg-zinc-900/40 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-outfit text-yellow-500">Rejoindre l'aventure</CardTitle>
          <CardDescription>
            Créez votre compte pour explorer la galaxie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nom d'utilisateur</label>
              <Input
                type="text"
                placeholder="Jedi_Shadow"
                icon={UserPlus}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-black/40"
              />
            </div>
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
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Mot de passe</label>
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
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Confirmer le mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Création...' : (
                <>
                  <UserPlus className="w-4 h-4" />
                  S'inscrire
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-zinc-500">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-yellow-500 hover:underline font-bold">
              Connectez-vous
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
