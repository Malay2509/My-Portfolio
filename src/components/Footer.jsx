import { ArrowUp } from 'lucide-react'
import Logo from './Logo'
import { personal } from '../data'

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          <a href="#hero" onClick={e => { e.preventDefault(); scrollTop() }} className="nav-logo">
            <Logo />
          </a>
          <p className="footer-tagline">Building modern backend services &amp; scalable web applications.</p>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2026 {personal.name}. All rights reserved.</p>
          
          <div className="footer-socials">
            {personal.social.github && (
              <a
                href={personal.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                GitHub
              </a>
            )}
            {personal.social.linkedin && (
              <a
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                LinkedIn
              </a>
            )}
          </div>

          <button onClick={scrollTop} className="back-to-top" aria-label="Back to top">
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}
