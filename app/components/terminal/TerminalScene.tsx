import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from '@remix-run/react'
import { buildAquariumScene } from './scenes/aquarium'
import { buildSpaceScene } from './scenes/space'
import { buildMatrixScene } from './scenes/matrix'
import { useAmbientAudio, SceneName } from './useAmbientAudio'
import { rand } from './sceneUtils'
import type { SceneDriver, DraggableEntity } from './sceneUtils'

// ── Resume content ────────────────────────────────────────────────────────────

const SECTIONS = {
  about: {
    path: '~/portfolio',
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
  { t: 'out',    text: 'Kyle Papke  ·  Senior Software Engineer',        cls: '',      pause: 1000 },
  { t: 'out',    text: '15+ years  ·  Fintech · Web3 · AdTech · Cyber', cls: 'dim',   pause: 3000 },
  { t: 'prompt', text: 'ls skills/',                                      pause: 2000 },
  { t: 'out',    text: 'TypeScript  React  Golang  GraphQL  Next.js',    cls: 'amber', pause: 900  },
  { t: 'out',    text: 'Docker  GCP  Web3  D3.js  Tailwind  Claude Code',cls: 'amber', pause: 3000 },
  { t: 'prompt', text: 'cat experience.log | head -6',                    pause: 2000 },
  { t: 'out',    text: '► Censys        Sr Software Engineer  2025–now', cls: 'cyan',  pause: 900  },
  { t: 'out',    text: '► Treasure      Sr Frontend Eng       2023–2024',cls: 'cyan',  pause: 900  },
  { t: 'out',    text: '► Criteo        Sr Developer Lead     2017–2023',cls: 'cyan',  pause: 900  },
  { t: 'out',    text: '► TD Ameritrade Sr Software Dev       2015–2017',cls: 'cyan',  pause: 3000 },
  { t: 'prompt', text: 'cat contact.txt',                                 pause: 2000 },
  { t: 'out',    text: 'email  →  kpapke@gmail.com',                     cls: 'cyan',  pause: 800  },
  { t: 'out',    text: 'web    →  kylepapke.xyz',                        cls: 'cyan',  pause: 800  },
  { t: 'out',    text: 'in     →  linkedin.com/in/kylepapke/',            cls: 'cyan',  pause: 3500 },
  { t: 'prompt', text: 'open portfolio --watch --loop',                   pause: 2200 },
]

const CLS: Record<string, string> = {
  '':     'color:#00FF87',
  dim:    'color:#00994F;opacity:0.75',
  muted:  'color:#2E5A3A;opacity:0.9',
  cyan:   'color:#00D9FF',
  amber:  'color:#FFB700',
  orange: 'color:#FF6B35',
}

// ── Word entity: user text that swims/floats/falls in the scene ───────────────
// pretext measures the initial width; per-char canvas measurement drives rendering

const WORD_PALETTES: Record<SceneName, Array<[string, string]>> = {
  aquarium: [
    ['#00FF87', 'rgba(0,255,135,0.4)'],
    ['#00D9FF', 'rgba(0,217,255,0.35)'],
    ['#FFB700', 'rgba(255,183,0,0.35)'],
    ['#7DF9FF', 'rgba(125,249,255,0.3)'],
  ],
  space: [
    ['#B8FFDA', 'rgba(184,255,218,0.3)'],
    ['#7DF9FF', 'rgba(125,249,255,0.3)'],
    ['#FFB700', 'rgba(255,183,0,0.35)'],
    ['#FF6B35', 'rgba(255,107,53,0.35)'],
  ],
  matrix: [
    ['#00FF87', 'rgba(0,255,135,0.4)'],
    ['#FFFFFF', 'rgba(255,255,255,0.3)'],
    ['#00D9FF', 'rgba(0,217,255,0.3)'],
    ['#B8FFDA', 'rgba(184,255,218,0.25)'],
  ],
}

class WordEntity implements DraggableEntity {
  x: number; y: number; baseY: number; fishW: number
  spec: { px: number }; dir: number
  dragging = false; throwVx = 0; throwVy = 0
  readonly text: string

  private chars: string[]
  private charWidths: number[] = []   // measured lazily on first draw
  private color: string
  private glowColor: string
  private phase: number
  private freq: number
  private amp: number
  private speed: number
  private readonly fontSize = 14

  constructor(text: string, measuredWidth: number, x: number, y: number, scene: SceneName) {
    this.text = text
    this.chars = [...text]            // Unicode-aware split (handles emoji correctly)
    this.fishW = measuredWidth        // pretext-measured initial width for hit-testing
    this.x = x; this.y = y; this.baseY = y
    this.dir = Math.random() < 0.5 ? 1 : -1
    this.speed = rand(28, 75)
    this.phase = rand(0, Math.PI * 2)
    this.freq = rand(0.33, 0.68)
    this.amp = rand(8, 22)
    this.spec = { px: this.fontSize }
    const palette = WORD_PALETTES[scene]
    const [c, g] = palette[Math.floor(Math.random() * palette.length)]
    this.color = c; this.glowColor = g
  }

  update(dt: number, W: number, H: number) {
    if (this.dragging) { this.phase += dt * this.freq * 5; return }
    if (Math.abs(this.throwVx) > 1 || Math.abs(this.throwVy) > 1) {
      this.x += this.throwVx * dt
      this.baseY += this.throwVy * dt
      this.baseY = Math.max(44, Math.min(H - 195, this.baseY))
      const decay = Math.pow(0.5, dt / 0.28)
      this.throwVx *= decay; this.throwVy *= decay
    } else { this.throwVx = 0; this.throwVy = 0 }
    this.phase += dt * this.freq
    this.x += this.speed * this.dir * dt
    this.y = this.baseY + Math.sin(this.phase) * this.amp
    const pad = this.fishW + 30
    if (this.dir > 0 && this.x > W + pad)  { this.x = -pad;   this.baseY = rand(44, H - 195) }
    if (this.dir < 0 && this.x < -pad)     { this.x = W + pad; this.baseY = rand(44, H - 195) }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`
    ctx.fillStyle   = this.dragging ? '#FFFFFF' : this.color
    ctx.shadowColor = this.dragging ? 'rgba(255,255,255,0.9)' : this.glowColor
    ctx.shadowBlur  = this.dragging ? 22 : 12

    // Measure each char once, then cache — works for emoji & any Unicode
    if (this.charWidths.length === 0) {
      let total = 0
      for (const ch of this.chars) {
        const w = ctx.measureText(ch).width
        this.charWidths.push(w)
        total += w
      }
      this.fishW = total  // refine hit-box with actual measured width
    }

    // Per-character body-flex wave — same technique as fish/rockets
    const wigAmp  = this.dragging ? 5 : 2
    const wigFreq = this.dragging ? 4.5 : 2.2
    let cx = this.x
    for (let i = 0; i < this.chars.length; i++) {
      const lag = (this.dir > 0 ? i : this.chars.length - 1 - i) * 0.28
      const cy  = this.y + Math.sin(this.phase * wigFreq + lag) * wigAmp
      ctx.fillText(this.chars[i], cx, cy)
      cx += this.charWidths[i]
    }
    ctx.restore()
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { scene: SceneName }

export function TerminalScene({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef  = useRef<SceneDriver | null>(null)
  const dimRef    = useRef({ W: 0, H: 0 })
  const rafRef    = useRef<number>(0)

  // word entities live in a ref (animation loop) + mirrored to state (UI)
  const wordEntitiesRef = useRef<WordEntity[]>([])
  const [wordList, setWordList] = useState<string[]>([])
  const [drawInput, setDrawInput] = useState('')
  const drawInputRef = useRef<HTMLInputElement>(null)

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

  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scriptIdxRef = useRef(0)
  const activeTabRef = useRef('auto')

  const pretextRef = useRef<null | {
    prepareWithSegments: typeof import('@chenglou/pretext').prepareWithSegments
    layoutWithLines:     typeof import('@chenglou/pretext').layoutWithLines
  }>(null)

  const { enabled: soundOn, toggle: toggleSound } = useAmbientAudio(scene)

  // ── Canvas resize + scene init ────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    const mobile = window.innerWidth <= 640

    function buildScene(ctx: CanvasRenderingContext2D, W: number, H: number, mobile: boolean) {
      if (scene === 'aquarium') sceneRef.current = buildAquariumScene(ctx, W, H, mobile)
      else if (scene === 'space') sceneRef.current = buildSpaceScene(ctx, W, H, mobile)
      else sceneRef.current = buildMatrixScene(ctx, W, H, mobile)
    }

    function resize() {
      const p = canvas.parentElement!
      const W = (canvas.width  = p.clientWidth)
      const H = (canvas.height = p.clientHeight)
      dimRef.current = { W, H }
      if (sceneRef.current) sceneRef.current.rebuild(ctx, W, H)
      else buildScene(ctx, W, H, mobile)
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
      // word entities rendered on top of the scene
      for (const we of wordEntitiesRef.current) {
        we.update(dt, W, H)
        we.draw(ctx)
      }
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
    // word entities are drawn on top — check first
    const words = wordEntitiesRef.current
    for (let i = words.length - 1; i >= 0; i--)
      if (hitTest(words[i], x, y)) return words[i]
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
      const dt  = Math.max((now - prevDragRef.current.t) / 1000, 0.001)
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

    canvas.addEventListener('mousedown',  onGrab,    { passive: false })
    canvas.addEventListener('mousemove',  onDrag,    { passive: false })
    canvas.addEventListener('touchstart', onGrab,    { passive: false })
    canvas.addEventListener('touchmove',  onDrag,    { passive: false })
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

  // ── Pretext: load dynamically (canvas.measureText — client-only) ──────────

  useEffect(() => {
    import('@chenglou/pretext').then(mod => {
      pretextRef.current = {
        prepareWithSegments: mod.prepareWithSegments,
        layoutWithLines:     mod.layoutWithLines,
      }
    })
  }, [])

  // ── Word spawning ─────────────────────────────────────────────────────────

  const spawnWord = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const canvas  = canvasRef.current as HTMLCanvasElement
    const ctx2d   = canvas.getContext('2d')!
    const fontSize = 14
    const fontStr  = `${fontSize}px "JetBrains Mono", monospace`

    // Use pretext for accurate Unicode/emoji-aware width measurement
    let measuredWidth: number
    if (pretextRef.current) {
      const { prepareWithSegments, layoutWithLines } = pretextRef.current
      const prepared = prepareWithSegments(trimmed, fontStr)
      const { lines } = layoutWithLines(prepared, 99999, 20)
      measuredWidth = lines[0]?.width ?? trimmed.length * 9
    } else {
      ctx2d.font = fontStr
      measuredWidth = ctx2d.measureText(trimmed).width
    }

    const { W, H } = dimRef.current
    const entity = new WordEntity(
      trimmed, measuredWidth,
      rand(W * 0.1, Math.max(W * 0.1 + 1, W * 0.9 - measuredWidth)),
      rand(60, Math.max(80, H - 220)),
      scene,
    )
    wordEntitiesRef.current.push(entity)
    setWordList(prev => [...prev, trimmed])
  }, [scene])

  const clearWords = useCallback(() => {
    wordEntitiesRef.current = []
    setWordList([])
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
    if (scriptIdxRef.current >= SCRIPT.length) { scriptIdxRef.current = 0; setLines([]) }
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

  const showSection = useCallback((key: string) => {
    stopAuto()
    const sec = SECTIONS[key as keyof typeof SECTIONS]
    if (!sec) return
    setPromptPath(sec.path); setTyped('')

    const termWidth = Math.min(window.innerWidth * 0.96, 960) - 36

    const expanded: Array<{ text: string; cls: string; href?: string }> = []
    for (const line of sec.lines) {
      const l = line as { text: string; cls: string; href?: string; wrap?: boolean }
      if (l.wrap && l.text && pretextRef.current) {
        const { prepareWithSegments, layoutWithLines } = pretextRef.current
        const prepared = prepareWithSegments(l.text, '12px "JetBrains Mono", monospace')
        const { lines: wrapped } = layoutWithLines(prepared, termWidth, 18)
        for (const wl of wrapped) expanded.push({ text: wl.text, cls: l.cls })
      } else {
        expanded.push({ text: l.text, cls: l.cls, href: l.href })
      }
    }
    setLines(expanded)
  }, [stopAuto])

  const switchTab = useCallback((tab: string) => {
    activeTabRef.current = tab
    setActiveTab(tab)
    if (tab === 'auto') {
      setLines([]); scriptIdxRef.current = 0; runAuto()
    } else if (tab === 'draw') {
      stopAuto(); setLines([]); setTyped('')
      setPromptPath('~/portfolio/draw')
      setTimeout(() => drawInputRef.current?.focus(), 50)
    } else {
      showSection(tab)
    }
  }, [runAuto, showSection, stopAuto])

  // ── Mount ─────────────────────────────────────────────────────────────────

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

  // ── Scene nav metadata ────────────────────────────────────────────────────

  const SCENE_META: Record<SceneName, { emoji: string; label: string; route: string }> = {
    aquarium: { emoji: '🐟', label: 'ocean',  route: '/aquarium' },
    space:    { emoji: '🚀', label: 'space',  route: '/space'    },
    matrix:   { emoji: '⬛', label: 'matrix', route: '/matrix'   },
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const isDrawMode = activeTab === 'draw'

  return (
    <>
      <div style={styles.menubar}>
        <span style={styles.menubarApple}>&#xF8FF;</span>
        <span style={styles.menubarApp}>Terminal</span>
        <div style={styles.menubarItems}>
          {['Shell', 'Edit', 'View', 'Window', 'Help'].map(m => (
            <span key={m} style={styles.menubarItem}>{m}</span>
          ))}
        </div>
        <div style={styles.menubarRight}><span>{clock}</span></div>
      </div>

      <div style={styles.terminalWindow}>
        <div style={styles.titleBar}>
          <div style={styles.trafficLights}>
            <span style={{ ...styles.light, background: '#FF5F57', boxShadow: '0 0 5px rgba(255,95,87,0.6)' }} />
            <span style={{ ...styles.light, background: '#FEBC2E', boxShadow: '0 0 5px rgba(254,188,46,0.5)' }} />
            <span style={{ ...styles.light, background: '#28C840', boxShadow: '0 0 5px rgba(40,200,64,0.5)' }} />
          </div>
          <span style={styles.windowTitle}>kyle@papke — ~/portfolio — bash</span>
        </div>

        <div style={styles.terminalBody}>
          <canvas ref={canvasRef} style={styles.canvas} />
          {scene === 'aquarium' && <div style={styles.waterSurface} />}

          {/* Scene switcher — floats inside the canvas, top-right */}
          <div style={styles.sceneBtns}>
            {(Object.entries(SCENE_META) as [SceneName, typeof SCENE_META[SceneName]][]).map(([key, meta]) => (
              <Link
                key={key}
                to={meta.route}
                style={{ ...styles.sceneBtn, ...(scene === key ? styles.sceneBtnActive : {}) }}
              >
                {meta.emoji} {meta.label}
              </Link>
            ))}
          </div>

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
              <button
                onClick={() => switchTab('draw')}
                style={{
                  ...styles.tab,
                  ...(isDrawMode ? styles.tabDrawActive : styles.tabDraw),
                }}
              >
                ✏ draw
              </button>
              <button
                onClick={toggleSound}
                style={{ ...styles.tab, marginLeft: 'auto', opacity: soundOn ? 1 : 0.5 }}
                title={soundOn ? 'Mute' : 'Enable ambient audio'}
              >
                {soundOn ? '♪ on' : '♪ off'}
              </button>
            </div>

            {/* Terminal output */}
            {isDrawMode ? (
              <div style={styles.tlines}>
                {wordList.length === 0 ? (
                  <div style={{ ...styles.tline, color: '#00994F', opacity: 0.75 }}>
                    type words, phrases, or emoji below — press Enter to spawn them into the scene. drag & throw.
                  </div>
                ) : (
                  <>
                    <div style={{ ...styles.tline, color: '#00994F' }}>
                      {wordList.length} entit{wordList.length === 1 ? 'y' : 'ies'} swimming
                    </div>
                    {wordList.map((w, i) => (
                      <div key={i} style={{ ...styles.tline, color: '#FF6B35' }}>~ {w}</div>
                    ))}
                  </>
                )}
                {wordList.length > 0 && (
                  <button
                    onClick={clearWords}
                    style={{ ...styles.tab, marginTop: 6, ...styles.tabDraw }}
                  >
                    clear scene
                  </button>
                )}
              </div>
            ) : (
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
            )}

            {/* Prompt */}
            {isDrawMode ? (
              <div style={styles.promptLine}>
                <span style={{ color: '#FF6B35' }}>spawn</span>
                <span style={{ color: '#00994F', margin: '0 6px 0 2px' }}>~&gt;</span>
                <input
                  ref={drawInputRef}
                  type="text"
                  value={drawInput}
                  onChange={e => setDrawInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter')  { spawnWord(drawInput); setDrawInput('') }
                    if (e.key === 'Escape') { switchTab('auto') }
                  }}
                  placeholder="type anything, press Enter…"
                  style={styles.drawInput}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            ) : (
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
            )}
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

const FONT    = "'JetBrains Mono', monospace"
const GREEN   = '#00FF87'
const DIMGREEN = '#00994F'
const CYAN    = '#00D9FF'
const AMBER   = '#FFB700'
const ORANGE  = '#FF6B35'

const styles = {
  menubar: {
    position: 'fixed' as const, top: 0, left: 0, right: 0, height: 27,
    background: 'rgba(18,18,28,0.9)', backdropFilter: 'blur(24px) saturate(1.4)',
    display: 'flex', alignItems: 'center', padding: '0 14px',
    fontSize: 13, color: 'rgba(255,255,255,0.88)', zIndex: 200,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  menubarApple: { fontSize: 17, marginRight: 14, cursor: 'default' as const },
  menubarApp:   { fontWeight: 700, marginRight: 18 },
  menubarItems: { display: 'flex' as const },
  menubarItem:  { padding: '0 10px', cursor: 'default' as const, height: 27, display: 'flex' as const, alignItems: 'center' as const },
  menubarRight: { marginLeft: 'auto', display: 'flex' as const, gap: 14, color: 'rgba(255,255,255,0.7)', fontSize: 12 },

  terminalWindow: {
    position: 'fixed' as const,
    top: 27, left: '50%', transform: 'translateX(-50%)',
    width: 'min(960px, 96vw)', height: 'min(660px, calc(100vh - 72px))',
    borderRadius: 14, overflow: 'hidden' as const,
    display: 'flex' as const, flexDirection: 'column' as const,
    // glass border + deep shadow + green ambient glow
    boxShadow: [
      '0 0 0 1px rgba(255,255,255,0.12)',
      '0 0 0 1.5px rgba(0,255,135,0.08)',
      '0 32px 80px rgba(0,0,0,0.85)',
      '0 8px 32px rgba(0,0,0,0.6)',
      '0 0 80px rgba(0,255,135,0.06)',
      'inset 0 1px 0 rgba(255,255,255,0.08)',
    ].join(','),
  },

  titleBar: {
    height: 40,
    background: 'rgba(22,24,28,0.85)',
    backdropFilter: 'blur(20px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
    display: 'flex' as const, alignItems: 'center' as const, padding: '0 14px',
    flexShrink: 0,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'relative' as const,
  },
  trafficLights: { display: 'flex' as const, gap: 8, zIndex: 1 },
  light: { width: 13, height: 13, borderRadius: '50%' as const, display: 'inline-block' as const, flexShrink: 0 },
  windowTitle: {
    position: 'absolute' as const, left: '50%', transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.45)', fontSize: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    letterSpacing: '0.02em', whiteSpace: 'nowrap' as const,
  },
  // floating pill inside the canvas body, top-right corner — no collision with title text
  sceneBtns: {
    position: 'absolute' as const, top: 10, right: 12, zIndex: 30,
    display: 'flex' as const, gap: 4,
    background: 'rgba(10,12,16,0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '4px 6px',
  },
  sceneBtn: {
    background: 'transparent', border: 'none',
    color: 'rgba(255,255,255,0.45)', fontFamily: FONT,
    fontSize: 9.5, padding: '2px 7px', borderRadius: 4, cursor: 'pointer' as const,
    letterSpacing: '0.03em', textDecoration: 'none',
    transition: 'color 0.12s, background 0.12s',
  },
  sceneBtnActive: {
    background: 'rgba(0,255,135,0.12)', color: GREEN,
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
    background: [
      'linear-gradient(to top,rgba(4,8,18,0.97) 0%,rgba(4,8,18,0.92) 55%,rgba(4,8,18,0.6) 80%,transparent 100%)',
    ].join(','),
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    padding: '10px 18px 14px', display: 'flex' as const, flexDirection: 'column' as const, zIndex: 10,
    borderTop: '1px solid rgba(0,255,135,0.06)',
  },

  bioStrip: {
    display: 'flex' as const, alignItems: 'baseline' as const, flexWrap: 'wrap' as const,
    gap: '0 8px', marginBottom: 7, paddingBottom: 7,
    borderBottom: '1px solid rgba(0,255,135,0.14)',
  },
  bioName:  { color: GREEN,    fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' },
  bioRole:  { color: CYAN,     fontSize: 11 },
  bioLoc:   { color: DIMGREEN, fontSize: 10 },
  bioLinks: { display: 'flex' as const, gap: 12, marginLeft: 'auto', flexWrap: 'wrap' as const, justifyContent: 'flex-end' as const },
  bioLink:  { color: AMBER, fontSize: 10.5, textDecoration: 'none', opacity: 0.85 },

  navTabs: { display: 'flex' as const, gap: 2, marginBottom: 8, flexWrap: 'wrap' as const },
  tab: {
    background: 'transparent', border: `1px solid rgba(0,255,135,0.18)`,
    color: DIMGREEN, fontFamily: FONT, fontSize: 10.5, padding: '3px 10px',
    borderRadius: 3, cursor: 'pointer' as const, letterSpacing: '0.04em',
    transition: 'background 0.12s, color 0.12s', userSelect: 'none' as const,
  },
  tabActive:     { background: 'rgba(0,255,135,0.12)', borderColor: GREEN,   color: GREEN   },
  tabDraw:       { borderColor: `rgba(255,107,53,0.35)`, color: `rgba(255,107,53,0.65)` },
  tabDrawActive: { background: `rgba(255,107,53,0.1)`,   borderColor: ORANGE, color: ORANGE  },

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
  drawInput: {
    background: 'transparent', border: 'none', outline: 'none',
    color: GREEN, fontFamily: FONT, fontSize: 12, letterSpacing: '0.02em',
    flex: 1, caretColor: GREEN, minWidth: 0,
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
