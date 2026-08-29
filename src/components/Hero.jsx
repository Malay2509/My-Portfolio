import { useState, useEffect } from 'react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { personal } from '../data'

const CODE_LINES = [
  'const developer = {',
  '  name: "Malay Singh Bisht",',
  '  role: "Full-Stack + Backend",',
  '  college: "SGSITS Indore",',
  '  stack: ["React", "Node", "Java"],',
  '  openTo: "new opportunities",',
  '  hire: () => "Let\'s build! 🚀"',
  '};',
]

function TypewriterText({ phrases }) {
  const [pIdx, setPIdx]     = useState(0)
  const [cIdx, setCIdx]     = useState(0)
  const [deleting, setDel]  = useState(false)

  useEffect(() => {
    const current = phrases[pIdx]
    let timer
    if (!deleting) {
      if (cIdx < current.length) {
        timer = setTimeout(() => setCIdx(c => c + 1), 70)
      } else {
        timer = setTimeout(() => setDel(true), 1800)
      }
    } else {
      if (cIdx > 0) {
        timer = setTimeout(() => setCIdx(c => c - 1), 40)
      } else {
        setDel(false)
        setPIdx(p => (p + 1) % phrases.length)
      }
    }
    return () => clearTimeout(timer)
  }, [cIdx, deleting, pIdx, phrases])

  return (
    <span className="typewriter-text">
      {phrases[pIdx].slice(0, cIdx)}
      <span className="typewriter-cursor">|</span>
    </span>
  )
}

function CodeWindow() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(v => {
        if (v >= CODE_LINES.length) { clearInterval(timer); return v }
        return v + 1
      })
    }, 280)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="code-window">
      <div className="code-window-header">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="code-window-title">malay.config.ts</span>
      </div>
      <div className="code-window-body">
        {CODE_LINES.slice(0, visibleLines).map((line, li) => (
          <div key={li}>{line}</div>
        ))}
        {visibleLines < CODE_LINES.length && (
          <span className="typewriter-cursor">▋</span>
        )}
      </div>
    </div>
  )
}

export default function Hero() {
  const handleScrollToProjects = (e) => {
    e.preventDefault()
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScrollToContact = (e) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-anim" />
      
      <div className="hero-container">
        {/* Left column */}
        <div className="hero-content" style={{ textAlign: 'left' }}>
          <div className="hero-badge">
            <span className="badge-dot" />
            <span>{personal.status}</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">{personal.shortName}</span> 👋
          </h1>

          <div className="hero-typewriter">
            I build <TypewriterText phrases={personal.typewriterPhrases} />
          </div>

          <p className="hero-desc">
            A B.Tech IT graduate from <strong style={{ color: 'var(--text-primary)' }}>SGSITS, Indore</strong>, specializing in Full-Stack Web Development and Backend Engineering.
          </p>

          <div className="hero-actions">
            <a href="#projects" onClick={handleScrollToProjects} className="btn btn-primary">
              View My Work →
            </a>
            <a href="#contact" onClick={handleScrollToContact} className="btn btn-secondary">
              Let's Connect
            </a>
            <a
              href={personal.resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Resume
            </a>
          </div>

          {/* Socials */}
          <div className="hero-socials">
            {personal.social.github && (
              <a
                href={personal.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </a>
            )}
            {personal.social.linkedin && (
              <a
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
            )}
            <a
              href={`mailto:${personal.email}`}
              className="social-link"
              aria-label="Email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
          </div>
        </div>

        {/* Right column */}
        <div className="hero-visual">
          <CodeWindow />
          <div className="floating-tech-tag tag-1">React.js</div>
          <div className="floating-tech-tag tag-2">Node.js</div>
          <div className="floating-tech-tag tag-3">Postman 🚀</div>
          <div className="floating-tech-tag tag-4">Docker 🐳</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>
    </section>
  )
}
