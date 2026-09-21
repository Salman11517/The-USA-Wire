import React from 'react';
import { useRouter, Link } from '../lib/router';
import { Clock, TrendingUp, ChevronRight, Eye } from 'lucide-react';
import { Article } from '../types';

interface HeroSectionProps {
  featuredArticle: Article | null;
  sideArticles: Article[];
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  } catch {
    return 'Recent';
  }
}

export const HeroSection: React.FC<HeroSectionProps> = ({ featuredArticle, sideArticles }) => {
  if (!featuredArticle) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8" id="editorial-hero-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Large Featured Story (Left: 7-8 cols) */}
        <div className="lg:col-span-8 flex flex-col group">
          <div className="relative overflow-hidden rounded-xl bg-slate-900 aspect-16/9 md:aspect-21/10 shadow-lg">
            <img
              src={featuredArticle.featured_image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              loading="eager"
            />
            {/* Editorial overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded shadow-md">
                {featuredArticle.category_name || 'Featured Story'}
              </span>
              {featuredArticle.breaking && (
                <span className="bg-amber-500 text-black font-extrabold text-[11px] uppercase px-2.5 py-1 rounded shadow-md flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-black animate-ping" />
                  Live Update
                </span>
              )}
            </div>

            {/* Mobile overlay text fallback or details */}
            <div className="absolute bottom-4 left-4 right-4 text-white sm:hidden">
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" />
                {formatRelativeTime(featuredArticle.published_at)}
              </span>
              <h1 className="text-lg font-bold leading-snug line-clamp-2">
                {featuredArticle.title}
              </h1>
            </div>
          </div>

          {/* Editorial Headline & Summary below image on desktop/tablet for readability */}
          <div className="mt-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-medium mb-2">
                <span className="text-slate-900 font-bold uppercase tracking-wider">
                  By {featuredArticle.author_name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatRelativeTime(featuredArticle.published_at)}
                </span>
                <span>•</span>
                <span>{featuredArticle.reading_time || 4} min read</span>
                {featuredArticle.views > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Eye className="w-3.5 h-3.5" />
                      {featuredArticle.views.toLocaleString()} views
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 hover:text-red-700 transition leading-tight">
                <Link to={`/story/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h1>

              {featuredArticle.subtitle && (
                <p className="mt-2.5 text-base sm:text-lg text-slate-600 line-clamp-3 leading-relaxed">
                  {featuredArticle.subtitle}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <Link
                to={`/story/${featuredArticle.slug}`}
                className="inline-flex items-center gap-1.5 bg-[#0A192F] hover:bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors group"
                id="hero-read-article-btn"
              >
                <span>Read Full Story</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              {featuredArticle.source_name && (
                <span className="text-xs text-slate-400 italic">
                  Reported via {featuredArticle.source_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Curated Stories (Right: 4-5 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="border-b-2 border-[#0A192F] pb-2 mb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Trending Across America</span>
            </h2>
            <Link to="/category/trending" className="text-xs font-bold text-red-600 hover:underline">
              All Trends →
            </Link>
          </div>

          <div className="divide-y divide-slate-200 flex-1 flex flex-col justify-between">
            {sideArticles.slice(0, 4).map((story, idx) => (
              <article key={story.id} className="py-3 sm:py-3.5 first:pt-0 last:pb-0 group">
                <div className="flex gap-3.5 items-start">
                  <div className="w-24 h-20 sm:w-28 sm:h-22 shrink-0 rounded-lg overflow-hidden bg-slate-100 shadow-sm relative">
                    <img
                      src={story.featured_image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-1 left-1 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        {story.category_name || 'News'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(story.published_at)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                      <Link to={`/story/${story.slug}`}>
                        {story.title}
                      </Link>
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{story.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">+{story.trend_score}% trending</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
