<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { animate, stagger } from 'motion'
import IsoShapes from './IsoShapes.vue'
import { INK, P, bounds, box, cone, cyl, line, sph, toPath, type Shape, type Vec3 } from './iso'
import { BRAND } from './scenes'
import { EASE, prefersReducedMotion, usePointerTilt } from '@/composables/useMotion'
import { buildings, type BuildingId } from '@/data/home'

// Illustration signature « Le Hub » : quatre bâtiments (lycée, université, entreprise, incubateur)
// envoient des opportunités le long de l'avenue jusqu'au jeune, sur la place centrale.
// « Ce ne sont plus les jeunes qui cherchent les opportunités ; ce sont les opportunités qui les trouvent. »

const props = defineProps<{ active?: BuildingId }>()
const emit = defineEmits<{ select: [id: BuildingId] }>()

const { a: NAVY, b: ORANGE, c: GREEN, w: WHITE } = BRAND
const ROAD = '#eef1f5'
const C: Vec3 = [7, 7, 0]

// Sol quadrillé, avenue et allées.
const ground: Shape[] = [
  ...box(-0.5, -0.5, -0.35, 15, 15, 0.35, WHITE),
  ...Array.from({ length: 13 }, (_, k) => k + 1).flatMap((k) => [
    line([[k, -0.5, 0], [k, 14.5, 0]], { width: 1, color: '#0c347016' }),
    line([[-0.5, k, 0], [14.5, k, 0]], { width: 1, color: '#0c347016' }),
  ]),
  ...box(-0.5, 6.2, 0, 15, 1.6, 0.04, ROAD),
  ...box(2, 3.8, 0, 1, 2.4, 0.04, ROAD),
  ...box(2, 7.8, 0, 1, 2.4, 0.04, ROAD),
  ...box(11.2, 4, 0, 1, 2.2, 0.04, ROAD),
  ...box(11.2, 7.8, 0, 1, 2.6, 0.04, ROAD),
  line([[0, 7, 0.05], [14, 7, 0.05]], { dashed: true, width: 1.2 }),
]

const plaza: Shape[] = [
  ...cyl(7, 7, 0.04, 2.2, 0.26, NAVY),
  { t: 'ellipse', c: P([7, 7, 0.3]), rx: 1.2247 * 1.5 * 22, ry: 0.7071 * 1.5 * 22, fill: 'none' },
]

const pawn: Shape[] = [...cyl(7, 7, 0.3, 0.42, 0.2, ORANGE), ...cone(7, 7, 0.5, 0.33, 1.15, ORANGE), sph(7, 7, 1.9, 0.32, ORANGE)]

