export const rand = (a: number, b: number) => a + Math.random() * (b - a)
export const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1))

const MIRROR: Record<string, string> = {
  '>': '<', '<': '>', '{': '}', '}': '{',
  '(': ')', ')': '(', '[': ']', ']': '[',
}
export const flip = (s: string) =>
  s.split('').reverse().map(c => MIRROR[c] ?? c).join('')

export function measureCell(
  ctx: CanvasRenderingContext2D,
  size: number,
  font = '"JetBrains Mono", monospace',
): number {
  ctx.font = `${size}px ${font}`
  return ctx.measureText('M').width
}

export interface DraggableEntity {
  x: number
  y: number
  baseY: number
  fishW: number
  spec: { px: number }
  dir: number
  dragging: boolean
  throwVx: number
  throwVy: number
}

export interface SceneDriver {
  tick(dt: number, ctx: CanvasRenderingContext2D, W: number, H: number): void
  rebuild(ctx: CanvasRenderingContext2D, W: number, H: number): void
  entities(): DraggableEntity[]
}
