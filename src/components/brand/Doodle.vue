<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, inView, stagger } from 'motion'
import { EASE, prefersReducedMotion } from '@/composables/useMotion'

// Annotations dessinées à la main : un seul trait, orange du logo, tracé à l'écran une fois
// quand il apparaît. Chaque dessin a un rôle précis (guider vers une action, souligner une
// promesse) ; ils restent rares : quatre sur tout le site. Décoratifs, ignorés des lecteurs d'écran.
type Name = 'arrow-curve' | 'arrow-loop' | 'underline' | 'megaphone'

const props = withDefaults(defineProps<{ name: Name; delay?: number }>(), { delay: 0 })

const drawings: Record<Name, { viewBox: string; paths: string[]; stretch?: boolean }> = {
  // Flèche courbe : relie une action à son résultat.
  'arrow-curve': {
    viewBox: '0 0 120 80',
    // Part d'en bas à gauche, remonte et arrive à l'horizontale : la pointe vise ce qui est à droite.
    paths: ['M8 70c4-28 34-46 98-42', 'M93 18.5l13 9.5-13.5 8'],
  },
  // Flèche en boucle : désigne l'action finale.
  'arrow-loop': {
    viewBox: '0 0 120 90',
    paths: ['M6 22c26-16 60-12 60 12 0 18-26 18-22 2 4-16 40-12 62 34', 'M93 66.5 106 70l3-13'],
  },
  // Double soulignement au feutre sous un chiffre clé : appuie la promesse sans toucher le texte.
  underline: {
    viewBox: '0 0 200 24',
    paths: ['M4 9c46-6 120-8 192-2', 'M22 19c40-4 96-5 150-1'],
    stretch: true,
  },
  // Haut-parleur : « on te prévient ».
  megaphone: {
    viewBox: '0 0 64 64',
    paths: ['M10 27v11h8l22 12V14L18 27Z', 'M18 38l4 12h6l-2-10', 'M47 25c3.5 3.5 3.5 10.5 0 14', 'M53 19c7 7 7 19 0 26'],
  },
}

const svg = ref<SVGSVGElement | null>(null)
let stop: VoidFunction | undefined

onMounted(() => {
  if (prefersReducedMotion() || !svg.value) return
  const paths = Array.from(svg.value.querySelectorAll('path'))
  // État de départ posé en JavaScript : sans script, le dessin est simplement visible.
  paths.forEach((p) => (p.style.strokeDashoffset = '1'))
  stop = inView(
    svg.value,
    () => {
      animate(paths, { strokeDashoffset: [1, 0] }, { duration: 0.9, ease: EASE, delay: stagger(0.25, { startDelay: props.delay }) })
    },
    { amount: 0.6 },
  )
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <svg
    ref="svg"
    :viewBox="drawings[name].viewBox"
    :preserveAspectRatio="drawings[name].stretch ? 'none' : undefined"
    fill="none"
    stroke="currentColor"
    stroke-width="2.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="pointer-events-none overflow-visible text-brand-orange print:hidden"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="d in drawings[name].paths" :key="d" :d="d" pathLength="1" stroke-dasharray="1" />
  </svg>
</template>
