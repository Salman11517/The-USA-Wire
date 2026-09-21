import React from 'react';
import { useRouter, Link } from '../lib/router';
import { Flame, ArrowUpRight, Eye, Clock, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface TrendingSectionProps {
  trendingArticles: Article[];
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return 'Recent';
  }
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ trendingArticles }) => {
  const topFive = trendingArticles.slice(0, 5);

  if (topFive.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#0A192F] text-white py-10 my-8 shadow-md border-y border-slate-800" id="trending-america-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-600 to-amber-600 p-2.5 rounded-xl shadow-md">
              <Flame className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase font-sans">
                  WHAT'S TRENDING IN AMERICA
                </h2>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold bg-red-600/30 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Live Velocity
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Stories and debates capturing America’s digital consciousness right now
              </p>
            </div>
          </div>

          <Link
            to="/category/trending"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 self-start sm:self-auto bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 transition"
            id="view-all-trending-btn"
          >
            <span>Explore All Trending</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5 Column / Responsive Grid for Top 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
          {topFive.map((story, index) => {
            const rank = story.trending_rank || index + 1;
            return (
              <article
                key={story.id}
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 group shadow-sm"
              >
                <div>
                  {/* Rank Header + Category */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-black font-sans text-red-500 tracking-tighter">
                        #{rank}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {story.category_name || 'Trending'}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                      +{story.trend_score}%
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative aspect-16/9 rounded-lg overflow-hidden mb-3 bg-slate-950">
                    <img
                      src={story.featured_image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-red-400 transition leading-snug line-clamp-3">
                    <Link to={`/story/${story.slug}`}>
                      {story.title}
                    </Link>
                  </h3>
                </div>

                {/* Footer Metrics */}
                <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatRelativeTime(story.published_at)}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Eye className="w-3 h-3 text-slate-400" />
                    {story.views.toLocaleString()}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
