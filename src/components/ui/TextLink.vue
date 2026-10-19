<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

// Lien d'action secondaire, en couleur de lien ; souligné au survol. `onDark` pour les fonds sombres ou photo.
defineProps<{ to: RouteLocationRaw; onDark?: boolean }>()
</script>

<template>
  <RouterLink
    :to="to"
    class="font-medium underline-offset-4 transition-colors hover:underline"
    :class="onDark ? 'text-white' : 'text-navy'"
  >
    <slot />
  </RouterLink>
</template>
