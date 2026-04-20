const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

export default function ShapChart({ factors }) {
  if (!factors || factors.length === 0) return null;

  return (
    <div>
      {factors.map((f, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 500 }}>{f}</span>
            <span style={{ color: '#9ca3af', fontSize: 11 }}>
              {i === 0 ? 'high' : i === 1 ? 'medium' : 'low'} impact
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: '#f3f4f6' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: COLORS[i],
              width: i === 0 ? '85%' : i === 1 ? '55%' : '35%',
              transition: 'width 0.6s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}