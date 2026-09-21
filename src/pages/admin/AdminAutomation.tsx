import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { createArticle, getCategories } from '../../lib/db';
import { Webhook, Copy, Check, Play, Sparkles, Shield, Code, CheckCircle2 } from 'lucide-react';

export const AdminAutomation: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string>('');

  const samplePayload = {
    title: "Autonomous Electric Air Taxis Complete First Federal Test Corridor Across Texas",
    subtitle: "Federal aviation inspectors certify regional passenger test routes connecting Dallas and Austin hubs.",
    slug: "autonomous-electric-air-taxis-test-corridor-texas",
    category_id: "cat-technology",
    content: "DALLAS — A new era in regional transportation achieved certified milestones today as autonomous electric vertical takeoff vehicles conducted synchronized commuter simulations...\n\n### Certification Milestones\nCommercial passenger trials will initiate in summer 2026 under strict regional flight oversight.",
    featured_image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    author_name: "The USA Wire Automated Wire Desk",
    source_name: "Federal Aviation Administration & Texas DOT",
    source_url: "https://faa.gov",
    status: "published",
    trending: true,
    trend_score: 94,
    breaking: false
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSimulateWebhook = async () => {
    setTestStatus('testing');
    try {
      const created = await createArticle(samplePayload as any);
      setTestStatus('success');
      setTestResult(`Successfully ingested story! Assigned ID: ${created.id}, Slug: ${created.slug}`);
    } catch (err: any) {
      setTestStatus('error');
      setTestResult(err.message || 'Webhook simulation error');
    }
  };

  return (
    <AdminLayout activeTab="/admin/automation">
      <div className="max-w-4xl mx-auto space-y-8" id="admin-automation-view">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              Headless Ingestion
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            n8n Automation &amp; Webhook Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish articles automatically from n8n workflows, RSS aggregators, or AI news agents
          </p>
        </div>

        {/* Overview Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Automated Story Ingestion Architecture
              </h2>
              <p className="text-xs text-slate-500">
                Direct Supabase database or serverless endpoint integration
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The USA Wire is pre-architected so your <strong>n8n workflow</strong> can scrape, summarize, format, and push trending stories directly into the <code className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">articles</code> table. All fields, including automatic reading time, trend scores, source citations, and category associations are structured for zero-touch publishing.
          </p>
        </div>

        {/* Live Simulator Button */}
        <div className="bg-gradient-to-r from-[#0A192F] to-[#162E52] text-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Test Sandbox</span>
              <h3 className="text-lg font-bold">Simulate n8n Automated Webhook Ingestion</h3>
            </div>
            <button
              type="button"
              disabled={testStatus === 'testing'}
              onClick={handleSimulateWebhook}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{testStatus === 'testing' ? 'Ingesting...' : 'Run Simulation Insert'}</span>
            </button>
          </div>

          {testStatus === 'success' && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{testResult}</span>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 text-xs rounded-xl">
              {testResult}
            </div>
          )}
        </div>

        {/* JSON Payload Specification */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase text-slate-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-slate-500" />
              <span>Sample n8n JSON Payload Specification</span>
            </h3>
            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify(samplePayload, null, 2), 'payload')}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-red-600 transition"
            >
              {copied === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'payload' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
            {JSON.stringify(samplePayload, null, 2)}
          </pre>
        </div>

        {/* cURL Request snippet */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase text-slate-900">
              Supabase Direct HTTP cURL / Webhook Call
            </h3>
            <button
              type="button"
              onClick={() => copyToClipboard(`curl -X POST 'https://your-supabase-project.supabase.co/rest/v1/articles' \\
  -H "apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY" \\
  -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Prefer: return=representation" \\
  -d '${JSON.stringify(samplePayload)}'`, 'curl')}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-red-600 transition"
            >
              {copied === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'curl' ? 'Copied' : 'Copy cURL'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`curl -X POST 'https://your-supabase-project.supabase.co/rest/v1/articles' \\
  -H "apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY" \\
  -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Prefer: return=representation" \\
  -d '${JSON.stringify(samplePayload)}'`}
          </pre>
        </div>
      </div>
    </AdminLayout>
  );
};
