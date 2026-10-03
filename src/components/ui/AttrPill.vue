<script setup lang="ts">
// Pastille d'attribut : toujours un libellé à côté de la couleur.
withDefaults(defineProps<{ color?: 'navy' | 'orange' | 'green' | 'white' }>(), { color: 'green' })

const dot = { navy: 'bg-navy', orange: 'bg-orange', green: 'bg-green', white: 'bg-white' }
</script>

<template>
  <span
    class="inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-white py-1.5 pr-4 pl-2.5 text-sm font-semibold text-ink"
  >
    <span class="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink" :class="dot[color]"></span>
    <slot />
  </span>
</template>
