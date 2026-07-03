'use client';

import { RuleSection } from '../types';
import { WikiArticleHeader, WikiMarkdown } from '@/shared/components/wiki/WikiArticle';

interface RulesSectionDetailProps {
  section: RuleSection;
}

export default function RulesSectionDetail({ section }: RulesSectionDetailProps) {
  return (
    <div className="space-y-8">
      <WikiArticleHeader
        badge="Directives"
        title={section.title}
        excerpt={section.description}
      />
      <WikiMarkdown>{section.content}</WikiMarkdown>
    </div>
  );
}
