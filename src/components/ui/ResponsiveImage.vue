<script setup lang="ts">
import { computed } from 'vue'
import { photos, type PhotoName } from '@/data/photos'

// Photo responsive : deux largeurs WebP, chargement différé sauf pour l'image du haut de page.
const props = withDefaults(defineProps<{ name: PhotoName; sizes?: string; eager?: boolean; decorative?: boolean }>(), {
  sizes: '100vw',
})

const photo = computed(() => photos[props.name])
const srcset = computed(() => photo.value.widths.map((w) => `/images/${photo.value.name}-${w}.webp ${w}w`).join(', '))
</script>

<template>
  <img
    :src="`/images/${photo.name}-${photo.widths[0]}.webp`"
    :srcset="srcset"
    :sizes="sizes"
    :alt="decorative ? '' : photo.alt"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
    class="h-full w-full object-cover"
    :style="{ objectPosition: photo.focus }"
  />
</template>
