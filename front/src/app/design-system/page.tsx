'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Globe, Lock, Shield, Sparkles, User, 
  Settings, Bell, Search, Plus, Mail, Heart, Share2, 
  MoreHorizontal, ChevronRight, Zap, Terminal, Palette,
  Layout, Component, Type, Play, Info
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Switch } from '@/shared/components/ui/Switch';
import { Slider } from '@/shared/components/ui/Slider';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/shared/components/ui/Dropdown';
import { Modal } from '@/shared/components/ui/Modal';
import { Tabs } from '@/shared/components/ui/Tabs';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { Pagination } from '@/shared/components/ui/Pagination';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { ForumRow } from '@/shared/components/forum/ForumRow';
import { TopicRow } from '@/shared/components/forum/TopicRow';
import { PostView } from '@/shared/components/forum/PostView';

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 selection:text-yellow-500">
      {/* Header */}
      <div className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Palette className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black font-outfit tracking-widest uppercase">SWOR V2</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Design System Forum</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-yellow-500/20 text-yellow-500">v1.0.0 Alpha</Badge>
            <div className="h-8 w-px bg-white/5 mx-2" />
            <Avatar src="" fallback="AD" status="online" size="sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-12 space-y-32">
        {/* Section: Typography & Colors */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">01. Identité Visuelle</h2>
            <div className="h-1 w-20 bg-yellow-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Typographie</h3>
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-600 uppercase font-black">Font: Cinzel (Titres)</p>
                  <p className="text-5xl font-black font-outfit uppercase tracking-tight">Que la force soit avec vous</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-600 uppercase font-black">Font: Sans-Serif (Contenu)</p>
                  <p className="text-xl text-zinc-400 leading-relaxed">Il y a bien longtemps, dans une galaxie lointaine, très lointaine...</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-600 uppercase font-black">Font: Monospace (Metadata)</p>
                  <p className="text-sm font-mono text-yellow-500">DATABASE_LINK_ESTABLISHED: 100%</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Palette de Couleurs</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-yellow-500 border border-white/10" />
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Yellow Accent (#EAB308)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-zinc-900 border border-white/5" />
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Zinc 900 (#18181B)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-black border border-white/10" />
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Black (#000000)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-zinc-500 border border-white/10" />
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Zinc 500 (#71717A)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Buttons & Badges */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">02. Composants Atomiques</h2>
            <div className="h-1 w-20 bg-yellow-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Boutons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Bouton Primaire</Button>
                <Button variant="secondary">Secondaire</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Fantôme</Button>
                <Button variant="danger">Supprimer</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="era-blue">Guerre des Clones</Button>
                <Button variant="era-red">Guerre Civile Galactique</Button>
                <Button variant="era-yellow">Nouvelle République</Button>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge>Standard</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="yellow">Spécial</Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Jedi</Badge>
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Sith</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Forms */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">03. Formulaires</h2>
            <div className="h-1 w-20 bg-yellow-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Champ de texte</label>
                <Input placeholder="Rechercher dans la galaxie..." icon={Search} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Zone de texte</label>
                <Textarea placeholder="Écrivez votre message RP ici..." />
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Interrupteurs</h3>
                  <Switch label="Mode RP actif" defaultChecked />
                  <Switch label="Notifications" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Checkboxes</h3>
                  <Checkbox label="Se souvenir de moi" defaultChecked />
                  <Checkbox label="Accepter les règles" />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Slider</h3>
                <Slider label="Volume des Holotransmissions" defaultValue={75} />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Interactive Components */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">04. Interacteurs Complexes</h2>
            <div className="h-1 w-20 bg-yellow-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Modales & Tooltips</h3>
              <div className="flex gap-4 items-center">
                <Button onClick={() => setIsModalOpen(true)}>Ouvrir la Modale</Button>
                <Tooltip content="C'est un secret pour tout le monde" position="top">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 cursor-help">
                    Survolez-moi
                  </div>
                </Tooltip>
              </div>

              <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Transmission Impériale"
              >
                <div className="space-y-6">
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4">
                    <Shield className="w-8 h-8 text-red-500" />
                    <div>
                      <h4 className="font-bold text-red-500 uppercase tracking-widest text-sm">Alerte Prioritaire</h4>
                      <p className="text-xs text-red-500/60">Une flotte rebelle a été détectée dans le système Mid Rim.</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Toutes les unités doivent se tenir prêtes pour une intervention immédiate. Le Grand Moff Tarkin attend un rapport complet d'ici la fin de la rotation.
                  </p>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Ignorer</Button>
                    <Button variant="danger">Intercepter</Button>
                  </div>
                </div>
              </Modal>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Navigation & Tabs</h3>
              <Tabs 
                tabs={[
                  { id: 'general', label: 'Général', icon: Settings, content: <div className="p-8 border border-white/5 bg-white/[0.01] rounded-[2rem] text-zinc-500 text-xs">Paramètres globaux du compte</div> },
                  { id: 'security', label: 'Sécurité', icon: Lock, content: <div className="p-8 border border-white/5 bg-white/[0.01] rounded-[2rem] text-zinc-500 text-xs">Options de chiffrement et authentification</div> },
                  { id: 'notifs', label: 'Alertes', icon: Bell, content: <div className="p-8 border border-white/5 bg-white/[0.01] rounded-[2rem] text-zinc-500 text-xs">Gestion des signaux de communication</div> }
                ]}
              />
            </div>
          </div>
        </section>

        {/* Section: Forum UI */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">05. Système de Forum</h2>
            <div className="h-1 w-20 bg-yellow-500 rounded-full" />
          </div>

          <div className="space-y-16">
            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Index & Catégories</h3>
              <div className="space-y-4">
                <CategoryHeader title="Holonews & Communications" icon={Sparkles} />
                <div className="grid grid-cols-1 gap-3">
                  <ForumRow 
                    id={1}
                    name="Annonces Officielles"
                    description="Toutes les mises à jour majeures du système et de l'univers."
                    topicsCount={24}
                    postsCount={142}
                    icon={Bell}
                    href="#"
                    isNew={true}
                  />
                  <ForumRow 
                    id={2}
                    name="Cantina de Mos Eisley"
                    description="Discussions générales et hors-sujet entre voyageurs."
                    topicsCount={1562}
                    postsCount={45210}
                    icon={MessageSquare}
                    href="#"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Sujets (Threads)</h3>
              <div className="space-y-2">
                <TopicRow 
                  id={101}
                  title="[RP] L'arrivée sur Coruscant"
                  authorName="Anakin Skywalker"
                  authorAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Anakin"
                  authorColor="#3b82f6"
                  repliesCount={45}
                  viewsCount={1204}
                  createdAt={new Date().toISOString()}
                  isPinned={true}
                  href="#"
                />
                <TopicRow 
                  id={102}
                  title="Comment obtenir plus de crédits ?"
                  authorName="Han Solo"
                  authorAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Han"
                  authorColor="#ef4444"
                  repliesCount={12}
                  viewsCount={340}
                  createdAt={new Date().toISOString()}
                  href="#"
                />
              </div>
              <div className="flex justify-center pt-4">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={12} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Messages (Posts)</h3>
              <PostView 
                author={{
                  name: "Darth Vader",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vader",
                  title: "Seigneur Sith",
                  groupName: "Empire Galactique",
                  groupColor: "#ef4444",
                  isAdmin: true,
                  isOnline: true
                }}
                content={`# Transmission Prioritaire\n\nJe trouve votre manque de foi troublant. La Force est bien plus puissante que toute technologie.\n\n- Ne sous-estimez pas le côté obscur.\n- Préparez mon vaisseau.\n- Alertez l'Empereur.\n\n***\n*Envoyé depuis le Super Destroyer Stellaire Executor*`}
                createdAt={new Date().toISOString()}
                isFirstPost={true}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
            Propulsé par le système SWOR V2
          </p>
          <div className="flex justify-center gap-6">
            <button className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white transition-colors">Documentation</button>
            <button className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white transition-colors">Support</button>
            <button className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white transition-colors">GitHub</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

