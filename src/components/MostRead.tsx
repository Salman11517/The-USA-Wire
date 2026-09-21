import React from 'react';
import { useRouter, Link } from '../lib/router';
import { Eye, Flame, TrendingUp } from 'lucide-react';
import { Article } from '../types';

interface MostReadProps {
  articles: Article[];
}

export const MostRead: React.FC<MostReadProps> = ({ articles }) => {
  // Sort by views descending and take top 5
  const topRead = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  if (topRead.length === 0) return null;

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="most-read-sidebar">
      <div className="border-b-2 border-slate-900 pb-2 mb-4 flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-red-600" />
          <span>MOST READ</span>
        </h3>
        <span className="text-[11px] font-semibold text-slate-400 uppercase">This Week</span>
      </div>

      <div className="divide-y divide-slate-100">
        {topRead.map((story, idx) => (
          <article key={story.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5 group">
            <span className="text-2xl sm:text-3xl font-black text-slate-300 group-hover:text-red-600 transition-colors font-sans w-6 text-center shrink-0">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                {story.category_name || 'Trending'}
              </span>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition leading-snug line-clamp-2 mt-0.5">
                <Link to={`/story/${story.slug}`}>
                  {story.title}
                </Link>
              </h4>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span>{story.views.toLocaleString()} reads</span>
                <span>•</span>
                <span>{story.reading_time || 3} min read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
};
