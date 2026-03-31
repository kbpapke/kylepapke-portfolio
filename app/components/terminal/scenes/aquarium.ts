import { rand, randInt, flip, measureCell, DraggableEntity, SceneDriver } from '../sceneUtils'

const SPECIES_BASE = [
  { s: '><{{{°>',  px: 14, c: '#00FF87', g: 'rgba(0,255,135,0.35)',  spd: 55,  amp: 18, n: [2, 3] },
  { s: '><°>',     px: 12, c: '#00FF87', g: 'rgba(0,255,135,0.25)',  spd: 82,  amp: 11, n: [3, 4] },
  { s: '=><{{°>>', px: 16, c: '#FFB700', g: 'rgba(255,183,0,0.30)',  spd: 36,  amp: 23, n: [1, 2] },
  { s: '><(((*>',  px: 13, c: '#00D9FF', g: 'rgba(0,217,255,0.30)',  spd: 67,  amp: 14, n: [2, 3] },
  { s: '>~>',      px: 10, c: '#B8FFDA', g: 'rgba(184,255,218,0.2)', spd: 98,  amp:  8, n: [3, 5] },
  { s: '><{  °>',  px: 18, c: '#FF6B35', g: 'rgba(255,107,53,0.32)', spd: 27,  amp: 26, n: [1, 1] },
  { s: '><((()>',  px: 13, c: '#FF8C42', g: 'rgba(255,140,66,0.28)', spd: 60,  amp: 15, n: [1, 2] },
  { s: '~><{°>',   px: 11, c: '#7DF9FF', g: 'rgba(125,249,255,0.2)', spd: 74,  amp: 12, n: [1, 2] },
]

const BUBBLES = ['○', '◦', '°', '·', '˚']
const P_CHARS = '01><{}[]|~°·∴∵≈∞⌈⌉⌊⌋⟨⟩'.split('')

interface Spec { s: string; px: number; c: string; g: string; spd: number; amp: number }

class Fish implements DraggableEntity {
  x: number; y: number; baseY: number; fishW: number
  spec: Spec; dir: number; dragging = false; throwVx = 0; throwVy = 0
  private speed: number; private phase: number; private freq: number
  private amp: number; private cellW: number

