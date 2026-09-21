import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { getArticles, getCategories } from '../lib/db';
import { Article, Category } from '../types';
import { Clock, Eye, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { MostRead } from '../components/MostRead';

interface CategoryPageProps {
  categorySlug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug }) => {
  const { setDocMeta } = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'trending'>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cats, all] = await Promise.all([
          getCategories(),
          getArticles({ limit: 50 })
        ]);
        setAllArticles(all);

        // Match category slug
        const matched = cats.find(
          c => c.slug.toLowerCase() === categorySlug.toLowerCase() ||
               c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
        );

        if (matched) {
          setCategory(matched);
          setDocMeta(
            `${matched.name} | The USA Wire`,
            matched.description || `Browse the latest ${matched.name} updates, trending stories, and analysis on The USA Wire.`
          );
        } else if (categorySlug === 'trending') {
          setCategory({
            id: 'virtual-trending',
            name: 'Trending Stories',
            slug: 'trending',
            description: 'The stories, debates, and breaking moments sweeping digital feeds across America right now.',
            created_at: new Date().toISOString()
          });
          setDocMeta("Trending in America | The USA Wire", "Stories capturing America's attention right now.");
        } else {
          setCategory(null);
        }

        // Filter articles
        let filtered: Article[] = [];
        if (categorySlug === 'trending') {
          filtered = all.filter(a => a.trending);
          if (filtered.length === 0) filtered = all.slice(0, 10);
        } else if (matched) {
          filtered = all.filter(
            a => a.category_id === matched.id ||
                 a.category_name?.toLowerCase() === matched.name.toLowerCase()
          );
        }
        setArticles(filtered);
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setLoading(false);
      }
    }

    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, setDocMeta]);

  // Sort articles
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'trending') return (b.trend_score || 0) - (a.trend_score || 0);
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  const featuredStory = sortedArticles[0] || null;
  const remainingStories = sortedArticles.slice(1);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading channel stories...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-black text-slate-900">Channel Not Found</h1>
        <p className="text-slate-600">The news channel "{categorySlug}" is not recognized.</p>
        <Link to="/" className="inline-block bg-[#0A192F] text-white px-6 py-2.5 rounded-lg font-bold">
          Return to Front Page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" id="category-page-container">
      {/* Category Header Banner */}
      <div className="bg-[#0A192F] text-white rounded-2xl p-6 sm:p-10 mb-8 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-red-500 bg-red-600/20 px-2.5 py-1 rounded border border-red-500/30">
                Channel Dispatch
              </span>
              <span className="text-xs text-slate-400">
                {sortedArticles.length} Stories Indexed
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight font-sans">
              {category.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Sort Pill Filters */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                sortBy === 'latest' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => setSortBy('trending')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                sortBy === 'trending' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trending
            </button>
            <button
              type="button"
              onClick={() => setSortBy('views')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                sortBy === 'views' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Most Read
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Stories (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Featured Category Story */}
          {featuredStory && (
            <article className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                <div className="md:col-span-7 aspect-16/10 md:aspect-auto overflow-hidden bg-slate-100">
                  <img
                    src={featuredStory.featured_image}
                    alt={featuredStory.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                  />
                </div>
                <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                      Channel Spotlight
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-red-600 transition leading-snug mt-1">
                      <Link to={`/story/${featuredStory.slug}`}>
                        {featuredStory.title}
                      </Link>
                    </h2>
                    {featuredStory.subtitle && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3">
                        {featuredStory.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>By {featuredStory.author_name}</span>
                    <Link to={`/story/${featuredStory.slug}`} className="font-bold text-red-600 hover:underline">
                      Read Story →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Grid of Remaining Stories */}
          {remainingStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {remainingStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={story.featured_image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      {story.trending && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                          Trending
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span>{story.author_name}</span>
                        <span>•</span>
                        <span>{story.reading_time || 3} min read</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                        <Link to={`/story/${story.slug}`}>
                          {story.title}
                        </Link>
                      </h3>
                      {story.subtitle && (
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">
                          {story.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="px-4 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {story.views.toLocaleString()} views
                    </span>
                    <Link to={`/story/${story.slug}`} className="font-bold text-red-600 hover:text-red-800">
                      Read →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm text-slate-500">More stories are currently in development by our newsroom correspondents.</p>
            </div>
          )}
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <MostRead articles={allArticles} />
        </div>
      </div>
    </div>
  );
};
