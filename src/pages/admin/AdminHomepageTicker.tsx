import React, { useEffect, useState } from 'react';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getArticles, getSiteSettings, updateSiteSettings, updateArticle } from '../../lib/db';
import { Article, SiteSettings } from '../../types';
import { Radio, Star, Save, CheckCircle2, AlertCircle, Flame, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminHomepageTicker: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [tickerEnabled, setTickerEnabled] = useState(true);
  const [tickerText, setTickerText] = useState('');
  const [tickerSlug, setTickerSlug] = useState('');
  const [heroArticleId, setHeroArticleId] = useState('');

  useEffect(() => {
    setDocMeta('Hero & Breaking Ticker | The USA Wire Admin', 'Manage ticker and hero settings');

    async function load() {
      setLoading(true);
      try {
        const [allArticles, siteSettings] = await Promise.all([
          getArticles({ limit: 100 }),
          getSiteSettings(),
        ]);
        setArticles(allArticles);
        setSettings(siteSettings);

        setTickerEnabled(!!siteSettings.breaking_ticker_enabled);
        setTickerText(siteSettings.breaking_ticker_text || '');
        setTickerSlug(siteSettings.breaking_ticker_article_slug || '');
        setHeroArticleId(siteSettings.homepage_featured_article_id || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setDocMeta]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await updateSiteSettings({
        breaking_ticker_enabled: tickerEnabled,
        breaking_ticker_text: tickerText,
        breaking_ticker_article_slug: tickerSlug,
        homepage_featured_article_id: heroArticleId,
      });

      // Also mark the selected hero article as featured
      if (heroArticleId) {
        await updateArticle(heroArticleId, { featured: true });
      }

      setFeedback({ type: 'success', message: 'Homepage & breaking ticker configuration saved!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSetHeroFromArticle = (art: Article) => {
    setHeroArticleId(art.id);
  };

  const handleSetTickerFromArticle = (art: Article) => {
    setTickerText(art.title);
    setTickerSlug(art.slug);
  };

  if (loading || !settings) {
    return (
      <AdminLayout activeTab="/admin/ticker">
        <div className="py-20 text-center text-slate-500">Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="/admin/ticker">
      <div className="max-w-4xl mx-auto space-y-8" id="admin-ticker-view">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            Hero &amp; Breaking Ticker Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control the high-visibility breaking red bar and front-page lead editorial story
          </p>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Breaking News Ticker Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600" />
                <h2 className="text-base font-extrabold uppercase text-slate-900">
                  🔴 Breaking News Ticker
                </h2>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tickerEnabled}
                  onChange={(e) => setTickerEnabled(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span className="text-xs font-bold text-slate-700">Ticker Active On Front Page</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Ticker Headline Text
                </label>
                <input
                  type="text"
                  value={tickerText}
                  onChange={(e) => setTickerText(e.target.value)}
                  placeholder="e.g. Federal Aviation Administration issues emergency notice regarding nationwide radar upgrades"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Target Story Slug (Link when clicked)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tickerSlug}
                    onChange={(e) => setTickerSlug(e.target.value)}
                    placeholder="e.g. high-speed-rail-expansion-announced-linking-major-us-cities"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Quick populate ticker from current breaking stories */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                  Quick Select from Breaking Stories:
                </span>
                <div className="flex flex-wrap gap-2">
                  {articles.filter(a => a.breaking).slice(0, 4).map((bArt) => (
                    <button
                      key={bArt.id}
                      type="button"
                      onClick={() => handleSetTickerFromArticle(bArt)}
                      className="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition text-left"
                    >
                      Use: "{bArt.title.slice(0, 40)}..."
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Homepage Hero Lead Story Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-extrabold uppercase text-slate-900">
                Front-Page Main Hero Lead Story
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Select Featured Article for Top Left Hero Spotlight:
              </label>
              <select
                value={heroArticleId}
                onChange={(e) => setHeroArticleId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Auto-select highest priority featured story --</option>
                {articles.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.category_name || 'News'}] {a.title} ({a.views.toLocaleString()} views)
                  </option>
                ))}
              </select>
            </div>

            {/* Currently selected hero preview */}
            {heroArticleId && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                {(() => {
                  const selected = articles.find(a => a.id === heroArticleId);
                  if (!selected) return null;
                  return (
                    <>
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <img src={selected.featured_image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black uppercase text-red-600">
                          Selected Hero Story
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {selected.title}
                        </h4>
                        <span className="text-xs text-slate-500">
                          By {selected.author_name} • {selected.views.toLocaleString()} views
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition"
              id="save-ticker-settings-btn"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Homepage & Ticker Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
