import React, { useEffect, useState } from 'react';
import { useRouter } from '../lib/router';
import { HeroSection } from '../components/HeroSection';
import { BreakingTicker } from '../components/BreakingTicker';
import { TrendingSection } from '../components/TrendingSection';
import { LatestStories } from '../components/LatestStories';
import { CategorySections } from '../components/CategorySections';
import { MostRead } from '../components/MostRead';
import { Newsletter } from '../components/Newsletter';
import { getArticles, getCategories, getSiteSettings, getArticleById } from '../lib/db';
import { Article, Category, SiteSettings } from '../types';

export const HomePage: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDocMeta(
      "The USA Wire | America's Trending Stories, All in One Place",
      "Real-time coverage of what's happening and trending across America right now. Breaking news, viral stories, technology, business, entertainment, and culture."
    );

    async function loadData() {
      try {
        const [allArticles, allCats, siteSettings] = await Promise.all([
          getArticles({ limit: 40 }),
          getCategories(),
          getSiteSettings(),
        ]);

        setArticles(allArticles);
        setCategories(allCats);
        setSettings(siteSettings);

        // Determine featured article from settings or fallback to first featured/first published
        if (siteSettings.homepage_featured_article_id) {
          const specific = allArticles.find(a => a.id === siteSettings.homepage_featured_article_id);
          if (specific) {
            setFeaturedArticle(specific);
          } else {
            const fallback = allArticles.find(a => a.featured) || allArticles[0] || null;
            setFeaturedArticle(fallback);
          }
        } else {
          const fallback = allArticles.find(a => a.featured) || allArticles[0] || null;
          setFeaturedArticle(fallback);
        }
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Listen for data updates (e.g. from admin actions)
    const handleDataUpdate = () => {
      loadData();
    };
    window.addEventListener('usa-wire-data-updated', handleDataUpdate);
    return () => window.removeEventListener('usa-wire-data-updated', handleDataUpdate);
  }, [setDocMeta]);

  if (loading || !settings) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading America's trending newsroom...</p>
      </div>
    );
  }

  // Curated side articles for Hero (excluding the featured one)
  const sideArticles = articles
    .filter(a => a.id !== featuredArticle?.id)
    .slice(0, 4);

  // Trending articles
  const trendingArticles = articles.filter(a => a.trending);

  // Breaking articles
  const breakingArticles = articles.filter(a => a.breaking);

  return (
    <div className="pb-16" id="homepage-root">
      {/* Breaking News Bar */}
      <BreakingTicker settings={settings} breakingArticles={breakingArticles} />

      {/* Hero Editorial Section */}
      <HeroSection featuredArticle={featuredArticle} sideArticles={sideArticles} />

      {/* What's Trending In America (#1 to #5) */}
      <TrendingSection trendingArticles={trendingArticles.length > 0 ? trendingArticles : articles.slice(0, 5)} />

      {/* Main Content Layout (Latest Stories + Most Read Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Latest Stories (8 columns) */}
          <div className="lg:col-span-8">
            <LatestStories articles={articles} />
          </div>

          {/* Most Read Sidebar (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <MostRead articles={articles} />

            {/* Quick Channel Guide Card */}
            <div className="bg-slate-100/90 border border-slate-200/80 rounded-xl p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                The USA Wire Dispatch
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Stories aggregated from verified regional bureaus and digital trend pulses nationwide.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 6).map(c => (
                  <span key={c.id} className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Blocks (USA News, Viral, Tech, Business, Sports, Entertainment, Lifestyle) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <CategorySections categories={categories} articles={articles} />
      </div>

      {/* Newsletter Signup */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Newsletter />
      </div>
    </div>
  );
};
