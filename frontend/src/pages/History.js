import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getHistory } from '../api';

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

const diseaseColors = {
  diabetes: '#6366f1',
  cancer:   '#10b981',
  heart:    '#f59e0b',
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [filter,  setFilter]  = useState('all');

  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    getHistory().then(r => setHistory(r.data.history || [])).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? history : history.filter(r => r.disease === filter);

  const riskChip = (level) => {
    const map = {
      HIGH:   ['#fee2e2', '#991b1b'],
      MEDIUM: ['#fef3c7', '#92400e'],
      LOW:    ['#d1fae5', '#065f46'],
    };
    const [bg, color] = map[level] || map.LOW;
    return (
      <span style={{
        padding: '2px 8px', borderRadius: 20, fontSize: 11,
        fontWeight: 600, background: bg, color,
      }}>{level}</span>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        padding: isMobile ? '1rem' : '2rem',
        paddingBottom: isMobile ? 'calc(1rem + 64px)' : '2rem',
        minWidth: 0,
        overflowY: 'auto',
      }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1f3a', marginBottom: 4 }}>
          Prediction history
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: '1.5rem' }}>
          All your past health predictions
        </p>

        {/* Filter tabs — horizontally scrollable on mobile */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: '1.5rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          // hide scrollbar visually but keep functionality
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: 2, // prevent chip clipping
        }}>
          {['all', 'diabetes', 'cancer', 'heart'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? '#6366f1' : '#fff',
              color: filter === f ? '#fff' : '#6b7280',
              textTransform: 'capitalize',
              flexShrink: 0, // prevent chips from shrinking
              whiteSpace: 'nowrap',
            }}>{f}</button>
          ))}
        </div>

        <div style={{
          background: '#fff', borderRadius: 12,
          border: '0.5px solid #e5e7eb', overflow: 'hidden',
        }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '3rem',
              color: '#9ca3af', fontSize: 14,
            }}>
              No predictions found.
            </div>
          ) : isMobile ? (
            /* Mobile card list */
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((rec, i) => (
                <div key={i} style={{
                  padding: '12px 14px', borderRadius: 10,
                  border: '0.5px solid #f3f4f6', background: '#fafafa',
                }}>
                  {/* Top row: disease + date */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 8,
                  }}>
                    <span style={{
                      fontWeight: 600, fontSize: 13,
                      textTransform: 'capitalize',
                      color: diseaseColors[rec.disease] || '#6366f1',
                    }}>
                      {rec.disease}
                    </span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>
                      {new Date(rec.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Result text */}
                  <div style={{ fontSize: 12, color: '#374151', marginBottom: 10 }}>
                    {rec.result}
                  </div>

                  {/* Bottom row: probability bar + risk chip */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                      <div style={{
                        flex: 1, height: 6, borderRadius: 3,
                        background: '#f3f4f6', maxWidth: 120,
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          background: diseaseColors[rec.disease] || '#6366f1',
                          width: `${Math.round(rec.probability * 100)}%`,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1f3a' }}>
                        {Math.round(rec.probability * 100)}%
                      </span>
                    </div>
                    {riskChip(rec.risk_level)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop table — allow horizontal scroll on narrow viewports */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    {['Disease', 'Result', 'Probability', 'Risk Level', 'Date'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        color: '#6b7280', fontWeight: 500, fontSize: 12,
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rec, i) => (
                    <tr key={i} style={{ borderTop: '0.5px solid #f3f4f6' }}>
                      <td style={{
                        padding: '12px 16px', textTransform: 'capitalize', fontWeight: 500,
                      }}>{rec.disease}</td>
                      <td style={{ padding: '12px 16px' }}>{rec.result}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            flex: 1, height: 6, borderRadius: 3,
                            background: '#f3f4f6', maxWidth: 80,
                          }}>
                            <div style={{
                              height: '100%', borderRadius: 3,
                              background: diseaseColors[rec.disease] || '#6366f1',
                              width: `${Math.round(rec.probability * 100)}%`,
                            }} />
                          </div>
                          <span>{Math.round(rec.probability * 100)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>{riskChip(rec.risk_level)}</td>
                      <td style={{ padding: '12px 16px', color: '#9ca3af' }}>
                        {new Date(rec.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}