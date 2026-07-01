import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { LucideIcon } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  icon?: LucideIcon;
  imageUrl?: string;
  action?: React.ReactNode;
  className?: string;
  columns?: string[];
}

export function CategoryHeader({ title, icon: Icon, imageUrl, action, className, columns }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className={cn(
        "forum-header-bar flex items-center justify-between rounded-t-md",
        className
      )}>
        <div className="flex items-center gap-3">
          {imageUrl && imageUrl !== '' ? (
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : Icon && (
            <Icon className="w-4 h-4 text-zinc-400" />
          )}
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {title}
          </h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      
      {columns && (
        <div className="hidden md:flex items-center px-5 py-2 bg-black/40 border-x border-white/5 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
          <div className="flex-grow">{columns[0] || 'Sujet'}</div>
          <div className="flex items-center gap-8 text-center">
            <div className="w-32">{columns[1] || 'Stats'}</div>
            <div className="w-48 text-left">{columns[2] || 'Dernier Message'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

