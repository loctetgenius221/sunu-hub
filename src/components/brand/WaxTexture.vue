<script setup lang="ts">
// Texture textile ton sur ton, posée en fond d'une section (qui doit être `relative isolate`).
// Un dégradé l'efface du côté du texte : le motif habille, il ne gêne jamais la lecture.
const props = withDefaults(
  defineProps<{
    motif?: 'losange' | 'bogolan'
    /** Couleur et opacité du motif, en classe Tailwind (ex. text-white/[0.07]). */
    tone?: string
    /** Côté où le motif est le plus visible. */
    from?: 'right' | 'left' | 'edges'
    parallax?: boolean
  }>(),
  { motif: 'losange', tone: 'text-white/[0.07]', from: 'right', parallax: false },
)

// Sur une colonne (mobile), le texte occupe toute la largeur : le motif se replie dans l'angle haut.
const fades = {
  right: 'mask-[linear-gradient(to_bottom_left,black,transparent_40%)] lg:mask-[linear-gradient(to_left,black_15%,transparent_75%)]',
  left: 'mask-[linear-gradient(to_bottom_right,black,transparent_40%)] lg:mask-[linear-gradient(to_right,black_15%,transparent_75%)]',
  edges: 'mask-[linear-gradient(to_right,black,transparent_32%,transparent_68%,black)]',
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" :class="fades[props.from]" aria-hidden="true">
    <div v-if="parallax" v-parallax="24" class="absolute inset-x-0 -inset-y-8" :class="[`wax-${motif}`, tone]"></div>
    <div v-else class="absolute inset-0" :class="[`wax-${motif}`, tone]"></div>
  </div>
</template>
