import React, { useEffect, useState } from 'react';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';
import { getContactMessages, markContactMessageRead } from '../../lib/db';
import { ContactMessage } from '../../types';
import { Mail, Clock, CheckCircle2, User, Trash2 } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    setDocMeta('Newsroom Inquiries | The USA Wire Admin', 'Contact messages');
    loadMessages();
  }, [setDocMeta]);

  async function loadMessages() {
    setLoading(true);
    try {
      const msgs = await getContactMessages();
      setMessages(msgs);
      if (msgs.length > 0) setSelectedMessage(msgs[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status !== 'read') {
      await markContactMessageRead(msg.id);
      setMessages(messages.map(m => (m.id === msg.id ? { ...m, status: 'read' as const } : m)));
    }
  };

  return (
    <AdminLayout activeTab="/admin/messages">
      <div className="space-y-6" id="admin-messages-view">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            Editorial Inbox &amp; Newsroom Tips ({messages.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Messages and story tips submitted by readers through the contact portal
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 max-w-lg mx-auto">
            <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">No Inquiries Yet</h3>
            <p className="text-xs text-slate-400 mt-1">When readers submit story tips or editorial inquiries, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* List of Messages (5 cols) */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
              {messages.map((m) => {
                const isSelected = selectedMessage?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMessage(m)}
                    className={`p-4 cursor-pointer transition ${
                      isSelected ? 'bg-red-50/70 border-l-4 border-red-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${m.status !== 'read' ? 'text-red-600' : 'text-slate-800'}`}>
                        {m.name} {m.status !== 'read' && '• NEW'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 truncate mb-1">
                      {m.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {m.message}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Message Detail View (7 cols) */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-extrabold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Inquiry Dispatch
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">
                      {selectedMessage.subject}
                    </h2>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                      <div>
                        <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                      </div>
                      <div>
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedMessage.message}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="inline-flex items-center gap-1.5 bg-[#0A192F] hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 text-xs">
                  Select a message on the left to read full text.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
