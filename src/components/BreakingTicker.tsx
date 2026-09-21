import React from 'react';
import { useRouter, Link } from '../lib/router';
import { Radio, ChevronRight, AlertCircle } from 'lucide-react';
import { Article, SiteSettings } from '../types';

interface BreakingTickerProps {
  settings: SiteSettings;
  breakingArticles: Article[];
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ settings, breakingArticles }) => {
  const { navigate } = useRouter();

  if (!settings.breaking_ticker_enabled) {
    return null;
  }

  // Determine current breaking headline and target link
  const topBreakingArticle = breakingArticles.length > 0 ? breakingArticles[0] : null;
  const displayHeadline = settings.breaking_ticker_text || topBreakingArticle?.title || 'Developing stories unfolding across the United States';
  const targetSlug = settings.breaking_ticker_article_slug || topBreakingArticle?.slug;

  return (
    <div className="bg-[#101F38] border-b border-slate-700/80 text-white overflow-hidden py-2 px-4 shadow-inner" id="breaking-news-ticker">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Pulsing Badge */}
        <div className="flex items-center gap-1.5 bg-red-600 text-white font-extrabold uppercase text-[11px] sm:text-xs px-2.5 py-1 rounded-sm tracking-wider shrink-0 shadow-sm animate-pulse">
          <span className="h-2 w-2 rounded-full bg-white inline-block" />
          <span>BREAKING</span>
        </div>

        {/* Ticker Headline */}
        <div className="flex-1 overflow-hidden min-w-0">
          {targetSlug ? (
            <Link
              to={`/story/${targetSlug}`}
              className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-red-400 truncate block transition group"
              title={displayHeadline}
              id="breaking-ticker-link"
            >
              <span className="group-hover:underline">{displayHeadline}</span>
            </Link>
          ) : (
            <span className="text-xs sm:text-sm font-medium text-slate-200 truncate block">
              {displayHeadline}
            </span>
          )}
        </div>

        {/* Action Link */}
        {targetSlug && (
          <Link
            to={`/story/${targetSlug}`}
            className="hidden sm:inline-flex items-center gap-0.5 text-xs font-bold text-red-400 hover:text-red-300 shrink-0 whitespace-nowrap group"
          >
            <span>Read Story</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};
