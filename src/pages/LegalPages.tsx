import React, { useEffect } from 'react';
import { useRouter } from '../lib/router';

export const PrivacyPage: React.FC = () => {
  const { setDocMeta } = useRouter();
  useEffect(() => {
    setDocMeta('Privacy Policy | The USA Wire', 'Privacy Policy for The USA Wire visitors and newsletter subscribers.');
  }, [setDocMeta]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-800">
        <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight font-sans">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>

        <section className="space-y-2 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase">1. Information We Collect</h2>
          <p>
            The USA Wire is committed to protecting your privacy. When you visit our website, we may collect non-personally identifiable information such as browser type, operating system, and pages visited to improve platform performance. If you voluntarily subscribe to our newsletter or submit a contact message, we collect your email address and name.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase">2. Use of Information</h2>
          <p>
            We use collected information solely to provide news dispatches, respond to editorial inquiries, and evaluate content popularity through anonymized view counters. We never sell, rent, or lease subscriber lists to third parties.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase">3. Cookies & Analytics</h2>
          <p>
            We may use standard session cookies to remember preferences and measure engagement. You may configure your browser to reject cookies without affecting your ability to read articles.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { setDocMeta } = useRouter();
  useEffect(() => {
    setDocMeta('Terms of Service | The USA Wire', 'Terms of Service governing the use of The USA Wire website.');
  }, [setDocMeta]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-800">
        <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight font-sans">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>

        <section className="space-y-2 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase">1. Acceptance of Terms</h2>
          <p>
            By accessing or using The USA Wire, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of the website.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase">2. Intellectual Property & Fair Use</h2>
          <p>
            All original commentary, headlines, and software code on The USA Wire are protected by copyright and intellectual property laws. Third-party trademarks, logos, and external media references belong to their respective owners and are referenced strictly for identification and editorial reporting purposes under Fair Use doctrine.
          </p>
        </section>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC = () => {
  const { setDocMeta } = useRouter();
  useEffect(() => {
    setDocMeta('Editorial Disclaimer | The USA Wire', 'Editorial reporting and source attribution transparency disclaimer.');
  }, [setDocMeta]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-800">
        <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight font-sans">
          Editorial & Reporting Disclaimer
        </h1>
        <p className="text-xs text-slate-400">Last Revised: January 2026</p>

        <section className="space-y-2 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 uppercase">Source Attribution & Independence</h2>
          <p>
            The USA Wire is an independent digital news and trending media curation platform. In compliance with strict journalistic transparency standards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li>We do not manufacture or fabricate news sources or witness accounts.</li>
            <li>Articles derived from external investigations, wire agencies, press releases, or broadcast outlets clearly display source citations and direct links to the original reporting.</li>
            <li>Articles are not labeled as independently reported unless conducted directly by The USA Wire correspondents.</li>
            <li>Opinions expressed in commentary pieces belong exclusively to their credited authors.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
