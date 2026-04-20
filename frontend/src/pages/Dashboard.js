// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import { getStats, getHistory } from '../api';

// const statCards = [
//   { key: 'total',    label: 'Total predictions', color: '#6366f1', bg: '#eef2ff' },
//   { key: 'high',     label: 'High risk results', color: '#ef4444', bg: '#fee2e2' },
//   { key: 'low',      label: 'Low risk results',  color: '#10b981', bg: '#d1fae5' },
// ];

// export default function Dashboard() {
//   const [stats,   setStats]   = useState(null);
//   const [history, setHistory] = useState([]);
//   const navigate = useNavigate();
//   const userName = localStorage.getItem('user_name') || 'User';

//   useEffect(() => {
//     getStats().then(r => setStats(r.data)).catch(() => {});
//     getHistory().then(r => setHistory(r.data.history || [])).catch(() => {});
//   }, []);

//   const riskChip = (level) => {
//     const map = {
//       HIGH:   { bg: '#fee2e2', color: '#991b1b' },
//       MEDIUM: { bg: '#fef3c7', color: '#92400e' },
//       LOW:    { bg: '#d1fae5', color: '#065f46' },
//     };
//     const s = map[level] || map.LOW;
//     return (
//       <span style={{
//         padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
//         background: s.bg, color: s.color
//       }}>{level}</span>
//     );
//   };

//   const totalPredictions = stats?.total_predictions || 0;
//   const highRisk = stats?.risk_distribution?.HIGH || 0;
//   const lowRisk  = stats?.risk_distribution?.LOW  || 0;

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
//       <Sidebar />
//       <div style={{ flex: 1, padding: '2rem' }}>
//         <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1f3a' }}>
//           Good morning, {userName}
//         </h1>
//         <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4, marginBottom: '1.5rem' }}>
//           Here's your health overview
//         </p>

//         {/* Stat cards */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: '1.5rem' }}>
//           {[
//             { label: 'Total predictions', value: totalPredictions, color: '#6366f1', bg: '#eef2ff' },
//             { label: 'High risk results', value: highRisk,         color: '#ef4444', bg: '#fee2e2' },
//             { label: 'Low risk results',  value: lowRisk,          color: '#10b981', bg: '#d1fae5' },
//           ].map((s, i) => (
//             <div key={i} style={{
//               background: s.bg, borderRadius: 12, padding: '1.25rem',
//               border: `1.5px solid ${s.color}22`
//             }}>
//               <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginBottom: 8 }}>
//                 {s.label}
//               </div>
//               <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
//             </div>
//           ))}
//         </div>

//         {/* Avg risk per disease */}
//         {stats?.average_risk_by_disease && (
//           <div style={{
//             background: '#fff', borderRadius: 12, padding: '1.25rem',
//             border: '0.5px solid #e5e7eb', marginBottom: '1.5rem'
//           }}>
//             <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Average risk by disease</h3>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
//               {Object.entries(stats.average_risk_by_disease).map(([disease, pct]) => (
//                 <div key={disease}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
//                     <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{disease}</span>
//                     <span style={{ color: '#6b7280' }}>{pct}%</span>
//                   </div>
//                   <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6' }}>
//                     <div style={{
//                       height: '100%', borderRadius: 4,
//                       background: disease === 'diabetes' ? '#6366f1' : disease === 'cancer' ? '#10b981' : '#f59e0b',
//                       width: `${pct}%`
//                     }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Recent history */}
//         <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #e5e7eb' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//             <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent predictions</h3>
//             <button onClick={() => navigate('/predict')} style={{
//               padding: '6px 14px', borderRadius: 8, border: 'none',
//               background: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 500
//             }}>
//               + New prediction
//             </button>
//           </div>

