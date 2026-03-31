import { rand, randInt, flip, measureCell, DraggableEntity, SceneDriver } from '../sceneUtils'

// ── Beach entities ────────────────────────────────────────────────────────────

// Floaty objects on the water surface or drifting in the sky
const FLOAT_SPECS = [
  { s: '⛱️',  px: 20, c: '#FF6B35', g: 'rgba(255,107,53,0.4)',  spd: 22, amp: 6,  n: [1, 2] },
  { s: '🏐',  px: 18, c: '#FF4081', g: 'rgba(255,64,129,0.4)',   spd: 35, amp: 8,  n: [2, 3] },
  { s: '🕶️',  px: 16, c: '#FFB700', g: 'rgba(255,183,0,0.35)',  spd: 28, amp: 5,  n: [1, 2] },
  { s: '🍋',  px: 16, c: '#FFE44D', g: 'rgba(255,228,77,0.35)', spd: 20, amp: 7,  n: [1, 2] },
  { s: '🍉',  px: 18, c: '#4CAF50', g: 'rgba(76,175,80,0.35)',  spd: 18, amp: 6,  n: [1, 2] },
]

// ASCII wave chars
const WAVE_CHARS = ['~', '≈', '∿', '⌇', 'ˇ']
// Sand texture chars
const SAND_CHARS = ['.', '·', '∴', '∵', ':', ';', '`', "'", ',']

interface Spec { s: string; px: number; c: string; g: string; spd: number; amp: number }

class BeachEntity implements DraggableEntity {
  x: number; y: number; baseY: number; fishW: number
  spec: Spec; dir: number; dragging = false; throwVx = 0; throwVy = 0
  private speed: number; private phase: number; private freq: number
  private amp: number; private cellW: number

  constructor(ctx: CanvasRenderingContext2D, spec: Spec, x: number, y: number) {
    this.spec = spec; this.x = x; this.y = y; this.baseY = y
    this.dir = Math.random() < 0.5 ? 1 : -1
    this.speed = spec.spd * rand(0.7, 1.3)
    this.phase = rand(0, Math.PI * 2)
    this.freq = rand(0.25, 0.55)
    this.amp = spec.amp * rand(0.7, 1.3)
    this.cellW = measureCell(ctx, spec.px)
    this.fishW = spec.s.length * this.cellW
  }

  get chars() { return this.dir < 0 ? flip(this.spec.s) : this.spec.s }

