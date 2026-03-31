import { rand, randInt, flip, measureCell, CANVAS_FONT, DraggableEntity, SceneDriver } from '../sceneUtils'

// ── Sky entities ──────────────────────────────────────────────────────────────

const AIR_SPECS = [
  // Emoji are fine as long as canvas has emoji font fallbacks.
  // Also avoid variation selectors (e.g. ✈️) which can render blank on some stacks.
  { s: '✈', px: 18, c: '#7DF9FF', g: 'rgba(125,249,255,0.35)', spd: 70, amp: 10, n: [1, 2] },
  { s: '🚁', px: 18, c: '#00FF87', g: 'rgba(0,255,135,0.30)', spd: 48, amp: 14, n: [1, 2] },
  { s: '🛩', px: 16, c: '#FFB700', g: 'rgba(255,183,0,0.30)', spd: 62, amp: 9, n: [1, 2] },
  { s: '🛫', px: 16, c: '#FF6B35', g: 'rgba(255,107,53,0.30)', spd: 80, amp: 8, n: [1, 1] },
]

const CLOUD_CHARS = ['☁', '☁', '⛅', '˙', '·']
const CONTRAIL_CHARS = ['·', '°', '˙', '—']

interface Spec { s: string; px: number; c: string; g: string; spd: number; amp: number }

class Aircraft implements DraggableEntity {
  x: number; y: number; baseY: number; fishW: number
  spec: Spec; dir: number; dragging = false; throwVx = 0; throwVy = 0
  private speed: number; private phase: number; private freq: number
  private amp: number; private cellW: number

  constructor(ctx: CanvasRenderingContext2D, spec: Spec, x: number, y: number) {
    this.spec = spec
    this.x = x; this.y = y; this.baseY = y
    this.dir = Math.random() < 0.5 ? 1 : -1
    this.speed = spec.spd * rand(0.75, 1.25)
    this.phase = rand(0, Math.PI * 2)
    this.freq = rand(0.18, 0.42)
    this.amp = spec.amp * rand(0.7, 1.25)
    this.cellW = measureCell(ctx, spec.px)
    ctx.save()
    ctx.font = `${spec.px}px ${CANVAS_FONT}`
    this.fishW = ctx.measureText(spec.s).width
    ctx.restore()
  }

  get chars() { return this.dir < 0 ? flip(this.spec.s) : this.spec.s }

