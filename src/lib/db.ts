import { Article, Category, SiteSettings, MediaAsset, ContactMessage, NewsletterSubscriber } from '../types';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_MEDIA } from '../data/seedData';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  ARTICLES: 'usa_wire_articles',
  CATEGORIES: 'usa_wire_categories',
  SETTINGS: 'usa_wire_settings',
  MEDIA: 'usa_wire_media',
  MESSAGES: 'usa_wire_messages',
  SUBSCRIBERS: 'usa_wire_subscribers',
  ADMIN_SESSION: 'usa_wire_admin_session',
  VIEWS_LOG: 'usa_wire_views_log',
};

// Seed LocalStorage if not present
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    const seedMessages: ContactMessage[] = [
      {
        id: 'msg-01',
        name: 'Sarah Jenkins',
        email: 'sjenkins@mediawatch.org',
        subject: 'Press Inquiry regarding High-Speed Rail editorial',
        message: 'Hello USA Wire team, we are covering high-speed rail developments in Nevada and would love to feature quote excerpts from your senior correspondent Marcus Vance.',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'read'
      },
      {
        id: 'msg-02',
        name: 'David Miller',
        email: 'david.miller@austinlive.com',
        subject: 'Viral Sourdough coverage attribution',
        message: 'Loved your piece on the Canton, Ohio bakery! Sent it to our regional newsletter subscribers and got wonderful feedback. Keep up the tremendous work!',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'unread'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(seedMessages));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
    const seedSubscribers: NewsletterSubscriber[] = [
      { id: 'sub-1', email: 'reader@americanwire.org', created_at: new Date().toISOString(), active: true },
      { id: 'sub-2', email: 'editor@usweeklydigest.com', created_at: new Date().toISOString(), active: true },
    ];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(seedSubscribers));
  }
}

// Initial check
initializeLocalStorage();

// Helper to get local array
function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to set local storage key:', key, err);
  }
}

// Global dispatch event for UI responsiveness across tabs or components
function notifyDataChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('usa-wire-data-updated'));
  }
}

/* -------------------------------------------------------------
   ARTICLES API
-------------------------------------------------------------- */

export interface GetArticlesOptions {
  categorySlug?: string;
  status?: string;
  trendingOnly?: boolean;
  breakingOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  search?: string;
  sortBy?: 'latest' | 'trending' | 'views';
}

export async function getArticles(options: GetArticlesOptions = {}): Promise<Article[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase.from('articles').select('*');

      if (options.status) {
        query = query.eq('status', options.status);
      } else {
        query = query.eq('status', 'published');
      }

      if (options.trendingOnly) {
        query = query.eq('trending', true);
      }
      if (options.breakingOnly) {
        query = query.eq('breaking', true);
      }
      if (options.featuredOnly) {
        query = query.eq('featured', true);
      }

      if (options.sortBy === 'trending') {
        query = query.order('trending_rank', { ascending: true, nullsFirst: false }).order('trend_score', { ascending: false });
      } else if (options.sortBy === 'views') {
        query = query.order('views', { ascending: false });
      } else {
        query = query.order('published_at', { ascending: false });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Article[];
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local database', err);
    }
  }

  // Local fallback
  let list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);

  if (options.status) {
    list = list.filter(a => a.status === options.status);
  } else {
    list = list.filter(a => a.status === 'published');
  }

  if (options.categorySlug && options.categorySlug !== 'all') {
    const categories = await getCategories();
    const targetCat = categories.find(c => c.slug.toLowerCase() === options.categorySlug?.toLowerCase());
    if (targetCat) {
      list = list.filter(a => a.category_id === targetCat.id || a.category_name?.toLowerCase() === targetCat.name.toLowerCase());
    }
  }

  if (options.trendingOnly) {
    list = list.filter(a => a.trending);
  }

  if (options.breakingOnly) {
    list = list.filter(a => a.breaking);
  }

  if (options.featuredOnly) {
    list = list.filter(a => a.featured);
  }

  if (options.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
      a.content.toLowerCase().includes(q) ||
      (a.category_name && a.category_name.toLowerCase().includes(q)) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Sorting
  if (options.sortBy === 'trending') {
    list.sort((a, b) => {
      if (a.trending_rank && b.trending_rank) return a.trending_rank - b.trending_rank;
      if (a.trending_rank) return -1;
      if (b.trending_rank) return 1;
      return (b.trend_score || 0) - (a.trend_score || 0);
    });
  } else if (options.sortBy === 'views') {
    list.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    list.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  }

  if (options.limit && options.limit > 0) {
    list = list.slice(0, options.limit);
  }

  return list;
}

export async function getAllAdminArticles(): Promise<Article[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Article[];
    } catch {
      // fallback
    }
  }
  const list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
      if (!error && data) return data as Article;
    } catch {
      // fallback
    }
  }
  const list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  const found = list.find(a => a.slug === slug);
  return found || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (!error && data) return data as Article;
    } catch {
      // fallback
    }
  }
  const list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  return list.find(a => a.id === id) || null;
}

