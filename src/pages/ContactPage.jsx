import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact — Velune</title>
        <meta name="description" content="Get in touch with Velune for editorial pitches, partnerships, or advertising." />
      </Helmet>

      <div style={{ paddingTop: 68 }}>
        {/* Header */}
        <div style={{ background: 'var(--velune-surface)', borderBottom: '1px solid var(--velune-border)', padding: '80px 0 64px', textAlign: 'center' }}>
          <div className="container-velune" style={{ maxWidth: 560 }}>
            <span className="label-caps v-accent">Contact</span>
            <h1 className="font-editorial text-[48px] font-bold v-text mt-[18px] mb-4">Get in Touch</h1>
            <p className="font-sans text-[15px] v-muted leading-[1.72] m-0">
              For editorial pitches, partnerships, advertising, or just a kind word.
            </p>
          </div>
        </div>

        <div className="container-velune pt-[72px] pb-[100px]">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {sent ? (
              <div className="text-center py-20">
                <p className="font-editorial text-[28px] v-text italic mb-4">
                  Thank you. We'll be in touch.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="font-sans text-[12px] v-accent bg-transparent border-none cursor-pointer tracking-[0.14em] uppercase"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="flex flex-col gap-2">
                    <label className="label-caps v-muted">Name</label>
                    <input className="v-input" value={form.name} onChange={set('name')} placeholder="Your name" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="label-caps v-muted">Email</label>
                    <input className="v-input" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-caps v-muted">Subject</label>
                  <input className="v-input" value={form.subject} onChange={set('subject')} placeholder="What's this about?" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-caps v-muted">Message</label>
                  <textarea
                    className="v-input"
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Your message..."
                    rows={6}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn-primary self-start" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
