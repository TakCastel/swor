'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogIn, LogOut, Shield, Settings, Bell, Search, Menu } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/ui/Button';
import { useActiveCharacter } from '@/shared/contexts/CharacterContext';
import { Badge } from '@/shared/components/ui/Badge';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/shared/components/ui/Dropdown';

const navLinks = [
  { path: '/', label: 'Portal' },
  { path: '/forum', label: 'Forum' },
  { path: '/rules', label: 'Règlement' },
  { path: '/universe', label: 'Univers' },
];

export default function Header() {
  const pathname = usePathname();
  const { user, loading: loadingAuth, logout } = useAuth();
  const { activeCharacter, loading: loadingChar } = useActiveCharacter();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="forum-container px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group transition-transform active:scale-95">
              <div className="flex flex-col items-center justify-center leading-[0] font-starwars text-yellow-500 lowercase">
                <span className="text-2xl tracking-tighter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">sw</span>
                <span className="text-2xl tracking-tighter -mt-3 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">or</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors",
                      isActive 
                        ? "text-yellow-500" 
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!loadingAuth && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    {activeCharacter && (
                      <Link 
                        href={`/profile/character/${activeCharacter.id}`}
                        className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all group"
                      >
                        <div className="relative">
                          <Avatar 
                            src={activeCharacter.avatar} 
                            fallback={activeCharacter.name} 
                            size="sm"
                            className="rounded-full ring-1 ring-white/10 group-hover:ring-yellow-500/50 transition-all"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-950 rounded-full" />
                        </div>
                        <div className="flex flex-col items-start -space-y-0.5">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{activeCharacter.name}</span>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{activeCharacter.credits} CRÉDITS</span>
                        </div>
                      </Link>
                    )}

                    <Dropdown 
                      align="right"
                      trigger={
                        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all shadow-xl">
                          <User className="w-4 h-4" />
                        </button>
                      }
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2 bg-white/[0.02]">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Connecté en tant que</p>
                        <p className="text-xs font-bold text-white truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/profile">
                        <DropdownItem icon={User}>Profil Joueur</DropdownItem>
                      </Link>
                      <Link href="/settings">
                        <DropdownItem icon={Settings}>Préférences</DropdownItem>
                      </Link>
                      <div className="h-px bg-white/5 my-2" />
                      <DropdownItem icon={LogOut} onClick={handleLogout} className="text-red-400 hover:bg-red-500/10">
                        Déconnexion
                      </DropdownItem>
                    </Dropdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button variant="primary" size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] h-9 px-5 rounded-full shadow-lg shadow-yellow-500/10">
                        Rejoindre
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
