-- ==============================================================================
-- THE USA WIRE: COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- "America's Trending Stories, All in One Place."
--
-- Instructions:
-- 1. Create a free project at https://supabase.com
-- 2. Go to the SQL Editor in your Supabase dashboard
-- 3. Paste and run this entire script
-- 4. Enable Storage bucket named 'usa-wire-media' (public: true)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ADMIN ROLES TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'author')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  color TEXT DEFAULT '#0A192F',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'The USA Wire Staff',
  author_avatar TEXT,
  source_name TEXT,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  trending BOOLEAN NOT NULL DEFAULT false,
  breaking BOOLEAN NOT NULL DEFAULT false,
  trend_score INT NOT NULL DEFAULT 50 CHECK (trend_score >= 0 AND trend_score <= 100),
  trending_rank INT,
  views BIGINT NOT NULL DEFAULT 0,
  reading_time INT NOT NULL DEFAULT 3,
  seo_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_trending ON public.articles(trending, trend_score DESC, trending_rank ASC);
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON public.articles(breaking);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_views ON public.articles(views DESC);

-- 4. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 5. ARTICLE_TAGS RELATION TABLE
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL
);

-- 7. PAGE VIEWS ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS idx_page_views_article ON public.page_views(article_id, viewed_at DESC);

-- 8. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size TEXT,
  type TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FUNCTION: Increment Article Views atomically
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.articles
  SET views = views + 1
  WHERE id = article_id;

  INSERT INTO public.page_views (article_id, viewed_at)
  VALUES (article_id, NOW());
END;
$$;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Public READ access for published articles, categories, settings
CREATE POLICY "Public articles are viewable by everyone" ON public.articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public site_settings are viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Public tags are viewable by everyone" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Public can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Admin full access policies (service role or authenticated users with admin role)
CREATE POLICY "Admins full access on articles" ON public.articles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on site_settings" ON public.site_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on media_assets" ON public.media_assets
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on contact_messages" ON public.contact_messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on newsletter_subscribers" ON public.newsletter_subscribers
  FOR ALL USING (auth.role() = 'authenticated');
