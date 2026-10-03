import { P, box, cone, cyl, line, sph, toPath, type Shape, type Vec3 } from './iso'

// Catalogue des scènes SUNU HŪB. Couleurs passées par palette pour le mode sobre (`mono`).
export interface Palette {
  a: string // structure (marine)
  b: string // action (orange)
  c: string // signal (vert)
  w: string // blanc
  accent: string // billes et impulsions
}

export const BRAND: Palette = { a: '#0c3470', b: '#ff6b00', c: '#00ff57', w: '#ffffff', accent: '#ff6b00' }
export const MONO: Palette = { a: '#b9bec8', b: '#e6e8ec', c: '#ffffff', w: '#ffffff', accent: '#141414' }

/** Trajectoires animées (en coordonnées écran) pour le mode `live`. */
export interface Motion {
  id: string
  path: string
  dur: number
  keyPoints?: string
  keyTimes?: string
  begin?: number
}

export interface Scene {
  shapes: Shape[]
  motions?: Motion[]
}

const steps = (p: Palette): Scene => {
  const tops: Vec3[] = [
    [1.25, 1, 1.45],
    [1.25, -1, 2.45],
    [1.25, -3, 3.45],
  ]
  // Bille : pause sur chaque marche, petit bond entre elles.
  const hop = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.max(a[2], b[2]) + 0.6]
  const pts = [tops[0]!, hop(tops[0]!, tops[1]!), tops[1]!, hop(tops[1]!, tops[2]!), tops[2]!].map(P)
  return {
    shapes: [
      ...box(0, -4, 0, 2.5, 2, 3, p.a),
      ...box(0, -2, 0, 2.5, 2, 2, p.b),
      ...box(0, 0, 0, 2.5, 2, 1, p.c),
      sph(...tops[0]!, 0.45, p.w, 'ball'),
    ],
    motions: [
      {
        id: 'ball',
        path: toPath(pts),
        dur: 5,
        keyPoints: '0;0;0.5;0.5;1;1;0',
        keyTimes: '0;0.15;0.3;0.45;0.6;0.9;1',
      },
    ],
  }
}

const network = (p: Palette): Scene => {
  const A: Vec3 = [0.8, 0.8, 0.8]
  const B: Vec3 = [4.8, 1.4, 0.8]
  const C: Vec3 = [1.6, 4.8, 0.8]
  const links: [Vec3, Vec3][] = [
    [A, B],
    [B, C],
    [C, A],
  ]
  return {
    shapes: [
      ...links.map(([s, e]) => line([s, e], { dashed: true })),
      ...box(0, 0, 0, 1.6, 1.6, 1.6, p.a),
      ...box(4, 0.6, 0, 1.6, 1.6, 1.6, p.b),
      ...box(0.8, 4, 0, 1.6, 1.6, 1.6, p.c),
    ],
    motions: links.map(([s, e], i) => ({ id: `pulse${i}`, path: toPath([P(s), P(e)]), dur: 2.4, begin: -i * 0.8 })),
  }
}

const pawn = (x: number, y: number, fill: string): Shape[] => [
  ...cyl(x, y, 0.4, 0.5, 0.25, fill),
  ...cone(x, y, 0.65, 0.38, 1.3, fill),
  sph(x, y, 2.05, 0.36, fill),
]

const pawns = (p: Palette): Scene => ({
  shapes: [...box(0, 0, 0, 6, 2.6, 0.4, p.w), ...pawn(1, 1.3, p.a), ...pawn(3, 1.3, p.b), ...pawn(5, 1.3, p.c)],
})

const sheets = (p: Palette): Scene => {
  const lines = [0.8, 1.4, 2].map((y) => line([[0.9, y, 0.72], [2.8, y, 0.72]], { width: 1.4, color: '#14141466' }))
  return {
    shapes: [
      ...box(0.4, 0.3, 0, 3, 3.6, 0.24, p.w),
      ...box(0.2, 0.15, 0.24, 3, 3.6, 0.24, p.w),
      ...box(0, 0, 0.48, 3, 3.6, 0.24, p.w),
      ...lines,
      ...cyl(2.2, 2.9, 0.72, 0.55, 0.18, p.b),
      ...cyl(2.2, 2.9, 0.9, 0.18, 0.7, p.a),
    ],
  }
}

const signpost = (p: Palette): Scene => ({
  shapes: [
    ...cyl(0, 0, 0, 1.1, 0.3, p.a),
    ...cyl(0, 0, 0.3, 0.18, 4.8, p.w),
    ...box(0.2, -0.15, 3.4, 3, 0.3, 0.9, p.b),
    ...box(-0.15, 0.2, 2.2, 0.3, 3, 0.9, p.c),
  ],
})

const shield = (p: Palette): Scene => ({
  shapes: [
    ...box(-0.4, -0.6, 0, 3.8, 1.6, 0.4, p.a),
    ...box(0, 0, 0.4, 3, 0.4, 3.4, p.c),
    line(
      [
        [0.75, 0.42, 2.2],
        [1.35, 0.42, 1.5],
        [2.35, 0.42, 3],
      ],
      { width: 5, color: '#141414' },
    ),
  ],
})

const phone = (p: Palette): Scene => ({
  shapes: [
    ...box(0, 0, 0, 2.1, 0.35, 3.9, p.a),
    {
      t: 'poly',
      fill: p.w,
      pts: [P([0.2, 0.36, 3.6]), P([1.9, 0.36, 3.6]), P([1.9, 0.36, 0.5]), P([0.2, 0.36, 0.5])],
    },
    ...box(1.5, -0.4, 3.2, 2, 0.3, 1.1, p.c),
    sph(3.4, -0.25, 4.45, 0.32, p.b),
  ],
})

export const scenes = { steps, network, pawns, sheets, signpost, shield, phone }
export type SceneKind = keyof typeof scenes
