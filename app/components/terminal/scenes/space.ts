import { rand, randInt, flip, measureCell, CANVAS_FONT, DraggableEntity, SceneDriver } from '../sceneUtils'

const ROCKET_DEFS = [
  // Icon-forward space sprites.
  { s: '🚀', px: 18, c: '#00FF87', g: 'rgba(0,255,135,0.4)',   spd: 55, n: [2, 3] },
  { s: '🛰', px: 17, c: '#7DF9FF', g: 'rgba(125,249,255,0.3)', spd: 40, n: [1, 2] },
  { s: '🛸', px: 18, c: '#FFB700', g: 'rgba(255,183,0,0.4)',   spd: 30, n: [1, 2] },
  { s: '☄', px: 18, c: '#FF6B35', g: 'rgba(255,107,53,0.4)',  spd: 80, n: [1, 2] },
  { s: '🪐', px: 18, c: '#B8FFDA', g: 'rgba(184,255,218,0.2)', spd: 22, n: [1, 1] },
]

const TRAIL_CHARS = ['·', '°', '*', '.']
const STAR_CHARS = ['.', '·', '*', '✦', '✧', '⊹']
const STAR_COLS = ['#FFFFFF', '#B8E0FF', '#FFE4B5', '#C8FFC8']

interface RocketSpec { s: string; px: number; c: string; g: string; spd: number }

class Rocket implements DraggableEntity {
  x: number; y: number; baseY: number; fishW: number
  spec: RocketSpec; dir: number; dragging = false; throwVx = 0; throwVy = 0
  private speed: number; private phase: number; private freq: number
  private amp: number; private cellW: number

  constructor(ctx: CanvasRenderingContext2D, def: RocketSpec, x: number, y: number) {
    this.spec = def; this.x = x; this.y = y; this.baseY = y
    this.dir = Math.random() < 0.5 ? 1 : -1
    this.speed = def.spd * rand(0.7, 1.3)
    this.phase = rand(0, Math.PI * 2)
    this.freq = rand(0.2, 0.5)
    this.amp = rand(10, 30)
    this.cellW = measureCell(ctx, def.px)
    ctx.save()
    ctx.font = `${def.px}px ${CANVAS_FONT}`
    this.fishW = ctx.measureText(def.s).width
    ctx.restore()
  }

  get chars() { return this.dir < 0 ? flip(this.spec.s) : this.spec.s }

