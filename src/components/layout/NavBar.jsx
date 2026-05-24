import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, toggleTheme } from '../../store/slices/uiSlice';
import { selectIsLoggedIn } from '../../store/slices/authSlice';
import { Sun, Moon, Menu, Close } from '../ui/Icons';

const CATEGORIES = ['Tech', 'Fashion', 'Health', 'Lifestyle', 'Grooming'];

const TRANSPARENT_PATHS = ['/', '/article'];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const isTransparent = TRANSPARENT_PATHS.some(p =>
    p === '/' ? pathname === '/' : pathname.startsWith(p)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const opaque = !isTransparent || scrolled;

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 68,
        display: 'flex', alignItems: 'center',
        padding: '0 48px',
        background: opaque ? 'var(--velune-bg)' : 'transparent',
        borderBottom: opaque ? '1px solid var(--velune-border)' : '1px solid transparent',
        backdropFilter: opaque ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: opaque ? 'blur(20px)' : 'none',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="border-none bg-transparent cursor-pointer p-0 mr-auto"
      >
        <span
          className="font-editorial text-[20px] font-bold tracking-[0.38em] uppercase block"
          style={{ color: opaque ? 'var(--velune-text)' : '#f0ece3' }}
        >
          VELUNE
        </span>
      </button>

      {/* Desktop categories — centered */}
      <div className="hidden md:flex gap-9 absolute left-1/2 -translate-x-1/2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => navigate(`/category/${cat}`)}
            className="nav-link"
            style={{ color: opaque ? 'var(--velune-muted)' : 'rgba(240,236,227,0.7)' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5 ml-auto">
        <button
          className="btn-ghost p-[6px] flex items-center"
          style={{ color: opaque ? 'var(--velune-muted)' : 'rgba(240,236,227,0.7)' }}
          onClick={() => dispatch(toggleTheme())}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          className="btn-nav hidden sm:block"
          onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
        >
          {isLoggedIn ? 'Dashboard' : 'Login'}
        </button>

        {/* Mobile menu toggle */}
        <button
          className="btn-ghost md:hidden p-[6px]"
          style={{ color: opaque ? 'var(--velune-text)' : '#f0ece3' }}
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <Close size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-[68px] left-0 right-0 flex flex-col p-6 gap-4 md:hidden"
          style={{ background: 'var(--velune-bg)', borderBottom: '1px solid var(--velune-border)' }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => navigate(`/category/${cat}`)}
              className="nav-link text-left"
            >
              {cat}
            </button>
          ))}
          <button
            className="btn-nav mt-2 self-start"
            onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
          >
            {isLoggedIn ? 'Dashboard' : 'Login'}
          </button>
        </div>
      )}
    </nav>
  );
}
