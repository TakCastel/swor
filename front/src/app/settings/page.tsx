'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Save, Loader2, AlertCircle, CheckCircle2, Camera, ArrowLeft, Trash2 } from 'lucide-react';
import { apiFetch, apiMutate, fetchCurrentUser } from '@/shared/utils/api';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bioHrp, setBioHrp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const user = await fetchCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);

      const profile = await apiFetch<any>('/me');
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url || '');
      setBioHrp(profile.bio_hrp || '');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      await apiMutate('/me/profile', 'PATCH', {
        username,
        avatar_url: avatarUrl,
        bio_hrp: bioHrp,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-outfit text-white">Paramètres du compte</h1>
      </div>

      <div className="grid gap-8">
        <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Profil Personnel (HRP)</CardTitle>
            <CardDescription>Modifiez votre identité de joueur.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-zinc-800">
                  {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><User className="w-8 h-8" /></div>}
                </div>
                <div className="flex-grow space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">URL de l'avatar Joueur</label>
                  <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} icon={Camera} placeholder="https://..." />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pseudo Joueur</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} icon={User} placeholder="Pseudo" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Biographie HRP</label>
                  <textarea 
                    value={bioHrp} 
                    onChange={(e) => setBioHrp(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-yellow-500/50 min-h-[100px]"
                    placeholder="Parlez de vous ici (pas de vos persos)..."
                  />
                </div>
                <div className="space-y-2 opacity-50">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email (non modifiable)</label>
                  <Input value={user?.email || ''} disabled icon={Mail} />
                </div>
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
              {success && <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex gap-2"><CheckCircle2 className="w-4 h-4" />Modifications enregistrées</div>}

              <Button type="submit" className="w-full bg-yellow-500 text-black font-black" disabled={updating}>
                {updating ? 'Enregistrement...' : <><Save className="w-4 h-4 mr-2" /> Enregistrer les modifications</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-red-500/10 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500">Zone Critique</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-white font-bold">Supprimer mon compte</p>
              <p className="text-zinc-500 text-xs text-balance">Cette action supprimera définitivement vos données et tous vos personnages.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => router.push('/auth/delete-account')}>
              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