// Bâtiments : formes, point d'ancrage du libellé (sommet) et trajet des opportunités.
// `side` : libellé posé à droite du bâtiment plutôt qu'au-dessus (rangée avant, pour ne pas masquer la place).
const B: Record<BuildingId, { shapes: Shape[]; top: Vec3; side?: boolean; route: Vec3[]; token: string }> = {
  lycee: {
    shapes: [
      ...box(1, 1, 0, 3, 3, 2, WHITE),
      { t: 'poly', fill: NAVY, pts: [P([2.1, 4, 0]), P([2.9, 4, 0]), P([2.9, 4, 1.1]), P([2.1, 4, 1.1])] },
      ...cyl(3.5, 1.5, 2, 0.07, 1.7, NAVY),
      ...box(3.45, 0.55, 3.05, 0.1, 0.9, 0.6, GREEN),
    ],
    top: [2.5, 2.5, 3.9],
    route: [[2.5, 4.2, 0.35], [2.5, 7, 0.35], [4.7, 7, 0.35]],
    token: ORANGE,
  },
  entreprise: {
    shapes: [
      ...box(10.5, 1.5, 0, 2.4, 2.4, 5.2, ORANGE),
      ...[1.3, 2.5, 3.7].flatMap((z) => [line([[10.5, 3.9, z], [12.9, 3.9, z]], { width: 1.2 }), line([[12.9, 1.5, z], [12.9, 3.9, z]], { width: 1.2 })]),
      ...box(10.9, 1.9, 5.2, 1.6, 1.6, 0.5, WHITE),
      ...cyl(11.7, 2.7, 5.7, 0.06, 1, NAVY),
    ],
    top: [11.7, 2.7, 6.8],
    route: [[11.7, 4.1, 0.35], [11.7, 7, 0.35], [9.3, 7, 0.35]],
    token: WHITE,
  },
  universite: {
    shapes: [
      ...box(1, 10, 0, 3.2, 3, 0.4, WHITE),
      ...box(1.3, 10.3, 0.4, 2.6, 2.4, 2, NAVY),
      ...[1.8, 2.6, 3.4].flatMap((x) => cyl(x, 12.9, 0.4, 0.14, 2, WHITE)),
      ...box(1.1, 10.1, 2.4, 3, 2.8, 0.3, WHITE),
      ...cone(2.6, 11.5, 2.7, 1.4, 1.1, ORANGE),
    ],
    top: [2.6, 11.5, 4],
    route: [[2.5, 9.8, 0.35], [2.5, 7, 0.35], [4.7, 7, 0.35]],
    token: GREEN,
  },
  incubateur: {
    shapes: [
      ...box(10.3, 10.3, 0, 2.8, 2.8, 1.6, GREEN),
      { t: 'poly', fill: WHITE, pts: [P([10.9, 13.1, 0.4]), P([12.5, 13.1, 0.4]), P([12.5, 13.1, 1.2]), P([10.9, 13.1, 1.2])] },
      ...cyl(11.7, 11.7, 1.6, 0.32, 0.35, NAVY),
      sph(11.7, 11.7, 2.45, 0.55, WHITE),
    ],
    top: [13.1, 10.3, 1.2],
    side: true,
    route: [[11.7, 10.1, 0.35], [11.7, 7, 0.35], [9.3, 7, 0.35]],
    token: NAVY,
  },
}

// Ordre du peintre : rangée arrière, place, jetons, puis rangée avant.
const back: BuildingId[] = ['lycee', 'entreprise']
const front: BuildingId[] = ['universite', 'incubateur']

const tokenShapes = (fill: string) => box(-0.3, -0.3, 0, 0.6, 0.6, 0.45, fill)
const tokens = (Object.keys(B) as BuildingId[]).map((id, i) => ({
  id,
  shapes: tokenShapes(B[id].token),
  path: toPath(B[id].route.map(P)),
  begin: -i * 0.9,
}))

const vb = bounds([...ground, ...Object.values(B).flatMap((b) => b.shapes)], 14)
const pct = ([x, y]: [number, number]) => ({
  left: `${((x - vb.x) / vb.w) * 100}%`,
  top: `${((y - vb.y) / vb.h) * 100}%`,
})

const hovered = ref<BuildingId | null>(null)
const lit = computed(() => hovered.value ?? props.active ?? null)
const onEnter = (id: BuildingId) => (e: PointerEvent) => e.pointerType === 'mouse' && (hovered.value = id)
const onLeave = (e: PointerEvent) => e.pointerType === 'mouse' && (hovered.value = null)

const live = ref(false)
const svg = ref<SVGSVGElement | null>(null)
const tilt = ref<HTMLElement | null>(null)
const { onPointerMove, onPointerLeave } = usePointerTilt(tilt, { x: 8, y: 6 })

onMounted(() => {
  if (prefersReducedMotion() || !svg.value) return
  live.value = true
  // Les bâtiments sortent du sol l'un après l'autre.
  const rising = svg.value.querySelectorAll<SVGGElement>('[data-rise]')
  animate(
    rising,
    { opacity: [0, 1], transform: ['translateY(36px)', 'translateY(0px)'] },
    { duration: 0.9, delay: stagger(0.12, { startDelay: 0.15 }), ease: EASE },
  )
})
</script>

