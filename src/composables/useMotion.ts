import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { animate, inView } from 'motion'

export const EASE = [0.22, 1, 0.36, 1] as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
