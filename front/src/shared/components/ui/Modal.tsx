import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className={cn(
        "relative w-full rounded-[2.5rem] border border-white/10 bg-zinc-900/95 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-full",
        sizeClasses[size]
      )}>
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          {title && (
            <h2 className="text-xl font-black font-outfit text-white uppercase tracking-widest">
              {title}
            </h2>
          )}
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}


