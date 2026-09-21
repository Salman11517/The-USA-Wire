import React, { useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useAuth } from '../../lib/auth';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, user } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  if (user) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Invalid administrator credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@theusawire.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" id="admin-login-screen">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/20 text-red-500 mb-3 border border-red-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight font-sans">
            THE USA <span className="text-red-500">WIRE</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
            Editorial Newsroom & Admin Portal
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-email-input" className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theusawire.com"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password-input" className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow flex items-center justify-center gap-2 mt-2"
            id="admin-login-submit-btn"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Newsroom'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-red-400 hover:text-red-300 font-semibold underline transition"
          >
            Click to fill default admin credentials (admin@theusawire.com)
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
