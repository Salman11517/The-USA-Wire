import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { getArticles, getCategories } from '../lib/db';
import { Article, Category } from '../types';
import { Search, Filter, Clock, Eye, AlertCircle } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { route, setDocMeta, navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'trending' | 'views'>('latest');
  const [loading, setLoading] = useState(true);

  // Extract ?q= from URL
  useEffect(() => {
    const params = new URLSearchParams(route.search);
    const q = params.get('q') || '';
    setQuery(q);

    setDocMeta(
      q ? `Search: "${q}" | The USA Wire` : 'Search Stories | The USA Wire',
      "Search breaking news, viral trends, business updates, sports highlights, and culture across America."
    );

    async function load() {
      setLoading(true);
      try {
        const [cats, articles] = await Promise.all([
          getCategories(),
          getArticles({ limit: 100 })
        ]);
        setCategories(cats);
        setAllArticles(articles);
      } catch (err) {
        console.error('Failed to load search data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [route.search, setDocMeta]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  // Filter & Search Logic
  const trimmedQuery = query.toLowerCase().trim();
  let results = allArticles.filter((article) => {
    // Category filter
    if (selectedCategory !== 'all') {
      if (article.category_id !== selectedCategory && article.category_name?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // Text search filter
    if (!trimmedQuery) return true;

    const inTitle = article.title.toLowerCase().includes(trimmedQuery);
    const inSubtitle = (article.subtitle || '').toLowerCase().includes(trimmedQuery);
    const inContent = article.content.toLowerCase().includes(trimmedQuery);
    const inCategory = (article.category_name || '').toLowerCase().includes(trimmedQuery);
    const inTags = (article.tags || []).some(t => t.toLowerCase().includes(trimmedQuery));
    const inAuthor = article.author_name.toLowerCase().includes(trimmedQuery);

    return inTitle || inSubtitle || inContent || inCategory || inTags || inAuthor;
  });

  // Sort
  results.sort((a, b) => {
    if (sortOrder === 'trending') return (b.trend_score || 0) - (a.trend_score || 0);
    if (sortOrder === 'views') return (b.views || 0) - (a.views || 0);
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" id="search-page-container">
      {/* Search Header Banner */}
      <div className="bg-[#0A192F] text-white rounded-2xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4 font-sans">
          SEARCH THE USA WIRE
        </h1>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all headlines, tags, topics, correspondents..."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-400"
              id="search-page-input"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow shrink-0"
            id="search-page-submit-btn"
          >
            Search
          </button>
        </form>

        {/* Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500"
              id="search-category-filter"
            >
              <option value="all">All Channels</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-medium">Sort:</span>
            <button
              type="button"
              onClick={() => setSortOrder('latest')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                sortOrder === 'latest' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('trending')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                sortOrder === 'trending' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trending
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('views')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                sortOrder === 'views' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Most Read
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {trimmedQuery ? (
            <span>Showing results for <span className="text-red-600 font-extrabold">"{trimmedQuery}"</span></span>
          ) : (
            <span>Showing All Verified Stories</span>
          )}
        </h2>
        <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
          {results.length} Stories Found
        </span>
      </div>

      {/* Results Grid or Empty State */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((story) => (
            <article
              key={story.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={story.featured_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#0A192F] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                    {story.category_name || 'News'}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span>{story.author_name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.reading_time || 3} min read
                    </span>
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

              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {story.views.toLocaleString()} views
                </span>
                <Link to={`/story/${story.slug}`} className="font-bold text-red-600 hover:text-red-800">
                  Read Story →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Stories Found</h3>
          <p className="text-sm text-slate-500">
            We couldn't find any stories matching "{query}". Try checking for typos or searching with broader keywords like "rail", "tech", "election", or "market".
          </p>
          <button
            type="button"
            onClick={() => { setQuery(''); setSelectedCategory('all'); }}
            className="mt-3 inline-block text-xs font-bold text-red-600 hover:underline"
          >
            Clear Search Filters
          </button>
        </div>
      )}
    </div>
  );
};
