import { useState, useEffect } from 'react'
import Logo from './Logo'
import { personal } from '../data'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar({ theme, toggleTheme, onGameOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(`#${e.target.id}`)),
      { threshold: 0.35 }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const ThemeToggleBtn = () => (
    <button
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        color: 'var(--text-secondary)',
        borderRadius: 'var(--radius-sm)',
        transition: 'var(--transition)'
      }}
      className="theme-toggle-button"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <a
          href="#hero"
          onClick={e => handleNav(e, '#hero')}
          className="nav-logo"
        >
          <Logo />
        </a>

        {/* Links */}
        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={e => handleNav(e, l.href)}
                className={active === l.href ? 'active' : ''}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="nav-mobile-resume-item">
            <a
              href={personal.resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-resume-btn nav-resume-btn-mobile"
            >
              Resume ↗
            </a>
          </li>
        </ul>

        {/* Action Controls: Theme + Prominent Resume + Easter Egg */}
        <div className="nav-actions">
          <div className="desktop-theme-toggle">
            <ThemeToggleBtn />
          </div>

          <a
            href={personal.resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-resume-btn desktop-resume-btn"
            id="nav-resume-btn"
          >
            Resume ↗
          </a>

          {onGameOpen && (
            <button
              className="mg-nav-trigger"
              onClick={onGameOpen}
              title="Click to play MALAY.EXE easter egg game"
              aria-label="Play MALAY.EXE easter egg game"
              id="mg-nav-trigger-btn"
            >
              <span className="mg-nav-trigger-icon">🎮</span>
              <span className="mg-nav-trigger-text">.EXE</span>
            </button>
          )}

          {/* Hamburger on Mobile */}
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Embedded Navbar Styles */}
      <style>{`
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: 12px;
        }

        .nav-resume-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: linear-gradient(135deg, #4F6EF6 0%, #7C3AED 100%) !important;
          color: #ffffff !important;
          font-family: inherit;
          font-size: 0.92rem !important;
          font-weight: 700 !important;
          padding: 9px 20px !important;
          border-radius: 8px !important;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 18px rgba(79, 110, 246, 0.45);
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          text-decoration: none !important;
          white-space: nowrap;
          cursor: pointer;
        }

        .nav-resume-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 26px rgba(79, 110, 246, 0.65);
          color: #ffffff !important;
        }

        .nav-mobile-resume-item {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-resume-btn {
            display: none !important;
          }
          .nav-mobile-resume-item {
            display: block !important;
            width: 100%;
            margin-top: 10px;
          }
          .nav-resume-btn-mobile {
            width: 100%;
            padding: 12px !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </nav>
  )
}
