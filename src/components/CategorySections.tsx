import React from 'react';
import { useRouter, Link } from '../lib/router';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import { Article, Category } from '../types';

interface CategorySectionsProps {
  categories: Category[];
  articles: Article[];
}

const CATEGORY_ICONS: Record<string, string> = {
  'news': '🇺🇸',
  'viral': '🔥',
  'entertainment': '🎬',
  'sports': '🏈',
  'technology': '💻',
  'business': '💰',
  'lifestyle': '🌎',
  'interesting': '🔍',
  'trending': '📈',
};

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return 'Recent';
  }
}

export const CategorySections: React.FC<CategorySectionsProps> = ({ categories, articles }) => {
  // Highlight major categories
  const targetSlugs = ['news', 'viral', 'technology', 'business', 'sports', 'entertainment', 'lifestyle'];
  const activeCategories = categories.filter(c => targetSlugs.includes(c.slug));

  return (
    <div className="space-y-12 my-10" id="homepage-category-sections">
      {activeCategories.map((category) => {
        const catArticles = articles.filter(
          a => a.category_id === category.id || a.category_name?.toLowerCase() === category.name.toLowerCase()
        ).slice(0, 4);

        if (catArticles.length === 0) return null;

        const icon = CATEGORY_ICONS[category.slug] || '📌';

        return (
          <section key={category.id} className="space-y-4" id={`category-block-${category.slug}`}>
            {/* Category Header */}
            <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-label={category.name}>
                  {icon}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 font-sans">
                  {category.name}
                </h3>
              </div>
              <Link
                to={`/category/${category.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 group transition"
                id={`view-all-${category.slug}`}
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grid of stories (3-4 items) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catArticles.map((story) => (
                <article
                  key={story.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={story.featured_image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {story.trending && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">
                          Trending
                        </span>
                      )}
                    </div>

                    <div className="p-3.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatRelativeTime(story.published_at)}</span>
                        <span>•</span>
                        <span>{story.reading_time || 3}m read</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                        <Link to={`/story/${story.slug}`}>
                          {story.title}
                        </Link>
                      </h4>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[130px]">{story.author_name}</span>
                    <span className="flex items-center gap-1 font-medium text-slate-400">
                      <Eye className="w-3 h-3" />
                      {story.views.toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
