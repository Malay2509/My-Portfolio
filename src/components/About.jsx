import { Check } from 'lucide-react'
import { personal } from '../data'

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Intro</span>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">A brief overview of who I am, my academic background, and what drives me as a software developer.</p>
        </div>

        <div className="about-grid">
          {/* Left Column */}
          <div className="about-image-wrapper">
            <div className="about-image-frame">
              {personal.photo ? (
                <img
                  src={personal.photo}
                  alt={personal.photoAlt}
                  className="profile-photo"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : null}
              {/* Fallback avatar placeholder */}
              <div className="about-avatar" style={{ display: personal.photo ? 'none' : 'flex' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="photo-placeholder-label">Add Your Photo</span>
              </div>
            </div>

            {/* Floating availability card */}
            <div className="about-floating-card card-availability">
              <div className="card-dot" />
              <div>
                <p className="card-label">Status</p>
                <p className="card-value">Available for hire</p>
              </div>
            </div>

            {/* Floating location card */}
            <div className="about-floating-card card-location">
              <div className="card-dot" style={{ backgroundColor: 'var(--primary)' }} />
              <div>
                <p className="card-label">Location</p>
                <p className="card-value">Indore, India</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="about-content" style={{ textAlign: 'left' }}>
            <h3 className="about-greeting">
              Recent B.Tech IT Graduate from <span className="gradient-text">SGSITS, Indore</span>
            </h3>
            
            {personal.about.map((para, i) => (
              <p
                key={i}
                className="about-text"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}

            {/* Highlights checkboxes */}
            <div className="about-highlights">
              {personal.highlights.map(h => (
                <div key={h} className="highlight-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="about-cta">
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn btn-primary"
              >
                Let's Work Together
              </a>
              <a
                href={personal.resumeFile}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
