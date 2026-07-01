import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'yellow' | 'blue' | 'red' | 'green' | 'era-blue' | 'era-red' | 'era-gold';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-zinc-300",
    outline: "border border-white/20 text-zinc-400",
    yellow: "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
    blue: "bg-blue-500/10 border border-blue-500/20 text-blue-500",
    red: "bg-red-500/10 border border-red-500/20 text-red-500",
    green: "bg-green-500/10 border border-green-500/20 text-green-500",
    'era-blue': "bg-blue-600/10 border border-blue-400/20 text-blue-400",
    'era-red': "bg-red-600/10 border border-red-400/20 text-red-400",
    'era-gold': "bg-yellow-600/10 border border-yellow-400/20 text-yellow-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors",
        variant !== 'outline' && variant !== 'default' ? "border" : "",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };


