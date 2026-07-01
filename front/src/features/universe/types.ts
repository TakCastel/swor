export interface WikiArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  metadata: Record<string, string | string[]>;
  category: string;
  image?: string;
  relatedArticles?: string[]; // IDs of related articles
}

export interface WikiSubCategory {
  id: string;
  title: string;
  articles: WikiArticle[];
}

export interface WikiCategory {
  id: string;
  title: string;
  icon?: string;
  subCategories: WikiSubCategory[];
}



