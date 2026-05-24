import { useNavigate } from 'react-router-dom';
import CategoryBadge from '../ui/CategoryBadge';
import EditorialImage from '../ui/EditorialImage';
import { ArrowRight } from '../ui/Icons';

export default function HeroSection({ article }) {
  const navigate = useNavigate();
  if (!article) return null;

  return (
    <section
      className="relative overflow-hidden cursor-pointer"
      style={{ height: '92vh', minHeight: 560, maxHeight: 900 }}
      onClick={() => navigate(`/article/${article.slug}`)}
    >
      <div className="absolute inset-0">
        <EditorialImage category={article.category} src={article.coverImage} alt={article.title} large />
      </div>
      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.93) 100%)' }}
      />

      {/* Watermark */}
      <div
        className="absolute top-20 right-14 font-editorial text-[10px] tracking-[0.32em] uppercase"
        style={{ color: 'rgba(255,255,255,0.22)' }}
      >
        Featured Story
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-[0_56px_64px]">
        <div style={{ maxWidth: 820 }}>
          <div className="flex items-center gap-[14px] mb-[22px]">
            <CategoryBadge category={article.category} />
            <span
              className="w-[3px] h-[3px] rounded-full inline-block"
              style={{ background: 'var(--velune-accent)' }}
            />
            <span className="font-sans text-[12px] tracking-[0.04em]" style={{ color: 'rgba(240,236,227,0.5)' }}>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
                : article.date}
              {' · '}{article.readTime} read
            </span>
          </div>

          <h1
            className="font-editorial font-bold m-0 mb-[22px] leading-[1.1] text-balance"
            style={{ fontSize: 'clamp(30px,4.8vw,66px)', color: '#f0ece3' }}
          >
            {article.title}
          </h1>

          <p
            className="font-sans text-[16px] leading-[1.7] m-0 mb-9"
            style={{ color: 'rgba(240,236,227,0.68)', maxWidth: 560 }}
          >
            {article.excerpt}
          </p>

          <button
            className="btn-hero inline-flex items-center gap-[10px]"
            style={{
              fontFamily: 'Inter,sans-serif', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', fontWeight: 600, background: 'none',
              color: '#f0ece3', border: '1px solid rgba(240,236,227,0.45)',
              cursor: 'pointer', padding: '13px 28px',
              transition: 'border-color 0.18s ease, background 0.18s ease',
            }}
            onClick={e => { e.stopPropagation(); navigate(`/article/${article.slug}`); }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'rgba(240,236,227,0.9)';
              e.currentTarget.style.background = 'rgba(240,236,227,0.07)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(240,236,227,0.45)';
              e.currentTarget.style.background = 'none';
            }}
          >
            Read Story
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
