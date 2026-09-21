import React, { useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useAuth } from '../../lib/auth';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Radio,
  FolderTree,
  Mail,
  Users,
  Settings,
  Webhook,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Eye
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Articles', path: '/admin/articles', icon: FileText },
    { label: 'New Article', path: '/admin/articles/new', icon: PlusCircle },
    { label: 'Hero & Breaking Ticker', path: '/admin/ticker', icon: Radio },
    { label: 'Channels / Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { label: 'Newsletter Subscribers', path: '/admin/subscribers', icon: Users },
    { label: 'n8n Automation API', path: '/admin/automation', icon: Webhook },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row" id="admin-panel-container">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0A192F] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tight uppercase text-lg">
            THE USA <span className="text-red-500">WIRE</span>
          </span>
          <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded uppercase font-extrabold">
            ADMIN
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-64 bg-[#0A192F] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex flex-col group">
              <span className="font-black text-white text-xl tracking-tight uppercase font-sans">
                THE USA <span className="text-red-500">WIRE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Editorial Control Room
              </span>
            </Link>
          </div>

          {/* Nav items */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@theusawire.com'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition font-medium text-center"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-lg transition font-medium text-center border border-red-800/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
