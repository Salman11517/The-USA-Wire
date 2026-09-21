import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { subscribeNewsletter } from '../lib/db';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email);
      if (res.success) {
        setStatus('success');
        setMessage(res.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(res.message);
      }
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#071324] via-[#0A192F] to-[#0E2442] text-white rounded-2xl p-6 sm:p-10 my-10 shadow-lg border border-slate-800 relative overflow-hidden" id="newsletter-signup-box">
      {/* Subtle decorative background motif */}
      <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-red-600/20 text-red-400 rounded-full mb-4 border border-red-500/30">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans">
          GET THE BIGGEST STORIES IN AMERICA
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Join 185,000+ informed Americans. Delivered every weekday morning: curated breaking news, viral debates, and the trends shaping our culture.
        </p>

        <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full bg-slate-900/90 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-400"
            id="newsletter-email-input"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl text-sm transition shadow-md whitespace-nowrap"
            id="newsletter-subscribe-btn"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1.5 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <p className="mt-3 text-[11px] text-slate-400">
          Zero spam. One-click unsubscribe anytime. Read our{' '}
          <span className="underline hover:text-white cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </section>
  );
};
