import { RuleSection } from '../types';
import { Card, CardTitle } from '@/shared/components/ui/Card';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';
import { WikiArticleHeader } from '@/shared/components/wiki/WikiArticle';
import { ShieldAlert } from 'lucide-react';

interface RulesSectionDetailProps {
  section: RuleSection;
}

export default function RulesSectionDetail({ section }: RulesSectionDetailProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WikiArticleHeader
        badge="Directives"
        title={section.title}
        excerpt={section.description}
      />

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

