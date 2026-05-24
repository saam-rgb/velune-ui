import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuth, clearError } from '../store/slices/authSlice';
import EditorialImage from '../components/ui/EditorialImage';
import { ArrowLeft } from '../components/ui/Icons';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, accessToken } = useSelector(selectAuth);

  useEffect(() => {
    if (accessToken) navigate('/dashboard', { replace: true });
    return () => dispatch(clearError());
  }, [accessToken, navigate, dispatch]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(login(form));
  }

  return (
    <>
      <Helmet><title>Login — Velune</title></Helmet>

      <div className="min-h-screen grid" style={{ gridTemplateColumns: '45% 55%' }}>
        {/* Left — branding */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden p-[56px_56px_48px]">
          <div className="absolute inset-0">
            <EditorialImage category="Tech" large />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(145deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 100%)' }}
          />
          <div className="relative z-10">
            <button onClick={() => navigate('/')} className="border-none bg-transparent cursor-pointer p-0">
              <span className="font-editorial text-[20px] font-bold tracking-[0.38em] uppercase" style={{ color: '#f0ece3' }}>
                VELUNE
              </span>
            </button>
          </div>
          <div className="relative z-10">
            <p className="font-editorial text-[32px] italic leading-[1.25] mb-4" style={{ color: '#f0ece3' }}>
              "Stories That Matter."
            </p>
            <p className="font-sans text-[13px] leading-[1.7]" style={{ color: 'rgba(240,236,227,0.55)' }}>
              Premium editorial for aspirational urban India.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div
          className="flex items-center justify-center p-14"
          style={{ background: 'var(--velune-bg)' }}
        >
          <div className="w-full" style={{ maxWidth: 400 }}>
            <h2 className="font-editorial text-[34px] font-bold v-text m-0 mb-2">Sign In</h2>
            <p className="font-sans text-[14px] v-muted m-0 mb-10">Access your Velune dashboard.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
              <div className="flex flex-col gap-2">
                <label className="label-caps v-muted">Email</label>
                <input
                  className="v-input"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="editor@velune.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label-caps v-muted">Password</label>
                <input
                  className="v-input"
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="font-sans text-[13px] m-0" style={{ color: '#e55' }}>{error}</p>
              )}

              <button type="submit" className="btn-primary mt-2" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In to Velune'}
              </button>
            </form>

            <button
              onClick={() => navigate('/')}
              className="mt-8 font-sans text-[12px] v-accent bg-transparent border-none cursor-pointer tracking-[0.1em] uppercase p-0 flex items-center gap-2"
            >
              <ArrowLeft size={12} />
              Back to site
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
