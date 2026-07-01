import * as React from "react";
import { cn } from "@/shared/utils/cn";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
            <span className="text-[10px] font-mono text-yellow-500">{props.value || props.defaultValue}</span>
          </div>
        )}
        <input
          type="range"
          ref={ref}
          className={cn(
            "w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 transition-all",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };


