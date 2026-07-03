'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';

interface WikiBreadcrumbsProps {
  segments: string[];
}

export function WikiBreadcrumbs({ segments }: WikiBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 bg-white/[0.02] w-fit px-5 py-2.5 rounded-full border border-white/5">
      {segments.map((segment, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="w-3 h-3 text-zinc-800" />}
          <span className={i === segments.length - 1 ? 'text-yellow-500/80' : ''}>{segment}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

interface WikiArticleHeaderProps {
  badge?: string;
  title: string;
  excerpt: string;
}

export function WikiArticleHeader({ badge, title, excerpt }: WikiArticleHeaderProps) {
  return (
    <header className="space-y-8">
      {badge && (
        <div className="flex items-center gap-3 bg-yellow-500/5 w-fit px-5 py-2 rounded-full border border-yellow-500/10">
          <Badge variant="yellow" className="bg-transparent border-0 p-0 text-[11px] font-black tracking-[0.2em]">{badge}</Badge>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-white leading-[0.95] uppercase tracking-tighter">{title}</h2>
      <div className="relative pl-8 md:pl-10">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 rounded-full" />
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed italic font-medium">{excerpt}</p>
      </div>
    </header>
  );
}

interface WikiMarkdownProps {
  children: string;
}

/** Rendu markdown commun aux pages wiki : typographie sobre, alignée sur la page Règles. */
export function WikiMarkdown({ children }: WikiMarkdownProps) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, ...props }) => (
            <CategoryHeader title={props.children as string} className="mt-14 mb-8" />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-black text-white font-outfit mt-12 mb-5 uppercase tracking-widest border-l-4 border-yellow-500/30 pl-5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-zinc-400 leading-relaxed mb-6 text-lg" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="space-y-2 mb-8" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="space-y-2 mb-8 list-decimal list-inside text-zinc-400" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="flex items-start gap-3 text-zinc-400 text-lg leading-relaxed list-none">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-2.5" />
              <span>{props.children}</span>
            </li>
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-zinc-100 font-bold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="text-zinc-300" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-yellow-500/40 bg-yellow-500/5 px-8 py-6 rounded-r-3xl italic text-zinc-300 text-lg font-medium my-10 [&_p]:mb-0" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-8 rounded-2xl border border-white/5">
              <table className="w-full text-sm" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="bg-black/40 text-left px-5 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-5 py-3 text-zinc-400 border-b border-white/[0.03]" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