  update(dt: number, W: number, H: number) {
    if (this.dragging) { this.phase += dt * this.freq * 5; return }
    if (Math.abs(this.throwVx) > 1 || Math.abs(this.throwVy) > 1) {
      this.x += this.throwVx * dt
      this.baseY += this.throwVy * dt
      this.baseY = Math.max(44, Math.min(H * 0.58, this.baseY))
      const decay = Math.pow(0.5, dt / 0.28)
      this.throwVx *= decay; this.throwVy *= decay
    } else { this.throwVx = 0; this.throwVy = 0 }

    this.phase += dt * this.freq
    this.x += this.speed * this.dir * dt
    this.y = this.baseY + Math.sin(this.phase) * this.amp

    const pad = this.fishW + 40
    if (this.dir > 0 && this.x > W + pad) { this.x = -pad; this.baseY = rand(60, H * 0.55) }
    if (this.dir < 0 && this.x < -pad) { this.x = W + pad; this.baseY = rand(60, H * 0.55) }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.spec.px}px ${CANVAS_FONT}`
    ctx.fillStyle = this.dragging ? '#FFFFFF' : this.spec.c
    ctx.shadowColor = this.dragging ? 'rgba(255,255,255,0.9)' : this.spec.g
    ctx.shadowBlur = this.dragging ? 24 : 14
    const chars = this.chars
    const len = chars.length
    const wigAmp = this.dragging ? 5 : 1.8
    const wigFreq = this.dragging ? 4.6 : 2.0
    for (let i = 0; i < len; i++) {
      const lag = (this.dir > 0 ? i : len - 1 - i) * 0.26
      const cy = this.y + Math.sin(this.phase * wigFreq + lag) * wigAmp
      ctx.fillText(chars[i], this.x + i * this.cellW, cy)
    }
    ctx.restore()
  }
}

class Cloud {
  x: number; y: number
  private spd: number; private a: number; private sz: number
  private ch: string; private drift: number; private phase: number

  constructor(W: number, H: number, init: boolean) {
    this.x = init ? rand(-W * 0.2, W) : rand(-140, -40)
    this.y = rand(50, H * 0.42)
    this.spd = rand(10, 28)
    this.drift = rand(-4, 4)
    this.phase = rand(0, Math.PI * 2)
    this.a = rand(0.05, 0.16)
    this.sz = randInt(11, 18)
    this.ch = CLOUD_CHARS[randInt(0, CLOUD_CHARS.length - 1)]
  }

  update(dt: number) {
    this.phase += dt * 0.45
    this.x += this.spd * dt
    this.y += (this.drift + Math.sin(this.phase) * 0.8) * dt
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.a
    ctx.font = `${this.sz}px ${CANVAS_FONT}`
    ctx.fillStyle = '#CFE9FF'
    ctx.shadowColor = 'rgba(125,249,255,0.35)'
    ctx.shadowBlur = 10
    ctx.fillText(this.ch, this.x, this.y)
    ctx.restore()
  }

  get dead() { return this.x > 9999 }
}

class Contrail {
  private x: number; private y: number
  private vx: number; private vy: number
  private a: number; private sz: number; private life: number; private maxLife: number
  private ch: string

  constructor(x: number, y: number, dir: number) {
    this.x = x; this.y = y
    this.vx = -dir * rand(24, 60)
    this.vy = rand(-8, 8)
    this.a = rand(0.15, 0.45)
    this.sz = randInt(7, 11)
    this.life = rand(0.55, 1.25)
    this.maxLife = this.life
    this.ch = CONTRAIL_CHARS[randInt(0, CONTRAIL_CHARS.length - 1)]
  }

  update(dt: number) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = (this.life / this.maxLife) * this.a
    ctx.font = `${this.sz}px ${CANVAS_FONT}`
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowColor = 'rgba(125,249,255,0.35)'
    ctx.shadowBlur = 8
    ctx.fillText(this.ch, this.x, this.y)
    ctx.restore()
  }

  get dead() { return this.life <= 0 }
}

export function buildSkyScene(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  mobile: boolean,
): SceneDriver {
  const scale = mobile ? 0.8 : 1

  let aircraft: Aircraft[] = []
  let clouds: Cloud[] = []
  let trails: Contrail[] = []
  let cloudT = 0
  let trailT = 0
  let skyT = 0

  function build(ctx: CanvasRenderingContext2D, W: number, H: number) {
    aircraft = []; clouds = []; trails = []
    cloudT = 0; trailT = 0

    for (const sp of AIR_SPECS) {
      const px = Math.round(sp.px * scale)
      const count = mobile ? sp.n[0] : sp.n[1]
      const spec = { ...sp, px }
      for (let i = 0; i < count; i++) aircraft.push(new Aircraft(ctx, spec, rand(0, W), rand(70, H * 0.55)))
    }

    const cloudCount = mobile ? 26 : 46
    for (let i = 0; i < cloudCount; i++) clouds.push(new Cloud(W, H, true))
  }

  function drawBg(ctx: CanvasRenderingContext2D, dt: number, W: number, H: number) {
    skyT += dt
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#050A14')
    g.addColorStop(0.45, '#06172A')
    g.addColorStop(1, '#04070E')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    // subtle aurora-ish banding
    ctx.save()
    ctx.globalAlpha = 0.08
    for (let i = 0; i < (mobile ? 3 : 5); i++) {
      const y = H * (0.12 + i * 0.12) + Math.sin(skyT * 0.22 + i * 1.4) * 12
      const band = ctx.createLinearGradient(0, y, 0, y + 90)
      band.addColorStop(0, 'rgba(0,217,255,0)')
      band.addColorStop(0.5, 'rgba(0,217,255,0.5)')
      band.addColorStop(1, 'rgba(0,217,255,0)')
      ctx.fillStyle = band
      ctx.fillRect(0, y, W, 90)
    }
    ctx.restore()
  }

  build(ctx, W, H)

  return {
    tick(dt, ctx, W, H) {
      drawBg(ctx, dt, W, H)

      cloudT += dt
      if (cloudT > 0.7 && clouds.length < (mobile ? 28 : 52)) {
        cloudT = 0
        if (Math.random() < 0.65) clouds.push(new Cloud(W, H, false))
      }
      for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].update(dt)
        clouds[i].draw(ctx)
        if (clouds[i].x > W + 180) clouds.splice(i, 1)
      }

      trailT += dt
      if (trailT > 0.05) {
        trailT = 0
        for (const a of aircraft) {
          if (!a.dragging && Math.random() < 0.6) trails.push(new Contrail(a.x, a.y, a.dir))
        }
      }
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].update(dt); trails[i].draw(ctx)
        if (trails[i].dead) trails.splice(i, 1)
      }

      for (const a of aircraft) { a.update(dt, W, H); a.draw(ctx) }
    },

    rebuild(ctx, W, H) { build(ctx, W, H) },
    entities() { return aircraft },
  }
}

