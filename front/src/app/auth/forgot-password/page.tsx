'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/shared/utils/supabase';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Mail, Send, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black">
      <Card className="w-full max-w-md border-white/5 bg-zinc-900/40 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-outfit text-yellow-500">Mot de passe oublié</CardTitle>
          <CardDescription>
            {success 
              ? "Vérifiez votre boîte mail" 
              : "Entrez votre email pour réinitialiser votre accès"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <p className="text-sm text-zinc-400">
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
              </p>
              <Button variant="outline" className="w-full p-0">
                <Link href="/auth/login" className="w-full h-full flex items-center justify-center">
                  Retour à la connexion
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email</label>
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

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-black" 
                disabled={loading}
              >
                {loading ? 'Envoi...' : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer le lien
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Link href="/auth/login" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

