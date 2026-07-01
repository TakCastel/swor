'use client';

import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  History, 
  Users, 
  Globe, 
  Zap, 
  ChevronRight, 
  Search,
  BookOpen,
  Info,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { UNIVERSE_WIKI } from '../data/universe-wiki';
import { WikiArticle } from '../types';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { CategoryHeader } from '@/shared/components/forum/CategoryHeader';

export default function UniverseContent() {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(UNIVERSE_WIKI[0].subCategories[0].articles[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([UNIVERSE_WIKI[0].id]);

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const allArticles = useMemo(() => {
    const articles: WikiArticle[] = [];
    UNIVERSE_WIKI.forEach(cat => {
      cat.subCategories.forEach(sub => {
        articles.push(...sub.articles);
      });
    });
    return articles;
  }, []);

  const selectedArticle = useMemo(() => 
    allArticles.find(a => a.id === selectedArticleId) || allArticles[0],
  [selectedArticleId, allArticles]);

  const filteredWiki = useMemo(() => {
    if (!searchQuery) return UNIVERSE_WIKI;
    
    return UNIVERSE_WIKI.map(cat => ({
      ...cat,
      subCategories: cat.subCategories.map(sub => ({
        ...sub,
        articles: sub.articles.filter(art => 
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(sub => sub.articles.length > 0)
    })).filter(cat => cat.subCategories.length > 0);
  }, [searchQuery]);

  const categoryIcons: Record<string, any> = {
    history: History,
    society: Users,
    geography: Globe,
    science: Zap
  };

  return (
    <div className="py-12">
      {/* Mobile Header */}
      <Card className="lg:hidden flex items-center justify-between mb-8 p-4 rounded-2xl">
        <h1 className="text-xl font-outfit font-bold text-white tracking-wider">WIKI GALACTIQUE</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </Card>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Navigation */}
        <aside className={cn(
          "lg:w-80 space-y-12 shrink-0 lg:block",
          isSidebarOpen ? "block" : "hidden"
        )}>
          <div className="space-y-4 px-4">
            <h1 className="text-5xl font-black font-outfit text-white uppercase tracking-tighter">Wiki</h1>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Archives Galactiques</p>
          </div>

          {/* Search */}
          <div className="px-4">
            <Input 
              icon={Search}
              placeholder="Rechercher une donnée..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50"
            />
          </div>

          <nav className="space-y-3 px-2">
            {filteredWiki.map((category) => {
              const Icon = categoryIcons[category.id] || BookOpen;
              const isOpen = openCategories.includes(category.id);
              
              return (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all duration-300 group",
                      isOpen ? "bg-white/5 text-white shadow-lg" : "text-zinc-500 hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center border transition-all",
                        isOpen ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" : "bg-black/20 border-white/5 text-zinc-600 group-hover:text-zinc-400"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">{category.title}</span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-500",
                      isOpen ? "rotate-0 text-yellow-500" : "-rotate-90 text-zinc-700"
                    )} />
                  </button>
                  
                  {isOpen && (
                    <div className="ml-6 pl-6 border-l-2 border-white/5 space-y-6 py-4 animate-in fade-in slide-in-from-left-2 duration-300">
                      {category.subCategories.map(sub => (
                        <div key={sub.id} className="space-y-2">
                          <div className="px-3 py-1 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                            {sub.title}
                          </div>
                          <ul className="space-y-1">
                            {sub.articles.map(article => (
                              <li key={article.id}>
                                <button
                                  onClick={() => {
                                    setSelectedArticleId(article.id);
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                                    selectedArticleId === article.id 
                                      ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                  )}
                                >
                                  {article.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <Card className="mx-4 p-8 bg-yellow-500/[0.02] border-yellow-500/10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-12 h-12 text-yellow-500" />
            </div>
            <p className="text-[10px] font-black uppercase text-yellow-500 tracking-[0.4em] mb-4">Archives</p>
            <p className="text-xs text-zinc-500 leading-relaxed italic relative z-10">
              "L'histoire est écrite par ceux qui survivent à l'hyperespace."
            </p>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 bg-white/[0.02] w-fit px-6 py-2.5 rounded-full border border-white/5 shadow-inner">
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Galaxie</span>
            <ChevronRight className="w-3 h-3 text-zinc-800" />
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Archives</span>
            <ChevronRight className="w-3 h-3 text-zinc-800" />
            <span className="text-yellow-500/80">{selectedArticle.category}</span>
          </div>

          <div className="flex flex-col xl:flex-row gap-16">
            {/* Article Content */}
            <div className="flex-1 space-y-16">
              <header className="space-y-8">
                <h2 className="text-5xl lg:text-7xl font-black font-outfit text-white leading-tight uppercase tracking-tighter">
                  {selectedArticle.title}
                </h2>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 rounded-full" />
                  <p className="text-2xl text-zinc-400 font-medium leading-relaxed pl-10 italic">
                    {selectedArticle.excerpt}
                  </p>
                </div>
              </header>

              <div className="prose prose-invert prose-zinc max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({node, ...props}) => (
                      <CategoryHeader title={props.children as string} className="mt-20 mb-10" />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-2xl font-black text-white font-outfit mt-12 mb-6 uppercase tracking-widest border-l-4 border-white/10 pl-6" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-zinc-400 leading-relaxed mb-8 text-lg font-medium" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-zinc-300 font-bold text-sm transition-all hover:bg-white/[0.05] hover:border-white/10 list-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                        {props.children}
                      </li>
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="text-yellow-500 font-black tracking-wide" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-yellow-500/40 bg-yellow-500/5 p-10 rounded-r-[2.5rem] italic text-zinc-300 text-xl font-medium my-12 shadow-2xl" {...props} />
                    ),
                  }}
                >
                  {selectedArticle.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Infobox */}
            <aside className="w-full xl:w-96 shrink-0">
              <Card className="sticky top-32 overflow-hidden border-white/10 shadow-2xl">
                <div className="aspect-video bg-zinc-900 flex items-center justify-center relative border-b border-white/5 overflow-hidden group">
                  <span className="text-9xl opacity-5 font-black font-outfit text-white select-none group-hover:scale-110 transition-transform duration-700">{selectedArticle.title[0]}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="space-y-2">
                      <Badge variant="yellow" className="px-4 py-1 font-black">DATA_SCAN_OK</Badge>
                      <h4 className="text-white font-black font-outfit text-xl uppercase tracking-widest">{selectedArticle.title}</h4>
                    </div>
                  </div>
                </div>
                
                <dl className="p-10 space-y-8 bg-zinc-950/50">
                  {Object.entries(selectedArticle.metadata).map(([key, value]) => (
                    <div key={key} className="space-y-3 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <dt className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">{key}</dt>
                      <dd className="text-base text-zinc-200 font-bold tracking-tight">
                        {Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {value.map(v => (
                              <Badge key={v} variant="outline" className="px-3 py-1 rounded-lg bg-white/5 border-white/10 text-[10px] uppercase font-black tracking-widest text-zinc-400 hover:text-white transition-colors">
                                {v}
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

                <div className="bg-yellow-500/5 p-8 border-t border-white/5 backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shrink-0">
                      <Info className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest">
                      Archive officielle de la Bordure Intérieure.<br/>
                      <span className="text-zinc-700 font-black">SYNC_STAMP: {new Date().toLocaleDateString('fr-FR')}</span>
                    </p>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
