import * as React from "react";
import { cn } from "@/shared/utils/cn";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-5 bg-white/5 rounded-full border border-white/10 transition-colors peer-checked:bg-yellow-500 peer-checked:border-yellow-500" />
          <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-500 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-black" />
        </div>
        {label && (
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };


