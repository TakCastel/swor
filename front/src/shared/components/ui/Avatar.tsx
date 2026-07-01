import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', status, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-[10px]",
      md: "h-12 w-12 text-xs",
      lg: "h-20 w-20 text-base",
      xl: "h-32 w-32 text-2xl",
    };

    const statusClasses = {
      online: "bg-green-500",
      offline: "bg-zinc-600",
      away: "bg-yellow-500",
      busy: "bg-red-500",
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        <div className={cn(
          "flex items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden font-black uppercase tracking-widest relative",
          sizeClasses[size]
        )}>
          {src ? (
            <Image src={src} alt={alt || fallback} fill className="object-cover" />
          ) : (
            <span className="text-zinc-500">{fallback.substring(0, 2)}</span>
          )}
        </div>
        {status && (
          <span className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black",
            statusClasses[status]
          )} />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };


