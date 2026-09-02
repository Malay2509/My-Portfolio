import { useState, useEffect } from 'react'
import MalayGame from './game/MalayGame'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import Stats         from './components/Stats'
import About         from './components/About'
import Skills        from './components/Skills'
import Projects      from './components/Projects'
import Experience    from './components/Experience'
import Education     from './components/Education'
import Certifications from './components/Certifications'
import Blog          from './components/Blog'
import Contact       from './components/Contact'
import Footer        from './components/Footer'

export default function App() {
  const [gameOpen, setGameOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) return savedTheme
      return 'light' // default to light mode
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div>
      <Navbar theme={theme} toggleTheme={toggleTheme} onGameOpen={() => setGameOpen(true)} />
      <main>
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Blog />
        <Contact />
      </main>
      <Footer />

      {/* ── MALAY.EXE Easter Egg Game Overlay ── */}
      {gameOpen && <MalayGame onClose={() => setGameOpen(false)} />}
    </div>
  )
}
