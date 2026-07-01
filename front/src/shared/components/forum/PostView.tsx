import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { ShieldCheck, User, Quote, Reply, MoreHorizontal } from "lucide-react";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Avatar } from "@/shared/components/ui/Avatar";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostViewProps {
  id: string | number;
  author: {
    name: string;
    avatar?: string;
    title?: string;
    groupName?: string;
    groupColor?: string;
    isAdmin?: boolean;
    isOnline?: boolean;
  };
  content: string;
  createdAt: string;
  isFirstPost?: boolean;
  onReply?: () => void;
  onQuote?: () => void;
}

export function PostView({
  id,
  author,
  content,
  createdAt,
  isFirstPost = false,
  onReply,
  onQuote
}: PostViewProps) {
  return (
    <div id={`post-${id}`} className={cn(
      "forum-row flex flex-col md:flex-row rounded-md overflow-hidden scroll-mt-24",
      isFirstPost && "ring-1 ring-yellow-500/20"
    )}>
      {/* Sidebar auteur */}
      <div className="w-full md:w-48 p-4 border-b md:border-b-0 md:border-r border-white/5 shrink-0 bg-[#0f0f13]">
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar 
            src={author.avatar} 
            fallback={author.name} 
            size="lg" 
            status={author.isOnline ? 'online' : 'offline'}
            className="rounded-md border-white/10 w-24 h-24"
          />
          
          <div className="space-y-0.5">
            <h3 className="font-bold text-base leading-tight break-words tracking-tight" style={{ color: author.groupColor || '#fff' }}>
              {author.name}
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              {author.title || 'Voyageur'}
            </p>
          </div>

          <div className="flex flex-col gap-1 w-full pt-2">
            {author.isAdmin && (
              <div className="bg-red-500/10 text-red-500 border border-red-500/20 text-[8px] font-bold tracking-widest py-0.5 rounded-sm uppercase">STAFF</div>
            )}
            {author.groupName && (
              <div className="bg-white/5 text-zinc-400 border border-white/10 text-[8px] tracking-widest py-0.5 rounded-sm uppercase">
                {author.groupName}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1 w-full pt-2 text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
            <div className="flex justify-between px-1 border-b border-white/5 pb-1">
              <span>Messages:</span>
              <span className="text-zinc-400">142</span>
            </div>
            <div className="flex justify-between px-1">
              <span>Crédits:</span>
              <span className="text-yellow-500/70">1.2k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du message */}
      <div className="flex-grow flex flex-col min-h-[200px]">
        <div className="p-3 border-b border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          <span>Posté le {new Date(createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={onQuote}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Quote className="w-2.5 h-2.5" /> Citer
            </button>
            <span className="text-zinc-800">|</span>
            <button 
              onClick={onReply}
              className="hover:text-yellow-500 transition-colors flex items-center gap-1"
            >
              <Reply className="w-2.5 h-2.5" /> Répondre
            </button>
          </div>
        </div>
        <div className="p-6 flex-grow">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="text-zinc-200 leading-relaxed mb-4 last:mb-0" {...props} />,
              strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
              a: ({node, ...props}) => <a className="text-yellow-500 underline hover:text-yellow-400 transition-colors" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-4 text-zinc-200" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-4 text-zinc-200" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mb-3" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-zinc-700 pl-4 italic text-zinc-400 my-4" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        
        <div className="p-3 bg-black/10 flex justify-end">
           <button className="text-zinc-700 hover:text-zinc-400 transition-all">
             <MoreHorizontal className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}

