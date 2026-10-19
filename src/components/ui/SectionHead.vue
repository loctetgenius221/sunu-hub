<script setup lang="ts">
// En-tête de section : grand titre, texte d'appui dessous, centré ou aligné à gauche.
withDefaults(defineProps<{ title: string; lead?: string; id?: string; onDark?: boolean; center?: boolean }>(), {
  center: false,
})
</script>

<template>
  <div v-reveal class="max-w-3xl" :class="center && 'mx-auto text-center'">
    <h2 :id="id" class="h2" :class="onDark && 'text-white!'">{{ title }}</h2>
    <p v-if="lead" class="lead mt-5" :class="[onDark && 'text-white/75!', center && 'mx-auto max-w-2xl']">{{ lead }}</p>
    <slot />
  </div>
</template>
