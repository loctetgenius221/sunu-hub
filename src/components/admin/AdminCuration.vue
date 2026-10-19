<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Flag } from 'lucide-vue-next'
import ChoiceChips from '@/components/ui/ChoiceChips.vue'
import VerificationBadge from '@/components/opportunity/VerificationBadge.vue'
import { formatDate, opportunityTypes } from '@/data/labels'
import { useToast } from '@/composables/useToast'
import { listForCuration, setHidden, setVerification, type CurationRow } from '@/services/api'
import { paymentTerms, suspectTerms } from '@/services/moderation'
import type { VerificationStatus } from '@/types'

// Curation des opportunités (TDR A1) : vérifier, masquer, remettre en ligne.
// Les offres signalées ou contenant des mots d'arnaque remontent en premier.
const { show } = useToast()
const rows = ref<CurationRow[]>([])
const view = ref<'a-traiter' | 'toutes'>('a-traiter')

async function load() {
  rows.value = await listForCuration()
}
onMounted(load)

// Les deux niveaux remontent ici : l'équipe tranche.
const flagged = (r: CurationRow) => {
  const text = `${r.title} ${r.summary} ${r.conditions.join(' ')}`
  return [...paymentTerms(text), ...suspectTerms(text)]
}
const needsWork = (r: CurationRow) => !r.expired && (r.status !== 'verifiee' || r.reports > 0 || r.hidden || flagged(r).length > 0)

const shown = computed(() =>
  [...(view.value === 'a-traiter' ? rows.value.filter(needsWork) : rows.value)].sort((a, b) => b.reports - a.reports),
)

async function verify(r: CurationRow, status: VerificationStatus) {
  setVerification(r.id, status)
  show(`« ${r.title} » : ${status === 'verifiee' ? 'vérifiée' : 'source externe'}.`)
  await load()
}

async function toggleHidden(r: CurationRow) {
  setHidden(r.id, !r.hidden)
  show(r.hidden ? 'Offre remise en ligne.' : 'Offre masquée.')
  await load()
}
</script>

<template>
  <section aria-labelledby="h-cur">
    <div class="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
      <h2 id="h-cur" class="h2">Opportunités</h2>
      <ChoiceChips
        v-model="view"
        legend="Afficher"
        legend-class="sr-only"
        :options="[
          { value: 'a-traiter', label: `À traiter (${rows.filter(needsWork).length})` },
          { value: 'toutes', label: 'Toutes' },
        ]"
        class="[&_label]:min-h-9 [&_label]:px-3 [&_label]:py-1 [&_label]:text-sm"
      />
    </div>

    <p v-if="!shown.length" class="mt-8 rounded-tile bg-paper-2 p-6">Rien à traiter. Toutes les offres ouvertes sont vérifiées.</p>

    <ul>
      <li v-for="r in shown" :key="r.id" class="grid grid-cols-1 gap-4 border-b border-rule py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-navy">{{ opportunityTypes[r.type] }}</span>
            <VerificationBadge :status="r.status" />
            <span v-if="r.hidden" class="rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-white">Masquée</span>
            <span v-if="r.expired" class="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs text-ink-soft">Expirée</span>
            <span v-if="r.reports" class="inline-flex items-center gap-1 rounded-full bg-orange-soft px-2.5 py-0.5 text-xs font-semibold text-orange">
              <Flag :size="12" aria-hidden="true" />{{ r.reports }} signalement{{ r.reports > 1 ? 's' : '' }}
            </span>
          </div>
          <p class="display mt-2 text-[1.3rem]">
            <RouterLink :to="`/opportunites/${r.id}`" class="hover:underline">{{ r.title }}</RouterLink>
          </p>
          <p class="text-sm text-ink-soft">
            {{ r.structure.name }}{{ r.structure.verified ? '' : ' (structure non vérifiée)' }} · {{ r.sourceName }}, collectée le
            {{ formatDate(r.collectedAt) }}
          </p>
          <p v-if="flagged(r).length" class="mt-2 text-sm font-semibold">Mots à vérifier : {{ flagged(r).join(', ') }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-if="r.status !== 'verifiee'" type="button" class="min-h-11 rounded-full bg-mint text-green px-3 text-sm font-semibold" @click="verify(r, 'verifiee')">
            Marquer vérifiée
          </button>
          <button v-if="r.status === 'a-verifier'" type="button" class="min-h-11 rounded-full bg-white ring-1 ring-rule px-3 text-sm font-semibold" @click="verify(r, 'externe')">
            Source externe
          </button>
          <button type="button" class="min-h-11 rounded-full ring-1 ring-rule px-3 text-sm font-semibold" :class="r.hidden ? 'bg-white' : 'bg-paper-2 text-ink-soft'" @click="toggleHidden(r)">
            {{ r.hidden ? 'Remettre en ligne' : 'Masquer' }}
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>
