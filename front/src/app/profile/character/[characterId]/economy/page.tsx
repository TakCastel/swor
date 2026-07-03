'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch, apiMutate } from '@/shared/utils/api';
import { Card, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Wallet, TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownLeft, Loader2, ShieldCheck, Save, Edit2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export default function EconomyPage() {
  const params = useParams();
  const characterId = params.characterId as string;
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [character, setCharacter] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  // MJ Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editIncome, setEditIncome] = useState(0);
  const [editExpenses, setEditExpenses] = useState(0);

  useEffect(() => {
    fetchData();
  }, [characterId]);

  async function fetchData() {
    try {
      // 1. Get User Role
      const me = await apiFetch<{ role?: string }>('/me').catch(() => null);
      setUserRole(me?.role || 'user');

      // 2. Fetch credits, monthly flows & history
      const economy = await apiFetch<any>(`/characters/${characterId}/economy`);

      const charData = {
        credits: economy.credits,
        monthly_income: economy.monthly_income,
        monthly_expenses: economy.monthly_expenses,
      };
      setCharacter(charData);
      setEditIncome(charData.monthly_income || 0);
      setEditExpenses(charData.monthly_expenses || 0);
      setHistory(economy.history || []);
    } catch (err) {
      console.error('Erreur économie:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMJUpdate() {
    setUpdating(true);
    try {
      await apiMutate(`/characters/${characterId}`, 'PATCH', {
        monthly_income: editIncome,
        monthly_expenses: editExpenses
      });
      setCharacter({ ...character, monthly_income: editIncome, monthly_expenses: editExpenses });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour (Seuls les MJ/Admin peuvent modifier ces champs)');
    } finally {
      setUpdating(false);
    }
  }

  const isMJ = userRole === 'admin' || userRole === 'game_master';

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-outfit text-white">Fiche Économique</h2>
          <p className="text-zinc-500 text-sm">Suivez vos transactions et votre fortune galactique.</p>
        </div>
        
        {isMJ && (
          <Button 
            variant={isEditing ? 'outline' : 'secondary'} 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-xl border-yellow-500/20 text-yellow-500"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            {isEditing ? 'Annuler l\'édition MJ' : 'Modifier les flux (MJ)'}
          </Button>
        )}
      </div>

      {/* Flux Récurrents (Mensuels) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={cn(
          "p-6 border-white/5 bg-zinc-900/40 relative overflow-hidden group",
          isEditing && "ring-2 ring-yellow-500/50 border-yellow-500/50"
        )}>
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Revenus Mensuels (Salaire)</span>
              </div>
              {isEditing ? (
                <div className="pt-2">
                  <Input 
                    type="number" 
                    value={editIncome} 
                    onChange={(e) => setEditIncome(parseInt(e.target.value) || 0)}
                    className="bg-black/60 text-2xl font-mono text-green-500 h-14"
                  />
                </div>
              ) : (
                <p className="text-3xl font-black text-green-500 font-mono">+{character?.monthly_income?.toLocaleString() || 0} <span className="text-sm">¤/mois</span></p>
              )}
            </div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">Versés automatiquement le 1er du mois par l'Empire ou votre employeur.</p>
        </Card>

        <Card className={cn(
          "p-6 border-white/5 bg-zinc-900/40 relative overflow-hidden group",
          isEditing && "ring-2 ring-yellow-500/50 border-yellow-500/50"
        )}>
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-500">
                <TrendingDown className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Charges Mensuelles (Entretien)</span>
              </div>
              {isEditing ? (
                <div className="pt-2">
                  <Input 
                    type="number" 
                    value={editExpenses} 
                    onChange={(e) => setEditExpenses(parseInt(e.target.value) || 0)}
                    className="bg-black/60 text-2xl font-mono text-red-500 h-14"
                  />
                </div>
              ) : (
                <p className="text-3xl font-black text-red-500 font-mono">-{character?.monthly_expenses?.toLocaleString() || 0} <span className="text-sm">¤/mois</span></p>
              )}
            </div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">Loyer, entretien du vaisseau et frais de vie prélevés automatiquement.</p>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-4 animate-in fade-in zoom-in-95">
          <Button onClick={handleMJUpdate} disabled={updating} className="bg-yellow-500 text-black font-black px-8">
            {updating ? 'Mise à jour...' : <><Save className="w-4 h-4 mr-2" /> Valider les nouveaux flux</>}
          </Button>
        </div>
      )}

      {/* Solde Actuel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3 p-8 space-y-4 bg-yellow-500/[0.02] border-yellow-500/10 shadow-[0_0_50px_rgba(234,179,8,0.05)]">
          <div className="flex items-center gap-3 text-zinc-500">
            <Wallet className="w-5 h-5 text-yellow-500" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Crédits disponibles en poche</span>
          </div>
          <p className="text-6xl font-black text-white font-mono tracking-tighter">
            {character?.credits?.toLocaleString() || 0} <span className="text-yellow-500 text-3xl italic ml-2 text-glow">¤</span>
          </p>
        </Card>
      </div>

      {/* Historique */}
      <Card className="p-0 overflow-hidden bg-zinc-900/40 border-white/5">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <CardTitle className="text-xl">Historique des Flux</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-zinc-500 border-zinc-500/20">Tous les flux</Badge>
          </div>
        </div>
        
        {history.length > 0 ? (
          <div className="divide-y divide-white/5">
            {history.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors group">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                    transaction.type === 'income' 
                      ? "bg-green-500/10 border-green-500/20 text-green-500" 
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                  )}>
                    {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-yellow-500 transition-colors">{transaction.description}</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{new Date(transaction.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={cn(
                    "text-xl font-black font-mono",
                    transaction.type === 'income' ? "text-green-500" : "text-red-500"
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ¤
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
            <Clock className="w-12 h-12 text-zinc-800 mx-auto" />
            <p className="text-zinc-600 italic font-medium">Aucun mouvement de crédits pour le moment.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