  update(dt: number, W: number, H: number) {
    if (this.dragging) { this.phase += dt * this.freq * 5; return }
    if (Math.abs(this.throwVx) > 1 || Math.abs(this.throwVy) > 1) {
      this.x += this.throwVx * dt
      this.baseY += this.throwVy * dt
      const sandY = H * 0.6
      this.baseY = Math.max(44, Math.min(sandY - 10, this.baseY))
      const decay = Math.pow(0.5, dt / 0.28)
      this.throwVx *= decay; this.throwVy *= decay
    } else { this.throwVx = 0; this.throwVy = 0 }
    this.phase += dt * this.freq
    this.x += this.speed * this.dir * dt
    this.y = this.baseY + Math.sin(this.phase) * this.amp
    const pad = this.fishW + 30
    if (this.dir > 0 && this.x > W + pad) { this.x = -pad; this.baseY = rand(44, H * 0.55) }
    if (this.dir < 0 && this.x < -pad) { this.x = W + pad; this.baseY = rand(44, H * 0.55) }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.spec.px}px "JetBrains Mono", monospace`
    ctx.fillStyle = this.dragging ? '#FFFFFF' : this.spec.c
    ctx.shadowColor = this.dragging ? 'rgba(255,255,255,0.9)' : this.spec.g
    ctx.shadowBlur = this.dragging ? 24 : 14
    const chars = this.chars, len = chars.length
    const wigAmp = this.dragging ? 5 : 2
    const wigFreq = this.dragging ? 4.5 : 2.0
    for (let i = 0; i < len; i++) {
      const lag = (this.dir > 0 ? i : len - 1 - i) * 0.28
      const cy = this.y + Math.sin(this.phase * wigFreq + lag) * wigAmp
      ctx.fillText(chars[i], this.x + i * this.cellW, cy)
    }
    ctx.restore()
  }
}

class WaveRow {
  private y: number; private phase: number; private speed: number
  private chars: string[]; private color: string; private alpha: number

  constructor(y: number, speed: number, color: string, alpha: number) {
    this.y = y; this.phase = rand(0, Math.PI * 2)
    this.speed = speed; this.color = color; this.alpha = alpha
    this.chars = Array.from({ length: 60 }, () => WAVE_CHARS[randInt(0, WAVE_CHARS.length - 1)])
  }

  update(dt: number) { this.phase += dt * this.speed }

  draw(ctx: CanvasRenderingContext2D, W: number) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.font = '13px "JetBrains Mono", monospace'
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color; ctx.shadowBlur = 4
    const cellW = W / this.chars.length
    for (let i = 0; i < this.chars.length; i++) {
      const dy = Math.sin(this.phase + i * 0.3) * 3
      ctx.fillText(this.chars[i], i * cellW, this.y + dy)
    }
    ctx.restore()
  }
}

class SandGrain {
  x: number; y: number
  private ch: string; private a: number; private sz: number; private col: string

  constructor(W: number, H: number) {
    this.x = rand(0, W)
    this.y = rand(H * 0.6, H)
    this.ch = SAND_CHARS[randInt(0, SAND_CHARS.length - 1)]
    this.a = rand(0.08, 0.35)
    this.sz = randInt(9, 13)
    const warm = randInt(40, 70)
    this.col = `rgb(${210 + warm},${170 + warm * 0.6},${80 + warm * 0.3})`
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.globalAlpha = this.a
    ctx.font = `${this.sz}px "JetBrains Mono", monospace`
    ctx.fillStyle = this.col
    ctx.fillText(this.ch, this.x, this.y)
    ctx.restore()
  }
}

class Seagull {
  x: number; y: number
  private phase: number; private speed: number; private dir: number
  private sz: number

  constructor(W: number, H: number) {
    this.dir = Math.random() < 0.5 ? 1 : -1
    this.x = this.dir > 0 ? rand(-60, -10) : rand(W + 10, W + 60)
    this.y = rand(H * 0.05, H * 0.30)
    this.phase = rand(0, Math.PI * 2)
    this.speed = rand(40, 90)
    this.sz = randInt(10, 15)
  }

  update(dt: number, W: number) {
    this.phase += dt * 2.5
    this.x += this.speed * this.dir * dt
    this.y += Math.sin(this.phase) * 0.6
    void W
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.sz}px "JetBrains Mono", monospace`
    ctx.fillStyle = '#E8E8E8'; ctx.shadowColor = 'rgba(255,255,255,0.4)'; ctx.shadowBlur = 5
    // ascii gull: m or w shape depending on direction
    const glyph = this.dir > 0 ? 'ᵛ' : 'ᵛ'
    ctx.fillText(glyph, this.x, this.y)
    ctx.restore()
  }

  get dead() { return this.x < -120 || this.x > 9999 }
}

