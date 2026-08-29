import { certifications } from '../data'

export default function Certifications() {
  return (
    <section id="certifications" className="section certifications-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Credentials</span>
          <h2 className="section-title">Certifications &amp; Courses</h2>
          <p className="section-subtitle">Verified professional developer certificates and continuous learning achievements.</p>
        </div>

        {/* Grid layout */}
        <div className="certs-grid">
          {certifications.map((cert, i) => (
            <div key={i} className="cert-card">
              <div className="cert-ribbon">{cert.ribbon}</div>
              <h4 className="cert-name">{cert.name}</h4>
              <p className="cert-issuer">{cert.issuer}</p>
              <span className="cert-year">{cert.year}</span>
              {cert.link && cert.link !== '#' && (
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-verify">
                  View Certificate →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
