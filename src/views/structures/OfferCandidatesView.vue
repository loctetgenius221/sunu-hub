<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Download } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import { candidateStatuses, formatDate, opportunityTypes } from '@/data/labels'
import { fields } from '@/data/questions'
import { useToast } from '@/composables/useToast'
import { useStructureStore } from '@/stores/structure'
import type { CandidateStatus } from '@/types'

// Candidatures classées par adéquation (TDR S3). Le statut choisi est visible par le jeune ; export CSV.
const route = useRoute()
const store = useStructureStore()
const { show } = useToast()

const offer = computed(() => store.getOffer(String(route.params.id)))
const candidates = computed(() => (offer.value ? store.candidatesFor(offer.value) : []))
const fieldLabel = (v: string) => fields.find((f) => f.value === v)?.label ?? v
const levelLabel = { bac: 'Bac', licence: 'Licence', master: 'Master', tous: 'Tous' }

function setStatus(id: string, status: CandidateStatus) {
  if (!offer.value) return
  store.setCandidateStatus(offer.value.id, id, status)
  show(`Statut mis à jour : ${candidateStatuses[status].toLowerCase()}. Le candidat le voit dans son suivi.`)
}

function exportCsv() {
  if (!offer.value) return
  const rows = [
    ['Rang', 'Prénom', 'Niveau', 'Filière', 'Ville', 'Score', 'Statut'],
    ...candidates.value.map((c, i) => [i + 1, `${c.firstName} ${c.initial}`, levelLabel[c.level], fieldLabel(c.field), c.city, c.score, candidateStatuses[c.status]]),
  ]
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `candidatures-${offer.value.id}.csv` })
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section v-if="!offer" class="wrap py-20">
    <h1 class="h2">Offre introuvable</h1>
    <BaseButton :to="{ name: 'structure-dashboard' }" variant="secondary" class="mt-8">Retour à mon espace</BaseButton>
  </section>

  <template v-else>
    <section class="grid-paper border-b border-rule">
      <div class="wrap py-10 sm:py-14">
        <nav aria-label="Fil d'Ariane" class="text-sm">
          <RouterLink :to="{ name: 'structure-dashboard' }" class="font-semibold text-navy hover:underline">Mon espace</RouterLink>
          <span class="mx-2 text-ink-soft">/</span><span class="text-ink-soft">Candidatures</span>
        </nav>
        <div class="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-navy">{{ opportunityTypes[offer.type] }}</p>
            <h1 class="display mt-1 text-[clamp(1.9rem,3.4vw,2.8rem)]">{{ offer.title }}</h1>
            <p class="mt-2 text-ink-soft">Clôture le {{ formatDate(offer.deadline) }} · {{ candidates.length }} candidatures</p>
          </div>
          <BaseButton variant="light" class="shadow-soft" :disabled="!candidates.length" @click="exportCsv"><Download :size="18" aria-hidden="true" />Exporter en CSV</BaseButton>
        </div>
      </div>
    </section>

    <div class="wrap py-10 lg:py-14">
      <p class="max-w-2xl text-sm text-ink-soft">
        Classement par adéquation au niveau, à la filière, au lieu et au type recherché. La motivation compte aussi : lisez-la avant
        d'écarter un profil débutant.
      </p>

      <p v-if="!candidates.length" class="mt-8 rounded-tile bg-paper-2 p-6">Aucune candidature pour l'instant.</p>

      <ol v-else class="mt-6 border-t border-rule">
        <li
          v-for="(c, i) in candidates"
          :key="c.id"
          class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-rule py-6 md:grid-cols-[3rem_minmax(0,1fr)_7rem_13rem] md:items-center"
        >
          <span class="display text-[1.6rem] leading-none tabular-nums">{{ i + 1 }}</span>
          <div class="min-w-0">
            <p class="font-semibold">{{ c.firstName }} {{ c.initial }} <span class="font-normal text-ink-soft">· {{ c.city }}</span></p>
            <p class="text-sm">{{ levelLabel[c.level] }} · {{ fieldLabel(c.field) }}</p>
            <p class="mt-1 text-sm text-ink-soft italic">« {{ c.motivation }} »</p>
          </div>
          <div class="col-start-2 flex items-center gap-2 md:col-start-auto md:block">
            <span class="display text-[1.6rem] tabular-nums">{{ c.score }}</span><span class="text-sm text-ink-soft">/100</span>
            <div class="h-1 w-20 overflow-hidden rounded-full bg-paper-2 md:mt-1" aria-hidden="true"><div class="h-full bg-navy" :style="{ width: `${c.score}%` }"></div></div>
          </div>
          <div class="col-start-2 min-w-0 md:col-start-auto">
            <label :for="`st-${c.id}`" class="sr-only">Statut de la candidature de {{ c.firstName }}</label>
            <select
              :id="`st-${c.id}`"
              :value="c.status"
              class="field min-h-11 py-2 text-sm"
              :class="c.status === 'retenue' && 'bg-mint'"
              @change="setStatus(c.id, ($event.target as HTMLSelectElement).value as CandidateStatus)"
            >
              <option v-for="(label, k) in candidateStatuses" :key="k" :value="k">{{ label }}</option>
            </select>
          </div>
        </li>
      </ol>
      <p class="mt-6 text-xs text-ink-soft">Candidats fictifs (maquette). Les coordonnées complètes ne sont visibles qu'avec l'accord du jeune.</p>
    </div>
  </template>
</template>