export function buildBeachScene(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  mobile: boolean,
): SceneDriver {
  const scale = mobile ? 0.78 : 1

  let entities: BeachEntity[] = []
  let waves: WaveRow[] = []
  let grains: SandGrain[] = []
  let gulls: Gull[] = []
  let gullTimer = 0
  let sunT = 0

  type Gull = Seagull  // alias for type inference

  function build(ctx: CanvasRenderingContext2D, W: number, H: number) {
    entities = []; waves = []; grains = []; gulls = []
    gullTimer = 0

    const waterY = H * 0.58

    for (const sp of FLOAT_SPECS) {
      const px = Math.round(sp.px * scale)
      const count = mobile ? sp.n[0] : sp.n[1]
      const spec = { ...sp, px }
      for (let i = 0; i < count; i++) {
        entities.push(new BeachEntity(ctx, spec, rand(0, W), rand(waterY * 0.15, waterY - 10)))
      }
    }

    // Wave rows near horizon and closer
    const waveRows = mobile ? 4 : 6
    for (let i = 0; i < waveRows; i++) {
      const t = i / (waveRows - 1)
      const y = waterY * 0.6 + t * waterY * 0.45
      const alpha = 0.15 + t * 0.45
      const spd = 0.3 + t * 0.7
      const col = t < 0.5 ? '#00CFFF' : '#00AAEE'
      waves.push(new WaveRow(y, spd, col, alpha))
    }

    // Sand texture — bottom 40% of screen
    const grainCount = mobile ? 120 : 280
    for (let i = 0; i < grainCount; i++) grains.push(new SandGrain(W, H))
  }

  function drawBg(ctx: CanvasRenderingContext2D, dt: number, W: number, H: number) {
    sunT += dt
    const waterY = H * 0.58

    // Sky gradient — warm beach sky
    const sky = ctx.createLinearGradient(0, 0, 0, waterY)
    sky.addColorStop(0, '#0A1428')
    sky.addColorStop(0.4, '#0D2040')
    sky.addColorStop(1, '#1A3A5C')
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, waterY)

    // Sun glow
    const sunX = W * 0.72; const sunY = H * 0.12
    const sunR = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, W * 0.22)
    sunR.addColorStop(0, 'rgba(255,220,100,0.18)')
    sunR.addColorStop(0.4, 'rgba(255,160,50,0.08)')
    sunR.addColorStop(1, 'rgba(255,120,0,0)')
    ctx.fillStyle = sunR; ctx.fillRect(0, 0, W, waterY)

    // Sun disc (ASCII ☀ with glow)
    ctx.save()
    ctx.font = `${mobile ? 18 : 26}px "JetBrains Mono", monospace`
    ctx.fillStyle = '#FFE44D'
    ctx.shadowColor = 'rgba(255,220,80,0.8)'; ctx.shadowBlur = 28
    ctx.fillText('☀', sunX - 10, sunY + 8)
    ctx.restore()

    // Ocean gradient
    const ocean = ctx.createLinearGradient(0, waterY, 0, H * 0.72)
    ocean.addColorStop(0, '#0A2A4A')
    ocean.addColorStop(1, '#071824')
    ctx.fillStyle = ocean; ctx.fillRect(0, waterY, W, H * 0.72 - waterY)

    // Ocean shimmer
    ctx.save(); ctx.globalAlpha = 0.06
    ctx.strokeStyle = '#5FDAFF'; ctx.lineWidth = 1
    for (let x = 0; x < W; x += 70) {
      const wx = x + Math.sin(sunT * 0.5 + x * 0.01) * 15
      ctx.beginPath(); ctx.moveTo(wx, waterY + 2)
      ctx.quadraticCurveTo(wx + 35, waterY + 5 + Math.sin(sunT * 0.9 + x * 0.008) * 3, wx + 70, waterY + 2)
      ctx.stroke()
    }
    ctx.restore()

    // Sand gradient
    const sand = ctx.createLinearGradient(0, H * 0.62, 0, H)
    sand.addColorStop(0, '#1A1208')
    sand.addColorStop(0.3, '#2A1E0E')
    sand.addColorStop(1, '#1E1608')
    ctx.fillStyle = sand; ctx.fillRect(0, H * 0.62, W, H - H * 0.62)

    // Horizon line glow
    ctx.save()
    const hl = ctx.createLinearGradient(0, 0, W, 0)
    hl.addColorStop(0, 'rgba(0,180,255,0)')
    hl.addColorStop(0.3, 'rgba(0,200,255,0.18)')
    hl.addColorStop(0.7, 'rgba(0,200,255,0.18)')
    hl.addColorStop(1, 'rgba(0,180,255,0)')
    ctx.fillStyle = hl; ctx.fillRect(0, waterY - 1, W, 2)
    ctx.restore()
  }

  build(ctx, W, H)

  return {
    tick(dt, ctx, W, H) {
      drawBg(ctx, dt, W, H)

      // Sand grains (static, drawn first)
      for (const g of grains) g.draw(ctx)

      // Wave rows
      for (const w of waves) { w.update(dt); w.draw(ctx, W) }

      // Seagulls
      gullTimer += dt
      if (gullTimer > rand(3, 8) && gulls.length < (mobile ? 3 : 6)) {
        gullTimer = 0; gulls.push(new Seagull(W, H))
      }
      for (let i = gulls.length - 1; i >= 0; i--) {
        gulls[i].update(dt, W); gulls[i].draw(ctx)
        if (gulls[i].dead) gulls.splice(i, 1)
      }

      // Beach entities (beachballs, sunglasses, etc.)
      for (const e of entities) { e.update(dt, W, H); e.draw(ctx) }
    },

    rebuild(ctx, W, H) { build(ctx, W, H) },
    entities() { return entities },
  }
}
