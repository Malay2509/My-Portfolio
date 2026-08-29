import { useState, useEffect, useRef } from 'react'

export default function Logo() {
  const [showTooltip, setShowTooltip] = useState(false)
  const containerRef = useRef(null)

  // Handle click outside to close the tooltip (especially on mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowTooltip(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <span
      ref={containerRef}
      className="logo-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        // Toggle on click
        setShowTooltip(prev => !prev)
      }}
    >
      <span className="logo-bracket">&lt;</span>
      <span>MSB</span>
      <span className="logo-bracket">/&gt;</span>
      
      {showTooltip && (
        <span className="logo-tooltip" onClick={e => e.stopPropagation()}>
          <span className="tooltip-name">Malay Singh Bisht</span>
          <span className="tooltip-pun">The Most Significant Bit ⚡</span>
        </span>
      )}
    </span>
  )
}
