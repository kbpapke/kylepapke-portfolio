import { rand, randInt, DraggableEntity, SceneDriver } from '../sceneUtils'

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01><{}[]ABCDEF'.split('')

class MatrixColumn implements DraggableEntity {
  x: number; y: number; baseY = 0; fishW = 12
  spec = { px: 13 }; dir = 0
  dragging = false; throwVx = 0; throwVy = 0

  private speed: number; private len: number
  private chars: string[]; private mutateT = 0
  private cellH = 16

  constructor(x: number, H: number) {
    this.x = x; this.y = rand(-H, 0)
    this.speed = rand(80, 200); this.len = randInt(8, 22)
    this.chars = Array.from({ length: this.len }, () =>
      MATRIX_CHARS[randInt(0, MATRIX_CHARS.length - 1)])
  }

  update(dt: number, H: number) {
    if (this.dragging) return
    if (Math.abs(this.throwVy) > 1) {
      this.y += this.throwVy * dt
      this.throwVy *= Math.pow(0.5, dt / 0.28)
    } else {
      this.throwVy = 0
      this.y += this.speed * dt
    }
    if (this.y > H + this.len * this.cellH) {
      this.y = rand(-H * 0.5, -50)
      this.x = rand(0, 9999) // reset x handled by rebuild
      this.speed = rand(80, 200)
    }
    this.mutateT += dt
    if (this.mutateT > 0.12) {
      this.mutateT = 0
      this.chars[randInt(0, this.len - 1)] = MATRIX_CHARS[randInt(0, MATRIX_CHARS.length - 1)]
    }
  }

  draw(ctx: CanvasRenderingContext2D, H: number) {
    ctx.save()
    ctx.font = `${this.spec.px}px "JetBrains Mono", monospace`
    for (let i = 0; i < this.len; i++) {
      const cy = this.y + i * this.cellH
      if (cy < -this.cellH || cy > H + this.cellH) continue
      const isHead = i === this.len - 1
      if (isHead) {
        ctx.fillStyle = '#FFFFFF'
        ctx.shadowColor = '#00FF87'
        ctx.shadowBlur = 12
      } else {
        const fade = i / this.len
        ctx.fillStyle = `rgba(0,${Math.floor(180 + 75 * fade)},${Math.floor(80 * fade)},${0.2 + 0.8 * fade})`
        ctx.shadowBlur = 0
      }
      ctx.fillText(this.chars[i], this.x, cy)
    }
    ctx.restore()
  }
}

export function buildMatrixScene(
  _ctx: CanvasRenderingContext2D,
  W: number, H: number,
  _mobile: boolean,
): SceneDriver {
  let cols: MatrixColumn[] = []

  function build(W: number, H: number) {
    cols = []
    const count = Math.floor(W / 18)
    for (let i = 0; i < count; i++)
      cols.push(new MatrixColumn(i * 18 + rand(0, 8), H))
  }

  build(W, H)

  return {
    tick(dt, ctx, W, H) {
      ctx.fillStyle = 'rgba(0,4,0,0.18)'
      ctx.fillRect(0, 0, W, H)
      for (const c of cols) { c.update(dt, H); c.draw(ctx, H) }
    },

    rebuild(_ctx, W, H) { build(W, H) },
    entities() { return cols },
  }
}
