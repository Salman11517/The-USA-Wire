import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { getArticleBySlug, getArticles, incrementArticleViews } from '../lib/db';
import { Article } from '../types';
import { MostRead } from '../components/MostRead';
import {
  Clock,
  Calendar,
  Share2,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Eye,
  Bookmark,
  ArrowLeft,
  Flame
} from 'lucide-react';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const { setDocMeta, navigate } = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const found = await getArticleBySlug(slug);
        if (found) {
          setArticle(found);
          // Set dynamic SEO tags
          setDocMeta(
            found.seo_title || found.title,
            found.meta_description || found.subtitle || found.title,
            found.featured_image
          );

          // Increment view count
          incrementArticleViews(found.id);

          // Load related articles in same category
          const all = await getArticles({ limit: 20 });
          setAllArticles(all);
          const related = all
            .filter(a => a.id !== found.id && (a.category_id === found.category_id || a.category_name === found.category_name))
            .slice(0, 3);
          setRelatedArticles(related);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, setDocMeta]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading story...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-black text-slate-900">Story Not Found</h1>
        <p className="text-slate-600">The article you are looking for may have been updated, rescheduled, or moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Front Page</span>
        </Link>
      </div>
    );
  }

  // Format Dates
  const publishedDate = new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const updatedDate = article.updated_at
    ? new Date(article.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Share handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://theusawire.com/story/${article.slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareX = () => {
    const text = `${article.title} - via @TheUSAWire`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = `${article.title} - ${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  // Structured Data Schema.org NewsArticle injection
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.meta_description || article.subtitle,
    'image': [article.featured_image],
    'datePublished': article.published_at,
    'dateModified': article.updated_at || article.published_at,
    'author': [{
      '@type': 'Person',
      'name': article.author_name,
    }],
    'publisher': {
      '@type': 'Organization',
      'name': 'The USA Wire',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://theusawire.com/logo.png',
      }
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10" id={`article-${article.id}`}>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5 font-medium flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-red-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/category/${article.category_id || 'news'}`} className="hover:text-red-600 uppercase font-bold text-red-600">
          {article.category_name || 'USA News'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 truncate max-w-xs">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Article Content (8 columns) */}
        <main className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 md:p-10 shadow-sm">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#0A192F] text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded">
                {article.category_name || 'USA News'}
              </span>
              {article.trending && (
                <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Trending #{article.trending_rank || 1}
                </span>
              )}
              {article.breaking && (
                <span className="bg-amber-500 text-black text-[11px] font-extrabold uppercase px-2.5 py-1 rounded animate-pulse">
                  🔴 Breaking Story
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] font-sans">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed border-l-4 border-red-600 pl-4 py-0.5">
                {article.subtitle}
              </p>
            )}

            {/* Author Byline & Date Bar */}
            <div className="pt-3 pb-4 border-y border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {article.author_avatar ? (
                  <img
                    src={article.author_avatar}
                    alt={article.author_name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {article.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {article.author_name}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Staff Correspondent</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.reading_time || 3} min read
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <div className="font-medium text-slate-700">Published: {publishedDate}</div>
                {updatedDate && <div className="text-slate-400">Updated: {updatedDate}</div>}
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                Share Story:
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="bg-[#1877F2] hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1"
                  aria-label="Share on Facebook"
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={handleShareX}
                  className="bg-black hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1"
                  aria-label="Share on X"
                >
                  X / Twitter
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="bg-[#25D366] hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1"
                  aria-label="Share on WhatsApp"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1"
                  aria-label="Copy article link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="my-6 rounded-xl overflow-hidden bg-slate-100 shadow-md">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-auto max-h-[520px] object-cover"
            />
            <div className="bg-slate-900/90 text-slate-300 text-xs px-4 py-2 flex items-center justify-between">
              <span className="italic truncate">{article.title}</span>
              <span className="text-slate-400 text-[11px] shrink-0 ml-2">The USA Wire Editorial Media</span>
            </div>
          </div>

          {/* Article Editorial Body */}
          <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed font-serif space-y-5">
            {article.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-xl sm:text-2xl font-bold font-sans text-slate-900 mt-6 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('* ')) {
                const bulletLines = paragraph.split('\n');
                return (
                  <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-3 text-base font-sans">
                    {bulletLines.map((bLine, bIdx) => (
                      <li key={bIdx} dangerouslySetInnerHTML={{ __html: bLine.replace(/^\*\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p key={pIdx} className="leading-relaxed font-sans text-slate-700">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Source Transparency Box (Mandatory Requirement Section 13) */}
          <div className="mt-8 pt-5 border-t border-slate-200">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Editorial Reporting & Transparency
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  Source:{' '}
                  <span className="text-red-700 font-bold">
                    {article.source_name || 'The USA Wire Investigative Bureau'}
                  </span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  The USA Wire adheres strictly to truthful attribution standards across all American coverage.
                </p>
              </div>

              {article.source_url && (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-4 py-2 rounded-lg border border-slate-300 shadow-sm transition shrink-0"
                >
                  <span>Read Original Source</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              )}
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filed Under:</span>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Related Stories Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-slate-900">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-4 font-sans">
                RELATED STORIES IN {article.category_name?.toUpperCase() || 'THIS CHANNEL'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <div key={rel.id} className="group">
                    <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100 mb-2">
                      <img
                        src={rel.featured_image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 line-clamp-2 leading-snug">
                      <Link to={`/story/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Sidebar (4 columns) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Most Read Stories */}
          <MostRead articles={allArticles} />

          {/* Trending Pulse */}
          <div className="bg-[#0A192F] text-white rounded-xl p-5 shadow-sm border border-slate-800">
            <div className="border-b border-slate-700 pb-2 mb-4 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-red-500" />
                <span>Trending Pulse</span>
              </h3>
              <span className="text-[10px] text-slate-400">Real-Time</span>
            </div>

            <div className="space-y-3.5">
              {allArticles.filter(a => a.trending && a.id !== article.id).slice(0, 4).map((tStory, idx) => (
                <div key={tStory.id} className="flex items-start gap-3 group">
                  <span className="text-lg font-black text-slate-500 font-sans">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-red-400 line-clamp-2 leading-snug">
                      <Link to={`/story/${tStory.slug}`}>
                        {tStory.title}
                      </Link>
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">
                      +{tStory.trend_score}% trending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};
