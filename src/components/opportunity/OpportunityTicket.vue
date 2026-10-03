<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { MapPin } from 'lucide-vue-next'
import SaveButton from './SaveButton.vue'
import VerificationBadge from './VerificationBadge.vue'
import { applicationSteps, formatDate, opportunityTypes } from '@/data/labels'
import { daysLeft } from '@/services/matching'
import { useActivityStore } from '@/stores/activity'
import type { ScoredOpportunity } from '@/types'

// Une opportunité présentée comme un ticket : talon avec compte à rebours, corps avec score et « pourquoi ».
// Sans profil (score négatif), le score n'est pas affiché.
const props = defineProps<{ item: ScoredOpportunity; notch?: string }>()
const activity = useActivityStore()

const left = computed(() => daysLeft(props.item.deadline))
const urgent = computed(() => left.value <= 7)
const application = computed(() => {
  const a = activity.state.applications[props.item.id]
  return a && applicationSteps.find((s) => s.id === a.step)?.label
})
</script>

<template>
  <article
    class="group relative grid h-full grid-cols-[5.5rem_minmax(0,1fr)] border-2 border-ink bg-white shadow-[6px_6px_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 sm:grid-cols-[7rem_minmax(0,1fr)]"
  >
    <!-- Talon -->
    <div
      class="flex flex-col items-center justify-center border-r-2 border-dashed border-ink px-2 py-4 text-center"
      :class="urgent ? 'bg-orange' : 'bg-paper-2'"
    >
      <span class="text-xs font-semibold">Clôture</span>
      <span class="display text-[2rem] leading-none tabular-nums">{{ left === 0 ? 'Auj.' : `J-${left}` }}</span>
      <span class="mt-1 text-xs">{{ formatDate(item.deadline) }}</span>
    </div>
    <!-- Encoches du ticket -->
    <span
      v-for="pos in ['-top-[2px]', '-bottom-[2px]']"
      :key="pos"
      class="absolute left-[5.5rem] h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink sm:left-[7rem]"
      :class="[pos, pos.startsWith('-top') ? '-translate-y-1/2' : 'translate-y-1/2']"
      :style="{ background: notch ?? 'var(--color-paper-2)' }"
      aria-hidden="true"
    ></span>

    <div class="flex min-w-0 flex-col p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-navy">{{ opportunityTypes[item.type] }}</span>
          <VerificationBadge :status="item.status" />
          <span v-if="application" class="border-2 border-ink bg-mint px-2 py-0.5 text-xs font-bold">{{ application }}</span>
        </div>
        <SaveButton :id="item.id" :title="item.title" compact class="-mt-1 -mr-1 shrink-0" />
      </div>
      <h3 class="display mt-2 text-[1.3rem] text-ink">
        <RouterLink :to="`/opportunites/${item.id}`" class="after:absolute after:inset-0 group-hover:underline">
          {{ item.title }}
        </RouterLink>
      </h3>
      <p class="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
        <MapPin :size="14" aria-hidden="true" class="shrink-0" />
        <span class="truncate">{{ item.structure.name }} · {{ item.city }}</span>
      </p>

      <template v-if="item.score >= 0">
        <div class="mt-auto flex items-center gap-3 pt-4">
          <div class="h-2 flex-1 border border-ink bg-paper-2" aria-hidden="true">
            <div class="h-full bg-navy" :style="{ width: `${item.score}%` }"></div>
          </div>
          <span class="text-sm font-bold tabular-nums">{{ item.score }}/100</span>
        </div>
        <p v-if="item.reasons.length" class="mt-2 text-sm text-ink-soft">
          <span class="font-semibold text-ink">Pourquoi&nbsp;:</span> {{ item.reasons.join(', ') }}.
        </p>
      </template>
      <p v-else class="mt-3 line-clamp-2 text-sm text-ink-soft">{{ item.summary }}</p>
    </div>
  </article>
</template>
