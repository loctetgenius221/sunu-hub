import type { Directive } from 'vue'
import { animate, inView, scroll, stagger } from 'motion'
import { EASE, prefersReducedMotion } from '@/composables/useMotion'

// Apparition au défilement, réversible et sensible au sens : l'élément entre quand il
// arrive à l'écran, se retire quand il en sort (vers le haut s'il sort par le haut),
// et revient du bon côté quand on remonte.
//
//   v-reveal                 montée + fondu, réversible
//   v-reveal.once            une seule fois (haut de page, pages de travail)
//   v-reveal.stagger         anime les enfants directs l'un après l'autre
//   v-reveal="{ delay: 0.2, distance: 40 }"
//
// Bonnes pratiques : transform et opacity uniquement ; l'état de départ n'est posé
// qu'en JavaScript (le contenu reste visible sans script) ; rien sous « réduire les animations ».

interface RevealOptions {
  delay?: number
  distance?: number
}

type El = HTMLElement & { __stop?: () => void }

const ENTER_DURATION = 0.75
const LEAVE = { duration: 0.35, ease: [0.4, 0, 1, 1] as const }

const targetsOf = (el: HTMLElement, all: boolean) => (all ? (Array.from(el.children) as HTMLElement[]) : [el])
// Au-dessus de l'écran : l'élément est (ou part) vers le haut.
const above = (entry: IntersectionObserverEntry) => entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)

export const reveal: Directive<El, RevealOptions | undefined> = {
  beforeMount(el, { modifiers, value }) {
    if (prefersReducedMotion()) return
    for (const t of targetsOf(el, !!modifiers.stagger)) {
      t.style.opacity = '0'
      t.style.transform = `translateY(${value?.distance ?? 32}px)`
    }
    el.dataset.reveal = ''
  },

  mounted(el, { modifiers, value }) {
    if (prefersReducedMotion()) return
    const targets = targetsOf(el, !!modifiers.stagger)
    const d = value?.distance ?? 32
    const delay = value?.delay ?? 0

    el.__stop = inView(
      el,
      (_, entry) => {
        const from = above(entry) ? -d : d
        animate(
          targets,
          { opacity: [0, 1], transform: [`translateY(${from}px)`, 'translateY(0px)'] },
          { duration: ENTER_DURATION, ease: EASE, delay: modifiers.stagger ? stagger(0.07, { startDelay: delay }) : delay },
        )
        if (modifiers.once) return void queueMicrotask(() => el.__stop?.())
        return (leave) => {
          animate(targets, { opacity: 0, transform: `translateY(${above(leave) ? -d : d}px)` }, LEAVE)
        }
      },
      { amount: 0.2 },
    )
  },

  unmounted(el) {
    el.__stop?.()
  },
}

// Parallaxe liée au défilement : l'élément glisse de -n à +n px pendant que son parent
// traverse l'écran. Le mouvement suit exactement le défilement, dans les deux sens.
//   v-parallax="60"
export const parallax: Directive<El, number | undefined> = {
  mounted(el, { value }) {
    if (prefersReducedMotion()) return
    const n = value ?? 60
    el.__stop = scroll(
      animate(el, { transform: [`translateY(${-n}px)`, `translateY(${n}px)`] }, { ease: 'linear' }),
      { target: el.parentElement ?? el, offset: ['start end', 'end start'] },
    )
  },
  unmounted(el) {
    el.__stop?.()
  },
}
