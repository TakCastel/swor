'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  Wallet, 
  Rocket, 
  Map, 
  ChevronLeft 
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const characterId = params.characterId as string;

  const navItems = [
    { id: 'summary', title: 'Résumé', path: `/profile/character/${characterId}`, icon: User },
    { id: 'inventory', title: 'Inventaire', path: `/profile/character/${characterId}/inventory`, icon: Briefcase },
    { id: 'economy', title: 'Fiche Économique', path: `/profile/character/${characterId}/economy`, icon: Wallet },
    { id: 'ship', title: 'Vaisseau', path: `/profile/character/${characterId}/ship`, icon: Rocket },
  ];

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="md:w-64 space-y-8 shrink-0">
          <div className="space-y-4">
            <Link 
              href="/profile"
              className="inline-flex items-center text-xs text-zinc-500 hover:text-white transition-colors gap-1 group mb-4"
            >
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              Retour au Profil
            </Link>
            <h1 className="text-3xl font-bold font-outfit text-white px-4">Personnage</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-yellow-500" : "text-zinc-600 group-hover:text-zinc-400"
                  )} />
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-grow min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
}

