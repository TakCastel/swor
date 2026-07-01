'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Shield, UserPlus, Info, Wallet } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const ruleSections = [
  { id: 'overview', title: 'Vue d\'ensemble', path: '/rules', icon: Info },
  { id: 'general', title: 'Généralités', path: '/rules/general', icon: Shield },
  { id: 'roleplay', title: 'Système de RP', path: '/rules/roleplay', icon: Book },
  { id: 'characters', title: 'Personnages', path: '/rules/characters', icon: UserPlus },
  { id: 'economy', title: 'Économie', path: '/rules/economy', icon: Wallet },
];

export default function RulesLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="md:w-64 space-y-8 shrink-0">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold font-outfit text-white px-4">Règlement</h1>
            <p className="text-zinc-500 text-sm px-4">Les lois qui régissent la galaxie Swor.</p>
          </div>

          <nav className="space-y-1">
            {ruleSections.map((section) => {
              const isActive = pathname === section.path;
              return (
                <Link
                  key={section.id}
                  href={section.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <section.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-yellow-500" : "text-zinc-600 group-hover:text-zinc-400"
                  )} />
                  <span className="font-medium text-sm">{section.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/10">
            <p className="text-[10px] uppercase font-bold text-yellow-500 tracking-widest mb-2">Note Staff</p>
            <p className="text-xs text-zinc-500 leading-relaxed italic">
              "L'ignorance de la loi n'est pas une excuse sur Coruscant."
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
}

