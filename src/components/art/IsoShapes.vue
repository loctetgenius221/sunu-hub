<script setup lang="ts">
import { INK, toPath, type Shape } from './iso'

// Rendu statique d'une liste de formes isométriques (à placer dans un <svg>).
defineProps<{ shapes: Shape[] }>()
</script>

<template>
  <template v-for="(s, i) in shapes" :key="i">
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
    />
    <g v-else :transform="`translate(${s.c[0]} ${s.c[1]})`">
      <circle :r="s.r" :fill="s.fill" />
      <circle v-if="s.shine" :cx="-s.r * 0.35" :cy="-s.r * 0.35" :r="s.r * 0.22" fill="#fff" stroke="none" />
    </g>
  </template>
</template>
