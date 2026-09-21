import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getArticles, getCategories, getSiteSettings, getContactMessages, getSubscribers } from '../../lib/db';
import { Article, Category, SiteSettings } from '../../types';
import {
  FileText,
  Eye,
  Flame,
  CheckCircle,
  Clock,
  PlusCircle,
  Settings,
  ArrowUpRight,
  TrendingUp,
  Radio,
  ExternalLink,
  Users,
  Mail
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [messagesCount, setMessagesCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDocMeta('Admin Dashboard | The USA Wire', 'Overview of article metrics, views, and editorial queues.');

    async function loadData() {
      try {
        const [allArticles, allCats, siteSettings, msgs, subs] = await Promise.all([
          getArticles({ limit: 100 }),
          getCategories(),
          getSiteSettings(),
          getContactMessages(),
          getSubscribers(),
        ]);
        setArticles(allArticles);
        setCategories(allCats);
        setSettings(siteSettings);
        setMessagesCount(msgs.length);
        setSubscribersCount(subs.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [setDocMeta]);

  if (loading) {
    return (
      <AdminLayout activeTab="/admin/dashboard">
        <div className="py-20 text-center text-slate-500">
          Loading editorial dashboard metrics...
        </div>
      </AdminLayout>
    );
  }

  // Metrics Calculations
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === 'published').length;
  const draftArticles = articles.filter(a => a.status === 'draft').length;
  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const trendingArticles = articles.filter(a => a.trending).length;

  // Top 5 Performing
  const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <AdminLayout activeTab="/admin/dashboard">
      <div className="space-y-8" id="admin-dashboard-view">
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
              Editorial Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              The USA Wire real-time content command center & metric analytics
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
              id="admin-create-article-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Article</span>
            </Link>

            <Link
              to="/admin/ticker"
              className="inline-flex items-center gap-1.5 bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition"
            >
              <Radio className="w-4 h-4 text-red-400" />
              <span>Manage Ticker</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-sm transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Site</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Articles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Total Stories</span>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalArticles}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">{publishedArticles} Published</span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{draftArticles} Drafts</span>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Total Story Views</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-slate-400">
              Across all published channels &amp; bureaus
            </div>
          </div>

          {/* Active Trends */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Active Trending</span>
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{trendingArticles}</div>
            <div className="text-xs text-red-600 font-semibold">
              Live on America’s Trending feed
            </div>
          </div>

          {/* Subscribers & Messages */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Subscribers & Leads</span>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{subscribersCount}</div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Link to="/admin/subscribers" className="text-blue-600 font-bold hover:underline">
                {subscribersCount} Readers
              </Link>
              <span>•</span>
              <Link to="/admin/messages" className="text-red-600 font-bold hover:underline">
                {messagesCount} Tips
              </Link>
            </div>
          </div>
        </div>

        {/* Top Performing Articles Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-extrabold text-slate-900 uppercase">
                Top Performing Stories By Views
              </h2>
            </div>
            <Link to="/admin/articles" className="text-xs font-bold text-red-600 hover:underline">
              Manage All Articles →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Rank &amp; Story</th>
                  <th className="px-5 py-3">Channel</th>
                  <th className="px-5 py-3">Views</th>
                  <th className="px-5 py-3">Trend Velocity</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topArticles.map((art, idx) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-slate-400 w-5 font-sans">
                          #{idx + 1}
                        </span>
                        <div className="w-12 h-9 rounded bg-slate-100 overflow-hidden shrink-0">
                          <img src={art.featured_image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <span className="font-bold text-slate-900 truncate block hover:text-red-600">
                            <Link to={`/admin/articles/edit/${art.id}`}>{art.title}</Link>
                          </span>
                          <span className="text-[11px] text-slate-400">By {art.author_name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {art.category_name || 'News'}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {art.views.toLocaleString()}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        +{art.trend_score}%
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {art.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <Link
                          to={`/story/${art.slug}`}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/articles/edit/${art.id}`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick n8n Automation Status Note */}
        <div className="bg-gradient-to-r from-[#0A192F] to-[#102A4C] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
              Automation &amp; API Ready
            </span>
            <h3 className="text-lg font-bold">Connect n8n or External AI Webhooks</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              The USA Wire database schema and ingestion endpoints are architected for headless auto-posting from n8n workflows with automatic slugification, reading-time estimation, and trend scoring.
            </p>
          </div>
          <Link
            to="/admin/automation"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shrink-0"
          >
            Open n8n Integration Hub →
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};
