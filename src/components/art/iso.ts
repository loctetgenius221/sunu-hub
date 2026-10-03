// Grammaire isométrique (DA §6) : unité 22 px, contour encre, faces assombries de 14 % et 28 %.
// Une scène est une liste de formes déjà projetées, dessinées dans l'ordre (peintre).

export const U = 22
const K = 0.866
export const INK = '#141414'

export type Vec3 = [number, number, number]
export type Pt = [number, number]

export const P = ([x, y, z]: Vec3): Pt => [(x - y) * K * U, (x + y) * 0.5 * U - z * U]

export type Shape =
  | { t: 'poly'; pts: Pt[]; fill: string }
  | { t: 'path'; d: string; fill: string; box: Pt[] }
  | { t: 'ellipse'; c: Pt; rx: number; ry: number; fill: string }
  | { t: 'circle'; c: Pt; r: number; fill: string; shine?: boolean; id?: string }
  | { t: 'line'; pts: Pt[]; dashed?: boolean; width?: number; color?: string; id?: string }

export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - amount)))
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')
}

/** Boîte : face supérieure, face gauche (y+d) et face droite (x+w). */
export function box(x: number, y: number, z: number, w: number, d: number, h: number, fill: string): Shape[] {
  const top = z + h
  return [
    { t: 'poly', fill: shade(fill, 0.14), pts: [P([x, y + d, top]), P([x + w, y + d, top]), P([x + w, y + d, z]), P([x, y + d, z])] },
    { t: 'poly', fill: shade(fill, 0.28), pts: [P([x + w, y, top]), P([x + w, y + d, top]), P([x + w, y + d, z]), P([x + w, y, z])] },
    { t: 'poly', fill, pts: [P([x, y, top]), P([x + w, y, top]), P([x + w, y + d, top]), P([x, y + d, top])] },
  ]
}

/** Cylindre vertical : corps puis disque supérieur. */
export function cyl(cx: number, cy: number, z: number, r: number, h: number, fill: string): Shape[] {
  const rx = 1.2247 * r * U
  const ry = 0.7071 * r * U
  const [bx, by] = P([cx, cy, z])
  const [tx, ty] = P([cx, cy, z + h])
  const d = `M${tx - rx} ${ty} L${bx - rx} ${by} A${rx} ${ry} 0 0 0 ${bx + rx} ${by} L${tx + rx} ${ty} Z`
  return [
    { t: 'path', d, fill: shade(fill, 0.2), box: [[bx - rx, by + ry], [tx + rx, ty]] },
    { t: 'ellipse', c: [tx, ty], rx, ry, fill },
  ]
}

export function sph(x: number, y: number, z: number, r: number, fill: string, id?: string): Shape {
  return { t: 'circle', c: P([x, y, z]), r: r * U, fill, shine: true, id }
}

/** Cône vertical : base elliptique et sommet. */
export function cone(cx: number, cy: number, z: number, r: number, h: number, fill: string): Shape[] {
  const rx = 1.2247 * r * U
  const ry = 0.7071 * r * U
  const [bx, by] = P([cx, cy, z])
  const [ax, ay] = P([cx, cy, z + h])
  const d = `M${bx - rx} ${by} A${rx} ${ry} 0 0 0 ${bx + rx} ${by} L${ax} ${ay} Z`
  return [{ t: 'path', d, fill, box: [[bx - rx, by + ry], [bx + rx, ay]] }]
}

export function line(pts: Vec3[], opts: { dashed?: boolean; width?: number; color?: string; id?: string } = {}): Shape {
  return { t: 'line', pts: pts.map(P), ...opts }
}

export const toPath = (pts: Pt[]) => 'M' + pts.map((p) => p.join(' ')).join(' L')

/** Boîte englobante de la scène pour un viewBox automatique. */
export function bounds(shapes: Shape[], pad = 6) {
  const xs: number[] = []
  const ys: number[] = []
  const add = ([x, y]: Pt) => (xs.push(x), ys.push(y))
  for (const s of shapes) {
    if (s.t === 'poly' || s.t === 'line') s.pts.forEach(add)
    else if (s.t === 'path') s.box.forEach(add)
    else if (s.t === 'ellipse') (add([s.c[0] - s.rx, s.c[1] - s.ry]), add([s.c[0] + s.rx, s.c[1] + s.ry]))
    else (add([s.c[0] - s.r, s.c[1] - s.r]), add([s.c[0] + s.r, s.c[1] + s.r]))
  }
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  return { x: minX, y: minY, w: Math.max(...xs) + pad - minX, h: Math.max(...ys) + pad - minY }
}
