'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, Plus, Trash2, Settings, Loader2, Save, X, Globe, 
  MessageSquare, AlertTriangle, Database, Shield, Layout, 
  ExternalLink, Edit2, Image as ImageIcon, ChevronUp, ChevronDown,
  GripVertical, Upload, Trash
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Badge } from '@/shared/components/ui/Badge';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { Modal } from '@/shared/components/ui/Modal';
import { supabase } from '@/shared/utils/supabase';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/utils/cn';

// Composant récursif pour afficher les forums et leurs enfants
function ForumItem({ 
  forum, 
  allForums, 
  onDelete, 
  onEdit, 
  onDragStart,
  onDrop,
  level = 0 
}: { 
  forum: any, 
  allForums: any[], 
  onDelete: (id: number) => void,
  onEdit: (forum: any) => void,
  onDragStart: (e: React.DragEvent, id: number) => void,
  onDrop: (e: React.DragEvent, targetId: number | null, catId: number) => void,
  level?: number 
}) {
  const [isOver, setIsOver] = useState(false);
  const children = allForums.filter(f => f.parent_id === forum.id)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  const isRoot = level === 0;

  return (
    <div className="space-y-2">
      <div 
        draggable
        onDragStart={(e) => onDragStart(e, forum.id)}
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => { setIsOver(false); onDrop(e, forum.id, forum.category_id); }}
        className={cn(
          "flex items-center justify-between p-5 transition-all group relative",
          isRoot 
            ? "bg-zinc-900/40 border border-white/5 rounded-2xl" 
            : "bg-white/[0.01] border border-white/5 rounded-2xl",
          isOver && "border-yellow-500 bg-yellow-500/10 scale-[1.01] z-10 shadow-2xl shadow-yellow-500/20"
        )}
      >
        <div className="flex items-center gap-5 min-w-0 flex-1">
          <div className="cursor-grab active:cursor-grabbing text-zinc-700 hover:text-zinc-400 px-1 shrink-0">
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="relative shrink-0">
            {forum.image_url ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <img src={forum.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border border-white/5 transition-colors shadow-inner",
            isRoot ? "bg-white/5 text-zinc-600 group-hover:text-yellow-500" : "bg-transparent text-zinc-700 group-hover:text-zinc-400"
          )}>
            {forum.type === 'planet' ? <Globe className="w-6 h-6" /> : forum.type === 'forum' ? <MessageSquare className="w-6 h-6" /> : <Layout className="w-6 h-6" />}
          </div>
            )}
            <Badge variant="outline" className="absolute -top-2 -right-2 text-[7px] h-4 py-0 px-1.5 border-white/10 bg-black text-zinc-500 uppercase font-black">
              {forum.type}
            </Badge>
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className={cn(
              "font-bold transition-colors uppercase tracking-tight truncate",
              isRoot ? "text-zinc-100 group-hover:text-white text-base" : "text-zinc-300 group-hover:text-zinc-100 text-sm"
            )}>
              {forum.name}
            </h3>
            {forum.description && (
              <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 font-medium italic">
                {forum.description}
              </p>
            )}
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] mt-1 font-black">Ordre: {forum.display_order}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/forum/${forum.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-yellow-500 hover:bg-yellow-500/10">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10" onClick={() => onEdit(forum)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10" onClick={() => onDelete(forum.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {children.length > 0 && (
        <div className={cn("space-y-2 border-l border-white/5", isRoot ? "ml-5 pl-12" : "ml-4 pl-6")}>
          {children.map(child => (
            <ForumItem 
              key={child.id} 
              forum={child} 
              allForums={allForums} 
              onDelete={onDelete} 
              onEdit={onEdit} 
              onDragStart={onDragStart}
              onDrop={onDrop}
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ForumAdminPage() {
  const router = useRouter();
  const { userRole, loading: loadingRole } = useActiveCharacter();
  const [categories, setCategories] = useState<any[]>([]);
  const [forums, setForums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingForum, setEditingForum] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const editHeaderFileInputRef = useRef<HTMLInputElement>(null);

  const [newForum, setNewForum] = useState({
    name: '',
    description: '',
    category_id: '',
    parent_id: '',
    type: 'location',
    display_order: 10,
    image_url: '',
    header_image_url: ''
  });

  useEffect(() => {
    if (!loadingRole && userRole !== 'admin') {
      router.push('/forum');
    } else if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole, loadingRole]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'header_image_url', isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const folder = field === 'image_url' ? 'forum-icons' : 'forum-headers';
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('forum')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('forum')
        .getPublicUrl(filePath);

      if (isEdit) {
        setEditingForum({ ...editingForum, [field]: publicUrl });
      } else {
        setNewForum({ ...newForum, [field]: publicUrl });
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      alert('Erreur lors de l\'envoi de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  async function fetchData() {
    setLoading(true);
    try {
      const { data: catData } = await supabase.from('forum_categories').select('*').order('display_order', { ascending: true });
      const { data: forumData } = await supabase.from('forums').select('*').order('display_order', { ascending: true });
      setCategories(catData || []);
      setForums(forumData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // --- Logique Drag & Drop ---
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('forumId', id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: number | null, catId: number) => {
    e.preventDefault();
    const sourceId = parseInt(e.dataTransfer.getData('forumId'));
    
    if (sourceId === targetId) return;

    setIsSaving(true);
    try {
      // Si targetId est null, on déplace à la racine de la catégorie
      const { error } = await supabase
        .from('forums')
        .update({ 
          parent_id: targetId,
          category_id: catId,
          display_order: 0 // On le met en haut par défaut lors d'un drop
        })
        .eq('id', sourceId);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du déplacement du forum');
    } finally {
      setIsSaving(false);
    }
  };

  async function handleAddForum() {
    if (!newForum.name || !newForum.category_id) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('forums').insert([{
        ...newForum,
        category_id: parseInt(newForum.category_id),
        parent_id: newForum.parent_id ? parseInt(newForum.parent_id) : null,
        display_order: parseInt(newForum.display_order.toString())
      }]);
      if (error) throw error;
      setNewForum({ name: '', description: '', category_id: '', parent_id: '', type: 'location', display_order: 10, image_url: '', header_image_url: '' });
      fetchData();
    } catch (err) {
      alert('Erreur lors de l\'ajout du forum');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateForum() {
    if (!editingForum) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('forums')
        .update({
          name: editingForum.name,
          description: editingForum.description,
          category_id: editingForum.category_id,
          parent_id: editingForum.parent_id || null,
          display_order: parseInt(editingForum.display_order),
          type: editingForum.type,
          image_url: editingForum.image_url,
          header_image_url: editingForum.header_image_url
        })
        .eq('id', editingForum.id);

      if (error) throw error;
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteForum(id: number) {
    const forumToDelete = forums.find(f => f.id === id);
    if (!forumToDelete) return;

    const getDescendantIds = (parentId: number): number[] => {
      const children = forums.filter(f => f.parent_id === parentId);
      let ids = children.map(c => c.id);
      for (const child of children) {
        ids = [...ids, ...getDescendantIds(child.id)];
      }
      return ids;
    };

    const descendants = getDescendantIds(id);
    const allForumsToAvoid = [id, ...descendants];

    if (forums.length <= allForumsToAvoid.length) {
      alert("Action impossible : vous ne pouvez pas supprimer le dernier forum.");
      return;
    }

    let targetForumId = forumToDelete.parent_id;
    if (!targetForumId) {
      const otherInCat = forums.find(f => f.category_id === forumToDelete.category_id && !allForumsToAvoid.includes(f.id));
      targetForumId = otherInCat ? otherInCat.id : forums.find(f => !allForumsToAvoid.includes(f.id))?.id;
    }

    if (!targetForumId) return;

    if (!confirm(`Supprimer "${forumToDelete.name}" ? Les messages seront transférés.`)) return;

    setIsSaving(true);
    try {
      await supabase.from('topics').update({ forum_id: targetForumId }).in('forum_id', allForumsToAvoid);
      await supabase.from('forums').delete().eq('id', id);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading || loadingRole) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-8 h-8 text-yellow-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 selection:text-yellow-500">
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-16">
        
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-zinc-500">
            <Link href="/forum" className="hover:text-white transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.3em]">
              <ChevronLeft className="w-3 h-3 text-yellow-500" /> Retour au forum
            </Link>
          </div>
          
          <SectionHeader 
            title="Administration des Forums" 
            subtitle="Gestion du contenu"
            font="outfit"
            description="Gérez l'arborescence, les catégories et les paramètres des forums de la plateforme."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Formulaire Ajout */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-zinc-900/40 border-white/5 sticky top-24 overflow-hidden">
              <div className="h-1 w-full bg-yellow-500" />
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-outfit uppercase flex items-center gap-3">
                  <Plus className="w-5 h-5 text-yellow-500" /> Créer un forum
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Configuration du nouveau forum</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nom du forum</label>
                  <Input value={newForum.name} onChange={(e) => setNewForum({...newForum, name: e.target.value})} placeholder="Ex: Cantina de Mos Eisley" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Description</label>
                  <Input value={newForum.description} onChange={(e) => setNewForum({...newForum, description: e.target.value})} placeholder="Brève description du forum..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center justify-between">
                    <span>Icône (Carrée)</span>
                    {newForum.image_url && (
                      <button onClick={() => setNewForum({...newForum, image_url: ''})} className="text-red-500 hover:text-red-400">Supprimer</button>
                    )}
                  </label>
                  
                  {newForum.image_url ? (
                    <div className="relative group rounded-xl overflow-hidden aspect-square border border-white/10 w-24">
                      <img src={newForum.image_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>Changer</Button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 aspect-square rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-zinc-600 group-hover:text-yellow-500 transition-colors" />
                        </>
                      )}
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image_url', false)}
                  />
                  <Input 
                    value={newForum.image_url} 
                    onChange={(e) => setNewForum({...newForum, image_url: e.target.value})} 
                    placeholder="Ou coller une URL d'icône..." 
                    className="text-[10px] h-8"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center justify-between">
                    <span>Illustration (Entête)</span>
                    {newForum.header_image_url && (
                      <button onClick={() => setNewForum({...newForum, header_image_url: ''})} className="text-red-500 hover:text-red-400">Supprimer</button>
                    )}
                  </label>
                  
                  {newForum.header_image_url ? (
                    <div className="relative group rounded-xl overflow-hidden aspect-video border border-white/10">
                      <img src={newForum.header_image_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => headerFileInputRef.current?.click()}>Changer</Button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => headerFileInputRef.current?.click()}
                      className="w-full aspect-video rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-zinc-600 group-hover:text-yellow-500 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">Uploader l'illustration</span>
                        </>
                      )}
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={headerFileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'header_image_url', false)}
                  />
                  <Input 
                    value={newForum.header_image_url} 
                    onChange={(e) => setNewForum({...newForum, header_image_url: e.target.value})} 
                    placeholder="Ou coller une URL d'illustration..." 
                    className="text-[10px] h-8"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Catégorie</label>
                  <select 
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-zinc-300 appearance-none cursor-pointer"
                    value={newForum.category_id}
                    onChange={(e) => setNewForum({...newForum, category_id: e.target.value})}
                  >
                    <option value="" className="bg-zinc-900">Sélectionner une catégorie...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Type de forum</label>
                    <select 
                      className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer"
                      value={newForum.type}
                      onChange={(e) => setNewForum({...newForum, type: e.target.value})}
                    >
                      <option value="forum" className="bg-zinc-900">Forum (HRP)</option>
                      <option value="location" className="bg-zinc-900">Localisation (RP)</option>
                      <option value="planet" className="bg-zinc-900">Planète (RP)</option>
                      <option value="region" className="bg-zinc-900">Région (RP)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Ordre</label>
                    <Input 
                      type="number" 
                      value={newForum.display_order}
                      onChange={(e) => setNewForum({...newForum, display_order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <Button variant="primary" className="w-full mt-4" onClick={handleAddForum} disabled={isSaving || !newForum.name || !newForum.category_id}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Enregistrer le forum
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Liste des forums avec Drag & Drop */}
          <div className="lg:col-span-8 space-y-12">
            {categories.map(cat => (
              <section 
                key={cat.id} 
                className="space-y-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, null, cat.id)}
              >
                <CategoryHeader 
                  title={cat.name} 
                  icon={cat.era ? Globe : Shield}
                  action={<Badge variant="outline" className="text-[8px] border-white/10 text-zinc-500 uppercase">{cat.era || 'Hors-RP'}</Badge>}
                />

                <div className="grid grid-cols-1 gap-2 p-2 border border-white/[0.02] rounded-2xl min-h-[50px] transition-colors hover:bg-white/[0.01]">
                  {forums.filter(f => f.category_id === cat.id && !f.parent_id)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map(forum => (
                      <ForumItem 
                        key={forum.id} 
                        forum={forum} 
                        allForums={forums} 
                        onDelete={handleDeleteForum} 
                        onEdit={(f) => { setEditingForum(f); setIsModalOpen(true); }}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                      />
                    ))}

                  {forums.filter(f => f.category_id === cat.id).length === 0 && (
                    <div className="p-12 text-center bg-zinc-950/50 border border-white/5 rounded-[2.5rem] border-dashed">
                      <div className="flex flex-col items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-zinc-800" />
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Aucun forum dans cette catégorie</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Modale d'Édition */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Modifier le forum">
        {editingForum && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Icône (Carrée)</label>
                <div className="flex gap-4">
                  {editingForum.image_url ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={editingForum.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-zinc-700 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="w-full h-8 text-[10px]" onClick={() => editFileInputRef.current?.click()}>
                        {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3 mr-2" />}
                        Uploader
                      </Button>
                      {editingForum.image_url && (
                        <Button variant="danger" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditingForum({...editingForum, image_url: ''})}>
                          <Trash className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <Input 
                      value={editingForum.image_url || ''} 
                      onChange={e => setEditingForum({...editingForum, image_url: e.target.value})}
                      placeholder="URL de l'icône..."
                      className="h-8 text-[10px]"
                    />
                    <input 
                      type="file" 
                      ref={editFileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image_url', true)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Illustration (Entête)</label>
                <div className="flex gap-4">
                  {editingForum.header_image_url ? (
                    <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={editingForum.header_image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-zinc-700 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="w-full h-8 text-[10px]" onClick={() => editHeaderFileInputRef.current?.click()}>
                        {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3 mr-2" />}
                        Uploader
                      </Button>
                      {editingForum.header_image_url && (
                        <Button variant="danger" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditingForum({...editingForum, header_image_url: ''})}>
                          <Trash className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <Input 
                      value={editingForum.header_image_url || ''} 
                      onChange={e => setEditingForum({...editingForum, header_image_url: e.target.value})}
                      placeholder="URL de l'illustration..."
                      className="h-8 text-[10px]"
                    />
                    <input 
                      type="file" 
                      ref={editHeaderFileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'header_image_url', true)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input label="Nom" value={editingForum.name} onChange={e => setEditingForum({...editingForum, name: e.target.value})} />
              <Input label="Description" value={editingForum.description} onChange={e => setEditingForum({...editingForum, description: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Type</label>
                  <select 
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-zinc-300"
                    value={editingForum.type}
                    onChange={e => setEditingForum({...editingForum, type: e.target.value})}
                  >
                    <option value="forum">Forum (HRP)</option>
                    <option value="location">Localisation (RP)</option>
                    <option value="planet">Planète (RP)</option>
                    <option value="region">Région (RP)</option>
                  </select>
                </div>
                <Input label="Ordre d'affichage" type="number" value={editingForum.display_order} onChange={e => setEditingForum({...editingForum, display_order: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button variant="primary" onClick={handleUpdateForum} disabled={isSaving}>Enregistrer les modifications</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
