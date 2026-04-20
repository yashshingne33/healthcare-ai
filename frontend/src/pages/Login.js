// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login, register } from '../api';

// export default function Login() {
//   const [isLogin, setIsLogin]   = useState(true);
//   const [form, setForm]         = useState({ name: '', email: '', password: '' });
//   const [error, setError]       = useState('');
//   const [loading, setLoading]   = useState(false);
//   const navigate = useNavigate();

//   const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async () => {
//     setError(''); setLoading(true);
//     try {
//       const fn   = isLogin ? login : register;
//       const body = isLogin ? { email: form.email, password: form.password } : form;
//       const res  = await fn(body);
//       localStorage.setItem('token',     res.data.access_token);
//       localStorage.setItem('user_name', res.data.user_name);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputStyle = {
//     width: '100%', padding: '12px 14px', borderRadius: 8,
//     border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none',
//     marginBottom: 12, background: '#f9fafb'
//   };

//   return (
//     <div style={{
//       minHeight: '100vh', display: 'flex', alignItems: 'center',
//       justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//     }}>
//       <div style={{
//         background: '#fff', borderRadius: 16, padding: '2.5rem',
//         width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
//       }}>
//         <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//           <div style={{ fontSize: 32, marginBottom: 8 }}>🏥</div>
//           <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1f3a' }}>HealthAI</h1>
//           <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
//             {isLogin ? 'Sign in to your account' : 'Create your account'}
//           </p>
//         </div>

//         {!isLogin && (
//           <input name="name" placeholder="Full name" value={form.name}
//             onChange={handle} style={inputStyle} />
//         )}
//         <input name="email" placeholder="Email address" value={form.email}
//           onChange={handle} style={inputStyle} type="email" />
//         <input name="password" placeholder="Password" value={form.password}
//           onChange={handle} style={inputStyle} type="password" />

//         {error && (
//           <div style={{
//             background: '#fee2e2', color: '#991b1b', padding: '8px 12px',
//             borderRadius: 6, fontSize: 12, marginBottom: 12
//           }}>{error}</div>
//         )}

//         <button onClick={submit} disabled={loading} style={{
//           width: '100%', padding: '12px', borderRadius: 8, border: 'none',
//           background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
//           color: '#fff', fontSize: 14, fontWeight: 600,
//           opacity: loading ? 0.7 : 1
//         }}>
//           {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
//         </button>

//         <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 16 }}>
//           {isLogin ? "Don't have an account? " : 'Already have an account? '}
//           <span onClick={() => { setIsLogin(!isLogin); setError(''); }}
//             style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 500 }}>
//             {isLogin ? 'Sign up' : 'Sign in'}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

export default function Login() {
  const [isLogin, setIsLogin]   = useState(true);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setError(''); setLoading(true);
    try {
      const fn   = isLogin ? login : register;
      const body = isLogin
        ? { email: form.email, password: form.password }
        : form;
      const res = await fn(body);
      localStorage.setItem('token',     res.data.access_token);
      localStorage.setItem('user_name', res.data.user_name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit();
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none',
    marginBottom: 14, background: '#fafafa', color: '#1a1f3a',
    transition: 'border-color 0.2s ease',
  };

  const features = [
    { icon: '🧠', text: 'AI-powered risk prediction' },
    { icon: '📊', text: 'Explainable results with SHAP' },
    { icon: '📄', text: 'PDF report generation' },
    { icon: '📈', text: 'Risk trend tracking' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left panel */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1f3a 0%, #312e81 50%, #4c1d95 100%)',
        padding: '3rem', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', color: '#fff'
      }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, marginBottom: '1.5rem'
          }}>🏥</div>

          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
            HealthAI
          </h1>
          <p style={{ fontSize: 16, color: '#a5b4fc', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            AI-powered healthcare prediction and monitoring system
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0
                }}>{f.icon}</div>
                <span style={{ fontSize: 14, color: '#c7d2fe' }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '3rem', padding: '16px 20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)'
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

      {/* Right panel */}
      <div style={{
        background: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
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
              onChange={handle} onKeyDown={handleKeyDown}
              style={inputStyle}
            />
          )}
          <input
            name="email" placeholder="Email address" value={form.email}
            onChange={handle} onKeyDown={handleKeyDown}
            style={inputStyle} type="email"
          />
          <input
            name="password" placeholder="Password" value={form.password}
            onChange={handle} onKeyDown={handleKeyDown}
            style={inputStyle} type="password"
          />

          {error && (
            <div style={{
              background: '#fee2e2', color: '#991b1b',
              padding: '10px 14px', borderRadius: 8,
              fontSize: 13, marginBottom: 14,
              border: '1px solid #fecaca'
            }}>{error}</div>
          )}

          <button onClick={submit} disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading
              ? '#9ca3af'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: 15, fontWeight: 600,
            letterSpacing: '0.01em'
          }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '20px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
            <span style={{ fontSize: 12, color: '#9ca3af' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setIsLogin(!isLogin); setError(''); setForm({ name: '', email: '', password: '' }); }}
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