export async function createArticle(articleData: Partial<Article>): Promise<Article> {
  const categories = await getCategories();
  const cat = categories.find(c => c.id === articleData.category_id);

  const newArticle: Article = {
    id: `art-${Date.now()}`,
    title: articleData.title || 'Untitled Story',
    slug: articleData.slug || `story-${Date.now()}`,
    subtitle: articleData.subtitle || '',
    content: articleData.content || '',
    featured_image: articleData.featured_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=80',
    category_id: articleData.category_id || categories[0]?.id || 'cat-usa',
    category_name: cat ? cat.name : (articleData.category_name || 'USA News'),
    author_name: articleData.author_name || 'The USA Wire Staff',
    author_avatar: articleData.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    source_name: articleData.source_name || '',
    source_url: articleData.source_url || '',
    status: articleData.status || 'published',
    featured: Boolean(articleData.featured),
    trending: Boolean(articleData.trending),
    breaking: Boolean(articleData.breaking),
    trend_score: articleData.trend_score ?? 60,
    trending_rank: articleData.trending_rank,
    views: articleData.views ?? 0,
    reading_time: articleData.reading_time || Math.max(1, Math.ceil((articleData.content?.length || 500) / 1000)),
    seo_title: articleData.seo_title || articleData.title,
    meta_description: articleData.meta_description || articleData.subtitle,
    tags: articleData.tags || ['USA', 'Trending'],
    published_at: articleData.published_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').insert([newArticle]).select().single();
      if (!error && data) {
        notifyDataChange();
        return data as Article;
      }
    } catch {
      // fallback to local
    }
  }

  const list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  list.unshift(newArticle);
  setLocal(STORAGE_KEYS.ARTICLES, list);
  notifyDataChange();
  return newArticle;
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
  const categories = await getCategories();
  if (updates.category_id) {
    const cat = categories.find(c => c.id === updates.category_id);
    if (cat) updates.category_name = cat.name;
  }

  updates.updated_at = new Date().toISOString();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select().single();
      if (!error && data) {
        notifyDataChange();
        return data as Article;
      }
    } catch {
      // fallback
    }
  }

  const list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  const index = list.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error(`Article with id ${id} not found`);
  }

  const updated = { ...list[index], ...updates };
  list[index] = updated;
  setLocal(STORAGE_KEYS.ARTICLES, list);
  notifyDataChange();
  return updated;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        notifyDataChange();
        return true;
      }
    } catch {
      // fallback
    }
  }

  const list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  const filtered = list.filter(a => a.id !== id);
  setLocal(STORAGE_KEYS.ARTICLES, filtered);
  notifyDataChange();
  return true;
}

export async function incrementArticleViews(id: string): Promise<number> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.rpc('increment_article_views', { article_id: id });
    } catch {
      // ignore
    }
  }

  const list = getLocal<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  const art = list.find(a => a.id === id);
  if (art) {
    art.views = (art.views || 0) + 1;
    setLocal(STORAGE_KEYS.ARTICLES, list);
    return art.views;
  }
  return 0;
}

/* -------------------------------------------------------------
   CATEGORIES API
-------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // fallback
    }
  }
  return getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export async function createCategory(catData: Partial<Category>): Promise<Category> {
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: catData.name || 'New Category',
    slug: catData.slug || `category-${Date.now()}`,
    description: catData.description || '',
    color: catData.color || '#0A192F',
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').insert([newCat]).select().single();
      if (!error && data) {
        notifyDataChange();
        return data as Category;
      }
    } catch {
      // fallback
    }
  }

  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  list.push(newCat);
  setLocal(STORAGE_KEYS.CATEGORIES, list);
  notifyDataChange();
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (!error && data) {
        notifyDataChange();
        return data as Category;
      }
    } catch {
      // fallback
    }
  }

  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    setLocal(STORAGE_KEYS.CATEGORIES, list);
    notifyDataChange();
    return list[idx];
  }
  throw new Error('Category not found');
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
      notifyDataChange();
      return true;
    } catch {
      // fallback
    }
  }

  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  setLocal(STORAGE_KEYS.CATEGORIES, list.filter(c => c.id !== id));
  notifyDataChange();
  return true;
}

/* -------------------------------------------------------------
   SITE SETTINGS API
-------------------------------------------------------------- */

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
        return { ...INITIAL_SETTINGS, ...settingsMap };
      }
    } catch {
      // fallback
    }
  }
  return getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated = { ...current, ...updates };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      for (const [key, value] of Object.entries(updates)) {
        await supabase.from('site_settings').upsert({ key, value });
      }
    } catch {
      // fallback
    }
  }

  setLocal(STORAGE_KEYS.SETTINGS, updated);
  notifyDataChange();
  return updated;
}

/* -------------------------------------------------------------
   MEDIA ASSETS API
-------------------------------------------------------------- */

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('media_assets').select('*').order('uploaded_at', { ascending: false });
      if (!error && data && data.length > 0) return data as MediaAsset[];
    } catch {
      // fallback
    }
  }
  return getLocal<MediaAsset[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
}

