export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  featured_image: string;
  category_id: string;
  category_name?: string;
  author_id?: string;
  author_name: string;
  author_avatar?: string;
  source_name?: string;
  source_url?: string;
  status: ArticleStatus;
  featured: boolean;
  trending: boolean;
  breaking: boolean;
  trend_score: number; // 0 to 100
  trending_rank?: number; // 1, 2, 3, etc.
  views: number;
  reading_time: number; // minutes
  seo_title?: string;
  meta_description?: string;
  og_image?: string;
  tags?: string[];
  published_at: string;
  updated_at: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  color?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  logo_text: string;
  contact_email: string;
  footer_text: string;
  breaking_ticker_enabled: boolean;
  breaking_ticker_text: string;
  breaking_ticker_article_slug?: string;
  homepage_featured_article_id?: string;
  social_facebook: string;
  social_x: string;
  social_instagram: string;
  social_youtube: string;
  n8n_api_key?: string;
  seo_default_title: string;
  seo_default_description: string;
}

export interface PageView {
  id: string;
  article_id: string;
  viewed_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'replied';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  active: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploaded_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  created_at: string;
}
