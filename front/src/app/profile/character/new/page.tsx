'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Shield, Award, ArrowLeft, Save, Loader2, AlertCircle, Users, BookOpen, Heart, Zap, Crosshair, Sparkles, Ghost, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '@/shared/utils/supabase';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import { Select } from '@/shared/components/ui/Select';
import { Group } from '@/features/profile/types';

// DATA DE CRÉATION
const ERAS_DISPLAY = {
  'CLONE_WARS': 'Guerre des Clones',
  'GALACTIC_CIVIL_WAR': 'Guerre Civile Galactique',
  'NEW_REPUBLIC': 'Nouvelle République'
};
const ERAS = Object.keys(ERAS_DISPLAY);
const SPECIES = [
  'Humain', 'Aqualish', 'Arkanien', 'Bith', 'Bothan', 'Cathar', 'Céréen', 'Chiss', 
  'Clawdite', 'Devaronien', 'Duros', 'Ewok', 'Falleen', 'Gamorréen', 'Gand', 
  'Géonosien', 'Gotal', 'Gungan', 'Hutt', 'Ithorien', 'Jawa', 'Kaleesh', 
  'Kaminoen', 'Kel Dor', 'Lannik', 'Lasat', 'Miraluka', 'Mirialan', 'Mon Calamari', 
  'Muun', 'Nautolan', 'Neimoidien', 'Nikto', 'Ortalan', 'Pantorien', 'Pau\'an', 
  'Quarren', 'Quermien', 'Rakata', 'Rattataki', 'Rodien', 'Selkath', 'Shistavanen', 
  'Sith (Espèce)', 'Snivvian', 'Sullustéen', 'Talz', 'Tholothien', 'Togorien', 
  'Togruta', 'Toydarien', 'Trandoshan', 'Tusken', 'Twi\'lek', 'Umbaran', 'Verpine', 
  'Weequay', 'Wookiee', 'Zabrak', 'Zeltron', 'Zygerrien', 'Autre'
].sort();

const OCCUPATIONS = [
  {
    category: 'COMBAT',
    icon: Crosshair,
    jobs: [
      { name: 'Soldat', skills: ['Tir de précision', 'Tactique militaire', 'Explosifs', 'Médecine de combat', 'Armes lourdes'], item: 'Fusil Blaster DC-15' },
      { name: 'Chasseur de Primes', skills: ['Pistage', 'Capture', 'Combat à mains nues', 'Intimidation', 'Jetpack'], item: 'Grappin de poignet' },
      { name: 'Garde Royal', skills: ['Défense rapprochée', 'Arts martiaux', 'Vigilance', 'Loyauté indéfectible', 'Armes à haste'], item: 'Pique de force' }
    ]
  },
  {
    category: 'FORCE',
    icon: Sparkles,
    jobs: [
      { name: 'Jedi', skills: ['Saut de Force', 'Télékynésie', 'Forme Shii-Cho', 'Persuasion Force', 'Sens de la Force'], item: "Sabre Laser d'entraînement" },
      { name: 'Sith', skills: ['Éclairs de Force', 'Étranglement', 'Rage de combat', 'Manipulation', 'Forme Makashi'], item: 'Cristal Kyber synthétique' },
      { name: 'Adepte de la Force', skills: ['Vision', 'Guérison par la Force', 'Dissimulation', 'Psychométrie', 'Harmonie'], item: 'Bâton orné' }
    ]
  },
  {
    category: 'TECH & PILOTAGE',
    icon: Zap,
    jobs: [
      { name: 'Pilote', skills: ['Manœuvres évasives', 'Navigation Hyperespace', 'Combat spatial', 'Réparation cockpit', 'Astrogation'], item: 'Comlink longue portée' },
      { name: 'Ingénieur', skills: ['Slicing (Piratage)', 'Réparation de droïdes', "Modification d'armes", 'Énergies spatiales', 'Logistique'], item: 'Outil de diagnostic' },
      { name: 'Slicer', skills: ['Cryptographie', 'Sabotage réseau', 'Infiltration digitale', 'Surveillance', 'Contre-mesures'], item: 'Datapad modifié' }
    ]
  },
  {
    category: 'SOCIAL & INTRIGUE',
    icon: Briefcase,
    jobs: [
      { name: 'Sénateur / Diplomate', skills: ['Éloquence', 'Négociation', 'Étiquette galactique', 'Réseautage', 'Droit galactique'], item: 'Sceau officiel' },
      { name: 'Espion', skills: ['Déguisement', 'Discrétion', 'Écoute', "Vol d'informations", 'Interrogatoire'], item: 'Projecteur holographique miniature' },
      { name: 'Marchand', skills: ['Estimation', 'Marchandage', 'Connaissance du marché', 'Logistique brute', 'Pot-de-vin'], item: 'Scanner de marchandises' }
    ]
  },
  {
    category: 'UNDERWORLD',
    icon: Ghost,
    jobs: [
      { name: 'Contrebandier', skills: ['Pilotage de cargo', 'Dissimulation de fret', 'Savoir criminel', 'Tir réflexe', 'Évasion'], item: 'Blaster DL-44' },
      { name: 'Assassin', skills: ['Poison', 'Tir de sniper', 'Coup de grâce', 'Patience infinie', 'Anatomie'], item: 'Dague vibro' },
      { name: 'Chef de Gang', skills: ['Commandement', 'Recrutement', 'Gestion de territoire', 'Raquet', 'Menace'], item: 'Médaillon de rang' }
    ]
  }
];

