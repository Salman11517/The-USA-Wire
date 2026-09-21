import React, { useEffect } from 'react';
import { useRouter, Link } from '../lib/router';
import { ShieldCheck, Target, Newspaper, Users, Award, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setDocMeta } = useRouter();

  useEffect(() => {
    setDocMeta(
      'About The USA Wire | America’s Trending Stories',
      'The USA Wire is a modern digital media platform dedicated to capturing what captures America’s attention across breaking news, viral culture, and technological innovation.'
    );
  }, [setDocMeta]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10" id="about-page-container">
      {/* Editorial Header */}
      <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center sm:text-left">
        <span className="text-xs font-black uppercase tracking-widest text-red-600 mb-2 block">
          Editorial Mission & Identity
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 font-sans">
          THE USA WIRE
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
          America’s Trending Stories, All in One Place.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm text-slate-800 leading-relaxed font-serif">
        <section className="space-y-3 font-sans">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            Who We Are
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            <strong>The USA Wire</strong> is a digital media platform focused on stories, trends, and conversations attracting attention across the United States. In an overwhelming internet era fractured by endless algorithms, The USA Wire provides a clear, high-signal pulse on what Americans are discussing, sharing, and debating right now.
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            Rather than representing an official government body or legacy television broadcasting network, The USA Wire is an independent digital publication blending curated editorial reporting, digital trend analysis, and source-transparent journalism.
          </p>
        </section>

        {/* 3 Core Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans pt-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Newspaper className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">National Pulse</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We monitor regional bureaus, public agencies, and civic developments across all fifty states to report events that impact everyday Americans.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Trend Velocity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From viral community heroes to seismic consumer shifts, we identify the cultural conversations dominating feeds before they hit the mainstream.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Source Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every story clearly credits original reporters, primary documents, and regional witnesses. We never fabricate sources or claim exclusivity where none exists.
            </p>
          </div>
        </div>

        <section className="space-y-3 font-sans pt-4 border-t border-slate-100">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            Editorial Guidelines & Ethics
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Our editorial staff operates under strict principles of accuracy, fairness, and transparency. When reporting on secondary publications or social feeds, we provide explicit source citations and links to original materials.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            If you have an editorial correction, tip, or inquiry, our newsroom welcomes your feedback. Visit our{' '}
            <Link to="/contact" className="text-red-600 font-bold hover:underline">
              Contact Page
            </Link>{' '}
            to reach our desks.
          </p>
        </section>
      </div>
    </div>
  );
};
