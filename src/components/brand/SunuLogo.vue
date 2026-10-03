<script setup lang="ts">
import SunuMark from './SunuMark.vue'

// Logotype : monogramme + « SUNU » (Montserrat Light, U vert) + « HŪB » (Bold, macron orange).
// `tone="dark"` pour un fond marine, `tone="light"` pour un fond blanc.
withDefaults(defineProps<{ tone?: 'light' | 'dark'; size?: 'md' | 'lg' }>(), {
  tone: 'light',
  size: 'md',
})
</script>

<template>
  <span
    class="inline-flex items-center leading-none"
    :class="[tone === 'dark' ? 'text-white' : 'text-navy', size === 'lg' ? 'gap-3.5' : 'gap-2.5']"
  >
    <span
      class="grid shrink-0 place-items-center"
      :class="[tone === 'light' && 'bg-navy p-1', size === 'lg' ? 'h-14 w-11' : 'h-9 w-7']"
    >
      <SunuMark class="h-full w-full" />
    </span>
    <span
      class="flex items-baseline gap-[0.35em] tracking-[0.04em]"
      :class="size === 'lg' ? 'text-[2rem]' : 'text-[1.25rem]'"
    >
      <span class="font-light">S<span :class="tone === 'dark' ? 'text-green' : 'text-[#00a838]'">U</span>NU</span>
      <span class="font-bold">
        H<span class="relative inline-block"
          >U<span class="absolute inset-x-[0.12em] -top-[0.28em] h-[0.12em] bg-orange" aria-hidden="true"></span></span
        >B
      </span>
    </span>
    <span class="sr-only">SUNU HŪB</span>
  </span>
</template>
