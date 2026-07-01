import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Globe, MessageSquare, ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'next/navigation';

export interface BreadcrumbSegment {
  name: string;
  href?: string;
  icon?: any;
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

export default function Breadcrumbs({ segments, className }: BreadcrumbsProps) {
  const router = useRouter();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors group px-1"
      >
        <ChevronLeft className="w-3 h-3 text-yellow-500/70 group-hover:text-yellow-500 transition-colors" />
        <span>Retour</span>
      </button>

      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex-grow overflow-hidden px-1">
        <Link 
          href="/forum" 
          className="flex items-center gap-1.5 hover:text-white transition-colors shrink-0 group"
        >
          <Home className="w-3 h-3 text-yellow-500/70 group-hover:text-yellow-500 transition-colors" />
          <span>Index</span>
        </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const Icon = segment.icon;

        return (
          <React.Fragment key={index}>
            <span className="text-zinc-700 mx-0.5">/</span>
            {isLast || !segment.href ? (
              <span className={cn(
                "flex items-center gap-1.5",
                isLast ? "text-zinc-300" : ""
              )}>
                {Icon && <Icon className="w-3 h-3" />}
                <span className="truncate max-w-[150px] md:max-w-[300px]">{segment.name}</span>
              </span>
            ) : (
              <Link 
                href={segment.href}
                className="flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                {Icon && <Icon className="w-3 h-3 text-yellow-500/70 group-hover:text-yellow-500 transition-colors" />}
                <span className="truncate max-w-[150px] md:max-w-[300px]">{segment.name}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
      </nav>
    </div>
  );
}

