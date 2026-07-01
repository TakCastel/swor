import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { User, ChevronRight, MessageSquare, Pin, Lock } from "lucide-react";
import { Card, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Avatar } from "@/shared/components/ui/Avatar";

interface TopicRowProps {
  id: string | number;
  title: string;
  authorName: string;
  authorAvatar?: string;
  authorColor?: string;
  repliesCount: number;
  viewsCount: number;
  createdAt: string;
  isPinned?: boolean;
  isLocked?: boolean;
  href: string;
  lastPost?: {
    id?: string | number;
    authorName: string;
    authorColor?: string;
    date: string;
  };
}

export function TopicRow({
  id,
  title,
  authorName,
  authorAvatar,
  authorColor,
  repliesCount,
  viewsCount,
  createdAt,
  isPinned,
  isLocked,
  href,
  lastPost
}: TopicRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    router.push(href);
  };

  return (
    <div 
      onClick={handleRowClick}
      className="block cursor-pointer first:rounded-t-none last:rounded-b-md overflow-hidden border-b border-white/5 last:border-0"
    >
      <div className={cn(
        "forum-row flex items-center p-4 group transition-all bg-black/20 hover:bg-white/[0.03]",
        isPinned && "border-l-2 border-l-yellow-500 bg-yellow-500/[0.02]"
      )}>
        {/* Status Icon */}
        <div className="mr-5 shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-zinc-600 group-hover:text-yellow-500/50 transition-colors">
          {isPinned ? (
            <Pin className="w-5 h-5 text-yellow-500" />
          ) : isLocked ? (
            <Lock className="w-5 h-5 text-zinc-500" />
          ) : (
            <MessageSquare className="w-5 h-5" />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-zinc-200 group-hover:text-yellow-500 transition-colors truncate tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            par <span className="font-bold" style={{ color: authorColor || '#a1a1aa' }}>{authorName}</span> • {new Date(createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Stats & Last Post (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-center shrink-0 ml-6">
          <div className="w-32 flex flex-col items-center justify-center border-x border-white/5 h-12">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm font-bold text-zinc-300 leading-none">{repliesCount}</p>
                <p className="text-[8px] uppercase tracking-tighter text-zinc-600 font-bold mt-1">Rép.</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-zinc-300 leading-none">{viewsCount}</p>
                <p className="text-[8px] uppercase tracking-tighter text-zinc-600 font-bold mt-1">Vues</p>
              </div>
            </div>
          </div>
          
          <div className="w-48 text-left flex flex-col justify-center h-12">
            {lastPost ? (
              <>
                <Link 
                  href={lastPost.id ? `${href}#post-${lastPost.id}` : href}
                  className="text-[9px] text-zinc-300 truncate hover:text-yellow-500 transition-colors"
                >
                  par <span className="font-bold" style={{ color: lastPost.authorColor }}>{lastPost.authorName}</span>
                </Link>
                <p className="text-[8px] text-zinc-600 mt-1 uppercase tracking-wider">
                  {lastPost.date}
                </p>
              </>
            ) : (
              <p className="text-[9px] text-zinc-700 italic">Aucun message</p>
            )}
          </div>
        </div>

        {/* Arrow (Mobile) */}
        <div className="md:hidden w-8 h-8 flex items-center justify-center text-zinc-700">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
