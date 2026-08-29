import { education } from '../data'

export default function Education() {
  return (
    <section id="education" className="section education-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Education</span>
          <h2 className="section-title">Academic History</h2>
          <p className="section-subtitle">A view of my engineering academic background and computer science foundation.</p>
        </div>

        {/* Grid layout */}
        <div className="edu-grid">
          {education.map((edu, i) => (
            <div key={i} className="edu-card">
              <div className="edu-icon">{edu.icon}</div>
              <div className="edu-info">
                <h3 className="edu-degree">{edu.degree}</h3>
                <p className="edu-institution">{edu.institution}</p>
                <span className="edu-year">{edu.period}</span>
                {edu.gpa && (
                  <span className="edu-year" style={{ marginLeft: '6px', background: 'rgba(124,58,237,.1)', color: 'var(--accent)' }}>
                    {edu.gpa}
                  </span>
                )}
                <p className="edu-detail">{edu.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
