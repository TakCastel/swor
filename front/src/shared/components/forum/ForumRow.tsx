import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { MessageSquare, ChevronRight, LucideIcon, Globe } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

interface ForumRowProps {
  id: string | number;
  name: string;
  description: string;
  topicsCount?: number;
  postsCount?: number;
  icon?: LucideIcon;
  imageUrl?: string;
  headerImageUrl?: string;
  href: string;
  isNew?: boolean;
  lastPost?: {
    id?: string | number;
    topicId?: string | number;
    title?: string;
    authorName?: string;
    authorColor?: string;
    date?: string;
  };
}

export function ForumRow({ 
  id, 
  name, 
  description, 
  topicsCount = 0, 
  postsCount = 0, 
  icon: Icon = Globe,
  imageUrl,
  headerImageUrl,
  href,
  isNew = false,
  lastPost
}: ForumRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    router.push(href);
  };

  return (
    <div 
      onClick={handleRowClick}
      className="block cursor-pointer first:rounded-t-none last:rounded-b-md overflow-hidden border-b border-white/5 last:border-0 group/row"
    >
      <div className={cn(
        "forum-row relative flex flex-col group transition-all bg-black/20 hover:bg-white/[0.03]",
        isNew && "border-l-2 border-l-yellow-500"
      )}>
        {/* Background Header Image (if any) */}
        {headerImageUrl && (
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-10 group-hover/row:opacity-20 transition-opacity">
            <img src={headerImageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex items-center p-5">
          {/* Status Icon Area */}
          <div className={cn(
            "w-10 h-10 flex items-center justify-center mr-5 shrink-0 rounded-lg transition-all",
            (!imageUrl || imageUrl === '') ? "text-zinc-600 bg-white/5" : "overflow-hidden border border-white/10",
            isNew && (!imageUrl || imageUrl === '') && "text-yellow-500 bg-yellow-500/10"
          )}>
            {imageUrl && imageUrl !== '' ? (
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Icon className={cn("w-5 h-5", isNew && "animate-pulse")} />
            )}
          </div>

          {/* Content Area */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-200 group-hover/row:text-yellow-500 transition-colors truncate tracking-tight">
                {name}
              </h3>
              {isNew && (
                <Badge variant="yellow" className="h-4 py-0 px-1 text-[8px] animate-pulse">Nouveau</Badge>
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500 group-hover/row:text-zinc-400 transition-colors mt-0.5 max-w-2xl line-clamp-2">
              {description}
            </p>
          </div>

          {/* Stats & Last Post (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-center shrink-0 ml-6">
            <div className="w-32 flex flex-col items-center justify-center border-x border-white/5 h-12">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-300 leading-none">{topicsCount}</p>
                  <p className="text-[8px] uppercase tracking-tighter text-zinc-600 font-bold mt-1">Sujets</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-300 leading-none">{postsCount}</p>
                  <p className="text-[8px] uppercase tracking-tighter text-zinc-600 font-bold mt-1">Messages</p>
                </div>
              </div>
            </div>
            
            <div className="w-48 text-left flex flex-col justify-center h-12">
              {lastPost ? (
                <>
                  <Link 
                    href={lastPost.topicId ? `/topic/${lastPost.topicId}${lastPost.id ? `#post-${lastPost.id}` : ''}` : '#'}
                    className="text-[10px] text-zinc-300 font-bold truncate hover:text-yellow-500 transition-colors"
                  >
                    {lastPost.title}
                  </Link>
                  <p className="text-[9px] text-zinc-500 mt-0.5">
                    par <span className="font-bold" style={{ color: lastPost.authorColor }}>{lastPost.authorName}</span>
                  </p>
                  <p className="text-[8px] text-zinc-600 mt-0.5">
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
    </div>
  );
}
