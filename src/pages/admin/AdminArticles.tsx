import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getArticles, getCategories, deleteArticle, updateArticle } from '../../lib/db';
import { Article, Category } from '../../types';
import {
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  Flame,
  Radio,
  Star,
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';

export const AdminArticles: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setDocMeta('Manage Articles | The USA Wire Admin', 'Article manager');
    loadData();
  }, [setDocMeta]);

  async function loadData() {
    setLoading(true);
    try {
      const [allArticles, allCats] = await Promise.all([
        getArticles({ limit: 100 }),
        getCategories(),
      ]);
      setArticles(allArticles);
      setCategories(allCats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles(articles.filter(a => a.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await updateArticle(article.id, { status: newStatus });
      setArticles(articles.map(a => (a.id === article.id ? { ...a, status: newStatus } : a)));
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleToggleTrending = async (article: Article) => {
    const newTrending = !article.trending;
    try {
      await updateArticle(article.id, { trending: newTrending });
      setArticles(articles.map(a => (a.id === article.id ? { ...a, trending: newTrending } : a)));
    } catch (err) {
      console.error('Failed to toggle trending', err);
    }
  };

  const handleToggleBreaking = async (article: Article) => {
    const newBreaking = !article.breaking;
    try {
      await updateArticle(article.id, { breaking: newBreaking });
      setArticles(articles.map(a => (a.id === article.id ? { ...a, breaking: newBreaking } : a)));
    } catch (err) {
      console.error('Failed to toggle breaking', err);
    }
  };

  // Filtering
  const filtered = articles.filter(a => {
    if (selectedCategory !== 'all' && a.category_id !== selectedCategory && a.category_name?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (statusFilter !== 'all' && a.status !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.author_name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AdminLayout activeTab="/admin/articles">
      <div className="space-y-6" id="admin-articles-view">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
              Article Library ({articles.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage stories, toggle breaking alerts, set trending velocity, and publish dispatches
            </p>
          </div>

          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto"
            id="admin-new-article-btn"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Story</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by story headline, correspondent..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Channels</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Headline &amp; Thumbnail</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded bg-slate-100 overflow-hidden shrink-0">
                          <img src={art.featured_image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/articles/edit/${art.id}`}
                            className="font-bold text-slate-900 hover:text-red-600 truncate block text-sm"
                          >
                            {art.title}
                          </Link>
                          <span className="text-[11px] text-slate-400">By {art.author_name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-extrabold uppercase text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {art.category_name || 'News'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(art)}
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full cursor-pointer text-[11px] transition ${
                          art.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle Published / Draft"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${art.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                        {art.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleBreaking(art)}
                          className={`p-1 rounded text-[10px] font-bold border transition ${
                            art.breaking
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                          title={art.breaking ? 'Breaking alert active (click to disable)' : 'Mark as breaking alert'}
                        >
                          BREAKING
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleTrending(art)}
                          className={`p-1 rounded text-[10px] font-bold border transition flex items-center gap-0.5 ${
                            art.trending
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                          title={art.trending ? 'Trending active (click to disable)' : 'Mark as trending'}
                        >
                          <Flame className="w-3 h-3 fill-current" />
                          <span>#{art.trending_rank || 1}</span>
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {art.views.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(art.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/story/${art.slug}`}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                          title="View live story"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/articles/edit/${art.id}`}
                          className="p-1.5 text-slate-600 hover:text-blue-600 rounded hover:bg-slate-100"
                          title="Edit article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {deleteConfirmId === art.id ? (
                          <div className="inline-flex items-center gap-1 bg-red-50 p-1 rounded border border-red-200">
                            <button
                              type="button"
                              onClick={() => handleDelete(art.id)}
                              className="text-red-700 font-bold px-1.5 py-0.5 hover:underline"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-slate-500 px-1 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(art.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
