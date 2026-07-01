import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { Search } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, label, id, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
            {label}
          </label>
        )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 text-sm text-zinc-300 ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:border-yellow-500/50 transition-all disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };



