// Placeholder editorial image with category-specific color gradients
const PALETTE = {
  Tech:      { a: '#0d1b35', b: '#1e3565' },
  Fashion:   { a: '#1e0d2a', b: '#3e1a58' },
  Health:    { a: '#0a2018', b: '#1a4535' },
  Lifestyle: { a: '#201508', b: '#3e2c10' },
  Grooming:  { a: '#200f10', b: '#3e1a1c' },
};

export default function EditorialImage({ category = 'Tech', src, alt, large = false, className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || category}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const p = PALETTE[category] || PALETTE.Tech;

  return (
    <div
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(140deg, ${p.a} 0%, ${p.b} 55%, ${p.a} 100%)` }}
      aria-label={`${category} editorial image`}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`rg-${category}`} cx="68%" cy="32%" r="52%">
            <stop offset="0%" stopColor={p.b} stopOpacity="0.9" />
            <stop offset="100%" stopColor={p.a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#rg-${category})`} />
        <circle cx="70%" cy="28%" r="30%" fill="rgba(255,255,255,0.022)" />
        <circle cx="12%" cy="78%" r="22%" fill="rgba(255,255,255,0.015)" />
        {large && <circle cx="48%" cy="55%" r="40%" fill="rgba(200,169,110,0.035)" />}
        {large && <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(200,169,110,0.06)" strokeWidth="1" />}
      </svg>
      <span
        style={{
          position: 'absolute', bottom: 12, right: 14,
          fontFamily: 'Inter,sans-serif', fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.22)', fontWeight: 500,
        }}
      >
        {category}
      </span>
    </div>
  );
}
