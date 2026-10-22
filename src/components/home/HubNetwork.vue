<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { animate, stagger } from 'motion'
import { EASE, prefersReducedMotion } from '@/composables/useMotion'
import { hubNodes } from '@/data/home'
import type { Stage } from '@/types'

// Réseau du héros : « Toi » au centre, relié aux opportunités. Les liens se tracent à
// l'arrivée, puis des points voyagent des destinations vers le centre : les opportunités
// viennent à toi. Le stade choisi (« Je suis… ») allume les destinations qui le concernent.
const props = defineProps<{ stage: Stage }>()

const C = 300 // centre
const R = 212 // rayon des destinations
const rad = (deg: number) => (deg * Math.PI) / 180
const at = (deg: number, r: number) => ({ x: C + r * Math.sin(rad(deg)), y: C - r * Math.cos(rad(deg)) })
// Courbe légèrement tournante, du centre vers le point : l'effet « tourbillon » de l'illustration.
const curve = (deg: number, r: number) => {
  const end = at(deg, r)
  const ctrl = at(deg - 16, r * 0.55)
  return `M${C} ${C}Q${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`
}

const nodes = computed(() =>
  hubNodes.map((n, i) => {
    const p = at(n.angle, R)
    const l = at(n.angle, R + 26)
    const sin = Math.sin(rad(n.angle))
    const cos = Math.cos(rad(n.angle))
    return {
      ...n,
      ...p,
      d: curve(n.angle, R),
      active: n.for.includes(props.stage),
      tag: {
        x: l.x,
        y: l.y + (cos > 0.6 ? -14 : cos < -0.6 ? 30 : 8),
        anchor: sin > 0.3 ? 'start' : sin < -0.3 ? 'end' : 'middle',
      },
      // Durées décalées : les points n'arrivent jamais tous en même temps.
      dur: `${3.2 + (i % 3) * 0.7}s`,
      begin: `${(i * 0.45).toFixed(2)}s`,
    }
  }),
)

// Points secondaires, entre deux destinations : la densité du réseau, sans texte.
const minor = hubNodes.map((n, i) => {
  const next = hubNodes[(i + 1) % hubNodes.length]!
  const span = (next.angle - n.angle + 360) % 360
  const angle = n.angle + span / 2
  const r = i % 2 ? 150 : 178
  return { ...at(angle, r), d: curve(angle, r) }
})

const label = `Toi, au centre, relié à : ${hubNodes.map((n) => n.label.toLowerCase()).join(', ')}.`

const svg = ref<SVGSVGElement | null>(null)
const animated = !prefersReducedMotion()

onMounted(() => {
  if (!animated || !svg.value) return
  const lines = svg.value.querySelectorAll('[data-line]')
  const dots = svg.value.querySelectorAll('[data-dot]')
  lines.forEach((l) => ((l as SVGPathElement).style.strokeDashoffset = '1'))
  dots.forEach((d) => ((d as SVGElement).style.opacity = '0'))
  animate(lines, { strokeDashoffset: [1, 0] }, { duration: 1.1, ease: EASE, delay: stagger(0.05, { startDelay: 0.3 }) })
  animate(dots, { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.05, { startDelay: 0.9 }) })
})
</script>

<template>
  <svg ref="svg" viewBox="-40 50 700 520" class="h-auto w-full overflow-visible" role="img" :aria-label="label">
    <!-- Liens secondaires : retirés sur mobile, où le réseau doit rester lisible -->
    <g class="max-sm:hidden" fill="none" stroke="#8fb8ff" stroke-opacity="0.28" stroke-width="1.5">
      <path v-for="(m, i) in minor" :key="`m${i}`" :d="m.d" pathLength="1" stroke-dasharray="1" data-line />
    </g>
    <g class="max-sm:hidden" fill="#071e44" stroke="#8fb8ff" stroke-opacity="0.55" stroke-width="1.5">
      <circle v-for="(m, i) in minor" :key="`md${i}`" :cx="m.x" :cy="m.y" r="4" data-dot />
    </g>

    <!-- Liens principaux -->
    <g fill="none" stroke-width="2" stroke-linecap="round">
      <path
        v-for="n in nodes"
        :id="`hub-${n.id}`"
        :key="n.id"
        :d="n.d"
        pathLength="1"
        stroke-dasharray="1"
        data-line
        class="transition-[stroke,stroke-opacity] duration-500"
        :stroke="n.active ? '#a9d3ff' : '#8fb8ff'"
        :stroke-opacity="n.active ? 0.85 : 0.32"
      />
    </g>

    <!-- Opportunités en route vers toi (seulement pour les destinations allumées) -->
    <g v-if="animated" fill="#7dd3a0">
      <template v-for="n in nodes" :key="`p${n.id}`">
        <circle v-if="n.active" r="4.5" opacity="0">
          <animateMotion :dur="n.dur" :begin="n.begin" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
            <mpath :href="`#hub-${n.id}`" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" :dur="n.dur" :begin="n.begin" repeatCount="indefinite" />
        </circle>
      </template>
    </g>

    <!-- Destinations -->
    <!-- Deux groupes : l'apparition anime le premier, l'état actif règle le second. -->
    <g v-for="n in nodes" :key="`n${n.id}`" data-dot>
      <g class="transition-opacity duration-500" :opacity="n.active ? 1 : 0.5">
      <circle :cx="n.x" :cy="n.y" :r="n.active ? 10 : 7.5" fill="#fff" class="transition-[r] duration-500" />
      <circle v-if="n.active" :cx="n.x" :cy="n.y" r="16" fill="none" stroke="#7dd3a0" stroke-width="2.5" />
      <text
        :x="n.tag.x"
        :y="n.tag.y"
        :text-anchor="n.tag.anchor"
        fill="#fff"
        font-size="25"
        font-weight="500"
        letter-spacing="-0.01em"
      >
        {{ n.label }}
      </text>
      </g>
    </g>

    <!-- Toi -->
    <g>
      <circle v-if="animated" :cx="C" :cy="C" r="52" fill="none" stroke="#7dd3a0" stroke-width="2">
        <animate attributeName="r" values="52;84" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.55;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle :cx="C" :cy="C" r="52" fill="#071e44" stroke="#7dd3a0" stroke-width="3.5" />
      <text :x="C" :y="C + 11" text-anchor="middle" fill="#fff" font-size="32" font-weight="700" letter-spacing="-0.02em">Toi</text>
    </g>
  </svg>
</template>
