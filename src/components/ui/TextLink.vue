<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

// Lien secondaire souligné (jamais de flèche). `onDark` pour les fonds marine.
defineProps<{ to: RouteLocationRaw; onDark?: boolean }>()
</script>

<template>
  <RouterLink
    :to="to"
    class="font-semibold transition-colors"
    :class="
      onDark
        ? 'border-b-2 border-white text-white hover:border-green hover:text-green'
        : 'text-ink underline decoration-navy decoration-2 underline-offset-8 hover:decoration-orange'
    "
  >
    <slot />
  </RouterLink>
</template>
