'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Book, Info, Shield, UserPlus, Wallet } from 'lucide-react';
import WikiShell, { type WikiNavCategory } from '@/shared/components/wiki/WikiShell';

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

  const categories: WikiNavCategory[] = ruleSections.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    href: section.path,
    active: pathname === section.path,
  }));

  return (
    <WikiShell
      title="Règlement"
      subtitle="Les lois qui régissent la galaxie Swor."
      categories={categories}
      footnoteLabel="Note Staff"
      footnote={`"L'ignorance de la loi n'est pas une excuse sur Coruscant."`}
    >
      {children}
    </WikiShell>
  );
}
