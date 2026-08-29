import { useState, useEffect } from 'react'
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
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) return savedTheme
      return 'dark' // default to dark
    }
    return 'dark'
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
      <Navbar theme={theme} toggleTheme={toggleTheme} />
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
    </div>
  )
}
