'use client';

import { RULES_OVERVIEW_CONTENT } from '../types';
import { WikiArticleHeader, WikiMarkdown } from '@/shared/components/wiki/WikiArticle';

export default function RulesOverview() {
  return (
    <div className="space-y-8">
      <WikiArticleHeader
        badge="Code galactique"
        title="Règlement officiel"
        excerpt="Pour assurer une expérience de jeu de qualité et une ambiance saine, lisez chaque section avant de créer votre personnage et d'écrire sur le forum."
      />
      <WikiMarkdown>{RULES_OVERVIEW_CONTENT}</WikiMarkdown>
    </div>
  );
}
