<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'

// Jauge de profil : anneau de progression, puis la liste de ce qui reste à faire et ce que chaque élément rapporte.
const store = useProfileStore()
const R = 34
const C = 2 * Math.PI * R
const dash = computed(() => `${(store.completion / 100) * C} ${C}`)
</script>

<template>
  <div>
    <div class="flex items-center gap-5">
      <svg viewBox="0 0 80 80" class="h-20 w-20 shrink-0 -rotate-90" role="img" :aria-label="`Profil complété à ${store.completion} %`">
        <circle cx="40" cy="40" :r="R" fill="none" stroke="#ececf0" stroke-width="8" />
        <circle cx="40" cy="40" :r="R" fill="none" stroke="var(--color-navy)" stroke-width="8" stroke-linecap="round" :stroke-dasharray="dash" class="transition-[stroke-dasharray] duration-700" />
      </svg>
      <div>
        <p class="text-[2rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">{{ store.completion }}&nbsp;%</p>
        <p class="mt-1 text-[0.9375rem] text-ink-soft">Profil complété</p>
      </div>
    </div>
    <ul class="mt-6 space-y-2.5 text-[0.9375rem]">
      <li v-for="c in store.checklist" :key="c.label" class="flex items-center gap-2.5">
        <span class="grid h-5 w-5 shrink-0 place-items-center rounded-full" :class="c.done ? 'bg-green text-white' : 'ring-1 ring-rule ring-inset'">
          <Check v-if="c.done" :size="12" :stroke-width="3" aria-hidden="true" />
        </span>
        <span :class="c.done && 'text-ink-soft'">{{ c.label }}</span>
        <span v-if="!c.done" class="ml-auto text-[0.8125rem] font-medium text-navy tabular-nums">+{{ c.weight }}&nbsp;%</span>
        <span class="sr-only">{{ c.done ? 'fait' : 'à faire' }}</span>
      </li>
    </ul>
  </div>
</template>
