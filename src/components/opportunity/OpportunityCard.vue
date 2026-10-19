<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CalendarClock } from 'lucide-vue-next'
import SaveButton from './SaveButton.vue'
import VerificationBadge from './VerificationBadge.vue'
import { applicationSteps, formatDate, opportunityTypes } from '@/data/labels'
import { daysLeft } from '@/services/matching'
import { useActivityStore } from '@/stores/activity'
import type { ScoredOpportunity } from '@/types'

// Carte d'opportunité : type et statut, intitulé, structure, date limite, pertinence et sa raison.
// Sans profil (score négatif), la pertinence n'est pas affichée. Toute la carte mène à la fiche.
const props = defineProps<{ item: ScoredOpportunity }>()
const activity = useActivityStore()

const left = computed(() => daysLeft(props.item.deadline))
const urgent = computed(() => left.value <= 7)
const deadline = computed(() => {
  if (left.value === 0) return 'Clôture aujourd’hui'
  return `Clôture dans ${left.value} jour${left.value > 1 ? 's' : ''}, le ${formatDate(props.item.deadline)}`
})
const application = computed(() => {
  const a = activity.state.applications[props.item.id]
  return a && applicationSteps.find((s) => s.id === a.step)?.label
})
</script>

<template>
  <article
    class="group relative flex h-full flex-col rounded-card bg-white p-6 ring-1 ring-rule transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-transparent"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-wrap items-center gap-2 text-[0.8125rem]">
        <span class="font-semibold text-navy">{{ opportunityTypes[item.type] }}</span>
        <VerificationBadge :status="item.status" />
        <span v-if="application" class="rounded-full bg-navy-soft px-2.5 py-0.5 font-semibold text-navy">{{ application }}</span>
      </div>
      <SaveButton :id="item.id" :title="item.title" compact class="relative z-10 -mt-1.5 -mr-1.5 shrink-0" />
    </div>

    <h3 class="mt-3 text-[1.3125rem] leading-snug font-semibold tracking-[-0.02em] text-ink">
      <RouterLink :to="`/opportunites/${item.id}`" class="after:absolute after:inset-0 after:rounded-card">
        {{ item.title }}
      </RouterLink>
    </h3>
    <p class="mt-1 text-[0.9375rem] text-ink-soft">{{ item.structure.name }}, {{ item.city }}</p>

    <p v-if="item.score < 0" class="mt-3 line-clamp-2 text-[0.9375rem] text-ink-soft">{{ item.summary }}</p>

    <div class="mt-auto pt-6">
      <div v-if="item.score >= 0" class="mb-4">
        <div class="flex items-baseline justify-between text-[0.8125rem]">
          <span class="text-ink-soft">Pertinence pour toi</span>
          <span class="font-semibold tabular-nums">{{ item.score }} / 100</span>
        </div>
        <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-paper-2" aria-hidden="true">
          <div class="h-full rounded-full bg-navy" :style="{ width: `${item.score}%` }"></div>
        </div>
        <p v-if="item.reasons.length" class="mt-2 text-[0.8125rem] text-ink-soft first-letter:uppercase">{{ item.reasons.join(', ') }}.</p>
      </div>
      <p
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8125rem] font-medium"
        :class="urgent ? 'bg-orange-soft text-orange' : 'bg-paper-2 text-ink-soft'"
      >
        <CalendarClock :size="14" aria-hidden="true" />{{ deadline }}
      </p>
    </div>
  </article>
</template>
