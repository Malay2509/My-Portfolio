// =======================================================
//  gameEngine.js — MALAY.EXE Game Engine v2
//  Added: screen shake, particle bursts, parallax BG layers,
//         better stickman, glowing enemies, polished HUD
// =======================================================

const GRAVITY       = 0.58
const JUMP_STRENGTH = -14
const GROUND_OFFSET = 78    // px from canvas bottom (works for both windowed & fullscreen)
const PLAYER_X      = 110
const HUD_H         = 44
const ANIM_INTERVAL = 8

// ── ENEMY DEFINITIONS ────────────────────────────────────
const ENEMY_DEFS = [
  { label: '🐛  BUG',        color: '#FF5555', glowColor: 'rgba(255,85,85,0.4)',   speed: 2.6, points: 100, w: 68,  h: 46,  msg: 'Bug squashed! 🐛\nSo satisfying.' },
  { label: '404',            color: '#FF7A35', glowColor: 'rgba(255,122,53,0.4)',  speed: 3.5, points: 150, w: 62,  h: 54,  msg: '404 NOT FOUND\n...but you found it.' },
  { label: '500',            color: '#FF2255', glowColor: 'rgba(255,34,85,0.4)',   speed: 2.2, points: 120, w: 62,  h: 54,  msg: '500 INTERNAL ERROR\nEnemy crashed itself.' },
  { label: 'NULL',           color: '#64748B', glowColor: 'rgba(100,116,139,0.3)', speed: 2.0, points: 80,  w: 60,  h: 30,  msg: 'NullPointerException\navoided! Great jump.' },
  { label: 'CORS',           color: '#F59E0B', glowColor: 'rgba(245,158,11,0.4)',  speed: 3.0, points: 130, w: 72,  h: 54,  msg: 'CORS ERROR\nOrigin: allowed. 🎉' },
  { label: 'MERGE\nCONFLICT',color: '#A855F7', glowColor: 'rgba(168,85,247,0.4)', speed: 2.0, points: 200, w: 80,  h: 60,  msg: 'Merge conflict resolved!\n(This never happens IRL)' },
  { label: 'MEMORY\nLEAK',   color: '#06B6D4', glowColor: 'rgba(6,182,212,0.4)',   speed: 1.6, points: 180, w: 80,  h: 60,  msg: 'Garbage collected! 🗑\nHeap freed.' },
  { label: 'DEADLINE',       color: '#FF0055', glowColor: 'rgba(255,0,85,0.5)',    speed: 5.5, points: 350, w: 90,  h: 56,  msg: 'Shipped on time.\n(This never happens either)' },
]

// ── COLLECTIBLE DEFINITIONS ───────────────────────────────
const COLLECT_DEFS = [
  { label: 'JAVA',        points: 100, color: '#F89820', msg: 'JAVA acquired ☕\n+100' },
  { label: 'SPRING BOOT', points: 150, color: '#6DB33F', msg: 'SPRING BOOT loaded 🍃\n+150' },
  { label: 'SQL',         points: 120, color: '#336791', msg: 'SQL optimised 🐘\n+120' },
  { label: 'DOCKER',      points: 200, color: '#2496ED', msg: 'DOCKER containerised 🐳\n+200' },
  { label: 'AWS',         points: 180, color: '#FF9900', msg: 'Deployed to AWS ☁\n+180' },
  { label: 'AI',          points: 250, color: '#8B5CF6', msg: 'AI acquired 🤖\nYou are 10× now.' },
  { label: 'REACT',       points: 100, color: '#61DAFB', msg: 'REACT renders ⚛\n+100' },
]

// ── PARALLAX BG LAYERS ────────────────────────────────────
const BG_CODES = [
  'const dev = new Malay()',
  'git push -f origin main',
  'docker build -t malay .',
  'SELECT * FROM opportunities',
  'npm install --save-dev life',
  'throw new HireException()',
  '// TODO: get hired',
  'console.log("hire me")',
  'return 200 // ok',
  'catch (e) { hustle() }',
]

