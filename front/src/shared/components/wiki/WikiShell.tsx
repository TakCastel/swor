'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LucideIcon, Menu, Search, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Input } from '@/shared/components/ui/Input';

export interface WikiNavItem {
  id: string;
  title: string;
  href?: string;
  active?: boolean;
  onSelect?: () => void;
}

export interface WikiNavGroup {
  id: string;
  title: string;
  items: WikiNavItem[];
}

export interface WikiNavCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  /** Lien direct (pas de sous-arborescence) */
  href?: string;
  active?: boolean;
  /** Sous-catégories dépliables */
  groups?: WikiNavGroup[];
}

interface WikiShellProps {
  title: string;
  subtitle: string;
  categories: WikiNavCategory[];
  /** Recherche (optionnelle) */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Encadré citation en bas de sidebar */
  footnoteLabel?: string;
  footnote?: string;
  children: React.ReactNode;
}

/**
 * Coquille commune des pages wiki (Univers, Règles) : sidebar hiérarchique
 * catégories → sous-catégories → articles, contenu à droite.
 */
export default function WikiShell({
  title,
  subtitle,
  categories,
  searchValue,
  onSearchChange,
  footnoteLabel,
  footnote,
  children,
}: WikiShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>(
    categories.filter(c => c.groups?.some(g => g.items.some(i => i.active)) || c.active).map(c => c.id)
  );

  const toggleCategory = (id: string) => {
    setOpenCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const closeMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="py-12">
      {/* Header mobile */}
      <div className="md:hidden flex items-center justify-between mb-8 px-4 py-3 rounded-2xl bg-zinc-900/40 border border-white/5">
        <h1 className="text-lg font-bold font-outfit text-white">{title}</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400" aria-label="Menu">
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className={cn('md:w-72 space-y-8 shrink-0 md:block', isSidebarOpen ? 'block' : 'hidden')}>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold font-outfit text-white px-4">{title}</h1>
            <p className="text-zinc-500 text-sm px-4">{subtitle}</p>
          </div>

          {onSearchChange && (
            <div className="px-2">
              <Input
                icon={Search}
                placeholder="Rechercher un article…"
                value={searchValue ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-zinc-900/50"
              />
            </div>
          )}

          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;

              // Catégorie = lien simple (ex. « Vue d'ensemble »)
              if (category.href && !category.groups) {
                return (
                  <Link
                    key={category.id}
                    href={category.href}
                    onClick={closeMobile}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group',
                      category.active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 transition-colors', category.active ? 'text-yellow-500' : 'text-zinc-600 group-hover:text-zinc-400')} />
                    <span className="font-medium text-sm">{category.title}</span>
                  </Link>
                );
              }

              // Catégorie dépliable avec sous-groupes
              const isOpen = openCategories.includes(category.id);
              const hasActiveChild = category.groups?.some(g => g.items.some(i => i.active));

              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group',
                      isOpen || hasActiveChild ? 'text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn('w-4 h-4 transition-colors', hasActiveChild ? 'text-yellow-500' : 'text-zinc-600 group-hover:text-zinc-400')} />
                      <span className="font-medium text-sm">{category.title}</span>
                    </div>
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-300', isOpen ? 'rotate-0 text-zinc-400' : '-rotate-90 text-zinc-700')} />
                  </button>

                  {isOpen && category.groups && (
                    <div className="ml-6 pl-4 border-l border-white/5 space-y-4 py-2 animate-in fade-in slide-in-from-left-1 duration-200">
                      {category.groups.map(group => (
                        <div key={group.id} className="space-y-0.5">
                          {group.title && (
                            <p className="px-3 py-1 text-[9px] font-black text-zinc-700 uppercase tracking-[0.25em]">
                              {group.title}
                            </p>
                          )}
                          {group.items.map(item => {
                            const itemClasses = cn(
                              'w-full text-left block px-3 py-2 rounded-xl text-sm transition-all',
                              item.active
                                ? 'bg-white/10 text-yellow-500 font-semibold'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                            );

                            return item.href ? (
                              <Link key={item.id} href={item.href} onClick={closeMobile} className={itemClasses}>
                                {item.title}
                              </Link>
                            ) : (
                              <button
                                key={item.id}
                                onClick={() => { item.onSelect?.(); closeMobile(); }}
                                className={itemClasses}
                              >
                                {item.title}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {footnote && (
            <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/10">
              <p className="text-[10px] uppercase font-bold text-yellow-500 tracking-widest mb-2">{footnoteLabel ?? 'Note'}</p>
              <p className="text-xs text-zinc-500 leading-relaxed italic">{footnote}</p>
            </div>
          )}
        </aside>

        {/* Contenu */}
        <main className="flex-grow min-w-0 min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
