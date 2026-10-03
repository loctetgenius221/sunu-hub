<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'

// Jauge de profil : pourcentage, barre segmentée et liste de ce qui reste à faire.
const store = useProfileStore()
</script>

<template>
  <div>
    <div class="flex items-end justify-between gap-4">
      <p class="font-semibold">Profil complété</p>
      <p class="display text-[2.4rem] leading-none text-navy tabular-nums">{{ store.completion }}&nbsp;%</p>
    </div>
    <div
      class="mt-3 flex h-3 border-2 border-ink bg-white"
      role="progressbar"
      :aria-valuenow="store.completion"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Profil complété"
    >
      <div class="h-full bg-green transition-[width] duration-700" :style="{ width: `${store.completion}%` }"></div>
    </div>
    <ul class="mt-5 space-y-2 text-sm">
      <li v-for="c in store.checklist" :key="c.label" class="flex items-center gap-2.5">
        <span
          class="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-ink"
          :class="c.done ? 'bg-green' : 'bg-white'"
        >
          <Check v-if="c.done" :size="12" :stroke-width="3" aria-hidden="true" />
        </span>
        <span :class="c.done ? 'text-ink-soft line-through' : 'font-semibold'">{{ c.label }}</span>
        <span v-if="!c.done" class="ml-auto text-ink-soft tabular-nums">+{{ c.weight }}&nbsp;%</span>
        <span class="sr-only">{{ c.done ? 'fait' : 'à faire' }}</span>
      </li>
    </ul>
  </div>
</template>