// ── HELPERS ───────────────────────────────────────────────
function rRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// ── MAIN ─────────────────────────────────────────────────
export function initGame(canvas, faceImg, callbacks, playerSprites) {
  const ctx = canvas.getContext('2d')
  let running = true
  let raf     = null
  let gameOverFired = false

  function groundY() { return canvas.height - GROUND_OFFSET }

  // ── STATE ──────────────────────────────────────────────
  const gs = {
    score:        0,
    hp:           3,
    bugsDefeated: 0,
    techCollected:0,
    tick:         0,
    animFrame:    0,
    animTimer:    0,
    worldX:       0,
    speedMult:    1,
    enemyTimer:   160,
    collectTimer: 260,
    player: {
      x: PLAYER_X, y: 0, vy: 0,
      isJumping: false, isPunching: false,
      punchTimer: 0, punchProgress: 0, punchCooldown: 0, invincible: 0,
    },
    enemies:     [],
    collectibles:[],
    particles:   [],
    shockwaves:  [],
    hitEffects:  [],
    messages:    [],
    shake:       { x: 0, y: 0, trauma: 0 },
    // Parallax floating code strings
    bgCodes: Array.from({ length: 8 }, (_, i) => ({
      text:  BG_CODES[i % BG_CODES.length],
      x:     Math.random() * 1200,
      y:     40 + Math.random() * 400,
      speed: 0.3 + Math.random() * 0.4,
      alpha: 0.03 + Math.random() * 0.04,
      size:  10 + Math.random() * 4,
    })),
  }

  gs.player.y = groundY()

  // ── INPUT ──────────────────────────────────────────────
  let jumpQueued  = false
  let punchQueued = false

  function onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jumpQueued = true }
    if (e.code === 'KeyF'  || e.code === 'KeyZ')    punchQueued = true
  }
  window.addEventListener('keydown', onKeyDown)

  const mobileJump  = () => { jumpQueued  = true }
  const mobilePunch = () => { punchQueued = true }

  // ── SCREEN SHAKE ───────────────────────────────────────
  function addShake(trauma) {
    gs.shake.trauma = Math.min(1, gs.shake.trauma + trauma)
  }

  function updateShake() {
    if (gs.shake.trauma <= 0) { gs.shake.x = 0; gs.shake.y = 0; return }
    const t = gs.shake.trauma
    gs.shake.x = (Math.random() * 2 - 1) * 12 * t * t
    gs.shake.y = (Math.random() * 2 - 1) * 8  * t * t
    gs.shake.trauma = Math.max(0, gs.shake.trauma - 0.045)
  }

  // ── PARTICLES ──────────────────────────────────────────
  function burst(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const spd   = 2 + Math.random() * 4
      gs.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 2,
        life: 35 + Math.random() * 20,
        maxLife: 55,
        color,
        r: 2 + Math.random() * 3,
      })
    }
  }

  // ── EFFECTS ────────────────────────────────────────────
  function addEffect(x, y, text, color) {
    gs.hitEffects.push({ x, y, text, color, life: 60, vy: -1.6 })
  }
  function showMessage(text) {
    gs.messages.push({ text, life: 160 })
    if (gs.messages.length > 2) gs.messages.shift()
  }

  // ── SPAWN ──────────────────────────────────────────────
  function spawnEnemy() {
    const def = ENEMY_DEFS[Math.floor(Math.random() * ENEMY_DEFS.length)]
    gs.enemies.push({
      ...def,
      x: canvas.width + 30,
      y: groundY() - def.h,
      id: gs.tick,
    })
  }
  function spawnCollectible() {
    const def = COLLECT_DEFS[Math.floor(Math.random() * COLLECT_DEFS.length)]
    // Height proportional to canvas — reachable in both windowed (340px) and fullscreen
    const gy = groundY()
    const jumpReach = 155   // approx px player can jump
    const minFromGround = 45
    const maxFromGround = Math.min(jumpReach - 20, gy - HUD_H - 30)
    gs.collectibles.push({
      ...def,
      x:        canvas.width + 30,
      y:        gy - minFromGround - Math.random() * (maxFromGround - minFromGround),
      bobPhase: Math.random() * Math.PI * 2,
      id:       gs.tick,
    })
  }

  // ── UPDATE ─────────────────────────────────────────────
  function update() {
    if (!running) return
    const p  = gs.player
    const gy = groundY()
    gs.tick++

    // Difficulty ramp
    if (gs.tick % 420 === 0) gs.speedMult = Math.min(2.6, gs.speedMult + 0.12)

    // Passive score
    if (gs.tick % 2 === 0) gs.score++

    // Animation
    gs.animTimer++
    if (gs.animTimer >= ANIM_INTERVAL) { gs.animTimer = 0; gs.animFrame ^= 1 }

    // World scroll
    gs.worldX -= 3.4 * gs.speedMult

    // BG codes
    gs.bgCodes.forEach(c => {
      c.x -= c.speed * gs.speedMult
      if (c.x < -400) { c.x = canvas.width + 50; c.text = BG_CODES[Math.floor(Math.random() * BG_CODES.length)] }
    })

    // Shake
    updateShake()

    // ── Jump ───
    if (jumpQueued && !p.isJumping) { p.vy = JUMP_STRENGTH; p.isJumping = true }
    jumpQueued = false

    // ── Punch ──
    if (punchQueued && p.punchCooldown <= 0) {
      p.isPunching = true; p.punchTimer = 18; p.punchCooldown = 30
      const hx1 = p.x + 8,  hx2 = p.x + 82
      const hy1 = p.y - 75, hy2 = p.y - 8
      gs.enemies = gs.enemies.filter(e => {
        const hit = e.x < hx2 && e.x + e.w > hx1 && e.y < hy2 && e.y + e.h > hy1
        if (hit) {
          addEffect(e.x + e.w / 2, e.y - 14, `+${e.points}`, '#FFD700')
          showMessage(e.msg)
          burst(e.x + e.w / 2, e.y + e.h / 2, e.color, 14)
          gs.score += e.points
          gs.bugsDefeated++
          addShake(0.25)
        }
        return !hit
      })
    }
    punchQueued = false

    if (p.punchTimer    > 0) p.punchTimer--; else p.isPunching = false
    if (p.punchCooldown > 0) p.punchCooldown--
    if (p.invincible    > 0) p.invincible--

    // ── Physics ──
    p.vy += GRAVITY
    p.y  += p.vy
    if (p.y >= gy) { p.y = gy; p.vy = 0; p.isJumping = false }

    // ── Enemies ──
    gs.enemyTimer--
    if (gs.enemyTimer <= 0) {
      spawnEnemy()
      gs.enemyTimer = Math.floor((75 + Math.random() * 110) / gs.speedMult)
    }
    gs.enemies.forEach(e => { e.x -= e.speed * gs.speedMult })

    // Collision
    if (p.invincible <= 0) {
      const px1 = p.x - 10, px2 = p.x + 10
      const py1 = p.y - 70, py2 = p.y - 4
      gs.enemies = gs.enemies.filter(e => {
        const hit = e.x < px2 && e.x + e.w > px1 && e.y < py2 && e.y + e.h > py1
        if (hit) {
          gs.hp--; p.invincible = 90
          addEffect(p.x, p.y - 90, '-1', '#FF4444')
          burst(p.x, p.y - 40, '#FF4444', 8)
          addShake(0.55)
        }
        return !hit
      })
    }
    gs.enemies = gs.enemies.filter(e => e.x + e.w > -80)

    // ── Collectibles ──
    gs.collectTimer--
    if (gs.collectTimer <= 0) {
      spawnCollectible()
      gs.collectTimer = Math.floor(200 + Math.random() * 140)
    }
    gs.collectibles = gs.collectibles.filter(c => {
      c.bobPhase += 0.055
      c.x -= 2.4 * gs.speedMult
      const hit = c.x < p.x + 22 && c.x + 96 > p.x - 22 && c.y < p.y && c.y + 28 > p.y - 95
      if (hit) {
        addEffect(c.x + 48, c.y - 10, `+${c.points} ${c.label}`, c.color)
        showMessage(c.msg)
        burst(c.x + 48, c.y + 14, c.color, 10)
        gs.score += c.points; gs.techCollected++
        return false
      }
      return c.x + 120 > -80
    })

    // ── Shockwaves ──
    gs.shockwaves.forEach(s => { s.r += (s.maxR - s.r) * 0.35; s.life-- })
    gs.shockwaves = gs.shockwaves.filter(s => s.life > 0)

    // ── Particles ──
    gs.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      p.vy += 0.18
      p.life--
    })
    gs.particles = gs.particles.filter(p => p.life > 0)

    // ── Hit effects ──
    gs.hitEffects.forEach(h => { h.y += h.vy; h.life-- })
    gs.hitEffects = gs.hitEffects.filter(h => h.life > 0)
    gs.messages.forEach(m => m.life--)
    gs.messages = gs.messages.filter(m => m.life > 0)

    // ── Game over ──
    if (gs.hp <= 0 && !gameOverFired) {
      gameOverFired = true; running = false
      cancelAnimationFrame(raf)
      setTimeout(() => callbacks.onGameOver({
        score: gs.score, bugsDefeated: gs.bugsDefeated, techCollected: gs.techCollected,
      }), 400)
    }
  }

  // ── DRAW FUNCTIONS ─────────────────────────────────────

  function drawBackground(w, h, gy) {
    // Dark gradient bg
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
    bgGrad.addColorStop(0, '#04080f')
    bgGrad.addColorStop(0.7, '#060c18')
    bgGrad.addColorStop(1, '#04080f')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Parallax floating code strings
    ctx.save()
    ctx.font = '12px "JetBrains Mono", monospace'
    ctx.textBaseline = 'top'
    gs.bgCodes.forEach(c => {
      ctx.globalAlpha = c.alpha
      ctx.fillStyle   = '#4F6EF6'
      ctx.fillText(c.text, c.x, c.y)
    })
    ctx.restore()

    // Dot grid
    ctx.save()
    ctx.fillStyle = 'rgba(79,110,246,0.07)'
    const dotSpacing = 38
    const ox = ((gs.worldX % dotSpacing) + dotSpacing) % dotSpacing
    for (let x = ox; x < w; x += dotSpacing) {
      for (let y = HUD_H + 20; y < gy - 10; y += dotSpacing) {
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill()
      }
    }
    ctx.restore()

    // Ground glow gradient
    const gg = ctx.createLinearGradient(0, gy, 0, h)
    gg.addColorStop(0, 'rgba(79,110,246,0.22)')
    gg.addColorStop(0.5, 'rgba(79,110,246,0.06)')
    gg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gg
    ctx.fillRect(0, gy, w, h - gy)

    // Ground line
    const glGrad = ctx.createLinearGradient(0, 0, w, 0)
    glGrad.addColorStop(0,   'rgba(79,110,246,0)')
    glGrad.addColorStop(0.1, 'rgba(79,110,246,0.8)')
    glGrad.addColorStop(0.9, 'rgba(79,110,246,0.8)')
    glGrad.addColorStop(1,   'rgba(79,110,246,0)')
    ctx.strokeStyle = glGrad; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()

    // Tick marks on ground
    ctx.strokeStyle = 'rgba(79,110,246,0.3)'; ctx.lineWidth = 1
    const tsp = 28
    const tx  = ((gs.worldX % tsp) + tsp) % tsp
    for (let x = tx; x < w; x += tsp) {
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + 8); ctx.stroke()
    }
  }

  function drawPlayer(p) {
    const x = p.x
    const y = p.y
    if (p.invincible > 0 && Math.floor(p.invincible / 5) % 2 === 0) return

    // ── GROUND SHADOW ────────────────────────────────────
    ctx.save()
    const gs2 = ctx.createRadialGradient(x, y + 4, 0, x, y + 4, 22)
    gs2.addColorStop(0, 'rgba(255,255,255,0.18)')
    gs2.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gs2
    ctx.beginPath(); ctx.ellipse(x, y + 4, 22, 5, 0, 0, Math.PI * 2); ctx.fill()
    ctx.restore()

    // Check if custom character sprites are loaded
    const hasRunSprites = playerSprites?.run?.length === 6 && playerSprites.run.every(img => img?.complete && img.naturalWidth > 0)
    const hasPunchSprites = playerSprites?.punch?.length === 4 && playerSprites.punch.every(img => img?.complete && img.naturalWidth > 0)

    if (hasRunSprites && hasPunchSprites) {
      let activeImg = null

      if (p.isPunching) {
        // Punch sequence (p.punchTimer: 18 ticks -> 0)
        // 18..15 (IDLE) -> 14..10 (WIND UP) -> 9..5 (PUNCH) -> 4..0 (RECOVER)
        const pt = p.punchTimer
        let pIndex = 0
        if (pt >= 15)      pIndex = 0
        else if (pt >= 10) pIndex = 1
        else if (pt >= 5)  pIndex = 2
        else               pIndex = 3

        activeImg = playerSprites.punch[pIndex]
      } else {
        // Run sequence: RUN 1 -> RUN 2 -> RUN 3 -> RUN 4 -> RUN 5 -> RUN 6 -> repeat
        // 6 ticks per frame (~100ms per frame)
        const runIndex = Math.floor(gs.tick / 6) % 6
        activeImg = playerSprites.run[runIndex]
      }

      if (activeImg) {
        // Scale sprite so character height is ~112px
        const renderH = 112
        const scale   = renderH / 380.0
        const renderW = 340.0 * scale

        // Anchor feet at (x, y). Frame anchor in 340x380 sprite is (170, 365)
        const anchorX = 170.0 * scale
        const anchorY = 365.0 * scale

        const drawX = x - anchorX
        const drawY = y - anchorY

        ctx.save()
        ctx.drawImage(activeImg, drawX, drawY, renderW, renderH)
        ctx.restore()
        return
      }
    }

    // Fallback: procedural rendering if sprites are still loading
    ctx.save()
    ctx.lineCap  = 'round'
    ctx.lineJoin = 'round'
    const WHITE = '#E8F4FD', JOINT = '#CBD5E1', JR = 3.5, headR = 22, LW = 2.2
    const headCY = y - 78, neckB = headCY + headR, sholY = neckB + 10, hipY = sholY + 28
    ctx.strokeStyle = WHITE; ctx.lineWidth = LW + 0.5
    ctx.beginPath(); ctx.moveTo(x, sholY); ctx.lineTo(x, hipY); ctx.stroke()
    ctx.save()
    ctx.beginPath(); ctx.arc(x, headCY, headR, 0, Math.PI * 2)
    if (faceImg?.complete && faceImg.naturalWidth > 0) {
      ctx.clip(); ctx.drawImage(faceImg, x - headR, headCY - headR, headR * 2, headR * 2)
    } else {
      ctx.fillStyle = '#1E293B'; ctx.fill()
    }
    ctx.restore()
    ctx.restore()
  }

  function drawEnemy(e) {
    ctx.save()

    // Outer glow pass
    ctx.shadowColor = e.glowColor; ctx.shadowBlur = 22
    rRect(ctx, e.x, e.y, e.w, e.h, 7)
    ctx.fillStyle = 'rgba(4,8,15,0.95)'; ctx.fill()
    ctx.strokeStyle = e.color; ctx.lineWidth = 2
    ctx.stroke()
    ctx.shadowBlur = 0

    // Animated top accent bar (scanner line)
    const scan = ((gs.tick * 1.5) % (e.h + 10)) - 5
    ctx.fillStyle = e.color
    ctx.globalAlpha = 0.15
    ctx.fillRect(e.x + 2, e.y + scan, e.w - 4, 4)
    ctx.globalAlpha = 1

    // Inner corner brackets
    const ac = 9
    ctx.strokeStyle = e.color; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.7
    ;[[e.x,e.y],[e.x+e.w,e.y],[e.x,e.y+e.h],[e.x+e.w,e.y+e.h]].forEach(([cx,cy], i) => {
      const sx = i % 2 === 0 ? 1 : -1
      const sy = i < 2 ? 1 : -1
      ctx.beginPath()
      ctx.moveTo(cx + sx * ac, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * ac)
      ctx.stroke()
    })
    ctx.globalAlpha = 1

    // Label — sized to fit, bold
    const lines  = e.label.split('\n')
    const fSize  = e.h <= 36 ? 11 : lines.length > 1 ? 12 : 14
    ctx.font     = `bold ${fSize}px 'JetBrains Mono', monospace`
    ctx.fillStyle    = e.color
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor  = e.glowColor; ctx.shadowBlur = 8
    const lh     = fSize + 3
    const startY = e.y + e.h / 2 - (lines.length - 1) * lh / 2
    lines.forEach((ln, i) => ctx.fillText(ln, e.x + e.w / 2, startY + i * lh))
    ctx.shadowBlur = 0

    // HP bar at bottom
    const barH = 3, barY = e.y + e.h - barH - 2
    ctx.fillStyle = e.color; ctx.globalAlpha = 0.35
    ctx.fillRect(e.x + 4, barY, e.w - 8, barH)
    ctx.globalAlpha = 0.9
    ctx.fillRect(e.x + 4, barY, (e.w - 8) * 0.6, barH)
    ctx.globalAlpha = 1

    ctx.restore()
  }

  function drawCollectible(c) {
    ctx.save()
    const bob = Math.sin(c.bobPhase) * 5
    const BY  = c.y + bob

    // Make collectible visually larger — use pill shape with icon
    const labelFont  = `bold 13px 'JetBrains Mono', monospace`
    ctx.font = labelFont
    const tw  = Math.max(70, ctx.measureText(c.label).width + 24)
    const CH  = 32

    // Outer glow
    ctx.shadowColor = c.color; ctx.shadowBlur = 16
    rRect(ctx, c.x, BY, tw, CH, 6)
    ctx.fillStyle = 'rgba(4,8,15,0.92)'; ctx.fill()
    ctx.strokeStyle = c.color; ctx.lineWidth = 2
    ctx.stroke()
    ctx.shadowBlur = 0

    // Pulsing inner fill hint
    const pulse = 0.04 + Math.abs(Math.sin(c.bobPhase * 1.3)) * 0.06
    rRect(ctx, c.x + 2, BY + 2, tw - 4, CH - 4, 5)
    ctx.fillStyle = c.color; ctx.globalAlpha = pulse; ctx.fill()
    ctx.globalAlpha = 1

    // Label text — centered, bright
    ctx.fillStyle    = c.color
    ctx.shadowColor  = c.color; ctx.shadowBlur = 6
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(c.label, c.x + tw / 2, BY + CH / 2)
    ctx.shadowBlur = 0

    // ★ star/gem icon on the left
    ctx.font = '14px serif'
    ctx.textAlign = 'center'
    ctx.globalAlpha = 0.85
    ctx.fillText('⬡', c.x + 11, BY + CH / 2 + 1)
    ctx.globalAlpha = 1

    ctx.restore()
  }

  function drawShockwaves() {
    gs.shockwaves.forEach(s => {
      ctx.save()
      ctx.globalAlpha   = s.life / 20 * 0.7
      ctx.strokeStyle   = s.color
      ctx.lineWidth     = 2.5 * (s.life / 20)
      ctx.shadowColor   = s.color
      ctx.shadowBlur    = 12
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.stroke()
      ctx.restore()
    })
  }

  function drawParticles() {
    gs.particles.forEach(p => {
      ctx.save()
      ctx.globalAlpha = p.life / p.maxLife
      ctx.fillStyle   = p.color
      ctx.shadowColor = p.color; ctx.shadowBlur = 6
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (p.life / p.maxLife), 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    })
  }

  function drawHitEffects(w, h) {
    gs.hitEffects.forEach(he => {
      ctx.save()
      ctx.globalAlpha  = Math.min(1, he.life / 30)
      ctx.font         = `bold 15px 'JetBrains Mono', monospace`
      ctx.fillStyle    = he.color
      ctx.shadowColor  = he.color; ctx.shadowBlur = 10
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(he.text, he.x, he.y)
      ctx.restore()
    })

    gs.messages.forEach((m, i) => {
      ctx.save()
      const alpha = Math.min(1, m.life / 45)
      ctx.globalAlpha  = alpha
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'bottom'
      const lines = m.text.split('\n')
      const baseY = h - 32 - (gs.messages.length - 1 - i) * 46
      lines.forEach((ln, li) => {
        const isFirst = li === 0
        ctx.font      = isFirst
          ? `bold 13px 'JetBrains Mono', monospace`
          : `11px 'JetBrains Mono', monospace`
        ctx.fillStyle = isFirst ? '#E2E8F0' : '#64748B'
        ctx.shadowColor = isFirst ? '#4F6EF6' : 'none'
        ctx.shadowBlur  = isFirst ? 6 : 0
        ctx.fillText(ln, w / 2, baseY - (lines.length - 1 - li) * 17)
      })
      ctx.restore()
    })
  }

  function drawHUD(w) {
    ctx.save()

    // Bar bg
    ctx.fillStyle = 'rgba(4,8,15,0.95)'
    ctx.fillRect(0, 0, w, HUD_H)

    // Bottom border line
    const hGrad = ctx.createLinearGradient(0, 0, w, 0)
    hGrad.addColorStop(0,   'rgba(79,110,246,0)')
    hGrad.addColorStop(0.15,'rgba(79,110,246,0.6)')
    hGrad.addColorStop(0.85,'rgba(79,110,246,0.6)')
    hGrad.addColorStop(1,   'rgba(79,110,246,0)')
    ctx.strokeStyle = hGrad; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, HUD_H); ctx.lineTo(w, HUD_H); ctx.stroke()

    // HP
    for (let i = 0; i < 3; i++) {
      ctx.save()
      ctx.globalAlpha  = i < gs.hp ? 1 : 0.12
      ctx.font         = '20px serif'
      ctx.textBaseline = 'middle'
      ctx.fillText('❤️', 16 + i * 28, HUD_H / 2)
      ctx.restore()
    }

    // Title
    ctx.font      = 'bold 12px "JetBrains Mono", monospace'
    ctx.fillStyle = '#818CF8'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('MALAY.EXE', w / 2, HUD_H / 2)

    // Speed indicator
    if (gs.speedMult > 1.05) {
      ctx.font      = '10px "JetBrains Mono", monospace'
      ctx.fillStyle = '#F59E0B'
      ctx.fillText(`× ${gs.speedMult.toFixed(1)}`, w / 2, HUD_H / 2 + 14)
    }

    // Score
    ctx.font      = 'bold 13px "JetBrains Mono", monospace'
    ctx.fillStyle = '#00E5CC'
    ctx.textAlign = 'right'
    ctx.shadowColor = '#00E5CC'; ctx.shadowBlur = 8
    ctx.fillText(`${String(gs.score).padStart(7, '0')}`, w - 16, HUD_H / 2)
    ctx.shadowBlur = 0

    ctx.restore()
  }

  // ── DRAW ───────────────────────────────────────────────
  function draw(t) {
    const w  = canvas.width
    const h  = canvas.height
    const gy = groundY()

    ctx.save()
    ctx.translate(gs.shake.x, gs.shake.y)

    drawBackground(w, h, gy)
    gs.collectibles.forEach(drawCollectible)
    gs.enemies.forEach(drawEnemy)
    drawPlayer(gs.player)
    drawShockwaves()
    drawParticles()
    drawHitEffects(w, h)
    drawHUD(w)

    ctx.restore()
  }

  // ── LOOP ───────────────────────────────────────────────
  function loop(t) {
    if (!running) return
    update(); draw(t)
    raf = requestAnimationFrame(loop)
  }

  raf = requestAnimationFrame(loop)

  return {
    mobileJump,
    mobilePunch,
    cleanup() {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKeyDown)
    },
  }
}
