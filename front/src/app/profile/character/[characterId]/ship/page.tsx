'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/shared/utils/supabase';
import { Card, CardTitle } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Rocket, Zap, Shield, Target, Cpu, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export default function ShipPage() {
  const params = useParams();
  const characterId = params.characterId as string;
  
  const [loading, setLoading] = useState(true);
  const [ship, setShip] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    fetchShip();
  }, [characterId]);

  async function fetchShip() {
    try {
      // 1. Fetch ship
      const { data: shipData, error: shipError } = await supabase
        .from('ships')
        .select('*')
        .eq('character_id', characterId)
        .single();
      
      if (shipError && shipError.code !== 'PGRST116') throw shipError; // PGRST116 means no row found
      setShip(shipData);

      // 2. Fetch modules if ship exists
      if (shipData) {
        const { data: moduleData, error: moduleError } = await supabase
          .from('ship_modules')
          .select('*')
          .eq('ship_id', shipData.id);

        if (moduleError) throw moduleError;
        setModules(moduleData || []);
      }
    } catch (err) {
      console.error('Erreur vaisseau:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>;

  if (!ship) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center border-2 border-dashed border-white/10">
          <Rocket className="w-10 h-10 text-zinc-700" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-outfit text-white">Aucun Vaisseau Enregistré</h2>
          <p className="text-zinc-500 max-w-sm">Vous ne possédez pas encore de vaisseau spatial. Achetez-en un dans un chantier naval galactique.</p>
        </div>
        <button className="px-8 py-3 rounded-2xl bg-yellow-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10">
          Visiter le Chantier Naval
        </button>
      </div>
    );
  }

  const moduleIcons: any = {
    engine: Zap,
    shield: Shield,
    weapon: Target,
    utility: Cpu,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-outfit text-white">{ship.name}</h2>
          <p className="text-zinc-500 text-sm">{ship.model} • Enregistré sous le matricule #{ship.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <Badge variant="yellow" className="px-4 py-1.5 text-xs">Vaisseau Personnel</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-6 relative overflow-hidden group bg-zinc-900/40 border-white/5">
          <Rocket className="absolute -right-12 -bottom-12 w-64 h-64 text-white/[0.02] -rotate-12 group-hover:scale-110 transition-transform duration-700" />
          <CardTitle className="text-xl">État Général</CardTitle>
          <div className="space-y-6 relative">
            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-bold uppercase tracking-widest">Coque</span>
                <span className="text-green-500">100%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-bold uppercase tracking-widest">Carburant Hyperdrive</span>
                <span className="text-yellow-500">100%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-full"></div>
              </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 space-y-1">
                <p className="text-[8px] uppercase font-bold text-zinc-500 tracking-widest">Fret</p>
                <p className="text-lg font-bold text-white">{ship.current_cargo_weight || 0} / {ship.cargo_capacity} T</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 space-y-1">
                <p className="text-[8px] uppercase font-bold text-zinc-500 tracking-widest">Autonomie</p>
                <p className="text-lg font-bold text-white">Illimitée</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white px-2">Modules Installés</h3>
          <div className="space-y-3">
            {modules.length > 0 ? modules.map((module) => {
              const Icon = moduleIcons[module.type] || Cpu;
              return (
                <div key={module.id} className="p-4 rounded-3xl bg-zinc-900/60 border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                      module.status === 'active' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{module.name}</p>
                      <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">{module.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {module.status === 'active' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <p className="text-xs text-zinc-600 italic">Aucun module installé.</p>
              </div>
            )}
            <button className="w-full p-4 rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center gap-2 text-zinc-600 hover:border-white/10 hover:text-zinc-400 transition-all text-sm font-bold uppercase tracking-widest">
              + Ajouter un Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
