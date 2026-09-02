// =======================================================
//  MalayGame.jsx — Floating Window Easter Egg Game  v3
//
//  MODES:
//   windowed  — floating 560×380px window over portfolio (default)
//   fullscreen — takes entire viewport
//   collapsed  — only titlebar shows (like a taskbar widget)
//
//  Draggable by titlebar. macOS-style traffic light controls.
//  Mobile always goes fullscreen.
// =======================================================
import { useState, useEffect, useRef, useCallback } from 'react'
import malayFaceUrl from '../assets/malay-face.png'
import run1Url from '../assets/game/player-run-1.png'
import run2Url from '../assets/game/player-run-2.png'
import run3Url from '../assets/game/player-run-3.png'
import run4Url from '../assets/game/player-run-4.png'
import run5Url from '../assets/game/player-run-5.png'
import run6Url from '../assets/game/player-run-6.png'
import punch1Url from '../assets/game/player-punch-1.png'
import punch2Url from '../assets/game/player-punch-2.png'
import punch3Url from '../assets/game/player-punch-3.png'
import punch4Url from '../assets/game/player-punch-4.png'
import { initGame } from './gameEngine'
import './game.css'

const WIN_W        = 560
const WIN_H        = 450
const TITLEBAR_H   = 40
const CANVAS_H     = WIN_H - TITLEBAR_H   // 410

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

const isMobileWidth = () =>
  typeof window !== 'undefined' && window.innerWidth < 768

// Boot terminal lines
const BOOT_LINES = [
  { delay: 150,  text: 'Scanning portfolio for bugs...',    ok: 'FOUND'  },
  { delay: 550,  text: 'Loading MALAY.EXE runtime...',      ok: 'OK'     },
  { delay: 950,  text: 'Compiling stickman physics...',     ok: 'OK'     },
  { delay: 1350, text: 'Importing CORS errors to fight...', ok: 'READY'  },
]
const BOOT_TOTAL = 2100

// Status badge text per phase
const PHASE_STATUS = {
  boot:     'INIT',
  menu:     'READY',
  playing:  'RUNNING',
  gameover: 'CRASHED',
}

