import React, { useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { Search, Menu, X, Flame, Shield, ChevronDown } from 'lucide-react';
import { SiteSettings, Category } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  categories: Category[];
}

export const Header: React.FC<HeaderProps> = ({ settings, categories }) => {
  const { navigate, route } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const mainNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Trending', path: '/category/trending', icon: true },
    { name: 'USA News', path: '/category/news' },
    { name: 'Viral', path: '/category/viral' },
    { name: 'Entertainment', path: '/category/entertainment' },
    { name: 'Sports', path: '/category/sports' },
    { name: 'Technology', path: '/category/technology' },
    { name: 'Business', path: '/category/business' },
  ];

  const moreItems = [
    { name: 'Lifestyle', path: '/category/lifestyle' },
    { name: 'Interesting Stories', path: '/category/interesting' },
    { name: 'About The USA Wire', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // Current date in US format
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-50 bg-[#0A192F] text-white shadow-md border-b border-slate-800" id="site-header">
      {/* Top Utility Bar */}
      <div className="border-b border-slate-800/80 bg-[#071324] px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse inline-block" />
              US Edition
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300 font-medium">{todayFormatted}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-400 italic">
              {settings.tagline || "America's Trending Stories, All in One Place."}
            </span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700 transition"
              id="header-admin-link"
            >
              <Shield className="w-3 h-3 text-red-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand & Nav Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="brand-logo-link">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase font-sans text-white">
                  THE USA <span className="text-red-500 font-extrabold">WIRE</span>
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 mb-1 hidden sm:inline-block" />
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold -mt-1 hidden sm:block">
                Digital News & Trending Media
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-semibold tracking-tight" id="desktop-nav">
            {mainNavItems.map((item) => {
              const isActive = route.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon && <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />}
                  {item.name}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="px-2.5 py-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center gap-1 text-sm font-semibold transition"
                id="header-more-dropdown-btn"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-[#0D1E36] border border-slate-700 rounded-lg shadow-xl py-1 z-50"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {moreItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMoreDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              aria-label="Search stories"
              id="header-search-toggle-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Bar (Dropdown on click) */}
      {searchOpen && (
        <div className="border-t border-slate-800 bg-[#071324] px-4 py-3 animate-fadeIn" id="search-bar-dropdown">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search breaking stories, viral trends, tech, business, sports..."
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-400"
                id="global-search-input"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5"
              id="global-search-submit-btn"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-lg"
              title="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0A192F] px-4 pt-3 pb-6 space-y-1 shadow-2xl" id="mobile-nav-drawer">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending America..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-1 text-sm font-semibold">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                  route.pathname === item.path ? 'bg-red-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {item.icon && <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />}
                {item.name}
              </Link>
            ))}
            {moreItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              Open Admin Dashboard
            </Link>
            <span>v1.0.0 Netlify Ready</span>
          </div>
        </div>
      )}
    </header>
  );
};
