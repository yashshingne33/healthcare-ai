import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

// ── SVG icon components ──────────────────────────────────────────────────────

const IconBrain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08
             3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08
             3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3Z"/>
  </svg>
);

const IconBarChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
    <line x1="2"  y1="20" x2="22" y2="20"/>
  </svg>
);

const IconFileText = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9"  x2="8" y2="9"/>
  </svg>
);

const IconTrendingUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const IconCross = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
             M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

// ── Media query hook ─────────────────────────────────────────────────────────

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// ── Logo component ───────────────────────────────────────────────────────────
// Replace `src` with your actual logo path, e.g. '/logo.png' or import logo from '../assets/logo.png'

const Logo = ({ size = 44 }) => (
  <img
    src="/logoAI.png"
    alt="HealthAI logo"
    width={size}
    height={size}
    style={{ borderRadius: 12, objectFit: 'contain', display: 'block' }}
    onError={(e) => {
      // Fallback: show a minimal SVG pulse icon if logo.png is missing
      e.currentTarget.style.display = 'none';
      e.currentTarget.nextSibling.style.display = 'flex';
    }}
  />
);

const LogoFallback = ({ size = 44, dark = false }) => (
  <div style={{
    display: 'none',           // shown only when Logo fails to load
    width: size, height: size,
    borderRadius: 12,
    background: dark ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    alignItems: 'center', justifyContent: 'center',
    color: '#fff',
  }}>
    <IconCross />
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────

export default function Login() {
  const [isLogin, setIsLogin]   = useState(true);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [greeting, setGreeting] = useState('');
  const navigate  = useNavigate();
  const isMobile  = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setError(''); setLoading(true);
    try {
      const fn   = isLogin ? login : register;
      const body = isLogin ? { email: form.email, password: form.password } : form;
      const res  = await fn(body);
      localStorage.setItem('token',     res.data.access_token);
      localStorage.setItem('user_name', res.data.user_name);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail))          setError(detail.map(e => e.msg).join(', '));
      else if (typeof detail === 'object') setError(JSON.stringify(detail));
      else                                 setError(detail || 'Something went wrong. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') submit(); };

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none',
    marginBottom: 14, background: '#fafafa', color: '#1a1f3a',
    transition: 'border-color 0.2s ease', boxSizing: 'border-box',
  };

  const features = [
    { Icon: IconBrain,      text: 'AI-powered risk prediction' },
    { Icon: IconBarChart,   text: 'Explainable results with SHAP' },
    { Icon: IconFileText,   text: 'PDF report generation' },
    { Icon: IconTrendingUp, text: 'Risk trend tracking' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    }}>

      {/* ── Left panel (desktop only) ─────────────────────────────────────── */}
      {!isMobile && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1f3a 0%, #312e81 50%, #4c1d95 100%)',
          padding: '3rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', color: '#fff',
        }}>
          <div style={{ maxWidth: 400 }}>

            {/* Logo */}
            <div style={{
              width: 56, height: 56, borderRadius: 16, marginBottom: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <Logo size={100} />
              <LogoFallback size={100} dark />
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
              HealthAI
            </h1>
            <p style={{ fontSize: 16, color: '#a5b4fc', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              AI-powered healthcare prediction and monitoring system
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {features.map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#a5b4fc',
                  }}>
                    <Icon />
                  </div>
                  <span style={{ fontSize: 14, color: '#c7d2fe' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Tagline card */}
            <div style={{
              marginTop: '3rem', padding: '16px 20px', borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <p style={{ fontSize: 12, color: '#818cf8', margin: 0, lineHeight: 1.6 }}>
                Predicts risk for <strong style={{ color: '#a5b4fc' }}>Diabetes</strong>,{' '}
                <strong style={{ color: '#a5b4fc' }}>Breast Cancer</strong>, and{' '}
                <strong style={{ color: '#a5b4fc' }}>Heart Disease</strong> using
                machine learning with explainable AI.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Right panel (form) ────────────────────────────────────────────── */}
      <div style={{
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '2rem 1.25rem' : '2rem',
        minHeight: isMobile ? '100vh' : 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Logo size={100} />
                <LogoFallback size={100} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1a1f3a' }}>HealthAI</span>
            </div>
          )}

          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>{greeting}</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1a1f3a', marginBottom: 4 }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: '2rem' }}>
            {isLogin
              ? 'Sign in to access your health dashboard'
              : 'Start monitoring your health risk today'}
          </p>

          {!isLogin && (
            <input
              name="name" placeholder="Full name" value={form.name}
              onChange={handle} onKeyDown={handleKeyDown} style={inputStyle}
            />
          )}
          <input
            name="email" placeholder="Email address" value={form.email} type="email"
            onChange={handle} onKeyDown={handleKeyDown} style={inputStyle}
          />
          <input
            name="password" placeholder="Password" value={form.password} type="password"
            onChange={handle} onKeyDown={handleKeyDown} style={inputStyle}
          />

          {error && (
            <div style={{
              background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca',
              padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          <button onClick={submit} disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
          }}>
            {loading
              ? 'Connecting… (may take 30s on first load)'
              : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
            <span style={{ fontSize: 12, color: '#9ca3af' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setForm({ name: '', email: '', password: '' });
              }}
              style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}