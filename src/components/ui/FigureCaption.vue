<script setup lang="ts">
// Légende de figure, signature du style éditorial : « Figure 1. Description. »
defineProps<{ n: number | string }>()
</script>

<template>
  <figcaption class="text-sm text-ink-soft">
    <span class="font-semibold text-ink">Figure {{ n }}.&nbsp;</span>
    <slot />
  </figcaption>
</template>
