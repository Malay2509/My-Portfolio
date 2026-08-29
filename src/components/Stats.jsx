import { stats } from '../data'

export default function Stats() {
  return (
    <section className="stats-ribbon">
      <div className="stats-container">
        {stats.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div className="stat-divider" />}
            <div className="stat-item">
              <span className="stat-number">
                {s.count}{s.suffix}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
