<script setup lang="ts">
// Bande tissée : la signature textile du site. Elle ferme les grands bandeaux marine
// et ouvre le pied de page, comme la lisière d'un pagne.
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })
</script>

<template>
  <div class="wax-band w-full" :class="size === 'sm' ? 'h-2' : 'h-3 sm:h-3.5'" aria-hidden="true"></div>
</template>
