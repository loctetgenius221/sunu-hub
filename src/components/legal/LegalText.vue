<script setup lang="ts">
import { computed } from 'vue'

// Texte légal : les valeurs « à compléter » sont surlignées pour ne jamais passer pour des informations réelles.
const props = defineProps<{ text: string }>()
const parts = computed(() => props.text.split(/(\[[^\]]+ : à compléter\])/g).filter(Boolean))
</script>

<template>
  <template v-for="(p, i) in parts" :key="i">
    <mark v-if="p.endsWith(': à compléter]')" class="rounded bg-orange-soft px-1 text-orange">{{ p.slice(1, -1) }}</mark>
    <template v-else>{{ p }}</template>
  </template>
</template>
