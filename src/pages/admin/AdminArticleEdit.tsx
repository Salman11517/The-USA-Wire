import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getArticleById, getCategories, createArticle, updateArticle } from '../../lib/db';
import { Article, Category } from '../../types';
import {
  Save,
  ArrowLeft,
  Eye,
  Sparkles,
  Flame,
  Radio,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
  Hash
} from 'lucide-react';

interface AdminArticleEditProps {
  id?: string; // If undefined, we are creating a new article
}

export const AdminArticleEdit: React.FC<AdminArticleEditProps> = ({ id }) => {
  const { navigate, setDocMeta } = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    category_id: '',
    content: '',
    featured_image: '',
    author_name: 'The USA Wire Staff',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    source_name: '',
    source_url: '',
    status: 'published' as 'published' | 'draft' | 'scheduled' | 'archived',
    breaking: false,
    trending: false,
    trending_rank: 1,
    featured: false,
    tagsInput: '',
    seo_title: '',
    meta_description: '',
    reading_time: 3,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);

        if (id) {
          setDocMeta('Edit Article | The USA Wire Admin', 'Article editor');
          const article = await getArticleById(id);
          if (article) {
            setFormData({
              title: article.title,
              subtitle: article.subtitle || '',
              slug: article.slug,
              category_id: article.category_id,
              content: article.content,
              featured_image: article.featured_image,
              author_name: article.author_name,
              author_avatar: article.author_avatar || '',
              source_name: article.source_name || '',
              source_url: article.source_url || '',
              status: article.status,
              breaking: !!article.breaking,
              trending: !!article.trending,
              trending_rank: article.trending_rank || 1,
              featured: !!article.featured,
              tagsInput: (article.tags || []).join(', '),
              seo_title: article.seo_title || '',
              meta_description: article.meta_description || '',
              reading_time: article.reading_time || 3,
            });
          }
        } else {
          setDocMeta('New Story | The USA Wire Admin', 'Create new article');
          if (cats.length > 0) {
            setFormData(prev => ({ ...prev, category_id: cats[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, setDocMeta]);

  // Auto slug generation from title
  const handleTitleChange = (newTitle: string) => {
    const updates: Partial<typeof formData> = { title: newTitle };
    if (!id || !formData.slug) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      updates.slug = generatedSlug;
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Auto reading time calculation from content
  const handleContentChange = (newContent: string) => {
    const wordCount = newContent.trim().split(/\s+/).length;
    const estTime = Math.max(1, Math.ceil(wordCount / 200));
    setFormData(prev => ({ ...prev, content: newContent, reading_time: estTime }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setFeedback({ type: 'error', message: 'Please provide both headline and content.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const tagsArray = formData.tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const selectedCategory = categories.find(c => c.id === formData.category_id);
    const categoryName = selectedCategory ? selectedCategory.name : 'USA News';

    try {
      const articlePayload: Partial<Article> = {
        title: formData.title,
        subtitle: formData.subtitle,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: formData.category_id,
        category_name: categoryName,
        content: formData.content,
        featured_image: formData.featured_image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        author_name: formData.author_name || 'Staff Correspondent',
        author_avatar: formData.author_avatar,
        source_name: formData.source_name,
        source_url: formData.source_url,
        status: formData.status,
        breaking: formData.breaking,
        trending: formData.trending,
        trending_rank: Number(formData.trending_rank) || 1,
        featured: formData.featured,
        tags: tagsArray,
        seo_title: formData.seo_title || formData.title,
        meta_description: formData.meta_description || formData.subtitle || formData.title.slice(0, 150),
        reading_time: formData.reading_time,
      };

      if (id) {
        await updateArticle(id, articlePayload);
        setFeedback({ type: 'success', message: 'Article updated successfully!' });
      } else {
        const created = await createArticle(articlePayload);
        setFeedback({ type: 'success', message: 'Article published successfully!' });
        setTimeout(() => {
          navigate(`/admin/articles/edit/${created.id}`);
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save article.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="/admin/articles">
        <div className="py-20 text-center text-slate-500">Loading article editor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="/admin/articles">
      <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto" id="article-editor-form">
        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/articles"
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase font-sans">
                {id ? 'Edit Story Dispatch' : 'New Editorial Dispatch'}
              </h1>
              <span className="text-xs text-slate-500">
                Estimated reading time: {formData.reading_time} min ({formData.content.split(/\s+/).filter(Boolean).length} words)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-sm transition"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
              id="editor-save-btn"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : id ? 'Update Dispatch' : 'Publish Story'}</span>
            </button>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Editorial Fields (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Headline */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Story Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter compelling, authoritative headline..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Subtitle / Summary Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="A clear 1-2 sentence lead summarizing the development for readers..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl px-3 py-2 text-xs text-slate-500">
                    theusawire.com/story/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-r-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Content Body Editor */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-700">
                  Article Body (Markdown / Rich Text) *
                </label>
                <div className="text-[11px] text-slate-400">
                  Supports ### Subheadings, * Bullet lists, and paragraphs
                </div>
              </div>

              <textarea
                required
                rows={16}
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write or paste the full story dispatches here. Separate paragraphs with double newlines..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white font-serif"
              />
            </div>

            {/* Source Attribution (Mandatory Section 13) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Source Transparency &amp; Attribution
              </h3>
              <p className="text-xs text-slate-500">
                To maintain journalistic integrity, indicate the primary source outlet, wire service, or official entity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={formData.source_name}
                    onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                    placeholder="e.g. Associated Press / Reuters / Federal Transit Admin"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Source URL
                  </label>
                  <input
                    type="url"
                    value={formData.source_url}
                    onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Search Engine Optimization (SEO) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Search Engine Optimization (SEO Meta)
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  SEO Title Tag
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder={formData.title || 'Custom search engine headline...'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder={formData.subtitle || 'Search snippet summary (under 160 characters)...'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Status & Category */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Publishing Details
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="published">Published (Live to readers)</option>
                  <option value="draft">Draft (Private in newsroom)</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Channel / Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Correspondent / Author
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Story Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  placeholder="rail, economy, technology"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Editorial Visibility Flags */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Editorial Flags &amp; Highlights
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Featured on Homepage Hero</span>
                    <span className="text-[10px] text-slate-500">Feature this in the prime lead position</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.breaking}
                    onChange={(e) => setFormData({ ...formData, breaking: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Breaking News Status</span>
                    <span className="text-[10px] text-slate-500">Flags with red alert badges across the site</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.trending}
                    onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Include in Trending Feed</span>
                    <span className="text-[10px] text-slate-500">Displays in 'What's Trending in America'</span>
                  </div>
                </label>

                {formData.trending && (
                  <div className="pl-6 pt-1">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Trending Rank (1 to 5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.trending_rank}
                      onChange={(e) => setFormData({ ...formData, trending_rank: Number(e.target.value) })}
                      className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Featured Image</span>
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              {formData.featured_image && (
                <div className="mt-2 aspect-16/9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Live Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 relative">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold uppercase text-red-600">Editorial Preview</span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Channel: {categories.find(c => c.id === formData.category_id)?.name || 'News'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                {formData.title || 'Untitled Story'}
              </h1>
              {formData.subtitle && (
                <p className="text-sm sm:text-base text-slate-600 border-l-4 border-red-600 pl-3">
                  {formData.subtitle}
                </p>
              )}

              {formData.featured_image && (
                <img
                  src={formData.featured_image}
                  alt=""
                  className="w-full h-auto max-h-[360px] object-cover rounded-xl"
                />
              )}

              <div className="prose text-sm text-slate-800 space-y-3 pt-3">
                {formData.content ? (
                  formData.content.split('\n\n').map((p, idx) => <p key={idx}>{p}</p>)
                ) : (
                  <p className="italic text-slate-400">No article body written yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