//           {history.length === 0 ? (
//             <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: 14 }}>
//               No predictions yet.{' '}
//               <span onClick={() => navigate('/predict')}
//                 style={{ color: '#6366f1', cursor: 'pointer' }}>Run your first one</span>
//             </div>
//           ) : (
//             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//               <thead>
//                 <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
//                   {['Disease', 'Result', 'Probability', 'Risk', 'Date'].map(h => (
//                     <th key={h} style={{ padding: '8px 0', textAlign: 'left', color: '#9ca3af', fontWeight: 500 }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.slice(0, 8).map((rec, i) => (
//                   <tr key={i} style={{ borderBottom: '0.5px solid #f9fafb' }}>
//                     <td style={{ padding: '10px 0', textTransform: 'capitalize', fontWeight: 500 }}>{rec.disease}</td>
//                     <td style={{ padding: '10px 0' }}>{rec.result}</td>
//                     <td style={{ padding: '10px 0' }}>{Math.round(rec.probability * 100)}%</td>
//                     <td style={{ padding: '10px 0' }}>{riskChip(rec.risk_level)}</td>
//                     <td style={{ padding: '10px 0', color: '#9ca3af' }}>
//                       {new Date(rec.timestamp).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getStats, getHistory } from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
  Area, AreaChart, Legend
} from 'recharts';

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [history, setHistory] = useState([]);
  const [disease, setDisease] = useState('diabetes');
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'User';

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(() => {});
    getHistory().then(r => setHistory(r.data.history || [])).catch(() => {});
  }, []);

  const riskChip = (level) => {
    const map = {
      HIGH:   { bg: '#fee2e2', color: '#991b1b' },
      MEDIUM: { bg: '#fef3c7', color: '#92400e' },
      LOW:    { bg: '#d1fae5', color: '#065f46' },
    };
    const s = map[level] || map.LOW;
    return (
      <span style={{
        padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: s.bg, color: s.color
      }}>{level}</span>
    );
  };

  // Build chart data for selected disease
  const chartData = history
    .filter(r => r.disease === disease)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((r, i) => ({
      name:     `#${i + 1}`,
      date:     new Date(r.timestamp).toLocaleDateString(),
      risk:     Math.round(r.probability * 100),
      ci_low:   Math.round(Math.max(0, r.probability - 0.07) * 100),
      ci_high:  Math.round(Math.min(1, r.probability + 0.07) * 100),
      level:    r.risk_level,
    }));

  const diseaseColors = {
    diabetes: '#6366f1',
    cancer:   '#10b981',
    heart:    '#f59e0b',
  };

  const totalPredictions = stats?.total_predictions || 0;
  const highRisk         = stats?.risk_distribution?.HIGH   || 0;
  const lowRisk          = stats?.risk_distribution?.LOW    || 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div style={{
        background: '#fff', border: '0.5px solid #e5e7eb',
        borderRadius: 8, padding: '10px 14px', fontSize: 12
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>
          Prediction {label} — {d?.date}
        </div>
        <div style={{ color: diseaseColors[disease] }}>
          Risk: <strong>{d?.risk}%</strong>
        </div>
        <div style={{ color: '#9ca3af' }}>
          CI: {d?.ci_low}% – {d?.ci_high}%
        </div>
        <div style={{ marginTop: 4 }}>{riskChip(d?.level)}</div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1f3a' }}>
          Good morning, {userName}
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4, marginBottom: '1.5rem' }}>
          Here's your health overview
        </p>

        {/* Stat cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginBottom: '1.5rem'
        }}>
          {[
            { label: 'Total predictions', value: totalPredictions, color: '#6366f1', bg: '#eef2ff' },
            { label: 'High risk results', value: highRisk,         color: '#ef4444', bg: '#fee2e2' },
            { label: 'Low risk results',  value: lowRisk,          color: '#10b981', bg: '#d1fae5' },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.bg, borderRadius: 12, padding: '1.25rem',
              border: `1.5px solid ${s.color}22`
            }}>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginBottom: 8 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Risk trend chart */}
        <div style={{
          background: '#fff', borderRadius: 12, padding: '1.5rem',
          border: '0.5px solid #e5e7eb', marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16
          }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1f3a' }}>
                Risk trend over time
              </h3>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                Shaded area shows confidence interval (±7%)
              </p>
            </div>
            {/* Disease filter */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['diabetes', 'cancer', 'heart'].map(d => (
                <button key={d} onClick={() => setDisease(d)} style={{
                  padding: '5px 12px', borderRadius: 20, border: 'none',
                  fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  textTransform: 'capitalize',
                  background: disease === d ? diseaseColors[d] : '#f3f4f6',
                  color: disease === d ? '#fff' : '#6b7280',
                  transition: 'all 0.2s'
                }}>{d}</button>
              ))}
            </div>
          </div>

          {chartData.length < 2 ? (
            <div style={{
              height: 200, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#9ca3af', fontSize: 14,
              flexDirection: 'column', gap: 8
            }}>
              <div style={{ fontSize: 32 }}>📊</div>
              <div>Run at least 2 {disease} predictions to see your trend</div>
              <button onClick={() => navigate('/predict')} style={{
                padding: '6px 16px', borderRadius: 8, border: 'none',
                background: diseaseColors[disease], color: '#fff',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', marginTop: 4
              }}>
                Run prediction
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={diseaseColors[disease]} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={diseaseColors[disease]} stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  domain={[0, 100]} tickFormatter={v => `${v}%`}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={50} stroke="#e5e7eb"
                  strokeDasharray="4 4" label=""
                />
                {/* CI band — high */}
                <Area
                  type="monotone" dataKey="ci_high"
                  stroke="none" fill="url(#ciGrad)"
                  fillOpacity={1} legendType="none"
                />
                {/* CI band — low (masks bottom of band) */}
                <Area
                  type="monotone" dataKey="ci_low"
                  stroke="none" fill="#fff"
                  fillOpacity={1} legendType="none"
                />
                {/* Main risk line */}
                <Line
                  type="monotone" dataKey="risk"
                  stroke={diseaseColors[disease]}
                  strokeWidth={2.5}
                  dot={{ fill: diseaseColors[disease], r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                  name="Risk %"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Average risk by disease */}
        {stats?.average_risk_by_disease && (
          <div style={{
            background: '#fff', borderRadius: 12, padding: '1.25rem',
            border: '0.5px solid #e5e7eb', marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
              Average risk by disease
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {Object.entries(stats.average_risk_by_disease).map(([d, pct]) => (
                <div key={d}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, marginBottom: 6
                  }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{d}</span>
                    <span style={{ color: '#6b7280' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      background: diseaseColors[d] || '#6366f1',
                      width: `${pct}%`, transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent predictions table */}
        <div style={{
          background: '#fff', borderRadius: 12, padding: '1.25rem',
          border: '0.5px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent predictions</h3>
            <button onClick={() => navigate('/predict')} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none',
              background: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 500,
              cursor: 'pointer'
            }}>
              + New prediction
            </button>
          </div>

          {history.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '2rem',
              color: '#9ca3af', fontSize: 14
            }}>
              No predictions yet.{' '}
              <span onClick={() => navigate('/predict')}
                style={{ color: '#6366f1', cursor: 'pointer' }}>
                Run your first one
              </span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Disease', 'Result', 'Probability', 'Risk', 'Date'].map(h => (
                    <th key={h} style={{
                      padding: '8px 0', textAlign: 'left',
                      color: '#9ca3af', fontWeight: 500
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 8).map((rec, i) => (
                  <tr key={i} style={{ borderBottom: '0.5px solid #f9fafb' }}>
                    <td style={{
                      padding: '10px 0', textTransform: 'capitalize', fontWeight: 500
                    }}>{rec.disease}</td>
                    <td style={{ padding: '10px 0' }}>{rec.result}</td>
                    <td style={{ padding: '10px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          flex: 1, height: 6, borderRadius: 3,
                          background: '#f3f4f6', maxWidth: 80
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            background: diseaseColors[rec.disease] || '#6366f1',
                            width: `${Math.round(rec.probability * 100)}%`
                          }} />
                        </div>
                        <span>{Math.round(rec.probability * 100)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 0' }}>{riskChip(rec.risk_level)}</td>
                    <td style={{ padding: '10px 0', color: '#9ca3af' }}>
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