export default function MalayGame({ onClose }) {
  const [phase, setPhase]       = useState('boot')
  const [bootDone, setBootDone] = useState([])
  const [glitch, setGlitch]     = useState(false)
  const [gameOverData, setGO]   = useState(null)
  const [winMode, setWinMode]   = useState('windowed')  // windowed | fullscreen | collapsed
  const [isTouch, setIsTouch]   = useState(false)

  // Window position state (for windowed mode)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const canvasRef        = useRef(null)
  const containerRef     = useRef(null)
  const engineRef        = useRef(null)
  const faceImgRef       = useRef(null)
  const playerSpritesRef = useRef({ run: [], punch: [] })
  const dragging         = useRef(false)
  const dragOff          = useRef({ x: 0, y: 0 })
  const winModeRef       = useRef(winMode)

  // Keep ref in sync
  useEffect(() => { winModeRef.current = winMode }, [winMode])

  // ── Mount: set initial position, touch, load assets ───
  useEffect(() => {
    const touch = isTouchDevice()
    setIsTouch(touch)

    // On mobile → always fullscreen
    if (isMobileWidth() || touch) {
      setWinMode('fullscreen')
    } else {
      // Position centered on screen
      setPos({
        x: Math.max(20, Math.round((window.innerWidth  - WIN_W) / 2)),
        y: Math.max(20, Math.round((window.innerHeight - WIN_H) / 2)),
      })
    }

    // Load face image
    const img = new Image()
    img.src = malayFaceUrl
    img.onload  = () => { faceImgRef.current = img }
    img.onerror = () => { faceImgRef.current = null }

    // Load player sprite frames
    const runUrls = [run1Url, run2Url, run3Url, run4Url, run5Url, run6Url]
    const punchUrls = [punch1Url, punch2Url, punch3Url, punch4Url]

    playerSpritesRef.current = {
      run: runUrls.map(url => { const i = new Image(); i.src = url; return i }),
      punch: punchUrls.map(url => { const i = new Image(); i.src = url; return i }),
    }
  }, [])

  // ── Boot sequence ─────────────────────────────────────
  useEffect(() => {
    if (phase !== 'boot') return
    const g = setTimeout(() => setGlitch(true), 80)
    const timers = BOOT_LINES.map(l =>
      setTimeout(() => setBootDone(p => [...p, l]), l.delay)
    )
    const done = setTimeout(() => setPhase('menu'), BOOT_TOTAL)
    return () => { clearTimeout(g); timers.forEach(clearTimeout); clearTimeout(done) }
  }, [phase])

  // ── Keyboard: ESC / R ─────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape') onClose()
      if (e.code === 'KeyR' && phase === 'gameover') handleRestart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, onClose])

  // ── Dragging ──────────────────────────────────────────
  const onTitlePointerDown = useCallback((e) => {
    if (winModeRef.current !== 'windowed') return
    dragging.current = true
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragOff.current = { x: clientX - pos.x, y: clientY - pos.y }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const c = e.touches ? e.touches[0] : e
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - WIN_W,      c.clientX - dragOff.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - TITLEBAR_H, c.clientY - dragOff.current.y)),
      })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('touchmove',  onMove, { passive: false })
    window.addEventListener('touchend',   onUp)
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('touchmove',  onMove)
      window.removeEventListener('touchend',   onUp)
    }
  }, [])

  // ── Window controls ───────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    setWinMode(m => m === 'fullscreen' ? 'windowed' : 'fullscreen')
  }, [])

  const toggleCollapse = useCallback(() => {
    setWinMode(m => m === 'collapsed' ? 'windowed' : 'collapsed')
  }, [])

  // ── Canvas resize when mode changes ──────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || phase !== 'playing') return
    // Let the layout settle, then measure container
    const t = setTimeout(() => {
      canvas.width  = container.clientWidth
      canvas.height = container.clientHeight
    }, 50)
    return () => clearTimeout(t)
  }, [winMode, phase])

  // ── Game start / restart / hire ───────────────────────
  const handleStart   = useCallback(() => { setGO(null); setPhase('playing') }, [])
  const handleRestart = useCallback(() => { setGO(null); setPhase('playing') }, [])
  const handleHireMe  = useCallback(() => {
    onClose()
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [onClose])

  // ── Engine lifecycle ──────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      canvas.width  = container.clientWidth
      canvas.height = container.clientHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const engine = initGame(canvas, faceImgRef.current, {
      onGameOver: (data) => { setGO(data); setPhase('gameover') },
    }, playerSpritesRef.current)
    engineRef.current = engine

    return () => {
      engine.cleanup()
      engineRef.current = null
      window.removeEventListener('resize', resize)
    }
  }, [phase])

  const handleJump  = useCallback(() => engineRef.current?.mobileJump(),  [])
  const handlePunch = useCallback(() => engineRef.current?.mobilePunch(), [])

  // ── Derived styles ────────────────────────────────────
  const isFullscreen = winMode === 'fullscreen'
  const isCollapsed  = winMode === 'collapsed'

  // ── RENDER ───────────────────────────────────────────
  return (
    <>
      {/* Backdrop: only in fullscreen — lets portfolio show through in windowed mode */}
      {isFullscreen && <div className="mg-backdrop" onClick={onClose} />}

      {/* The game window */}
      <div
        className={`mg-window mg-window-${winMode}`}
        style={
          !isFullscreen
            ? { left: pos.x, top: pos.y, cursor: dragging.current ? 'grabbing' : 'default' }
            : {}
        }
        role="dialog"
        aria-label="MALAY.EXE"
      >

        {/* ── TITLE BAR ──────────────────────────────── */}
        <div
          className="mg-titlebar"
          onMouseDown={onTitlePointerDown}
          onTouchStart={onTitlePointerDown}
          style={{ cursor: isFullscreen ? 'default' : 'grab' }}
        >
          {/* Traffic lights */}
          <div className="mg-traffic">
            <button className="mg-tl mg-tl-red"    onClick={onClose}         title="Close"     aria-label="Close game" />
            <button className="mg-tl mg-tl-yellow" onClick={toggleCollapse}  title="Collapse"  aria-label="Collapse window" />
            <button className="mg-tl mg-tl-green"  onClick={toggleFullscreen} title={isFullscreen ? 'Restore' : 'Fullscreen'} aria-label="Toggle fullscreen" />
          </div>

          <span className="mg-titlebar-title">
            <span className="mg-titlebar-icon">🎮</span>
            MALAY.EXE
          </span>

          <span className={`mg-titlebar-status mg-status-${phase}`}>
            {PHASE_STATUS[phase] || phase.toUpperCase()}
          </span>
        </div>

        {/* ── WINDOW BODY (hidden when collapsed) ───── */}
        {!isCollapsed && (
          <div className="mg-window-body">

            {/* Boot screen */}
            {phase === 'boot' && (
              <div className="mg-boot">
                <div className={`mg-boot-title ${glitch ? 'mg-glitch-active' : ''}`}>
                  MALAY.EXE
                </div>
                <div className="mg-boot-sub">v2.0 — Debug Runner · {WIN_W}×{WIN_H}</div>
                <div className="mg-boot-lines">
                  {bootDone.map((l, i) => (
                    <div key={i} className="mg-boot-line">
                      <span className="mg-boot-prefix">$</span>
                      <span className="mg-boot-text">{l.text}</span>
                      {i < bootDone.length - 1
                        ? <span className={`mg-boot-ok ${l.ok === 'FOUND' ? 'mg-ok-warn' : ''}`}>[{l.ok}]</span>
                        : <span className="mg-boot-ok mg-cursor-blink" />
                      }
                    </div>
                  ))}
                </div>
                <div className="mg-boot-progress"><div className="mg-boot-bar" /></div>
              </div>
            )}

            {/* Menu screen */}
            {phase === 'menu' && (
              <div className="mg-menu">
                <div className="mg-menu-eyebrow">// Easter Egg Unlocked</div>
                <div className="mg-menu-title">
                  <span className="mg-title-main">MALAY</span>
                  <span className="mg-title-sub">.EXE</span>
                </div>
                <p className="mg-menu-tag">Beat bugs · Collect tech · Survive the deadline</p>

                <div className="mg-ctrl-panel">
                  <div className="mg-ctrl-row"><span className="mg-key">SPACE</span><span>Jump</span></div>
                  <div className="mg-ctrl-row"><span className="mg-key">F</span><span>Punch 👊</span></div>
                  <div className="mg-ctrl-row"><span className="mg-key">ESC</span><span>Close</span></div>
                  <div className="mg-ctrl-row"><span className="mg-key">R</span><span>Restart</span></div>
                </div>

                <button className="mg-start-btn" onClick={handleStart} id="mg-start-game-btn">
                  ▶  Initialize Game
                </button>

                <p className="mg-menu-hint">// recruiter.exe is watching</p>
              </div>
            )}

            {/* Canvas — always mounted when playing or gameover */}
            <div
              ref={containerRef}
              className="mg-canvas-container"
              style={{ display: (phase === 'playing' || phase === 'gameover') ? 'block' : 'none' }}
            >
              <canvas ref={canvasRef} className="mg-canvas" />
            </div>

            {/* Game over */}
            {phase === 'gameover' && gameOverData && (
              <div className="mg-gameover">
                <div className="mg-go-badge">// PROCESS TERMINATED</div>
                <div className="mg-go-title">CRASHED</div>
                <div className="mg-go-sub">segmentation fault · core dumped</div>

                <div className="mg-go-stats">
                  <div className="mg-stat-row">
                    <span>Score</span>
                    <span className="mg-stat-val">{gameOverData.score.toLocaleString()}</span>
                  </div>
                  <div className="mg-stat-row">
                    <span>Bugs Squashed 🐛</span>
                    <span className="mg-stat-val">{gameOverData.bugsDefeated}</span>
                  </div>
                  <div className="mg-stat-row">
                    <span>Tech Mastered ⚡</span>
                    <span className="mg-stat-val">{gameOverData.techCollected}</span>
                  </div>
                </div>

                <div className="mg-hire-card">
                  <div className="mg-hire-badge">🚀 RECRUITER VERDICT</div>
                  <p className="mg-hire-headline">
                    Malay squashed <strong>{gameOverData.bugsDefeated} bugs</strong> & collected <strong>{gameOverData.techCollected} tech stacks</strong>!
                  </p>
                  <p className="mg-hire-sub">
                    He punches CORS & 500 errors, masters modern web tech, and ships under pressure. Ready to level up your team?
                  </p>
                </div>

                <div className="mg-go-btns">
                  <button id="mg-restart-btn" className="mg-btn mg-btn-primary" onClick={handleRestart}>
                    ▶ Restart
                  </button>
                  <button id="mg-hire-btn" className="mg-btn mg-btn-hire" onClick={handleHireMe}>
                    💼 Hire Malay
                  </button>
                  <button id="mg-back-btn" className="mg-btn mg-btn-ghost" onClick={onClose}>
                    Exit
                  </button>
                </div>

                <p className="mg-go-hint">press R to restart</p>
              </div>
            )}

            {/* Mobile controls */}
            {phase === 'playing' && isTouch && (
              <div className="mg-mobile-ctrls">
                <button className="mg-mob-btn" onTouchStart={e => { e.preventDefault(); handleJump() }} onClick={handleJump} id="mg-jump-btn">↑ JUMP</button>
                <button className="mg-mob-btn mg-mob-punch" onTouchStart={e => { e.preventDefault(); handlePunch() }} onClick={handlePunch} id="mg-punch-btn">👊 PUNCH</button>
              </div>
            )}

          </div>
        )}

        {/* Collapsed label */}
        {isCollapsed && (
          <button className="mg-collapsed-restore" onClick={toggleCollapse}>
            Click to restore game
          </button>
        )}

      </div>
    </>
  )
}
