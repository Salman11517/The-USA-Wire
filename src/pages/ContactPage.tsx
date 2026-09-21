import React, { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { createContactMessage } from '../lib/db';
import { Mail, CheckCircle2, Send, MapPin, Phone } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { setDocMeta } = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setDocMeta('Contact the Newsroom | The USA Wire', 'Reach out to The USA Wire editorial bureau, send story tips, press inquiries, and corrections.');
  }, [setDocMeta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setFeedback('Please complete all required fields.');
      return;
    }

    setStatus('submitting');
    try {
      await createContactMessage(formData);
      setStatus('success');
      setFeedback('Thank you for contacting The USA Wire! Your dispatch has been submitted directly to our editorial inbox and recorded for our team.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedback('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10" id="contact-page-container">
      <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center sm:text-left">
        <span className="text-xs font-black uppercase tracking-widest text-red-600 mb-2 block">
          Editorial Inquiries & Newsroom Tips
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 font-sans">
          CONTACT THE USA WIRE
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Have a breaking story lead, press release, or question for our correspondents? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form (8 cols) */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {status === 'success' ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Delivered</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">{feedback}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-4 bg-[#0A192F] hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
                  {feedback}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="News Tip / Editorial Correction / Press Inquiry"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide clear details, links to source materials, or story context..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
                id="contact-submit-btn"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Info Column (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-[#0A192F] text-white rounded-2xl p-6 shadow-sm border border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-wider text-red-500 mb-4 font-sans">
              Editorial Headquarters
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Digital Bureau</strong>
                  <span>Washington D.C. & Austin, TX Hubs</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Direct Email</strong>
                  <span>contact@theusawire.com</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Messages submitted here are delivered to the digital news desk and archived securely in the admin portal for review.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
