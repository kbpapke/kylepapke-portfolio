import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from '@remix-run/react'
import { buildAquariumScene } from './scenes/aquarium'
import { buildSpaceScene } from './scenes/space'
import { buildMatrixScene } from './scenes/matrix'
import { useAmbientAudio, SceneName } from './useAmbientAudio'
import type { SceneDriver, DraggableEntity } from './sceneUtils'

// ── Resume content ────────────────────────────────────────────────────────────

const SECTIONS = {
  about: {
    path: '~/portfolio',
    // Single paragraph strings — pretext will reflow these at the terminal width
    lines: [
      { text: '$ cat about.txt', cls: 'muted' },
      { text: 'Kyle Papke — Senior Software Engineer', cls: '' },
      { text: 'Ann Arbor, MI', cls: 'dim' },
      { text: '' },
      {
        text: 'Specialized in rapid prototyping and building cutting-edge high-fidelity UIs that translate complex data into actionable intelligence — speed, scalability, delivery.',
        cls: '',
        wrap: true,
      },
      { text: '' },
      { text: '15+ years across E-commerce · Fintech · AdTech · Blockchain · Web3 · Cybersecurity', cls: 'dim', wrap: true },
    ],
  },
  skills: {
    path: '~/portfolio/skills',
    lines: [
      { text: '$ ls -la skills/', cls: 'muted' },
      { text: 'Languages & Frameworks', cls: 'cyan' },
      { text: '  TypeScript  React  Golang  Node.js  Next.js  GraphQL  Remix  Vite', cls: 'amber' },
      { text: 'Infrastructure & Cloud', cls: 'cyan' },
      { text: '  Docker  Kubernetes  GCP  Supabase  Vercel  GitHub Actions  Jenkins', cls: 'amber' },
      { text: 'UI/UX & Design', cls: 'cyan' },
      { text: '  Figma  Tailwind CSS  D3.js  Responsive Design  Accessibility', cls: 'amber' },
      { text: 'Web3 & Blockchain', cls: 'cyan' },
      { text: '  Web3  Ethers.js  Wagmi.js  Thirdweb  Smart Contracts  Dapps', cls: 'amber' },
      { text: 'Testing', cls: 'cyan' },
      { text: '  Cypress  Playwright  Puppeteer  Vitest', cls: 'amber' },
      { text: 'AI & Tooling', cls: 'cyan' },
      { text: '  Claude Code  Cursor  Codex  ChatGPT  MCP', cls: 'amber' },
    ],
  },
  exp: {
    path: '~/portfolio/experience',
    lines: [
      { text: '$ cat experience.log', cls: 'muted' },
      { text: '► Censys — Senior Software Engineer  (2025 – present)', cls: 'cyan' },
      { text: '  Ann Arbor, MI  ·  React · TypeScript · Golang · GraphQL · GCP', cls: 'dim' },
      { text: '  Attack Surface Management platform. AI workflow dashboards.', cls: '' },
      { text: '' },
      { text: '► Treasure — Senior Frontend Engineer  (2023 – 2024)', cls: 'cyan' },
      { text: '  Remote  ·  Web3 · Next.js · TypeScript · Thirdweb · GraphQL', cls: 'dim' },
      { text: '  Web3 gaming ecosystem, NFT Marketplace, Chain Quests.', cls: '' },
      { text: '' },
      { text: '► Criteo — Senior Developer Lead  (2017 – 2023)', cls: 'cyan' },
      { text: '  Ann Arbor, MI  ·  Led 8 engineers · 2,300+ brands globally', cls: 'dim' },
      { text: '  Self-service ad platform. Spearheaded GraphQL adoption.', cls: '' },
      { text: '' },
      { text: '► TD Ameritrade — Senior Software Developer  (2015 – 2017)', cls: 'cyan' },
      { text: '  Ann Arbor, MI  ·  React · Agile', cls: 'dim' },
      { text: '  Robo-advisor & AI chatbot for millennial investors.', cls: '' },
      { text: '' },
      { text: '► Thomson Reuters — Frontend Developer  (2014 – 2015)', cls: 'cyan' },
      { text: '  Dexter, MI  ·  D3.js dashboards for tax & accounting.', cls: 'dim' },
      { text: '' },
      { text: '► Coach — Web Developer  (2011 – 2012)', cls: 'cyan' },
      { text: '  New York, NY  ·  JS SPAs for US / China / Japan e-commerce.', cls: 'dim' },
    ],
  },
  projects: {
    path: '~/portfolio/projects',
    lines: [
      { text: '$ cat initiatives.md', cls: 'muted' },
      { text: '★ Project Saturn  (America Guild)', cls: 'orange' },
      { text: '  Automated research, scanning, investment analysis &', cls: '' },
      { text: '  trade execution for Polymarket prediction markets.', cls: '' },
      { text: '' },
      { text: '★ AI Trading Camera  (Android)', cls: 'orange' },
      { text: '  AI-powered camera that analyzes memecoin charts,', cls: '' },
      { text: '  providing take-profit and stop-loss targets.', cls: '' },
      { text: '' },
      { text: '★ Dynamic Wealth Solutions', cls: 'orange' },
      { text: '  Custom automated fintech solution for client strategy.', cls: '' },
      { text: '' },
      { text: '★ Consortium Key Trading Tools', cls: 'orange' },
      { text: '  Interactive dashboard for Web3 portfolio management', cls: '' },
      { text: '  and high-stakes trading utilities.', cls: '' },
    ],
  },
  contact: {
    path: '~/portfolio/contact',
    lines: [
      { text: '$ cat contact.txt', cls: 'muted' },
      { text: 'name    Kyle Papke', cls: '' },
      { text: 'title   Senior Software Engineer', cls: '' },
      { text: 'loc     Ann Arbor, MI', cls: 'dim' },
      { text: '' },
      { text: 'email   kpapke@gmail.com', cls: 'cyan', href: 'mailto:kpapke@gmail.com' },
      { text: 'web     kylepapke.xyz', cls: 'cyan', href: 'https://kylepapke.xyz' },
      { text: 'in      linkedin.com/in/kylepapke/', cls: 'cyan', href: 'https://linkedin.com/in/kylepapke/' },
    ],
  },
}

