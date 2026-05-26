import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowLeft, Search, Filter, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { Post, placeholderPosts } from './AktualitySection';
import { fetchPublicArticles, formatArticleDate } from '../lib/kdermaApi';
import { defaultArticles } from '../../defaultArticles';

function renderFormattedContent(content: string) {
  if (!content) return null;

  const normalized = content.trim();

  if (normalized.startsWith('<div class="kderma-rectangle">')) {
    return (
      <div className="my-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-white p-6">
          <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand-blue" />
          <div>
            <h4 className="text-lg font-display font-bold text-[#0F172A]">Rectangle</h4>
            <p className="mt-2 text-slate-600 text-base leading-relaxed">
              Vložte vlastní text nebo upozornění do článku.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.startsWith('<div class="kderma-note">')) {
    return (
      <div className="my-10 rounded-[2rem] border border-blue-100 bg-blue-50/60 p-6 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-brand-blue">Poznámka</div>
        <p className="mt-2 text-slate-700 text-base leading-relaxed">Krátký blok pro praktické informace.</p>
      </div>
    );
  }
  
  const blocks = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  let keyIndex = 0;
  let listItemsAccumulator: string[] = [];
  let listType: 'bullet' | 'numeric' | null = null;

  const flushList = () => {
    if (listItemsAccumulator.length > 0) {
      if (listType === 'numeric') {
        renderedElements.push(
          <div key={`list-${keyIndex++}`} className="grid gap-4 my-8">
            {listItemsAccumulator.map((item, idx) => {
              const match = item.match(/^\d+\.\s*(.*?)(?::|$)(.*)/);
              if (match) {
                const title = match[1].trim();
                const body = match[2].trim();
                return (
                  <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue font-display font-bold text-base shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      {title && <h4 className="font-display font-bold text-slate-800 text-base mb-1">{title}</h4>}
                      {body && <p className="text-slate-500 text-sm leading-relaxed">{body}</p>}
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs flex gap-4 items-center">
                  <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0" />
                  <p className="text-slate-600 text-sm font-medium">{item}</p>
                </div>
              );
            })}
          </div>
        );
      } else {
        renderedElements.push(
          <div key={`list-${keyIndex++}`} className="grid gap-3.5 my-8">
            {listItemsAccumulator.map((item, idx) => {
              const cleaned = item.replace(/^•\s*/, '').trim();
              const colonIndex = cleaned.indexOf(':');
              if (colonIndex > 0 && colonIndex < 35) {
                const term = cleaned.substring(0, colonIndex).trim();
                const desc = cleaned.substring(colonIndex + 1).trim();
                return (
                  <div key={idx} className="flex gap-4 items-start bg-[#F8FAFC] border border-slate-200/60 p-4.5 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-brand-blue mt-2 shrink-0" />
                    <div className="text-sm">
                      <span className="font-bold text-[#0F172A] block md:inline md:mr-2">{term}:</span>
                      <span className="text-slate-600 font-medium">{desc}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className="flex gap-4 bg-slate-50/50 p-4 rounded-2xl items-center border border-slate-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                  <p className="text-slate-600 text-sm font-medium">{cleaned}</p>
                </div>
              );
            })}
          </div>
        );
      }
      listItemsAccumulator = [];
      listType = null;
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const origLine = blocks[i];
    const line = origLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('•')) {
      if (listType === 'numeric') {
        flushList();
      }
      listType = 'bullet';
      listItemsAccumulator.push(line);
    } else if (/^\d+\./.test(line)) {
      if (listType === 'bullet') {
        flushList();
      }
      listType = 'numeric';
      listItemsAccumulator.push(line);
    } else {
      flushList();
      renderedElements.push(
        <p key={keyIndex++} className="text-slate-600 text-base leading-relaxed mb-4 font-normal">
          {line}
        </p>
      );
    }
  }
  flushList();

  return <div className="space-y-4">{renderedElements}</div>;
}

interface AktualitySubpageProps {
  onBack: () => void;
  initialSelectedPost?: Post | null;
}

export default function AktualitySubpage({ onBack, initialSelectedPost }: AktualitySubpageProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(initialSelectedPost || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Vše');
  const [dbPosts, setDbPosts] = useState<Post[]>([]);

  const categories = ['Vše', 'Oznámení', 'Technologie', 'Poradenství'];

  React.useEffect(() => {
    let isActive = true;

    async function loadArticles() {
      try {
        const articles = await fetchPublicArticles();
        if (!isActive) return;

        setDbPosts(
          articles.map((article) => ({
            id: article.id,
            title: article.title,
            description: article.description,
            content: article.content,
            date: formatArticleDate(article.date),
            category: article.category || 'Oznámení',
          }))
        );
      } catch {
        if (isActive) {
          setDbPosts([]);
        }
      }
    }

    loadArticles();

    return () => {
      isActive = false;
    };
  }, []);

  const allPosts = dbPosts.length > 0 ? dbPosts : defaultArticles;

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Vše' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-44 md:pt-52 pb-32 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="max-w-3xl mb-16 text-left flex flex-col items-start">
                <div className="flex flex-col items-start gap-1.5 mb-6">
                  <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
                    Aktuality & novinky v K-DERMA
                  </span>
                  <div className="h-0.5 w-12 bg-brand-blue" />
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight text-[#0F172A] mb-6">
                  Aktuality kliniky <br />
                  <span className="text-brand-blue">K-Derma.</span>
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed">
                  Důležité informace o naší ordinaci, praktické rady pro ortodontické pacienty a novinky ze světa klinické péče.
                </p>
              </div>

              {/* Filters & Search Row */}
              <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                        selectedCategory === cat
                          ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/15'
                          : 'bg-white text-slate-500 hover:text-brand-blue border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div className="relative w-full md:max-w-xs">
                  <input
                    type="text"
                    placeholder="Hledat článek..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-5 py-3 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all"
                  />
                  <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* Articles Grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => {
                        setSelectedPost(post);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col justify-between hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-300 group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1.5 rounded-full">
                            {post.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-display font-bold text-[#0F172A] mb-4 group-hover:text-brand-blue transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                          {post.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Calendar size={14} />
                          <span>{post.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-blue group-hover:translate-x-1 transition-transform">
                          Číst dál
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="max-w-md mx-auto text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm px-6">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-6">
                    <Search size={28} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#0F172A] mb-2">Žádné články nebyly nalezeny</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Zkuste zadat jiné klíčové slovo nebo změnit vybranou kategorii.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Vše');
                    }}
                    className="text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    Resetovat filtry
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {/* Back to List */}
              <button 
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-blue mb-10 font-bold text-sm transition-colors cursor-pointer bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm hover:shadow-md"
              >
                <ArrowLeft size={16} /> Zpět na přehled aktualit
              </button>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3.5 py-2 rounded-full">
                  {selectedPost.category}
                </span>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                  <Calendar size={14} />
                  <span>{selectedPost.date}</span>
                </div>
              </div>

              {/* Article Headings */}
              <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-[#0F172A] mb-8 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Leading paragraph card */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-50 mb-10">
                <p className="text-slate-600 text-lg font-medium leading-relaxed">
                  {selectedPost.description}
                </p>
              </div>

              {/* Decisive Post Content */}
              <div className="prose prose-slate max-w-none text-[#0F172A] space-y-6 text-base leading-relaxed">
                {renderFormattedContent(selectedPost.content || selectedPost.description)}
              </div>

              {/* Bottom Call to Action */}
              <div className="mt-16 pt-10 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="font-display font-bold text-[#0F172A] text-lg mb-1">Máte doplňující otázky?</h4>
                  <p className="text-slate-500 text-sm">Rádi Vám vše zodpovíme na osobní ortodontické konzultaci.</p>
                </div>
                <button
                  onClick={() => {
                    onBack();
                    setTimeout(() => {
                      document.getElementById('kontakty-mapa')?.scrollIntoView({ behavior: 'smooth' });
                    }, 250);
                  }}
                  className="bg-brand-blue text-white px-8 py-4 rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-brand-blue/20 cursor-pointer whitespace-nowrap border-0"
                >
                  Objednat se na konzultaci
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
