import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  subtitle?: string;
  gradient?: boolean;
  font?: 'starwars' | 'outfit' | 'sans';
}

export function SectionHeader({
  title,
  description,
  subtitle,
  gradient = false,
  font = 'outfit',
  className,
  ...props
}: SectionHeaderProps) {
  const fontClasses = {
    starwars: "font-outfit font-black",
    outfit: "font-outfit font-black tracking-tight",
    sans: "font-sans font-black"
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {subtitle && (
        <h3 className="text-xl font-bold font-outfit text-zinc-400 uppercase tracking-[0.3em] -mb-2">
          {subtitle}
        </h3>
      )}
      <div className="space-y-2">
        <h2
          className={cn(
            "text-5xl uppercase",
            fontClasses[font],
            gradient ? "text-gradient" : "text-white"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="text-zinc-500 max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}


