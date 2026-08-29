import { useState } from 'react'
import { GithubIcon } from './BrandIcons'
import { projects } from '../data'

export default function Projects() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">A showcase of full-stack platforms, backend microservices, and databases I have built.</p>
        </div>

        {/* Filter buttons */}
        <div className="projects-filter">
          {['all', 'fullstack', 'backend', 'frontend'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
            >
              {f === 'all' ? 'All Projects' : f === 'fullstack' ? 'Full Stack' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filtered.map(p => (
            <div
              key={p.title}
              className={`project-card ${p.featured ? 'featured' : ''}`}
            >
              {p.featured && (
                <div className="project-badge">⭐ Featured</div>
              )}
              
              <div className="project-card-inner">
                <div className="project-header">
                  <div className="project-icon">{p.icon}</div>
                  <div className="project-links">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label="GitHub Repository"
                      >
                        <GithubIcon size={16} />
                      </a>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label="Live Demo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>

                <div className="project-tags">
                  {p.tags.map(t => (
                    <span key={t} className="tag">
                      {t}
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
