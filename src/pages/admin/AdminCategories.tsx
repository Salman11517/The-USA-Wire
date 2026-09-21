import React, { useEffect, useState } from 'react';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../lib/db';
import { Category } from '../../types';
import { FolderTree, PlusCircle, Trash2, Edit, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setDocMeta('Channel & Category Manager | The USA Wire Admin', 'Categories');
    loadCategories();
  }, [setDocMeta]);

  async function loadCategories() {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setFeedback(null);
    try {
      if (editingId) {
        await updateCategory(editingId, { name, slug, description });
        setFeedback({ type: 'success', message: 'Category updated successfully!' });
      } else {
        await createCategory({ name, slug, description });
        setFeedback({ type: 'success', message: 'Category created successfully!' });
      }
      setName('');
      setSlug('');
      setDescription('');
      setEditingId(null);
      loadCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving category.' });
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this channel?')) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AdminLayout activeTab="/admin/categories">
      <div className="max-w-4xl mx-auto space-y-8" id="admin-categories-view">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            Channel &amp; Category Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define channels covering USA News, Viral, Tech, Sports, Entertainment, and Culture
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Create / Edit Form (5 cols) */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold uppercase text-slate-900 flex items-center gap-1.5 border-b pb-2">
              <FolderTree className="w-4 h-4 text-red-600" />
              <span>{editingId ? 'Edit Channel' : 'Add New Channel'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Channel Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. technology"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Channel Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for category banner and SEO..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow transition flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Update Channel' : 'Add Channel'}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Channels (7 cols) */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-600">Active Channels ({categories.length})</span>
            </div>

            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/80 transition">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{cat.name}</span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        /{cat.slug}
                      </span>
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                      title="Edit channel"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                      title="Delete channel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
