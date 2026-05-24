import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Tech', 'Fashion', 'Health', 'Lifestyle', 'Grooming'];

const COMPANY = [
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Write for Us', path: '/contact' },
  { label: 'Advertise', path: '/contact' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/velune' },
  { label: 'Pinterest', href: 'https://pinterest.com/velune' },
  { label: 'X / Twitter', href: 'https://x.com/velune' },
  { label: 'YouTube', href: 'https://youtube.com/velune' },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{ background: 'var(--velune-bg)', borderTop: '1px solid var(--velune-border)', padding: '64px 0 40px' }}>
      <div className="container-velune">
        <div className="grid gap-12 mb-14" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }} className="min-[600px]:col-span-1">
            <div className="font-editorial text-[18px] font-bold tracking-[0.35em] v-text mb-4 uppercase">VELUNE</div>
            <p className="font-sans text-[13px] v-muted leading-[1.75]" style={{ maxWidth: 260 }}>
              Premium editorial for aspirational urban India. Curated stories in Tech, Fashion, Health, Lifestyle, and Grooming.
            </p>
          </div>

          {/* Sections */}
          <div>
            <div className="label-caps v-muted mb-5">Sections</div>
            <div className="flex flex-col gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => navigate(`/category/${cat}`)}
                  className="font-sans text-[13px] v-muted bg-transparent border-none cursor-pointer p-0 text-left transition-colors duration-150 hover:text-[var(--velune-accent)]"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="label-caps v-muted mb-5">Company</div>
            <div className="flex flex-col gap-3">
              {COMPANY.map(({ label, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="font-sans text-[13px] v-muted bg-transparent border-none cursor-pointer p-0 text-left transition-colors duration-150 hover:text-[var(--velune-accent)]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div>
            <div className="label-caps v-muted mb-5">Follow</div>
            <div className="flex flex-col gap-3">
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[13px] v-muted no-underline transition-colors duration-150 hover:text-[var(--velune-accent)]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row justify-between gap-3 pt-7"
          style={{ borderTop: '1px solid var(--velune-border)' }}
        >
          <span className="font-sans text-[12px] v-muted">© {new Date().getFullYear()} Velune Media. All rights reserved.</span>
          <span className="font-sans text-[12px] v-muted">Made in India</span>
        </div>
      </div>
    </footer>
  );
}
