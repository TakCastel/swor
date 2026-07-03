'use client';

import { useMemo, useState } from 'react';
import {
  BookOpen,
  Globe,
  Info,
  Rocket,
  Shield,
  Sparkles,
  Swords,
} from 'lucide-react';
import WikiShell, { type WikiNavCategory } from '@/shared/components/wiki/WikiShell';
import {
  WikiArticleHeader,
  WikiBreadcrumbs,
  WikiMarkdown,
} from '@/shared/components/wiki/WikiArticle';
import { UNIVERSE_WIKI } from '../data/universe-wiki';
import { Badge } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';

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

  const { category, subCategory, article } = findArticleContext(selectedArticleId);

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
      <div className="space-y-10">
        <WikiBreadcrumbs
          segments={['Univers', category.title, subCategory.title, article.title]}
        />

        <div className="flex flex-col xl:flex-row gap-12">
          <div className="flex-1 space-y-10 min-w-0">
            <WikiArticleHeader
              badge={article.category}
              title={article.title}
              excerpt={article.excerpt}
            />
            <WikiMarkdown>{article.content}</WikiMarkdown>
          </div>

          {Object.keys(article.metadata).length > 0 && (
            <aside className="w-full xl:w-80 shrink-0">
              <Card className="sticky top-32 overflow-hidden border-white/10">
                <div className="aspect-video bg-zinc-900 flex items-center justify-center border-b border-white/5">
                  <Rocket className="w-12 h-12 text-yellow-500/20" />
                </div>
                <dl className="p-8 space-y-6">
                  {Object.entries(article.metadata).map(([key, value]) => (
                    <div key={key} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <dt className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.25em]">
                        {key}
                      </dt>
                      <dd className="text-sm text-zinc-200 font-medium">
                        {Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {value.map((entry) => (
                              <Badge
                                key={entry}
                                variant="outline"
                                className="text-[10px] uppercase tracking-widest"
                              >
                                {entry}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </WikiShell>
  );
}