  update(dt: number, W: number, H: number) {
    if (this.dragging) { this.phase += dt * this.freq * 5; return }
    if (Math.abs(this.throwVx) > 1 || Math.abs(this.throwVy) > 1) {
      this.x += this.throwVx * dt; this.y += this.throwVy * dt
      this.y = Math.max(10, Math.min(H - 10, this.y))
      const d = Math.pow(0.5, dt / 0.28)
      this.throwVx *= d; this.throwVy *= d
    } else { this.throwVx = 0; this.throwVy = 0 }
    this.phase += dt * this.freq
    this.x += this.speed * this.dir * dt
    this.y = this.baseY + Math.sin(this.phase) * this.amp
    const pad = this.fishW + 30
    if (this.dir > 0 && this.x > W + pad) { this.x = -pad; this.baseY = rand(30, H - 190) }
    if (this.dir < 0 && this.x < -pad) { this.x = W + pad; this.baseY = rand(30, H - 190) }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.spec.px}px ${CANVAS_FONT}`
    ctx.fillStyle = this.dragging ? '#FFFFFF' : this.spec.c
    ctx.shadowColor = this.dragging ? 'rgba(255,255,255,0.9)' : this.spec.g
    ctx.shadowBlur = this.dragging ? 24 : 15
    const chars = this.chars, len = chars.length
    const wigAmp = this.dragging ? 5 : 1.5
    const wigFreq = this.dragging ? 4.5 : 2
    for (let i = 0; i < len; i++) {
      const lag = (this.dir > 0 ? i : len - 1 - i) * 0.2
      const cy = this.y + Math.sin(this.phase * wigFreq + lag) * wigAmp
      ctx.fillText(chars[i], this.x + i * this.cellW, cy)
    }
    ctx.restore()
  }
}

class Star {
  private x: number; private y: number; private ch: string
  private a: number; private sz: number; private phase: number
  private freq: number; private col: string

  constructor(W: number, H: number) {
    this.x = rand(0, W); this.y = rand(0, H)
    this.ch = STAR_CHARS[randInt(0, STAR_CHARS.length - 1)]
    this.a = rand(0.1, 0.7); this.sz = rand(7, 12)
    this.phase = rand(0, Math.PI * 2); this.freq = rand(0.3, 1.5)
    this.col = STAR_COLS[randInt(0, STAR_COLS.length - 1)]
  }
  update(dt: number) { this.phase += dt * this.freq }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.a * (0.5 + 0.5 * Math.sin(this.phase))
    ctx.font = `${this.sz}px ${CANVAS_FONT}`
    ctx.fillStyle = this.col; ctx.shadowColor = this.col; ctx.shadowBlur = 4
    ctx.fillText(this.ch, this.x, this.y)
    ctx.restore()
  }
}

class Trail {
  private x: number; private y: number; private ch: string
  private vx: number; private vy: number; private a: number
  private sz: number; private life: number; private maxLife: number

  constructor(x: number, y: number, dir: number) {
    this.x = x; this.y = y
    this.ch = TRAIL_CHARS[randInt(0, TRAIL_CHARS.length - 1)]
    this.vx = -dir * rand(20, 50); this.vy = rand(-15, 15)
    this.a = rand(0.4, 0.8); this.sz = rand(7, 11)
    this.life = rand(0.4, 1.0); this.maxLife = this.life
  }
  update(dt: number) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.globalAlpha = (this.life / this.maxLife) * this.a
    ctx.font = `${this.sz}px "JetBrains Mono", monospace`
    ctx.fillStyle = '#FFB700'; ctx.shadowColor = '#FF6B35'; ctx.shadowBlur = 5
    ctx.fillText(this.ch, this.x, this.y)
    ctx.restore()
  }
  get dead() { return this.life <= 0 }
}

export function buildSpaceScene(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  mobile: boolean,
): SceneDriver {
  let rockets: Rocket[] = []
  let stars: Star[] = []
  let trails: Trail[] = []
  let trailT = 0

  function build(ctx: CanvasRenderingContext2D, W: number, H: number) {
    rockets = []; stars = []; trails = []; trailT = 0

    for (const def of ROCKET_DEFS) {
      const count = mobile ? def.n[0] : def.n[1]
      for (let i = 0; i < count; i++) {
        const r = new Rocket(ctx, def, rand(0, W), rand(30, H - 190))
        r.baseY = r.y
        rockets.push(r)
      }
    }

    const starCount = mobile ? 60 : 120
    for (let i = 0; i < starCount; i++) stars.push(new Star(W, H))
  }

  build(ctx, W, H)

  return {
    tick(dt, ctx, W, H) {
      // deep space bg
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, '#000308'); g.addColorStop(0.5, '#020008'); g.addColorStop(1, '#04000A')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      // nebula wisps
      ctx.save()
      const n1 = ctx.createRadialGradient(W * 0.3, H * 0.35, 0, W * 0.3, H * 0.35, W * 0.4)
      n1.addColorStop(0, 'rgba(40,0,80,0.18)'); n1.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = n1; ctx.fillRect(0, 0, W, H)
      const n2 = ctx.createRadialGradient(W * 0.75, H * 0.6, 0, W * 0.75, H * 0.6, W * 0.35)
      n2.addColorStop(0, 'rgba(0,40,80,0.15)'); n2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = n2; ctx.fillRect(0, 0, W, H)
      ctx.restore()

      for (const s of stars) { s.update(dt); s.draw(ctx) }

      trailT += dt
      if (trailT > 0.04) {
        trailT = 0
        for (const r of rockets) {
          if (!r.dragging && Math.random() < 0.6)
            trails.push(new Trail(r.x, r.y, r.dir))
        }
      }
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].update(dt); trails[i].draw(ctx)
        if (trails[i].dead) trails.splice(i, 1)
      }
      for (const r of rockets) { r.update(dt, W, H); r.draw(ctx) }
    },

    rebuild(ctx, W, H) { build(ctx, W, H) },
    entities() { return rockets },
  }
}
