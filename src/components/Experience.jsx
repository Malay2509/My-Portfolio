import { experience } from '../data'

export default function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Journey</span>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">My professional internships and backend development roles in industry and open-source.</p>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {experience.map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <p className="timeline-company">{exp.company} · {exp.location}</p>
                  </div>
                  <span className="timeline-date">{exp.period}</span>
                </div>

                <ul className="timeline-bullets">
                  {exp.bullets.map((bullet, bi) => (
                    <li key={bi}>{bullet}</li>
                  ))}
                </ul>

                <div className="timeline-tags">
                  {exp.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
