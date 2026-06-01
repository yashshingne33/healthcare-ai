// // import { useNavigate, useLocation } from 'react-router-dom';

// // const links = [
// //   { path: '/dashboard', label: 'Dashboard', color: '#6ee7b7' },
// //   { path: '/predict',   label: 'Predict',   color: '#818cf8' },
// //   { path: '/history',   label: 'History',   color: '#fb923c' },
// // ];

// // export default function Sidebar() {
// //   const navigate  = useNavigate();
// //   const location  = useLocation();
// //   const userName  = localStorage.getItem('user_name') || 'User';

// //   const handleLogout = () => {
// //     localStorage.clear();
// //     navigate('/login');
// //   };

// //   return (
// //     <div style={{
// //       width: 220, minHeight: '100vh', background: 'var(--dark)',
// //       padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: 6
// //     }}>
// //       <div style={{
// //         color: '#fff', fontSize: 16, fontWeight: 600,
// //         marginBottom: '1.5rem', paddingBottom: '1rem',
// //         borderBottom: '0.5px solid rgba(255,255,255,0.1)'
// //       }}>
// //         HealthAI
// //         <span style={{ color: '#6ee7b7', fontSize: 11, display: 'block', marginTop: 2, fontWeight: 400 }}>
// //           Prediction System
// //         </span>
// //       </div>

// //       {links.map(link => (
// //         <button key={link.path} onClick={() => navigate(link.path)} style={{
// //           display: 'flex', alignItems: 'center', gap: 10,
// //           padding: '10px 12px', borderRadius: 8, border: 'none',
// //           background: location.pathname === link.path ? 'rgba(255,255,255,0.12)' : 'transparent',
// //           color: location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.55)',
// //           fontSize: 13, fontWeight: 500, textAlign: 'left', width: '100%',
// //           transition: 'all 0.2s'
// //         }}>
// //           <div style={{ width: 8, height: 8, borderRadius: '50%', background: link.color }} />
// //           {link.label}
// //         </button>
// //       ))}

// //       <div style={{ marginTop: 'auto' }}>
// //         <div style={{
// //           padding: '10px 12px', borderRadius: 8,
// //           background: 'rgba(255,255,255,0.05)', marginBottom: 8
// //         }}>
// //           <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Logged in as</div>
// //           <div style={{ color: '#fff', fontSize: 13, marginTop: 2 }}>{userName}</div>
// //         </div>
// //         <button onClick={handleLogout} style={{
// //           width: '100%', padding: '8px 12px', borderRadius: 8,
// //           border: '0.5px solid rgba(255,255,255,0.15)',
// //           background: 'transparent', color: 'rgba(255,255,255,0.5)',
// //           fontSize: 12
// //         }}>
// //           Logout
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }



// import { useNavigate, useLocation } from 'react-router-dom';

// const links = [
//   { path: '/dashboard', label: 'Dashboard', color: '#6ee7b7', icon: '▦' },
//   { path: '/predict',   label: 'Predict',   color: '#818cf8', icon: '◎' },
//   { path: '/history',   label: 'History',   color: '#fb923c', icon: '≡' },
// ];

// export default function Sidebar() {
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const userName  = localStorage.getItem('user_name') || 'User';
//   const initials  = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div style={{
//       width: 220, minHeight: '100vh', background: '#1a1f3a',
//       padding: '1.5rem 1rem', display: 'flex',
//       flexDirection: 'column', gap: 4,
//       borderRight: '1px solid rgba(255,255,255,0.05)'
//     }}>
//       {/* Logo */}
//       <div style={{
//         display: 'flex', alignItems: 'center', gap: 10,
//         marginBottom: '2rem', padding: '0 4px'
//       }}>
//         <div style={{
//           width: 36, height: 36, borderRadius: 10,
//           background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: 18, flexShrink: 0
//         }}>🏥</div>
//         <div>
//           <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>HealthAI</div>
//           <div style={{ color: '#6366f1', fontSize: 10, marginTop: 1 }}>Prediction System</div>
//         </div>
//       </div>

