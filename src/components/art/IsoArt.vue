<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { INK, bounds, toPath } from './iso'
import { BRAND, MONO, scenes, type SceneKind } from './scenes'
import { prefersReducedMotion, useReveal } from '@/composables/useMotion'

// Illustration isométrique générée (DA §6). `live` : animations continues (2 à 3 par écran maximum).
const props = withDefaults(
  defineProps<{ kind: SceneKind; mono?: boolean; live?: boolean; scale?: number; reveal?: boolean }>(),
  { scale: 1, reveal: true },
)

const uid = useId()
const scene = computed(() => scenes[props.kind](props.mono ? MONO : BRAND))
const vb = computed(() => bounds(scene.value.shapes))
const animate = computed(() => props.live && !prefersReducedMotion())
const motionFor = (id?: string) => (id && animate.value ? scene.value.motions?.find((m) => m.id === id) : undefined)

const root = ref<SVGSVGElement | null>(null)
if (props.reveal) useReveal(root)
</script>

<template>
  <svg
    ref="root"
    :viewBox="`${vb.x} ${vb.y} ${vb.w} ${vb.h}`"
    :width="vb.w * scale"
    :height="vb.h * scale"
    class="iso-art max-w-full overflow-visible"
    aria-hidden="true"
    focusable="false"
  >
    <g :stroke="INK" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
      <template v-for="(s, i) in scene.shapes" :key="i">
        <polygon v-if="s.t === 'poly'" :points="s.pts.map((p) => p.join(',')).join(' ')" :fill="s.fill" />
        <path v-else-if="s.t === 'path'" :d="s.d" :fill="s.fill" />
        <ellipse v-else-if="s.t === 'ellipse'" :cx="s.c[0]" :cy="s.c[1]" :rx="s.rx" :ry="s.ry" :fill="s.fill" />
        <path
          v-else-if="s.t === 'line'"
          :d="toPath(s.pts)"
          fill="none"
          :stroke="s.color ?? INK"
          :stroke-width="s.width ?? 1.6"
          :stroke-dasharray="s.dashed ? '4 5' : undefined"
          :class="s.dashed && live && 'iso-flow'"
        />
        <g v-else-if="s.t === 'circle'">
          <!-- Une bille animée part de l'origine et suit sa trajectoire. -->
          <g :transform="motionFor(s.id) ? undefined : `translate(${s.c[0]} ${s.c[1]})`">
            <circle :r="s.r" :fill="s.fill" />
            <circle v-if="s.shine" :cx="-s.r * 0.35" :cy="-s.r * 0.35" :r="s.r * 0.22" fill="#fff" stroke="none" />
            <animateMotion
              v-if="motionFor(s.id)"
              :path="motionFor(s.id)!.path"
              :dur="`${motionFor(s.id)!.dur}s`"
              :keyPoints="motionFor(s.id)!.keyPoints"
              :keyTimes="motionFor(s.id)!.keyTimes"
              :calcMode="motionFor(s.id)!.keyPoints ? 'linear' : 'paced'"
              repeatCount="indefinite"
            />
          </g>
        </g>
      </template>

      <!-- Impulsions le long des liaisons (scène network). -->
      <template v-if="animate">
        <circle
          v-for="m in scene.motions?.filter((m) => m.id.startsWith('pulse'))"
          :key="`${uid}-${m.id}`"
          r="3.5"
          :fill="mono ? INK : BRAND.accent"
          stroke="none"
        >
          <animateMotion :path="m.path" :dur="`${m.dur}s`" :begin="`${m.begin ?? 0}s`" repeatCount="indefinite" />
        </circle>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.iso-flow {
  animation: iso-flow 1.4s linear infinite;
}

@keyframes iso-flow {
  to {
    stroke-dashoffset: -18;
  }
}
</style>
