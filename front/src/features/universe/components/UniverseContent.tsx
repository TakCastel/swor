'use client';

import { useMemo, useState } from 'react';
import {
  BookOpen,
  Globe,
  Info,
  Shield,
  Sparkles,
  Swords,
} from 'lucide-react';
import WikiShell, { type WikiNavCategory } from '@/shared/components/wiki/WikiShell';
import { WikiArticleHeader, WikiMarkdown } from '@/shared/components/wiki/WikiArticle';
import { UNIVERSE_WIKI } from '../data/universe-wiki';

const categoryIcons: Record<string, typeof BookOpen> = {
  server: Info,
  fundamentals: BookOpen,
  'clone-wars': Swords,
  'civil-war': Shield,
  'new-republic': Sparkles,
  encyclopedia: Globe,
};

function findArticleContext(articleId: string) {
  for (const category of UNIVERSE_WIKI) {
    for (const subCategory of category.subCategories) {
      const article = subCategory.articles.find((a) => a.id === articleId);
      if (article) {
        return { category, subCategory, article };
      }
    }
  }

  const fallback = UNIVERSE_WIKI[0].subCategories[0].articles[0];
  return {
    category: UNIVERSE_WIKI[0],
    subCategory: UNIVERSE_WIKI[0].subCategories[0],
    article: fallback,
  };
}

export default function UniverseContent() {
  const [selectedArticleId, setSelectedArticleId] = useState(
    UNIVERSE_WIKI[0].subCategories[0].articles[0].id,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWiki = useMemo(() => {
    if (!searchQuery) {
      return UNIVERSE_WIKI;
    }

    const query = searchQuery.toLowerCase();

    return UNIVERSE_WIKI.map((category) => ({
      ...category,
      subCategories: category.subCategories
        .map((sub) => ({
          ...sub,
          articles: sub.articles.filter(
            (article) =>
              article.title.toLowerCase().includes(query) ||
              article.excerpt.toLowerCase().includes(query),
          ),
        }))
        .filter((sub) => sub.articles.length > 0),
    })).filter((category) => category.subCategories.length > 0);
  }, [searchQuery]);

  const navCategories = useMemo((): WikiNavCategory[] => {
    return filteredWiki.map((category) => ({
      id: category.id,
      title: category.title,
      icon: categoryIcons[category.id] ?? BookOpen,
      groups: category.subCategories.map((sub) => ({
        id: sub.id,
        title: sub.title,
        items: sub.articles.map((article) => ({
          id: article.id,
          title: article.title,
          active: selectedArticleId === article.id,
          onSelect: () => setSelectedArticleId(article.id),
        })),
      })),
    }));
  }, [filteredWiki, selectedArticleId]);

  const { article } = findArticleContext(selectedArticleId);

  return (
    <WikiShell
      title="Univers"
      subtitle="Lore, ères et encyclopédie de la galaxie Swor."
      categories={navCategories}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      footnoteLabel="Archives"
      footnote={`"L'histoire est écrite par ceux qui survivent à l'hyperespace."`}
    >
      <div className="space-y-8">
        <WikiArticleHeader
          badge={article.category}
          title={article.title}
          excerpt={article.excerpt}
        />
        <WikiMarkdown>{article.content}</WikiMarkdown>
      </div>
    </WikiShell>
  );
}