<template>
  <figure class="w-full">
    <div class="[perspective:1400px]" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
      <div ref="tilt" class="relative">
        <svg
          ref="svg"
          :viewBox="`${vb.x} ${vb.y} ${vb.w} ${vb.h}`"
          class="block h-auto w-full overflow-visible"
          role="img"
          aria-label="Quatre bâtiments, lycée, université, entreprise et incubateur, envoient des opportunités vers un jeune au centre de la place."
        >
          <g :stroke="INK" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
            <IsoShapes :shapes="ground" />

            <!-- Trajet du bâtiment allumé, tracé en orange. -->
            <path
              v-if="lit"
              :d="toPath(B[lit].route.map(P))"
              fill="none"
              :stroke="ORANGE"
              stroke-width="3.5"
              class="transition-opacity"
            />

            <g
              v-for="id in back"
              :key="id"
              data-rise
              class="cursor-pointer"
              @pointerenter="onEnter(id)($event)"
              @pointerleave="onLeave"
              @click="emit('select', id)"
            >
              <g class="transition-transform duration-300 ease-out" :style="{ transform: lit === id ? 'translateY(-12px)' : 'none' }">
                <IsoShapes :shapes="B[id].shapes" />
              </g>
            </g>

            <g data-rise>
              <IsoShapes :shapes="plaza" />
              <ellipse
                v-if="live"
                :cx="P([7, 7, 0.3])[0]"
                :cy="P([7, 7, 0.3])[1]"
                :rx="1.2247 * 1.5 * 22"
                :ry="0.7071 * 1.5 * 22"
                fill="none"
                :stroke="GREEN"
                stroke-width="3"
                class="hub-ring"
              />
              <IsoShapes :shapes="pawn" />
            </g>

            <!-- Les opportunités circulent vers la place et s'y effacent. -->
            <template v-if="live">
              <g v-for="t in tokens" :key="t.id" opacity="0">
                <IsoShapes :shapes="t.shapes" />
                <animateMotion :path="t.path" dur="3.6s" :begin="`${t.begin}s`" repeatCount="indefinite" calcMode="paced" />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.12;0.85;1"
                  dur="3.6s"
                  :begin="`${t.begin}s`"
                  repeatCount="indefinite"
                />
              </g>
            </template>

            <g
              v-for="id in front"
              :key="id"
              data-rise
              class="cursor-pointer"
              @pointerenter="onEnter(id)($event)"
              @pointerleave="onLeave"
              @click="emit('select', id)"
            >
              <g class="transition-transform duration-300 ease-out" :style="{ transform: lit === id ? 'translateY(-12px)' : 'none' }">
                <IsoShapes :shapes="B[id].shapes" />
              </g>
            </g>
          </g>
        </svg>

        <!-- Libellés posés au-dessus de chaque bâtiment (≥ 640 px). -->
        <button
          v-for="(b, id) in buildings"
          :key="id"
          type="button"
          class="absolute flex items-center gap-2 border-2 border-ink px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-[background-color,transform] duration-300 max-sm:hidden lg:text-sm"
          :class="[
            B[id].side ? 'ml-3 -translate-y-1/2' : '-translate-x-1/2',
            !B[id].side && (lit === id ? '-translate-y-[calc(100%+20px)]' : '-translate-y-[calc(100%+6px)]'),
            lit === id ? 'bg-orange' : 'bg-white',
          ]"
          :style="pct(P(B[id].top))"
          :aria-pressed="active === id"
          @pointerenter="onEnter(id)($event)"
          @pointerleave="onLeave"
          @click="emit('select', id)"
        >
          {{ b.label }}
        </button>
      </div>
    </div>

    <figcaption class="mt-4 text-sm text-ink-soft" aria-live="polite">
      <span class="font-semibold text-ink">Figure 1.&nbsp;</span>
      <template v-if="lit">{{ buildings[lit].label }} : {{ buildings[lit].offers.toLowerCase() }}, vérifiés avant d'arriver jusqu'à toi.</template>
      <template v-else>Les opportunités viennent à toi, vérifiées.</template>
    </figcaption>
  </figure>
</template>

<style scoped>
.hub-ring {
  transform-box: fill-box;
  transform-origin: center;
  animation: hub-ring 1.8s var(--ease-out-soft) infinite;
}

@keyframes hub-ring {
  from {
    transform: scale(0.7);
    opacity: 1;
  }
  to {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
