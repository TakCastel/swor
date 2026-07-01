import * as React from "react";
import { cn } from "@/shared/utils/cn";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ElementType;
    content: React.ReactNode;
  }[];
  defaultValue?: string;
  className?: string;
}

export function Tabs({ tabs, defaultValue, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0].id);

  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}


