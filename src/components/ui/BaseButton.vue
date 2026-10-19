<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

// Bouton pilule. `primary` (marine plein) : une seule action principale par écran.
// `secondary` : surface neutre. `light` : blanc plein, pour les fonds photo ou sombres.
// `glass` : translucide, pour une action secondaire posée sur une photo.
// Sur téléphone (< 640 px), les tailles `md` et `lg` prennent toute la largeur : cible large,
// facile à atteindre au pouce. `inline` garde la largeur du texte.
const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    href?: string
    variant?: 'primary' | 'secondary' | 'light' | 'glass' | 'ghost'
    size?: 'md' | 'lg' | 'sm'
    type?: 'button' | 'submit'
    block?: boolean
    inline?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

const variants = {
  primary: 'bg-navy text-white hover:bg-[#0a2c60] active:bg-navy-deep',
  secondary: 'bg-paper-2 text-ink hover:bg-[#e8e8ed] active:bg-[#dcdce1]',
  light: 'bg-white text-ink hover:bg-white/90',
  glass: 'bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md hover:bg-white/25',
  ghost: 'bg-transparent text-navy hover:bg-navy-soft',
}
const sizes = {
  sm: 'min-h-9 px-4 text-[0.9375rem]',
  md: 'min-h-11 px-6 text-[1.0625rem]',
  lg: 'min-h-13 px-8 text-[1.125rem]',
}
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    class="inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[background-color,scale,box-shadow] duration-200 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
    :class="[variants[variant], sizes[size], block ? 'w-full' : size !== 'sm' && !inline && 'max-sm:w-full']"
  >
    <slot />
  </component>
</template>
