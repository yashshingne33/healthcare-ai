import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getHistory } from '../api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    getHistory().then(r => setHistory(r.data.history || [])).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? history : history.filter(r => r.disease === filter);

  const riskChip = (level) => {
    const map = { HIGH: ['#fee2e2','#991b1b'], MEDIUM: ['#fef3c7','#92400e'], LOW: ['#d1fae5','#065f46'] };
    const [bg, color] = map[level] || map.LOW;
    return <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:600, background:bg, color }}>{level}</span>;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1f3a', marginBottom: 4 }}>Prediction history</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: '1.5rem' }}>All your past health predictions</p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {['all', 'diabetes', 'cancer', 'heart'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 500,
              background: filter === f ? '#6366f1' : '#fff',
              color: filter === f ? '#fff' : '#6b7280',
              textTransform: 'capitalize'
            }}>{f}</button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #e5e7eb', overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: 14 }}>
              No predictions found.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  {['Disease', 'Result', 'Probability', 'Risk Level', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec, i) => (
                  <tr key={i} style={{ borderTop: '0.5px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', textTransform: 'capitalize', fontWeight: 500 }}>{rec.disease}</td>
                    <td style={{ padding: '12px 16px' }}>{rec.result}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#f3f4f6', maxWidth: 80 }}>
                          <div style={{ height: '100%', borderRadius: 3, background: '#6366f1', width: `${Math.round(rec.probability * 100)}%` }} />
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
          )}
        </div>
      </div>
    </div>
  );
}