export default function NewCharacterPage() {
  const router = useRouter();
  const { refreshActiveCharacter } = useActiveCharacter();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);

  // ÉTAT DU FORMULAIRE
  const [formData, setFormData] = useState({
    name: '',
    species: 'Humain',
    era: 'CLONE_WARS',
    category: 'COMBAT',
    job: 'Soldat',
    selectedGroupId: '',
    physical_description: '',
    personality: '',
    background_history: '',
    likes: '',
    dislikes: '',
    selectedSkills: [] as string[],
    startingItem: ''
  });

  useEffect(() => {
    checkCharacterLimitAndFetchGroups();
  }, [formData.era]);

  async function checkCharacterLimitAndFetchGroups() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { count: charCount } = await supabase.from('characters').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      if (charCount !== null && charCount >= 6) { router.push('/profile'); return; }
      setCount(charCount || 0);

      const { data: groups } = await supabase.from('groups').select('*').eq('era', formData.era).order('name');
      setAvailableGroups(groups || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  const currentCategory = OCCUPATIONS.find(c => c.category === formData.category);
  const currentJob = currentCategory?.jobs.find(j => j.name === formData.job);

  const toggleSkill = (skill: string) => {
    if (formData.selectedSkills.includes(skill)) {
      setFormData({ ...formData, selectedSkills: formData.selectedSkills.filter(s => s !== skill) });
    } else if (formData.selectedSkills.length < 3) {
      setFormData({ ...formData, selectedSkills: [...formData.selectedSkills, skill] });
    }
  };

  async function handleCreate() {
    setCreating(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: character, error: charError } = await supabase.from('characters').insert({
        user_id: user?.id,
        name: formData.name,
        species: formData.species,
        class: formData.job,
        occupation_category: formData.category,
        era: formData.era,
        faction: availableGroups.find(g => g.id === formData.selectedGroupId)?.name || 'Indépendant',
        main_group_id: formData.selectedGroupId || null,
        physical_description: formData.physical_description,
        personality: formData.personality,
        background_history: formData.background_history,
        likes: formData.likes,
        dislikes: formData.dislikes,
        skills: formData.selectedSkills,
        starting_item: currentJob?.item,
        credits: 2000,
      }).select().single();

      if (charError) throw charError;

      // 1. Définir le personnage comme actif pour le profil
      if (character && user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ active_character_id: character.id })
          .eq('id', user.id);
        
        if (updateError) {
          console.error("Erreur lors de l'activation du personnage:", updateError);
        }
        
        // Petit délai pour laisser la DB respirer (surtout en local)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Forcer le rafraîchissement du contexte global
        await refreshActiveCharacter();
      }

      // 2. Gérer l'adhésion à la faction
      if (formData.selectedGroupId && character) {
        await supabase.from('group_members').insert({
          group_id: formData.selectedGroupId,
          character_id: character.id,
          role: 'member'
        });
      }

      // Rediriger vers le forum plutôt que le profil pour une immersion immédiate
      router.push('/forum');
    } catch (err: any) {
      setError(err.message);
      setCreating(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1) : router.push('/profile')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-outfit text-white">Création de Personnage</h1>
            <p className="text-zinc-500 text-sm">Étape {step} sur 4 : {step === 1 ? 'Identité' : step === 2 ? 'Destinée' : step === 3 ? 'Capacités' : 'Lore'}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1 w-8 rounded-full transition-colors ${step >= s ? 'bg-yellow-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-xl relative">
        {step === 1 && (
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Nom et Prénom RP</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} icon={User} placeholder="Ex: Dax Valen" required />
              </div>
              <div className="space-y-4">
                <Select 
                  label="Race / Espèce"
                  options={SPECIES}
                  value={formData.species}
                  onChange={(val) => setFormData({ ...formData, species: val })}
                  placeholder="Choisir une espèce..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Choisissez votre Ère</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ERAS.map(er => (
                  <button key={er} onClick={() => setFormData({ ...formData, era: er })} className={`px-4 py-6 rounded-2xl text-xs font-bold transition-all border ${formData.era === er ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/10'}`}>
                    {ERAS_DISPLAY[er as keyof typeof ERAS_DISPLAY]}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!formData.name} className="bg-yellow-500 text-black font-black">
                Continuer <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        )}

        {step === 2 && (
          <CardContent className="p-10 space-y-10">
            <div className="space-y-6">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-center block">Catégorie de métier</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {OCCUPATIONS.map(cat => (
                  <button key={cat.category} onClick={() => setFormData({ ...formData, category: cat.category, job: cat.jobs[0].name, selectedSkills: [] })} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${formData.category === cat.category ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'}`}>
                    <cat.icon className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{cat.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Select 
                label="Métier précis"
                options={currentCategory?.jobs.map(j => j.name) || []}
                value={formData.job}
                onChange={(val) => setFormData({ ...formData, job: val, selectedSkills: [] })}
                searchable={false}
              />
              <Select 
                label="Faction de départ"
                options={['Indépendant / Neutre', ...availableGroups.map(g => g.name)]}
                value={availableGroups.find(g => g.id === formData.selectedGroupId)?.name || 'Indépendant / Neutre'}
                onChange={(val) => {
                  const group = availableGroups.find(g => g.name === val);
                  setFormData({ ...formData, selectedGroupId: group ? group.id : '' });
                }}
                searchable={false}
              />
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-zinc-500"><ChevronLeft className="w-4 h-4 mr-2" /> Retour</Button>
              <Button onClick={() => setStep(3)} className="bg-yellow-500 text-black font-black">Continuer <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </CardContent>
        )}

        {step === 3 && (
          <CardContent className="p-10 space-y-10">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Compétences de {formData.job}</label>
                <p className="text-zinc-500 text-xs">Choisissez exactement 3 compétences (Sélection : {formData.selectedSkills.length}/3)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentJob?.skills.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill)} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.selectedSkills.includes(skill) ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/10'}`}>
                    <span className="text-sm font-bold">{skill}</span>
                    {formData.selectedSkills.includes(skill) && <Zap className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Équipement de départ reçu :</label>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500"><Shield className="w-5 h-5" /></div>
                <div>
                  <p className="text-white font-bold">{currentJob?.item}</p>
                  <p className="text-xs text-zinc-500">Objet de classe spécial</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-zinc-500">Crédits de départ :</span>
                <span className="text-yellow-500 font-black">2000 ¤</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-zinc-500"><ChevronLeft className="w-4 h-4 mr-2" /> Retour</Button>
              <Button onClick={() => setStep(4)} disabled={formData.selectedSkills.length !== 3} className="bg-yellow-500 text-black font-black">Continuer <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </CardContent>
        )}

        {step === 4 && (
          <CardContent className="p-10 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Physique & Apparence</label>
              <textarea value={formData.physical_description} onChange={(e) => setFormData({...formData, physical_description: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-yellow-500/50 min-h-[100px]" placeholder="Décrivez votre personnage (Taille, yeux, cicatrices, vêtements...)" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Ce qu'il aime (Affections)</label>
                <textarea value={formData.likes} onChange={(e) => setFormData({...formData, likes: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-yellow-500/50 min-h-[80px]" placeholder="La justice, le pazaak, les sabrelasers..." />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Ce qu'il déteste (Aversions)</label>
                <textarea value={formData.dislikes} onChange={(e) => setFormData({...formData, dislikes: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-yellow-500/50 min-h-[80px]" placeholder="L'Empire, le sable, le mensonge..." />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Histoire & Origines (Background)</label>
              <textarea value={formData.background_history} onChange={(e) => setFormData({...formData, background_history: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-yellow-500/50 min-h-[200px]" placeholder="Le moment le plus important : son passé. Où est-il né ? Comment est-il devenu ce qu'il est ?" />
            </div>

            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

            <div className="flex justify-between items-center pt-6">
              <Button variant="ghost" onClick={() => setStep(3)} className="text-zinc-500"><ChevronLeft className="w-4 h-4 mr-2" /> Retour</Button>
              <Button onClick={handleCreate} disabled={creating || !formData.background_history} className="bg-yellow-500 text-black font-black px-10">
                {creating ? 'Immersion en cours...' : 'Finaliser le personnage'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
