'use client';

import * as React from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  className?: string;
}

export function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = "Sélectionner...", 
  label,
  searchable = true,
  className
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("relative space-y-2", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
          {label}
        </label>
      )}
      
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-2 text-sm text-white outline-none transition-all hover:border-white/10 focus:border-yellow-500/50",
          isOpen && "border-yellow-500/50 ring-1 ring-yellow-500/20"
        )}
      >
        <span className={cn(!value && "text-zinc-500")}>
          {value || placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in duration-200 origin-top border-yellow-500/20">
          {searchable && (
            <div className="flex items-center border-b border-white/5 bg-white/[0.02] px-3">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                className="flex h-10 w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3 text-zinc-500 hover:text-white" />
                </button>
              )}
            </div>
          )}
          
          <div className="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-yellow-500 hover:text-black",
                    value === option ? "bg-yellow-500/10 text-yellow-500" : "text-zinc-300"
                  )}
                >
                  <span>{option}</span>
                  {value === option && <Check className="h-4 w-4" />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-zinc-500">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

