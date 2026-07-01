import { RuleSection } from '../types';
import { Card, CardTitle } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { ShieldAlert } from 'lucide-react';

interface RulesSectionDetailProps {
  section: RuleSection;
}

export default function RulesSectionDetail({ section }: RulesSectionDetailProps) {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-6">
        <div className="flex items-center gap-3 bg-yellow-500/5 w-fit px-4 py-1.5 rounded-full border border-yellow-500/10">
          <Badge variant="yellow" className="bg-transparent border-0 p-0 text-[10px] font-black tracking-[0.2em]">DIRECTIVES_PROTOCOL</Badge>
        </div>
        <h2 className="text-5xl font-black font-outfit text-white leading-tight uppercase tracking-tighter">{section.title}</h2>
        <div className="relative pl-10">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 rounded-full" />
          <p className="text-xl text-zinc-500 max-w-3xl leading-relaxed italic font-medium">
            {section.description}
          </p>
        </div>
      </header>

      <div className="space-y-6">
        <CategoryHeader title="Protocoles en Vigueur" icon={ShieldAlert} />
        <div className="grid gap-4">
          {section.rules.map((rule) => (
            <Card 
              key={rule.id} 
              hover
              className="p-10 group bg-zinc-900/40 border-white/5"
            >
              <div className="flex flex-col md:flex-row items-start gap-10">
                <div className="w-16 h-16 rounded-[1.25rem] bg-black/40 flex items-center justify-center shrink-0 border border-white/5 font-mono text-xl font-black text-yellow-500 shadow-2xl group-hover:border-yellow-500/20 transition-all">
                  {rule.id}
                </div>
                <div className="space-y-4">
                  <CardTitle className="text-2xl group-hover:text-yellow-500 transition-colors uppercase tracking-tight">
                    {rule.title}
                  </CardTitle>
                  <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                    {rule.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