const SCRIPT = [
  { t: 'prompt', text: 'whoami',                                         pause: 2200 },
  { t: 'out',    text: 'Kyle Papke  ·  Senior Software Engineer',        cls: '',     pause: 1000 },
  { t: 'out',    text: '15+ years  ·  Fintech · Web3 · AdTech · Cyber', cls: 'dim',  pause: 3000 },
  { t: 'prompt', text: 'ls skills/',                                      pause: 2000 },
  { t: 'out',    text: 'TypeScript  React  Golang  GraphQL  Next.js',    cls: 'amber', pause: 900 },
  { t: 'out',    text: 'Docker  GCP  Web3  D3.js  Tailwind  Claude Code',cls: 'amber', pause: 3000 },
  { t: 'prompt', text: 'cat experience.log | head -6',                    pause: 2000 },
  { t: 'out',    text: '► Censys        Sr Software Engineer  2025–now', cls: 'cyan', pause: 900 },
  { t: 'out',    text: '► Treasure      Sr Frontend Eng       2023–2024',cls: 'cyan', pause: 900 },
  { t: 'out',    text: '► Criteo        Sr Developer Lead     2017–2023',cls: 'cyan', pause: 900 },
  { t: 'out',    text: '► TD Ameritrade Sr Software Dev       2015–2017',cls: 'cyan', pause: 3000 },
  { t: 'prompt', text: 'cat contact.txt',                                 pause: 2000 },
  { t: 'out',    text: 'email  →  kpapke@gmail.com',                     cls: 'cyan', pause: 800 },
  { t: 'out',    text: 'web    →  kylepapke.xyz',                        cls: 'cyan', pause: 800 },
  { t: 'out',    text: 'in     →  linkedin.com/in/kylepapke/',            cls: 'cyan', pause: 3500 },
  { t: 'prompt', text: 'open portfolio --watch --loop',                   pause: 2200 },
]

// ── Colour classes ────────────────────────────────────────────────────────────

