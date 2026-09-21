import React from 'react';
import { useRouter, Link } from '../lib/router';
import { Home, Flame, Grid, Search, Shield } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { route } = useRouter();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Trending', path: '/category/trending', icon: Flame },
    { label: 'Channels', path: '/category/news', icon: Grid },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Admin', path: '/admin/dashboard', icon: Shield },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A192F] border-t border-slate-800 px-2 py-1.5 shadow-2xl"
      id="mobile-bottom-nav"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? route.pathname === '/'
              : route.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition ${
                isActive
                  ? 'text-red-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
