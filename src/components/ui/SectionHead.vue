<script setup lang="ts">
// En-tête de section : titre serif à gauche, texte d'appui aligné en bas à droite, filet noir dessous.
defineProps<{ title: string; lead?: string; id?: string; onDark?: boolean }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-5 border-b-2 pb-8 lg:grid-cols-12" :class="onDark ? 'border-white' : 'border-ink'">
    <h2 :id="id" class="h2 min-w-0 lg:col-span-7" :class="onDark && 'text-white!'">{{ title }}</h2>
    <div class="min-w-0 lg:col-span-4 lg:col-start-9 lg:self-end">
      <p v-if="lead" class="text-[1.05rem]" :class="onDark ? 'text-white/80' : 'text-ink-soft'">{{ lead }}</p>
      <slot />
    </div>
  </div>
</template>
