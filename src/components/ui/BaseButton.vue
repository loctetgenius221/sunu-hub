<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

// Pilule à contour encre et ombre dure. Un seul bouton `primary` par écran.
const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    href?: string
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit'
    block?: boolean
  }>(),
  { variant: 'primary', type: 'button' },
)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

const variants = {
  primary: 'bg-orange text-ink',
  secondary: 'bg-white text-ink',
  ghost: 'bg-transparent text-ink shadow-none! hover:shadow-none! hover:translate-0!',
}
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-ink px-6 py-2.5 font-semibold shadow-[4px_4px_0_var(--color-ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] active:translate-0 active:shadow-[2px_2px_0_var(--color-ink)] disabled:pointer-events-none disabled:opacity-50"
    :class="[variants[variant], block && 'w-full']"
  >
    <slot />
  </component>
</template>