  constructor(ctx: CanvasRenderingContext2D, spec: Spec, x: number, y: number) {
    this.spec = spec; this.x = x; this.y = y; this.baseY = y
    this.dir = Math.random() < 0.5 ? 1 : -1
    this.speed = spec.spd * rand(0.72, 1.28)
    this.phase = rand(0, Math.PI * 2)
    this.freq = rand(0.38, 0.70)
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
      this.baseY = Math.max(44, Math.min(H - 195, this.baseY))
      const decay = Math.pow(0.5, dt / 0.28)
      this.throwVx *= decay; this.throwVy *= decay
    } else { this.throwVx = 0; this.throwVy = 0 }
    this.phase += dt * this.freq
    this.x += this.speed * this.dir * dt
    this.y = this.baseY + Math.sin(this.phase) * this.amp
    const pad = this.fishW + 30
    if (this.dir > 0 && this.x > W + pad) { this.x = -pad; this.baseY = rand(44, H - 195) }
    if (this.dir < 0 && this.x < -pad) { this.x = W + pad; this.baseY = rand(44, H - 195) }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.spec.px}px "JetBrains Mono", monospace`
    ctx.fillStyle = this.dragging ? '#FFFFFF' : this.spec.c
    ctx.shadowColor = this.dragging ? 'rgba(255,255,255,0.9)' : this.spec.g
    ctx.shadowBlur = this.dragging ? 24 : 13
    const chars = this.chars, len = chars.length
    const wigAmp = this.dragging ? 6 : 2.2
    const wigFreq = this.dragging ? 4.8 : 2.2
    for (let i = 0; i < len; i++) {
      const lag = (this.dir > 0 ? i : len - 1 - i) * 0.28
      const cy = this.y + Math.sin(this.phase * wigFreq + lag) * wigAmp
      ctx.fillText(chars[i], this.x + i * this.cellW, cy)
    }
    ctx.restore()
  }
}

class Bubble {
  x: number; y: number
  private g: string; private sz: number; private rise: number
  private drift: number; private wb: number; private wf: number; private a: number

  constructor(x: number, y: number) {
    this.x = x + rand(-12, 12); this.y = y
    this.g = BUBBLES[randInt(0, BUBBLES.length - 1)]
    this.sz = rand(8, 15); this.rise = rand(18, 42)
    this.drift = rand(-6, 6); this.wb = rand(0, Math.PI * 2)
    this.wf = rand(0.4, 1.0); this.a = rand(0.2, 0.55)
  }
  update(dt: number) {
    this.wb += dt * this.wf; this.y -= this.rise * dt
    this.x += (this.drift + Math.sin(this.wb) * 4) * dt
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.globalAlpha = this.a
    ctx.font = `${this.sz}px "JetBrains Mono", monospace`
    ctx.fillStyle = '#A8D8FF'; ctx.shadowColor = '#00AAFF'; ctx.shadowBlur = 5
    ctx.fillText(this.g, this.x, this.y)
    ctx.restore()
  }
  get dead() { return this.y < -20 }
}

class Seaweed {
  private x: number; private segs: number; private ph: number
  private spd: number; private CELL = 14; private cols: string[]; private top: string

  constructor(x: number, H: number) {
    this.x = x; this.segs = randInt(4, 9)
    this.ph = rand(0, Math.PI * 2); this.spd = rand(0.25, 0.55)
    const hue = randInt(105, 155)
    this.cols = Array.from({ length: this.segs }, (_, i) =>
      `hsl(${hue},${60 + i * 3}%,${25 + i * 3}%)`)
    this.top = ['ψ', '¥', '✱', 'φ', '❧'][randInt(0, 4)]
    void H
  }
  update(dt: number) { this.ph += dt * this.spd }
  draw(ctx: CanvasRenderingContext2D, H: number) {
    ctx.save(); ctx.font = '13px "JetBrains Mono", monospace'
    for (let i = 0; i < this.segs; i++) {
      const sw = Math.sin(this.ph + i * 0.35) * (1.5 + i * 0.9)
      ctx.globalAlpha = 0.45 + 0.55 * (i / this.segs)
      ctx.fillStyle = this.cols[i]; ctx.shadowColor = this.cols[i]; ctx.shadowBlur = 3
      ctx.fillText(i === this.segs - 1 ? this.top : '|', this.x + sw, H - 20 - i * this.CELL)
    }
    ctx.restore()
  }
}

class TextParticle {
  x: number; y: number
  private ch: string; private spd: number; private a: number
  private sz: number; private col: string

  constructor(W: number, H: number, init: boolean) {
    this.x = rand(0, W)
    this.y = init ? rand(-H, 0) : rand(-30, -5)
    this.ch = P_CHARS[randInt(0, P_CHARS.length - 1)]
    this.spd = rand(12, 28); this.a = rand(0.04, 0.11)
    this.sz = randInt(9, 14)
    this.col = Math.random() < 0.65 ? '#00FF87' : '#00D9FF'
  }
  update(dt: number) { this.y += this.spd * dt }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.globalAlpha = this.a
    ctx.font = `${this.sz}px "JetBrains Mono", monospace`
    ctx.fillStyle = this.col
    ctx.fillText(this.ch, this.x, this.y)
    ctx.restore()
  }
  get dead() { return this.y > 9999 /* set per-frame using H */ }
}

export function buildAquariumScene(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  mobile: boolean,
): SceneDriver & { spawnBubbles(x: number, y: number, n: number): void } {
  const scale = mobile ? 0.78 : 1

  let fish: Fish[] = []
  let seaweeds: Seaweed[] = []
  let bubbles: Bubble[] = []
  let particles: TextParticle[] = []
  let bubbleT = 0, particleT = 0, causticT = 0

  const MAX_P = mobile ? 22 : 45

  function build(ctx: CanvasRenderingContext2D, W: number, H: number) {
    fish = []; seaweeds = []; bubbles = []; particles = []
    bubbleT = 0; particleT = 0

    for (const sp of SPECIES_BASE) {
      const px = Math.round(sp.px * scale)
      const count = mobile ? sp.n[0] : sp.n[1]
      const spec = { ...sp, px }
      for (let i = 0; i < count; i++)
        fish.push(new Fish(ctx, spec, rand(0, W), rand(44, H - 195)))
    }

    const swCount = mobile ? 10 : 22
    for (let i = 0; i < swCount; i++) seaweeds.push(new Seaweed(rand(20, W - 20), H))

    for (let i = 0; i < (mobile ? 18 : 35); i++) particles.push(new TextParticle(W, H, true))
  }

  function drawBg(ctx: CanvasRenderingContext2D, dt: number, W: number, H: number) {
    causticT += dt
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#010A16'); g.addColorStop(0.4, '#020C1A'); g.addColorStop(1, '#020508')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

    ctx.save()
    const shafts = mobile ? 4 : 7
    for (let i = 0; i < shafts; i++) {
      const ox = (i / (shafts - 1)) * W + Math.sin(causticT * 0.22 + i * 1.3) * 28
      const tx = ox + 8 + Math.sin(causticT * 0.18 + i) * 18
      const bw = 14 + Math.sin(causticT * 0.3 + i * 0.8) * 6
      const sg = ctx.createLinearGradient(ox, 0, tx, H * 0.65)
      sg.addColorStop(0, 'rgba(0,140,230,0.055)'); sg.addColorStop(1, 'rgba(0,100,200,0)')
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.moveTo(ox, 0); ctx.lineTo(ox + 18, 0)
      ctx.lineTo(tx + bw, H * 0.65); ctx.lineTo(tx - bw, H * 0.65)
      ctx.closePath(); ctx.fill()
    }
    ctx.restore()

    const sand = ctx.createLinearGradient(0, H - 28, 0, H)
    sand.addColorStop(0, 'rgba(55,42,18,0)'); sand.addColorStop(1, 'rgba(48,36,14,0.45)')
    ctx.fillStyle = sand; ctx.fillRect(0, H - 28, W, 28)

    ctx.save(); ctx.globalAlpha = 0.05
    ctx.strokeStyle = '#00D9FF'; ctx.lineWidth = 1
    for (let x = 0; x < W; x += 90) {
      const wx = x + Math.sin(causticT * 0.7 + x * 0.012) * 12
      ctx.beginPath(); ctx.moveTo(wx, 0)
      ctx.quadraticCurveTo(wx + 45, 4 + Math.sin(causticT * 1.1 + x * 0.008) * 3, wx + 90, 0)
      ctx.stroke()
    }
    ctx.restore()
  }

  build(ctx, W, H)

  return {
    tick(dt, ctx, W, H) {
      drawBg(ctx, dt, W, H)

      particleT += dt
      if (particleT > 0.14 && particles.length < MAX_P) {
        particleT = 0; particles.push(new TextParticle(W, H, false))
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(dt)
        if (particles[i].y > H + 20) { particles.splice(i, 1); continue }
        particles[i].draw(ctx)
      }

      for (const sw of seaweeds) { sw.update(dt); sw.draw(ctx, H) }

      bubbleT += dt
      if (bubbleT > rand(0.55, 1.1)) {
        bubbleT = 0
        const bx = rand(0, W)
        for (let i = 0; i < randInt(1, 3); i++) bubbles.push(new Bubble(bx, H - 30))
        if (fish.length && Math.random() < 0.45) {
          const f = fish[randInt(0, fish.length - 1)]
          bubbles.push(new Bubble(f.x + f.fishW * 0.5, f.y))
        }
      }
      for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].update(dt); bubbles[i].draw(ctx)
        if (bubbles[i].dead) bubbles.splice(i, 1)
      }

      for (const f of fish) { f.update(dt, W, H); f.draw(ctx) }
    },

    rebuild(ctx, W, H) { build(ctx, W, H) },
    entities() { return fish },

    spawnBubbles(x: number, y: number, n: number) {
      for (let i = 0; i < n; i++) bubbles.push(new Bubble(x, y))
    },
  }
}
