<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { AlertTriangle, Check, Plus } from 'lucide-vue-next'
import SchoolStatusBadge from '@/components/school/SchoolStatusBadge.vue'
import { fields } from '@/data/questions'
import { accessLabels, type Piste } from '@/services/orientation'
import { useOrientationStore } from '@/stores/orientation'

// Une piste d'orientation (TDR O4) : pourquoi, statut, coût, conditions, débouchés et risques.
const props = defineProps<{ piste: Piste; rank?: number; wide?: boolean }>()
const store = useOrientationStore()

const p = computed(() => props.piste)
const fieldLabel = computed(() => fields.find((f) => f.value === p.value.field)?.label)
const inWishes = computed(() => store.state.wishes.includes(p.value.program.id))
const fcfa = (n: number) => n.toLocaleString('fr-FR')
const accessTone = { accessible: 'bg-mint', 'a-tenter': 'bg-white', difficile: 'bg-orange' }
</script>

<template>
  <article class="flex h-full flex-col border-2 border-ink bg-white" :class="wide ? 'border-dashed' : 'shadow-[8px_8px_0_var(--color-navy)]'">
    <header class="flex items-start gap-4 border-b-2 border-ink p-5">
      <span v-if="rank" class="display shrink-0 text-[2.4rem] leading-none text-navy tabular-nums">{{ rank }}</span>
      <div class="min-w-0">
        <p class="text-xs font-bold text-navy">{{ fieldLabel }}</p>
        <h3 class="display mt-1 text-[1.4rem] leading-tight">{{ p.program.name }}</h3>
        <p class="mt-1 text-sm">
          <RouterLink :to="{ name: 'school', params: { id: p.school.id } }" class="font-semibold underline decoration-navy decoration-2 underline-offset-2">
            {{ p.school.name }}
          </RouterLink>
          <span class="text-ink-soft"> · {{ p.school.city }}</span>
        </p>
      </div>
    </header>

    <div class="flex flex-1 flex-col gap-4 p-5 text-sm">
      <p v-if="p.reasons.length"><span class="font-bold">Pourquoi cette piste&nbsp;:</span> {{ p.reasons.join(', ') }}.</p>

      <div class="flex flex-wrap gap-2">
        <SchoolStatusBadge :status="p.school.status" />
        <span class="border-2 border-ink px-2.5 py-0.5 font-bold" :class="accessTone[p.access]">{{ accessLabels[p.access] }}</span>
        <span v-if="p.program.cames" class="border border-ink px-2 py-0.5">CAMES</span>
      </div>

      <dl class="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 gap-y-1.5">
        <dt class="text-ink-soft">Coût par an</dt>
        <dd class="tabular-nums">{{ p.program.costRange ? `${fcfa(p.program.costRange[0])} à ${fcfa(p.program.costRange[1])} FCFA` : 'Non communiqué' }}</dd>
        <dt class="text-ink-soft">Durée</dt>
        <dd>{{ p.program.durationYears }} ans</dd>
        <dt class="text-ink-soft">Séries</dt>
        <dd>{{ p.program.admittedSeries.join(', ') }}</dd>
        <dt class="text-ink-soft">Débouchés</dt>
        <dd>{{ p.outcomes.join(', ') }} <span class="text-ink-soft">(estimation)</span></dd>
      </dl>

      <ul v-if="p.risks.length" class="space-y-1.5 border-l-4 border-orange pl-3">
        <li v-for="r in p.risks" :key="r" class="flex items-start gap-2"><AlertTriangle :size="15" class="mt-0.5 shrink-0" aria-hidden="true" />{{ r }}</li>
      </ul>

      <div class="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <span class="text-xs text-ink-soft">{{ p.campusen ? 'Vœu à saisir sur Campusen' : 'Privé : inscription auprès de l’école' }}</span>
        <button
          type="button"
          class="inline-flex min-h-11 items-center gap-2 border-2 border-ink px-3 font-semibold"
          :class="inWishes ? 'bg-navy text-white' : 'bg-white hover:bg-paper-2'"
          :aria-pressed="inWishes"
          @click="inWishes ? store.removeWish(p.program.id) : store.addWish(p.program.id)"
        >
          <component :is="inWishes ? Check : Plus" :size="16" aria-hidden="true" />{{ inWishes ? 'Dans ma liste' : 'Ajouter à ma liste' }}
        </button>
      </div>
    </div>
  </article>
</template>
