import React from 'react';
import { useRouter, Link } from '../lib/router';
import { Shield, ArrowUp } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071324] text-slate-400 border-t border-slate-800 pt-12 pb-8 mt-16" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter uppercase font-sans text-white">
                THE USA <span className="text-red-500 font-extrabold">WIRE</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-red-600 mb-1 inline-block" />
            </div>

            <p className="text-sm font-semibold text-slate-200">
              {settings.tagline || "America's Trending Stories, All in One Place."}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.footer_text ||
                'The USA Wire is an independent digital media publication and trending news curation platform covering what captures the attention of Americans across all fifty states.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href={settings.social_facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition"
                aria-label="The USA Wire on Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href={settings.social_x || 'https://x.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
                aria-label="The USA Wire on X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={settings.social_instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center transition"
                aria-label="The USA Wire on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={settings.social_youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition"
                aria-label="The USA Wire on YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-3 font-sans">
              Top Channels
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/category/trending" className="hover:text-white transition">Trending Now</Link></li>
              <li><Link to="/category/news" className="hover:text-white transition">USA News</Link></li>
              <li><Link to="/category/viral" className="hover:text-white transition">Viral Hits</Link></li>
              <li><Link to="/category/technology" className="hover:text-white transition">Technology & AI</Link></li>
              <li><Link to="/category/business" className="hover:text-white transition">Economy & Business</Link></li>
            </ul>
          </div>

          {/* More Channels */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-3 font-sans">
              Explore More
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/category/sports" className="hover:text-white transition">Sports & Athletics</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-white transition">Entertainment & Pop</Link></li>
              <li><Link to="/category/lifestyle" className="hover:text-white transition">Lifestyle & Wellness</Link></li>
              <li><Link to="/category/interesting" className="hover:text-white transition">Interesting Stories</Link></li>
              <li><Link to="/search" className="hover:text-white transition">Global Search</Link></li>
            </ul>
          </div>

          {/* Corporate & Legal */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-3 font-sans">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition">About The USA Wire</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Newsroom</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition">Editorial Disclaimer</Link></li>
              <li className="pt-2">
                <Link to="/admin/login" className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Admin Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} The USA Wire. All rights reserved. Built for modern American digital media.
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
