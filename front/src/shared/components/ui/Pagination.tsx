import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Logic to show only a few pages if there are many
  const visiblePages = pages.filter(p => 
    p === 1 || 
    p === totalPages || 
    (p >= currentPage - 1 && p <= currentPage + 1)
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visiblePages.map((page, index) => {
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <React.Fragment key={page}>
            {showEllipsis && <span className="text-zinc-600 px-2">...</span>}
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                "w-10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                currentPage === page
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                  : "border border-white/5 bg-white/[0.02] text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:pointer-events-none transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}


