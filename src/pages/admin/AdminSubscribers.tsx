import React, { useEffect, useState } from 'react';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getSubscribers } from '../../lib/db';
import { NewsletterSubscriber } from '../../types';
import { Users, Download, Mail, CheckCircle2 } from 'lucide-react';

export const AdminSubscribers: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDocMeta('Newsletter Subscribers | The USA Wire Admin', 'Subscriber list');
    loadSubscribers();
  }, [setDocMeta]);

  async function loadSubscribers() {
    setLoading(true);
    try {
      const subs = await getSubscribers();
      setSubscribers(subs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const exportCSV = () => {
    const headers = ['Email', 'Subscribed At', 'Status'];
    const rows = subscribers.map(s => [
      s.email,
      new Date(s.created_at).toISOString(),
      s.active ? 'Active' : 'Pending',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the-usa-wire-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout activeTab="/admin/subscribers">
      <div className="space-y-6 max-w-4xl mx-auto" id="admin-subscribers-view">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
              Newsletter Audience ({subscribers.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Readers subscribed to The USA Wire morning trending dispatch
            </p>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Subscribers CSV</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Subscriber Email</th>
                  <th className="px-5 py-3">Subscription Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sub.email}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(sub.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active Subscriber
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
