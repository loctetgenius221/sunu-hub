import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { animate, inView } from 'motion'

export const EASE = [0.22, 1, 0.36, 1] as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Inclinaison 3D qui suit la souris (esprit Spline). Le parent doit porter une perspective.
 * Retourne les gestionnaires à brancher sur la zone de survol.
 */
export function usePointerTilt(target: Ref<HTMLElement | null>, strength = { x: 10, y: 8 }) {
  const spring = { type: 'spring', stiffness: 120, damping: 18 } as const

  function onPointerMove(e: PointerEvent) {
    const el = target.value
    if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    animate(el, { rotateY: x * strength.x, rotateX: -y * strength.y }, spring)
  }

  function onPointerLeave() {
    if (target.value) animate(target.value, { rotateY: 0, rotateX: 0 }, spring)
  }

  return { onPointerMove, onPointerLeave }
}

/** Compte de 0 à `to` à l'entrée dans l'écran. */
export function useCountUp(target: Ref<HTMLElement | null>, to: number) {
  let stop: (() => void) | undefined
  const format = (n: number) => Math.round(n).toLocaleString('fr-FR')

  onMounted(() => {
    const el = target.value
    if (!el) return
    if (prefersReducedMotion()) return void (el.textContent = format(to))
    el.textContent = format(0)
    stop = inView(el, () => {
      animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (v) => (el.textContent = format(v)) })
      stop?.()
    })
  })

  onBeforeUnmount(() => stop?.())
}

/**
 * Révèle un élément une seule fois à son entrée dans l'écran (montée + léger zoom).
 * Le contenu n'est jamais caché si le mouvement est réduit.
 */
export function useReveal(target: Ref<HTMLElement | SVGElement | null>, delay = 0) {
  let stop: (() => void) | undefined

  onMounted(() => {
    const el = target.value
    if (!el || prefersReducedMotion()) return
    el.style.opacity = '0'
    stop = inView(
      el,
      () => {
        animate(
          el,
          { opacity: [0, 1], transform: ['translateY(22px) scale(.96)', 'translateY(0) scale(1)'] },
          { duration: 0.8, delay, ease: EASE },
        )
        stop?.()
      },
      { amount: 0.25 },
    )
  })

  onBeforeUnmount(() => stop?.())
}
