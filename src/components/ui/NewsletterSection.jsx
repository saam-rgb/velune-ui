import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email, source: 'homepage' });
      setSubscribed(true);
      toast.success('Check your inbox to confirm!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      if (msg.includes('Already subscribed')) {
        setSubscribed(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ background: 'var(--velune-surface)', borderTop: '1px solid var(--velune-border)', padding: '88px 0' }}>
      <div className="container-velune text-center" style={{ maxWidth: 640 }}>
        <span className="label-caps v-accent">Newsletter</span>
        <h2 className="font-editorial text-[42px] font-bold v-text mt-[18px] mb-4 leading-[1.14]">
          Velune, In Your Inbox
        </h2>
        <p className="font-sans text-[15px] v-muted leading-[1.72] mb-[42px]">
          Weekly editorial across Tech, Fashion, Health, Lifestyle and Grooming. Curated with intent. No filler.
        </p>

        {subscribed ? (
          <p className="font-editorial text-[24px] v-accent italic">Welcome to Velune.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="v-input flex-1"
              required
              disabled={loading}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
