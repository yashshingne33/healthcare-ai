export default function RiskMeter({ probability, riskLevel }) {
  const pct = Math.round(probability * 100);

  const color = riskLevel === 'HIGH' ? '#ef4444'
              : riskLevel === 'MEDIUM' ? '#f59e0b'
              : '#10b981';

  const chipStyle = {
    display: 'inline-block', padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600,
    background: riskLevel === 'HIGH'   ? '#fee2e2'
               : riskLevel === 'MEDIUM' ? '#fef3c7' : '#d1fae5',
    color: riskLevel === 'HIGH'   ? '#991b1b'
          : riskLevel === 'MEDIUM' ? '#92400e' : '#065f46',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color }}>{pct}%</span>
        <span style={chipStyle}>{riskLevel} RISK</span>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: '#e5e7eb', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 5,
          background: `linear-gradient(90deg, #10b981, #f59e0b, #ef4444)`,
          transition: 'width 0.8s ease'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
        <span>Low</span><span>Medium</span><span>High</span>
      </div>
    </div>
  );
}