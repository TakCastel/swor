import * as React from "react";
import { cn } from "@/shared/utils/cn";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute z-[100] px-3 py-1.5 rounded-lg bg-zinc-800 text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap border border-white/10 shadow-xl animate-in fade-in duration-200",
          positionClasses[position]
        )}>
          {content}
          <div className={cn(
            "absolute w-2 h-2 bg-zinc-800 border-white/10 transform rotate-45",
            position === 'top' && "bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b",
            position === 'bottom' && "top-[-5px] left-1/2 -translate-x-1/2 border-l border-t",
            position === 'left' && "right-[-5px] top-1/2 -translate-y-1/2 border-r border-t",
            position === 'right' && "left-[-5px] top-1/2 -translate-y-1/2 border-l border-b",
          )} />
        </div>
      )}
    </div>
  );
}