const CLS: Record<string, string> = {
  '':      'color:#00FF87',
  dim:     'color:#00994F;opacity:0.75',
  muted:   'color:#2E5A3A;opacity:0.9',
  cyan:    'color:#00D9FF',
  amber:   'color:#FFB700',
  orange:  'color:#FF6B35',
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { scene: SceneName }

export function TerminalScene({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef  = useRef<SceneDriver | null>(null)
  const dimRef    = useRef({ W: 0, H: 0 })
  const rafRef    = useRef<number>(0)

  // drag state
  const grabRef     = useRef<DraggableEntity | null>(null)
  const dragOffRef  = useRef({ x: 0, y: 0 })
  const prevDragRef = useRef({ x: 0, y: 0, t: 0 })
  const velRef      = useRef({ x: 0, y: 0 })

  // terminal UI state
  const [lines, setLines]           = useState<Array<{ text: string; cls: string; href?: string }>>([])
  const [typed, setTyped]           = useState('')
  const [promptPath, setPromptPath] = useState('~/portfolio')
  const [activeTab, setActiveTab]   = useState('auto')
  const [clock, setClock]           = useState('')

  const autoTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scriptIdxRef  = useRef(0)
  const activeTabRef  = useRef('auto')

  // pretext ref — loaded dynamically (client-only, uses canvas.measureText internally)
  const pretextRef = useRef<null | {
    prepareWithSegments: typeof import('@chenglou/pretext').prepareWithSegments
    layoutWithLines: typeof import('@chenglou/pretext').layoutWithLines
  }>(null)

  const { enabled: soundOn, toggle: toggleSound } = useAmbientAudio(scene)

  // ── Canvas resize + scene init ────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    const mobile = window.innerWidth <= 640

    function resize() {
      const p = canvas.parentElement!
      const W = (canvas.width  = p.clientWidth)
      const H = (canvas.height = p.clientHeight)
      dimRef.current = { W, H }
      if (sceneRef.current) sceneRef.current.rebuild(ctx, W, H)
      else buildScene(ctx, W, H, mobile)
    }

    function buildScene(ctx: CanvasRenderingContext2D, W: number, H: number, mobile: boolean) {
      if (scene === 'aquarium') sceneRef.current = buildAquariumScene(ctx, W, H, mobile)
      else if (scene === 'space') sceneRef.current = buildSpaceScene(ctx, W, H, mobile)
      else sceneRef.current = buildMatrixScene(ctx, W, H, mobile)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)
    return () => ro.disconnect()
  }, [scene])

  // ── Animation loop ────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    let lastT = performance.now()

    function frame(now: number) {
      rafRef.current = requestAnimationFrame(frame)
      const { W, H } = dimRef.current
      if (!W || !H) return
      const dt = Math.min((now - lastT) / 1000, 0.05)
      lastT = now
      sceneRef.current?.tick(dt, ctx, W, H)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // ── Drag & throw ──────────────────────────────────────────────────────────

  const canvasXY = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width
    const sy = canvas.height / rect.height
    const src = 'touches' in e ? e.touches[0] : e
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy }
  }, [])

  const hitTest = useCallback((f: DraggableEntity, x: number, y: number) => {
    const pad = 12
    return x >= f.x - pad && x <= f.x + f.fishW + pad
        && y >= f.y - f.spec.px - pad && y <= f.y + pad * 0.5
  }, [])

  const findAt = useCallback((x: number, y: number) => {
    const ents = sceneRef.current?.entities() ?? []
    for (let i = ents.length - 1; i >= 0; i--)
      if (hitTest(ents[i], x, y)) return ents[i]
    return null
  }, [hitTest])

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement

    function onGrab(e: MouseEvent | TouchEvent) {
      const { x, y } = canvasXY(e)
      const f = findAt(x, y)
      if (!f) return
      grabRef.current = f; f.dragging = true
      dragOffRef.current = { x: x - f.x, y: y - f.y }
      prevDragRef.current = { x, y, t: performance.now() }
      velRef.current = { x: 0, y: 0 }
      // aquarium: burst bubbles on grab
      const s = sceneRef.current as ReturnType<typeof buildAquariumScene>
      s?.spawnBubbles?.(f.x + f.fishW * 0.5, f.y, 5)
      canvas.style.cursor = 'grabbing'
      if ('cancelable' in e && e.cancelable) e.preventDefault()
    }

    function onDrag(e: MouseEvent | TouchEvent) {
      const { x, y } = canvasXY(e)
      if (!grabRef.current) {
        canvas.style.cursor = findAt(x, y) ? 'grab' : 'default'
        return
      }
      const now = performance.now()
      const dt = Math.max((now - prevDragRef.current.t) / 1000, 0.001)
      velRef.current = { x: (x - prevDragRef.current.x) / dt, y: (y - prevDragRef.current.y) / dt }
      prevDragRef.current = { x, y, t: now }
      const f = grabRef.current
      f.x = x - dragOffRef.current.x
      f.baseY = y - dragOffRef.current.y
      f.y = f.baseY
      if (Math.abs(velRef.current.x) > 20) f.dir = velRef.current.x > 0 ? 1 : -1
      canvas.style.cursor = 'grabbing'
      if ('cancelable' in e && e.cancelable) e.preventDefault()
    }

    function onRelease() {
      if (!grabRef.current) return
      const MAX = 900
      const f = grabRef.current
      f.throwVx = Math.max(-MAX, Math.min(MAX, velRef.current.x * 0.38))
      f.throwVy = Math.max(-MAX, Math.min(MAX, velRef.current.y * 0.38))
      if (Math.abs(f.throwVx) > 20) f.dir = f.throwVx > 0 ? 1 : -1
      f.dragging = false
      const s = sceneRef.current as ReturnType<typeof buildAquariumScene>
      s?.spawnBubbles?.(f.x + f.fishW * 0.5, f.y, 3)
      grabRef.current = null
      canvas.style.cursor = 'default'
    }

    canvas.addEventListener('mousedown',  onGrab,   { passive: false })
    canvas.addEventListener('mousemove',  onDrag,   { passive: false })
    canvas.addEventListener('touchstart', onGrab,   { passive: false })
    canvas.addEventListener('touchmove',  onDrag,   { passive: false })
    window.addEventListener('mouseup',    onRelease)
    window.addEventListener('touchend',   onRelease, { passive: false })
    return () => {
      canvas.removeEventListener('mousedown',  onGrab)
      canvas.removeEventListener('mousemove',  onDrag)
      canvas.removeEventListener('touchstart', onGrab)
      canvas.removeEventListener('touchmove',  onDrag)
      window.removeEventListener('mouseup',    onRelease)
      window.removeEventListener('touchend',   onRelease)
    }
  }, [canvasXY, findAt])

  // ── Pretext: load dynamically (client-only) ───────────────────────────────

  useEffect(() => {
    import('@chenglou/pretext').then(mod => {
      pretextRef.current = {
        prepareWithSegments: mod.prepareWithSegments,
        layoutWithLines: mod.layoutWithLines,
      }
    })
  }, [])

  // ── Terminal typewriter ───────────────────────────────────────────────────

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null }
  }, [])

  const addLine = useCallback((text: string, cls: string, href?: string) => {
    setLines(prev => [...prev.slice(-40), { text, cls, href }])
  }, [])

  const runAuto = useCallback(() => {
    if (activeTabRef.current !== 'auto') return
    if (scriptIdxRef.current >= SCRIPT.length) {
      scriptIdxRef.current = 0; setLines([])
    }
    const item = SCRIPT[scriptIdxRef.current]
    setPromptPath('~/portfolio')

    if (item.t === 'prompt') {
      setTyped('')
      let i = 0
      ;(function typeChar() {
        if (activeTabRef.current !== 'auto') return
        if (i < item.text.length) {
          setTyped(item.text.slice(0, ++i))
          autoTimerRef.current = setTimeout(typeChar, 42 + Math.random() * 36)
        } else {
          autoTimerRef.current = setTimeout(() => {
            addLine('$ ' + item.text, 'muted')
            setTyped('')
            scriptIdxRef.current++
            autoTimerRef.current = setTimeout(runAuto, item.pause)
          }, 200)
        }
      })()
    } else {
      addLine(item.text, item.cls ?? '')
      scriptIdxRef.current++
      autoTimerRef.current = setTimeout(runAuto, item.pause)
    }
  }, [addLine])

  // ── pretext-powered section rendering ────────────────────────────────────
  // For sections with wrap:true lines, reflow the text at the current terminal width

  const showSection = useCallback((key: string) => {
    stopAuto()
    const sec = SECTIONS[key as keyof typeof SECTIONS]
    if (!sec) return
    setPromptPath(sec.path); setTyped('')

    const termWidth = Math.min(window.innerWidth * 0.96, 960) - 36 // approx content width

    const expanded: Array<{ text: string; cls: string; href?: string }> = []

    for (const line of sec.lines) {
      const l = line as { text: string; cls: string; href?: string; wrap?: boolean }
      if (l.wrap && l.text && pretextRef.current) {
        // Use pretext to reflow paragraph text at the current terminal width
        const { prepareWithSegments, layoutWithLines } = pretextRef.current
        const prepared = prepareWithSegments(l.text, '12px "JetBrains Mono", monospace')
        const { lines: wrapped } = layoutWithLines(prepared, termWidth, 18)
        for (const wl of wrapped) {
          expanded.push({ text: wl.text, cls: l.cls })
        }
      } else {
        expanded.push({ text: l.text, cls: l.cls, href: l.href })
      }
    }

    setLines(expanded)
  }, [stopAuto])

  // ── Tab switching ─────────────────────────────────────────────────────────

  const switchTab = useCallback((tab: string) => {
    activeTabRef.current = tab
    setActiveTab(tab)
    if (tab === 'auto') {
      setLines([]); scriptIdxRef.current = 0; runAuto()
    } else {
      showSection(tab)
    }
  }, [runAuto, showSection])

  // ── Mount: start auto typewriter + clock ─────────────────────────────────

  useEffect(() => {
    autoTimerRef.current = setTimeout(runAuto, 1200)
    function tick() {
      const n = new Date()
      setClock(String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0'))
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => { stopAuto(); clearInterval(id) }
  }, [runAuto, stopAuto])

  // ── Scene labels ──────────────────────────────────────────────────────────

  const SCENE_META: Record<SceneName, { emoji: string; label: string; route: string }> = {
    aquarium: { emoji: '🐟', label: 'ocean',  route: '/aquarium' },
    space:    { emoji: '🚀', label: 'space',  route: '/space'    },
    matrix:   { emoji: '⬛', label: 'matrix', route: '/matrix'   },
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* macOS-style menu bar (desktop only) */}
      <div style={styles.menubar}>
        <span style={styles.menubarApple}>&#xF8FF;</span>
        <span style={styles.menubarApp}>Terminal</span>
        <div style={styles.menubarItems}>
          {['Shell', 'Edit', 'View', 'Window', 'Help'].map(m => (
            <span key={m} style={styles.menubarItem}>{m}</span>
          ))}
        </div>
        <div style={styles.menubarRight}>
          <span>{clock}</span>
        </div>
      </div>

      {/* Terminal window */}
      <div style={styles.terminalWindow}>

        {/* Title bar */}
        <div style={styles.titleBar}>
          <div style={styles.trafficLights}>
            <span style={{ ...styles.light, background: '#FF5F57', boxShadow: '0 0 5px rgba(255,95,87,0.6)' }} />
            <span style={{ ...styles.light, background: '#FEBC2E', boxShadow: '0 0 5px rgba(254,188,46,0.5)' }} />
            <span style={{ ...styles.light, background: '#28C840', boxShadow: '0 0 5px rgba(40,200,64,0.5)' }} />
          </div>
          <span style={styles.windowTitle}>kyle@papke — ~/portfolio — bash</span>
          <div style={styles.sceneBtns}>
            {(Object.entries(SCENE_META) as [SceneName, typeof SCENE_META[SceneName]][]).map(([key, meta]) => (
              <Link
                key={key}
                to={meta.route}
                style={{
                  ...styles.sceneBtn,
                  ...(scene === key ? styles.sceneBtnActive : {}),
                }}
              >
                {meta.emoji} {meta.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Canvas background */}
        <div style={styles.terminalBody}>
          <canvas ref={canvasRef} style={styles.canvas} />
          {scene === 'aquarium' && <div style={styles.waterSurface} />}

          {/* Terminal overlay */}
          <div style={styles.overlay}>

            {/* Bio strip */}
            <div style={styles.bioStrip}>
              <span style={styles.bioName}>Kyle Papke</span>
              <span style={styles.bioRole}>Senior Software Engineer</span>
              <span style={styles.bioLoc}>Ann Arbor, MI</span>
              <div style={styles.bioLinks}>
                <a href="mailto:kpapke@gmail.com" style={styles.bioLink}>kpapke@gmail.com</a>
                <a href="https://linkedin.com/in/kylepapke/" target="_blank" rel="noopener noreferrer" style={styles.bioLink}>linkedin</a>
                <a href="https://kylepapke.xyz" target="_blank" rel="noopener noreferrer" style={styles.bioLink}>kylepapke.xyz</a>
              </div>
            </div>

            {/* Nav tabs */}
            <div style={styles.navTabs}>
              {(['auto', 'about', 'skills', 'exp', 'projects', 'contact'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
                >
                  {tab === 'auto' ? '~/auto' : tab}
                </button>
              ))}
              {/* Sound toggle */}
              <button
                onClick={toggleSound}
                style={{ ...styles.tab, marginLeft: 'auto', opacity: soundOn ? 1 : 0.55 }}
                title={soundOn ? 'Mute ambient audio' : 'Enable ambient audio'}
              >
                {soundOn ? '♪ on' : '♪ off'}
              </button>
            </div>

            {/* Terminal output */}
            <div style={styles.tlines}>
              {lines.map((line, i) =>
                line.href ? (
                  <div key={i} style={{ ...styles.tline, ...parseStyle(line.cls) }}>
                    <a href={line.href} target="_blank" rel="noopener noreferrer" style={styles.tlineLink}>{line.text}</a>
                  </div>
                ) : (
                  <div key={i} style={{ ...styles.tline, ...parseStyle(line.cls) }}>{line.text || '\u00A0'}</div>
                )
              )}
            </div>

            {/* Prompt */}
            <div style={styles.promptLine}>
              <span style={{ color: '#00FF87' }}>kyle</span>
              <span style={{ color: '#00994F' }}>@</span>
              <span style={{ color: '#00FF87' }}>papke</span>
              <span style={{ color: '#00994F' }}>:</span>
              <span style={{ color: '#00D9FF' }}>{promptPath}</span>
              <span style={{ color: '#00994F', margin: '0 6px 0 2px' }}>$</span>
              <span style={{ color: '#00FF87' }}>{typed}</span>
              <span style={styles.cursor} />
            </div>

          </div>

          <div style={styles.scanlines} />
          <div style={styles.vignette} />
        </div>
      </div>
    </>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseStyle(cls: string): React.CSSProperties {
  const raw = CLS[cls] ?? CLS['']
  const result: React.CSSProperties = {}
  raw.split(';').forEach(part => {
    const [k, v] = part.split(':').map(s => s.trim())
    if (!k || !v) return
    const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as keyof React.CSSProperties
    ;(result as Record<string, string>)[camel] = v
  })
  return result
}

// ── Styles ────────────────────────────────────────────────────────────────────

const FONT = "'JetBrains Mono', monospace"
const GREEN = '#00FF87'
const DIMGREEN = '#00994F'
const CYAN = '#00D9FF'
const AMBER = '#FFB700'

const styles = {
  menubar: {
    position: 'fixed' as const, top: 0, left: 0, right: 0, height: 27,
    background: 'rgba(18,18,28,0.9)', backdropFilter: 'blur(24px) saturate(1.4)',
    display: 'flex', alignItems: 'center', padding: '0 14px',
    fontSize: 13, color: 'rgba(255,255,255,0.88)', zIndex: 200,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  menubarApple: { fontSize: 17, marginRight: 14, cursor: 'default' as const },
  menubarApp: { fontWeight: 700, marginRight: 18 },
  menubarItems: { display: 'flex' as const },
  menubarItem: { padding: '0 10px', cursor: 'default' as const, height: 27, display: 'flex' as const, alignItems: 'center' as const },
  menubarRight: { marginLeft: 'auto', display: 'flex' as const, gap: 14, color: 'rgba(255,255,255,0.7)', fontSize: 12 },

  terminalWindow: {
    position: 'fixed' as const,
    top: 27, left: '50%', transform: 'translateX(-50%)',
    width: 'min(960px, 96vw)',
    height: 'min(660px, calc(100vh - 72px))',
    borderRadius: 12, overflow: 'hidden' as const, display: 'flex' as const, flexDirection: 'column' as const,
    boxShadow: '0 0 0 1px rgba(255,255,255,0.09), 0 30px 80px rgba(0,0,0,0.8), 0 0 120px rgba(0,255,135,0.05)',
  },

  titleBar: {
    height: 40, background: 'linear-gradient(180deg,#3A3A3C 0%,#2A2A2C 100%)',
    display: 'flex' as const, alignItems: 'center' as const, padding: '0 14px',
    flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.6)', position: 'relative' as const,
  },
  trafficLights: { display: 'flex' as const, gap: 8, zIndex: 1 },
  light: { width: 13, height: 13, borderRadius: '50%' as const, display: 'inline-block' as const, flexShrink: 0 },
  windowTitle: {
    position: 'absolute' as const, left: '50%', transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.55)', fontSize: 12.5,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    letterSpacing: '0.02em', whiteSpace: 'nowrap' as const,
  },
  sceneBtns: { marginLeft: 'auto', display: 'flex' as const, gap: 5, zIndex: 2 },
  sceneBtn: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.5)', fontFamily: FONT,
    fontSize: 9.5, padding: '2px 8px', borderRadius: 3, cursor: 'pointer' as const,
    letterSpacing: '0.03em', textDecoration: 'none',
    transition: 'background 0.12s, color 0.12s',
  },
  sceneBtnActive: {
    background: 'rgba(0,255,135,0.1)', borderColor: 'rgba(0,255,135,0.4)', color: GREEN,
  },

  terminalBody: { flex: 1, position: 'relative' as const, overflow: 'hidden' as const, background: '#020C18' },
  canvas: { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', display: 'block' as const },

  waterSurface: {
    position: 'absolute' as const, top: 0, left: 0, right: 0, height: 2,
    background: 'linear-gradient(90deg,transparent 0%,rgba(0,180,255,0.5) 20%,rgba(0,255,180,0.7) 50%,rgba(0,180,255,0.5) 80%,transparent 100%)',
    animation: 'surface-wave 4s ease-in-out infinite',
  },

  overlay: {
    position: 'absolute' as const, bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(to top,rgba(2,6,16,0.98) 0%,rgba(2,6,16,0.93) 60%,transparent 100%)',
    padding: '10px 18px 14px', display: 'flex' as const, flexDirection: 'column' as const, gap: 0, zIndex: 10,
  },

  bioStrip: {
    display: 'flex' as const, alignItems: 'baseline' as const, flexWrap: 'wrap' as const,
    gap: '0 8px', marginBottom: 7, paddingBottom: 7,
    borderBottom: '1px solid rgba(0,255,135,0.14)',
  },
  bioName: { color: GREEN, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' },
  bioRole: { color: CYAN, fontSize: 11 },
  bioLoc:  { color: DIMGREEN, fontSize: 10 },
  bioLinks: { display: 'flex' as const, gap: 12, marginLeft: 'auto', flexWrap: 'wrap' as const, justifyContent: 'flex-end' as const },
  bioLink: { color: AMBER, fontSize: 10.5, textDecoration: 'none', opacity: 0.85 },

  navTabs: { display: 'flex' as const, gap: 2, marginBottom: 8, flexWrap: 'wrap' as const },
  tab: {
    background: 'transparent', border: '1px solid rgba(0,255,135,0.18)',
    color: DIMGREEN, fontFamily: FONT, fontSize: 10.5, padding: '3px 10px',
    borderRadius: 3, cursor: 'pointer' as const, letterSpacing: '0.04em',
    transition: 'background 0.12s, color 0.12s', userSelect: 'none' as const,
  },
  tabActive: { background: 'rgba(0,255,135,0.12)', borderColor: GREEN, color: GREEN },

  tlines: {
    display: 'flex' as const, flexDirection: 'column' as const, gap: 1,
    overflowY: 'auto' as const, maxHeight: 145,
    userSelect: 'text' as const, WebkitUserSelect: 'text' as const,
    scrollbarWidth: 'thin' as const, flex: 1,
  },
  tline: {
    fontSize: 12, lineHeight: 1.65, whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const, letterSpacing: '0.02em', fontFamily: FONT,
  },
  tlineLink: { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 2, opacity: 0.85 },

  promptLine: {
    display: 'flex' as const, alignItems: 'center' as const, flexWrap: 'wrap' as const,
    fontSize: 12, marginTop: 4, letterSpacing: '0.02em', fontFamily: FONT, flexShrink: 0,
  },
  cursor: {
    display: 'inline-block' as const, width: 8, height: 13,
    background: GREEN, verticalAlign: -2, boxShadow: `0 0 8px ${GREEN}`,
    animation: 'blink 1.1s step-end infinite',
  },

  scanlines: {
    position: 'absolute' as const, inset: 0, pointerEvents: 'none' as const, zIndex: 20,
    background: 'repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)',
  },
  vignette: {
    position: 'absolute' as const, inset: 0, pointerEvents: 'none' as const, zIndex: 19,
    background: 'radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.55) 100%)',
  },
} as const
