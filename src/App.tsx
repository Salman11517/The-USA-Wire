import React, { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { AuthProvider, useAuth } from './lib/auth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage, DisclaimerPage } from './pages/LegalPages';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminArticles } from './pages/admin/AdminArticles';
import { AdminArticleEdit } from './pages/admin/AdminArticleEdit';
import { AdminHomepageTicker } from './pages/admin/AdminHomepageTicker';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSubscribers } from './pages/admin/AdminSubscribers';
import { AdminAutomation } from './pages/admin/AdminAutomation';
import { AdminSettings } from './pages/admin/AdminSettings';

import { getCategories, getSiteSettings } from './lib/db';
import { Category, SiteSettings } from './types';

// Root App Router Content
const AppContent: React.FC = () => {
  const { route, navigate } = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadGlobalData() {
      try {
        const [cats, s] = await Promise.all([getCategories(), getSiteSettings()]);
        setCategories(cats);
        setSettings(s);
      } catch (err) {
        console.error('Failed to load global data', err);
      }
    }
    loadGlobalData();
  }, []);

  const path = route.pathname;
  const isAdminRoute = path.startsWith('/admin');

  // Admin Route Protection
  if (isAdminRoute && path !== '/admin/login' && !authLoading && !user) {
    return <AdminLogin />;
  }

  // Route Dispatcher
  const renderRoute = () => {
    // Admin Routes
    if (path === '/admin/login') {
      return <AdminLogin />;
    }
    if (path === '/admin' || path === '/admin/dashboard') {
      return <AdminDashboard />;
    }
    if (path === '/admin/articles') {
      return <AdminArticles />;
    }
    if (path === '/admin/articles/new') {
      return <AdminArticleEdit />;
    }
    if (path.startsWith('/admin/articles/edit/')) {
      const id = path.replace('/admin/articles/edit/', '');
      return <AdminArticleEdit id={id} />;
    }
    if (path === '/admin/ticker') {
      return <AdminHomepageTicker />;
    }
    if (path === '/admin/categories') {
      return <AdminCategories />;
    }
    if (path === '/admin/messages') {
      return <AdminMessages />;
    }
    if (path === '/admin/subscribers') {
      return <AdminSubscribers />;
    }
    if (path === '/admin/automation') {
      return <AdminAutomation />;
    }
    if (path === '/admin/settings') {
      return <AdminSettings />;
    }

    // Public Routes
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    if (path.startsWith('/story/')) {
      const slug = path.replace('/story/', '');
      return <ArticlePage slug={slug} />;
    }

    if (path.startsWith('/category/')) {
      const catSlug = path.replace('/category/', '');
      return <CategoryPage categorySlug={catSlug} />;
    }

    if (path === '/search') {
      return <SearchPage />;
    }

    if (path === '/about') {
      return <AboutPage />;
    }

    if (path === '/contact') {
      return <ContactPage />;
    }

    if (path === '/privacy') {
      return <PrivacyPage />;
    }

    if (path === '/terms') {
      return <TermsPage />;
    }

    if (path === '/disclaimer') {
      return <DisclaimerPage />;
    }

    // Fallback to Home
    return <HomePage />;
  };

  // If inside Admin panel, render without public Header and Footer
  if (isAdminRoute && path !== '/admin/login') {
    return <div className="min-h-screen bg-slate-100">{renderRoute()}</div>;
  }

  if (path === '/admin/login') {
    return renderRoute();
  }

  // Public Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-red-600 selection:text-white pb-14 lg:pb-0">
      {settings && <Header settings={settings} categories={categories} />}
      <main className="flex-1">{renderRoute()}</main>
      {settings && <Footer settings={settings} />}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}