export async function addMediaAsset(asset: Partial<MediaAsset>): Promise<MediaAsset> {
  const newAsset: MediaAsset = {
    id: `med-${Date.now()}`,
    name: asset.name || 'image.jpg',
    url: asset.url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=80',
    size: asset.size || '1.2 MB',
    type: asset.type || 'image/jpeg',
    uploaded_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('media_assets').insert([newAsset]).select().single();
      if (!error && data) {
        notifyDataChange();
        return data as MediaAsset;
      }
    } catch {
      // fallback
    }
  }

  const list = getLocal<MediaAsset[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  list.unshift(newAsset);
  setLocal(STORAGE_KEYS.MEDIA, list);
  notifyDataChange();
  return newAsset;
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('media_assets').delete().eq('id', id);
      notifyDataChange();
      return true;
    } catch {
      // fallback
    }
  }
  const list = getLocal<MediaAsset[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  setLocal(STORAGE_KEYS.MEDIA, list.filter(m => m.id !== id));
  notifyDataChange();
  return true;
}

/* -------------------------------------------------------------
   CONTACT MESSAGES & NEWSLETTER
-------------------------------------------------------------- */

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    } catch {
      // fallback
    }
  }
  return getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
}

export async function createContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    ...msg,
    status: 'unread',
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('contact_messages').insert([newMsg]);
    } catch {
      // fallback
    }
  }

  const list = getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  list.unshift(newMsg);
  setLocal(STORAGE_KEYS.MESSAGES, list);
  notifyDataChange();
  return newMsg;
}

export async function updateContactMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<void> {
  const list = getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  const item = list.find(m => m.id === id);
  if (item) {
    item.status = status;
    setLocal(STORAGE_KEYS.MESSAGES, list);
    notifyDataChange();
  }
}

export async function markContactMessageRead(id: string): Promise<void> {
  return updateContactMessageStatus(id, 'read');
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as NewsletterSubscriber[];
    } catch {
      // fallback
    }
  }
  const defaultSubs: NewsletterSubscriber[] = [
    { id: 'sub-1', email: 'editor@usadigitalpulse.com', created_at: new Date(Date.now() - 86400000 * 3).toISOString(), active: true },
    { id: 'sub-2', email: 'americantrends@mediareview.org', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), active: true },
    { id: 'sub-3', email: 'reader.inquiries@washingtonpostwire.net', created_at: new Date(Date.now() - 86400000 * 1).toISOString(), active: true },
  ];
  return getLocal<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, defaultSubs);
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('newsletter_subscribers').insert([{ email: trimmed }]);
    } catch {
      // fallback
    }
  }

  const list = getLocal<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
  if (list.some(s => s.email === trimmed)) {
    return { success: true, message: "You're already subscribed to The USA Wire!" };
  }

  list.push({
    id: `sub-${Date.now()}`,
    email: trimmed,
    created_at: new Date().toISOString(),
    active: true,
  });
  setLocal(STORAGE_KEYS.SUBSCRIBERS, list);
  return { success: true, message: "Welcome aboard! You're subscribed to America's Trending Stories." };
}

/* -------------------------------------------------------------
   ANALYTICS & SUMMARY
-------------------------------------------------------------- */

export async function getAnalyticsSummary() {
  const articles = await getAllAdminArticles();
  const categories = await getCategories();

  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === 'published').length;
  const drafts = articles.filter(a => a.status === 'draft').length;
  const scheduled = articles.filter(a => a.status === 'scheduled').length;
  const trendingCount = articles.filter(a => a.trending).length;
  const breakingCount = articles.filter(a => a.breaking).length;

  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const todayViews = Math.round(totalViews * 0.14) + 1284;
  const weeklyViews = Math.round(totalViews * 0.48) + 8420;

  const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const categoryCounts: Record<string, number> = {};
  categories.forEach(c => {
    categoryCounts[c.name] = articles.filter(a => a.category_id === c.id || a.category_name === c.name).length;
  });

  return {
    totalArticles,
    publishedArticles,
    drafts,
    scheduled,
    totalViews,
    todayViews,
    weeklyViews,
    trendingCount,
    breakingCount,
    topArticles,
    categoryCounts,
  };
}

/* -------------------------------------------------------------
   DATA BACKUP & RESET TOOLS
-------------------------------------------------------------- */

export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
  notifyDataChange();
}

export function exportDatabaseJSON(): string {
  const data = {
    exported_at: new Date().toISOString(),
    site_settings: getLocal(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
    categories: getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
    articles: getLocal(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES),
    media: getLocal(STORAGE_KEYS.MEDIA, INITIAL_MEDIA),
    messages: getLocal(STORAGE_KEYS.MESSAGES, []),
    subscribers: getLocal(STORAGE_KEYS.SUBSCRIBERS, []),
  };
  return JSON.stringify(data, null, 2);
}

export function importDatabaseJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.articles) localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(data.articles));
    if (data.categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    if (data.site_settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.site_settings));
    if (data.media) localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(data.media));
    notifyDataChange();
    return true;
  } catch (err) {
    console.error('Failed to import JSON', err);
    return false;
  }
}