//       {/* Nav label */}
//       <div style={{
//         fontSize: 10, color: 'rgba(255,255,255,0.3)',
//         fontWeight: 600, letterSpacing: '0.08em',
//         padding: '0 12px', marginBottom: 6
//       }}>
//         NAVIGATION
//       </div>

//       {/* Nav links */}
//       {links.map(link => {
//         const isActive = location.pathname === link.path;
//         return (
//           <button key={link.path} onClick={() => navigate(link.path)} style={{
//             display: 'flex', alignItems: 'center', gap: 10,
//             padding: '10px 12px', borderRadius: 10, border: 'none',
//             background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
//             color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
//             fontSize: 13, fontWeight: isActive ? 600 : 400,
//             textAlign: 'left', width: '100%',
//             borderLeft: isActive ? `3px solid ${link.color}` : '3px solid transparent',
//           }}>
//             <div style={{
//               width: 8, height: 8, borderRadius: '50%',
//               background: isActive ? link.color : 'rgba(255,255,255,0.2)',
//               flexShrink: 0
//             }} />
//             {link.label}
//           </button>
//         );
//       })}

//       {/* Bottom section */}
//       <div style={{ marginTop: 'auto' }}>
//         <div style={{
//           height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 12
//         }} />

//         {/* User card */}
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: 10,
//           padding: '10px 12px', borderRadius: 10,
//           background: 'rgba(255,255,255,0.05)', marginBottom: 8
//         }}>
//           <div style={{
//             width: 32, height: 32, borderRadius: '50%',
//             background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0
//           }}>{initials}</div>
//           <div style={{ overflow: 'hidden' }}>
//             <div style={{
//               color: '#fff', fontSize: 12, fontWeight: 500,
//               whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
//             }}>{userName}</div>
//             <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>Patient</div>
//           </div>
//         </div>

//         <button onClick={handleLogout} style={{
//           width: '100%', padding: '8px 12px', borderRadius: 8,
//           border: '0.5px solid rgba(255,255,255,0.1)',
//           background: 'transparent', color: 'rgba(255,255,255,0.4)',
//           fontSize: 12, textAlign: 'center'
//         }}>
//           Sign out
//         </button>
//       </div>
//     </div>
//   );
// }





import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Predict',   path: '/predict',   icon: '🔬' },
  { label: 'History',   path: '/history',   icon: '📋' },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isMobile  = useMediaQuery('(max-width: 767px)');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    navigate('/');
  };

  /* ─── MOBILE: fixed bottom navigation bar ─── */
  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'stretch',
        height: 64,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '6px 4px',
                position: 'relative',
              }}
            >
              {/* Active indicator pill */}
              {active && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '25%',
                  right: '25%',
                  height: 3,
                  borderRadius: '0 0 3px 3px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                }} />
              )}
              <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
              <span style={{
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                color: active ? '#6366f1' : '#9ca3af',
                letterSpacing: '-0.01em',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '6px 4px',
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>🚪</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af' }}>Logout</span>
        </button>
      </nav>
    );
  }

  /* ─── DESKTOP: left sidebar ─── */
  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      background: 'linear-gradient(160deg, #1a1f3a 0%, #312e81 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem', paddingLeft: 4 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>🏥</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>HealthAI</div>
          <div style={{ fontSize: 10, color: '#a5b4fc', marginTop: 1 }}>Prediction System</div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#6366f1', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 12 }}>
        NAVIGATION
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: active ? '#fff' : '#94a3b8',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              {/* Active dot */}
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: active ? '#6366f1' : 'transparent',
                border: active ? 'none' : '1.5px solid #475569',
              }} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10, border: 'none',
          cursor: 'pointer', background: 'transparent',
          color: '#94a3b8', fontSize: 14, textAlign: 'left',
          marginTop: 'auto',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
      >
        <span style={{ fontSize: 16 }}>🚪</span>
        Logout
      </button>
    </aside>
  );
}