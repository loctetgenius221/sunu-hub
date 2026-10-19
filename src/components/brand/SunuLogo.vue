<script setup lang="ts">
import SunuMark from './SunuMark.vue'

// Logotype : monogramme + « SUNU » (Montserrat Light, U vert) + « HŪB » (Bold, macron orange).
// `tone="dark"` pour un fond sombre, `tone="light"` pour un fond clair.
withDefaults(defineProps<{ tone?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg' }>(), {
  tone: 'light',
  size: 'md',
})
</script>

<template>
  <span
    class="inline-flex items-center leading-none font-[family-name:var(--font-brand)]"
    :class="[tone === 'dark' ? 'text-white' : 'text-navy', size === 'lg' ? 'gap-3' : 'gap-2']"
  >
    <span
      class="grid shrink-0 place-items-center rounded-[22%]"
      :class="[tone === 'light' && 'bg-navy', { sm: 'h-7 w-7 p-1', md: 'h-8 w-8 p-1.5', lg: 'h-12 w-12 p-2' }[size]]"
    >
      <SunuMark class="h-full w-full" />
    </span>
    <span class="flex items-baseline gap-[0.3em] tracking-[0.05em]" :class="{ sm: 'text-[1rem]', md: 'text-[1.125rem]', lg: 'text-[1.75rem]' }[size]">
      <span class="font-light">S<span :class="tone === 'dark' ? 'text-[#4ade80]' : 'text-green'">U</span>NU</span>
      <span class="font-bold">
        H<span class="relative inline-block"
          >U<span class="absolute inset-x-[0.12em] top-[-0.26em] h-[0.11em] bg-[#ff6b00]" aria-hidden="true"></span></span
        >B
      </span>
    </span>
    <span class="sr-only">SUNU HŪB</span>
  </span>
</template>
