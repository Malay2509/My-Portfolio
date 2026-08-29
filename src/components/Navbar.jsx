import { useState, useEffect } from 'react'
import Logo from './Logo'
import { personal } from '../data'

const NAV_LINKS = [
  { href: '#about',          label: 'About' },
  { href: '#skills',         label: 'Skills' },
  { href: '#projects',       label: 'Projects' },
  { href: '#experience',     label: 'Experience' },
  { href: '#education',      label: 'Education' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#blog',           label: 'Blog' },
  { href: '#contact',        label: 'Contact' },
]

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive]       = useState('')

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
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
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
          <li style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}>
            <ThemeToggleBtn />
          </li>
          <li className="nav-resume-item">
            <a
              href={personal.resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ color: '#fff', marginLeft: '6px' }}
            >
              Resume ↗
            </a>
          </li>
        </ul>

        {/* Toggle + Hamburger on Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-controls">
          <div className="mobile-theme-btn-wrap" style={{ display: 'none' }}>
            <ThemeToggleBtn />
          </div>
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
      
      {/* CSS overrides to show toggle on mobile next to hamburger */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-theme-btn-wrap { display: block !important; }
          .nav-links .theme-toggle-button { display: none !important; }
          .nav-resume-item { margin-top: 8px; width: 100%; }
          .nav-resume-item .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </nav>
  )
}
