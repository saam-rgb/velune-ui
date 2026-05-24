import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SectionHeader from '../components/ui/SectionHeader';
import NewsletterSection from '../components/ui/NewsletterSection';

const PILLARS = [
  { cat: 'Tech',      desc: 'Honest takes on AI, gadgets, and the digital tools reshaping how India works and creates.' },
  { cat: 'Fashion',   desc: 'Power dressing, investment pieces, and the Indian designers rewriting global style.' },
  { cat: 'Health',    desc: 'Evidence-based wellness — sleep, nutrition, and performance without the noise.' },
  { cat: 'Lifestyle', desc: 'Luxury watches, morning routines, and everything that makes aspirational living legible.' },
  { cat: 'Grooming',  desc: 'Skincare, fragrance, and the rituals that signal self-awareness without effort.' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About — Velune</title>
        <meta name="description" content="Velune is a premium digital editorial brand for aspirational urban Indians aged 20–35." />
      </Helmet>

      <div style={{ paddingTop: 68 }}>
        {/* Hero */}
        <div style={{ background: 'var(--velune-surface)', borderBottom: '1px solid var(--velune-border)', padding: '100px 0 80px', textAlign: 'center' }}>
          <div className="container-velune" style={{ maxWidth: 760 }}>
            <span className="label-caps v-accent">About</span>
            <h1
              className="font-editorial font-bold v-text mt-5 mb-7 leading-[1.1] text-balance"
              style={{ fontSize: 'clamp(36px,5vw,64px)' }}
            >
              Stories That Matter.<br />For People Who Care.
            </h1>
            <p className="font-sans text-[16px] v-muted leading-[1.8] m-0">
              Velune is a premium digital editorial brand for aspirational urban Indians aged 20–35. Think GQ meets a modern Indian digital magazine — confident, polished, and always worth reading.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="container-velune pt-20 pb-[72px]">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <SectionHeader title="Our Mission" />
            <p className="font-sans text-[17px] v-text leading-[1.88] mb-7 text-pretty">
              We exist to raise the quality of conversation around the things that shape how aspirational Indians live, dress, move, and think. Every piece we publish is edited with intention, written by someone who genuinely knows the subject, and designed to be worth your time.
            </p>
            <p className="font-sans text-[17px] v-text leading-[1.88] text-pretty">
              No content farms. No clickbait headlines. No listicles padded to hit a word count. Just sharp, considered editorial that treats our readers as the intelligent adults they are.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div style={{ background: 'var(--velune-surface)', borderTop: '1px solid var(--velune-border)', padding: '72px 0 80px' }}>
          <div className="container-velune">
            <SectionHeader title="What We Cover" />
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {PILLARS.map(({ cat, desc }) => (
                <div
                  key={cat}
                  onClick={() => navigate(`/category/${cat}`)}
                  className="cursor-pointer transition-colors duration-200 p-[36px_32px]"
                  style={{
                    background: 'var(--velune-card)',
                    border: '1px solid var(--velune-border)',
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--velune-accent)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--velune-border)'}
                >
                  <span className="label-caps v-accent">{cat}</span>
                  <p className="font-sans text-[14px] v-muted leading-[1.72] mt-[14px] mb-0">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <NewsletterSection />
      </div>
    </>
  );
}
