'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/shared/utils/supabase';
import { Card, CardTitle, CardDescription } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Briefcase, Shield, Zap, Search, Filter, Loader2, Award } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import { cn } from '@/shared/utils/cn';

export default function InventoryPage() {
  const params = useParams();
  const characterId = params.characterId as string;
  
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [startingItem, setStartingItem] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, [characterId]);

  async function fetchInventory() {
    try {
      // 1. Fetch character starting item
      const { data: charData } = await supabase
        .from('characters')
        .select('starting_item')
        .eq('id', characterId)
        .single();
      
      setStartingItem(charData?.starting_item);

      // 2. Fetch inventory items
      const { data, error } = await supabase
        .from('character_inventory')
        .select(`
          *,
          item:items_catalog(*)
        `)
        .eq('character_id', characterId);

      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error('Erreur inventaire:', err);
    } finally {
      setLoading(false);
    }
  }

  const rarityColors: any = {
    common: 'text-zinc-400 border-zinc-400/20 bg-zinc-400/5',
    uncommon: 'text-green-400 border-green-400/20 bg-green-400/5',
    rare: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    epic: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    legendary: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-outfit text-white">Inventaire</h2>
          <p className="text-zinc-500 text-sm">Gérez vos objets, armes et équipements.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input className="pl-10" placeholder="Rechercher un objet..." />
          </div>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Objet Spécial de Départ */}
        {startingItem && (
          <Card className="p-6 space-y-4 group border-yellow-500/20 bg-yellow-500/[0.02]">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-yellow-500/30 bg-yellow-500/10 text-yellow-500">
                <Award className="w-6 h-6" />
              </div>
              <Badge variant="yellow" className="text-[10px] uppercase font-bold">Objet de Départ</Badge>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-lg">{startingItem}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Équipement spécial lié à votre métier.</p>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[8px] uppercase font-bold text-zinc-600 tracking-tighter">Statut : Équipé</span>
              <button className="text-xs font-bold text-yellow-500/80 hover:text-yellow-500 transition-colors uppercase tracking-widest">Voir</button>
            </div>
          </Card>
        )}

        {inventory.map((item) => (
          <Card key={item.id} className="p-6 space-y-4 group">
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-300",
                rarityColors[item.item.rarity]
              )}>
                {item.item.type === 'weapon' ? <Zap className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
              </div>
              <Badge variant="outline" className={cn("text-[10px] uppercase tracking-widest font-bold", rarityColors[item.item.rarity])}>
                {item.item.rarity}
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-white text-lg">{item.item.name}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.item.description}</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[8px] uppercase font-bold text-zinc-600 tracking-tighter">Quantité</p>
                  <p className="text-sm font-mono text-zinc-300">x{item.quantity}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] uppercase font-bold text-zinc-600 tracking-tighter">Poids</p>
                  <p className="text-sm font-mono text-zinc-300">{item.item.weight}kg</p>
                </div>
              </div>
              <button className="text-xs font-bold text-yellow-500/80 hover:text-yellow-500 transition-colors uppercase tracking-widest">Utiliser</button>
            </div>
          </Card>
        ))}
        
        {/* Empty Slots */}
        {Array.from({ length: Math.max(0, 3 - inventory.length) }).map((_, i) => (
          <div key={i} className="rounded-[2.5rem] border-2 border-dashed border-white/5 flex items-center justify-center p-12 group hover:border-white/10 transition-colors">
            <span className="text-zinc-800 font-outfit text-xl group-hover:text-zinc-700 transition-colors">Emplacement vide</span>
          </div>
        ))}
      </div>
    </div>
  );
}
