import React, { useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { Clock, BookOpen, ChevronDown, User } from 'lucide-react';
import { Article } from '../types';

interface LatestStoriesProps {
  articles: Article[];
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

export const LatestStories: React.FC<LatestStoriesProps> = ({ articles }) => {
  const [displayCount, setDisplayCount] = useState(6);

  const displayedArticles = articles.slice(0, displayCount);
  const hasMore = displayCount < articles.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 4, articles.length));
  };

  return (
    <section className="space-y-4" id="latest-stories-section">
      <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight uppercase text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600" />
          <span>LATEST STORIES</span>
        </h2>
        <span className="text-xs font-semibold text-slate-500">
          Updated in Real-Time
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedArticles.map((story) => (
          <article
            key={story.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Image */}
              <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                <img
                  src={story.featured_image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-400"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#0A192F] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                    {story.category_name || 'News'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <span className="text-slate-700 font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {story.author_name}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(story.published_at)}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                  <Link to={`/story/${story.slug}`}>
                    {story.title}
                  </Link>
                </h3>

                {story.subtitle && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {story.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                {story.reading_time || 3} min read
              </span>
              <Link
                to={`/story/${story.slug}`}
                className="font-bold text-red-600 hover:text-red-800 transition"
              >
                Read Story →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-2.5 rounded-lg border border-slate-300 shadow-sm transition hover:border-slate-400 text-sm"
            id="load-more-latest-btn"
          >
            <span>Load More Stories</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      )}
    </section>
  );
};
