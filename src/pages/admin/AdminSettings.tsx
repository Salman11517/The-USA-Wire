import React, { useEffect, useState } from 'react';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getSiteSettings, updateSiteSettings } from '../../lib/db';
import { SiteSettings } from '../../types';
import { Settings, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [footerText, setFooterText] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialX, setSocialX] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');

  useEffect(() => {
    setDocMeta('Site Settings | The USA Wire Admin', 'Configure global site branding');

    async function load() {
      setLoading(true);
      try {
        const s = await getSiteSettings();
        setSettings(s);
        setSiteName(s.site_name || 'THE USA WIRE');
        setTagline(s.tagline || "America's Trending Stories, All in One Place.");
        setFooterText(s.footer_text || '');
        setSocialFacebook(s.social_facebook || '');
        setSocialX(s.social_x || '');
        setSocialInstagram(s.social_instagram || '');
        setSocialYoutube(s.social_youtube || '');
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
        site_name: siteName,
        tagline: tagline,
        footer_text: footerText,
        social_facebook: socialFacebook,
        social_x: socialX,
        social_instagram: socialInstagram,
        social_youtube: socialYoutube,
      });
      setFeedback({ type: 'success', message: 'Site configuration updated successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout activeTab="/admin/settings">
        <div className="py-20 text-center text-slate-500">Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="/admin/settings">
      <div className="max-w-4xl mx-auto space-y-8" id="admin-settings-view">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            Site Branding &amp; Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure platform branding, social channels, and public metadata
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

        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase text-slate-900 border-b pb-2">
              Identity &amp; Tagline
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Official Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Footer Editorial Summary
              </label>
              <textarea
                rows={3}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-extrabold uppercase text-slate-900 border-b pb-2">
              Social Media Distribution Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  X (Twitter) URL
                </label>
                <input
                  type="url"
                  value={socialX}
                  onChange={(e) => setSocialX(e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={socialYoutube}
                  onChange={(e) => setSocialYoutube(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
