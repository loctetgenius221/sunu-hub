<script setup lang="ts">
// Photo à angles droits, contour 2 px et ombre dure décalée de 10 px.
withDefaults(
  defineProps<{
    src: string
    alt: string
    ratio?: string
    shadow?: 'orange' | 'navy' | 'ink' | 'green'
    position?: string
  }>(),
  { ratio: '4 / 5', shadow: 'orange', position: 'center 30%' },
)
</script>

<template>
  <figure
    class="group relative border-2 border-ink bg-paper-2"
    :style="{ boxShadow: `10px 10px 0 var(--color-${shadow})`, aspectRatio: ratio }"
  >
    <div class="absolute inset-0 overflow-hidden">
      <img
        :src="src"
        :alt="alt"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        :style="{ objectPosition: position }"
      />
    </div>
    <slot />
  </figure>
</template>
