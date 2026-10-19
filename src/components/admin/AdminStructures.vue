<script setup lang="ts">
import { computed } from 'vue'
import { BadgeCheck, Clock } from 'lucide-vue-next'
import { formatDate, opportunityTypes, structureKinds } from '@/data/labels'
import { structures } from '@/data/structures'
import { useToast } from '@/composables/useToast'
import { paymentTerms, suspectTerms } from '@/services/moderation'
import { useStructureStore } from '@/stores/structure'

// Vérification des structures (TDR A3) et validation des offres publiées avant mise en ligne (S2).
// En maquette, la file contient le compte et les offres créés dans l'espace structures de cet appareil.
const store = useStructureStore()
const { show } = useToast()

const account = computed(() => store.state.account)
const pendingOffers = computed(() => store.state.offers.filter((o) => o.status === 'en-revue'))

const toCheck = (o: { title: string; summary: string; conditions: string[] }) => {
  const text = `${o.title} ${o.summary} ${o.conditions.join(' ')}`
  return [...paymentTerms(text), ...suspectTerms(text)]
}

function approveAccount() {
  store.simulateAccountReview()
  show('Structure vérifiée : elle peut publier.')
}

function approveOffer(id: string) {
  store.simulateOfferReview(id)
  show('Offre mise en ligne.')
}
</script>

<template>
  <section aria-labelledby="h-file">
    <h2 id="h-file" class="h2">File de validation</h2>

    <p v-if="!(account?.status === 'pending') && !pendingOffers.length" class="mt-8 rounded-tile bg-paper-2 p-6">
      Rien en attente. Créez un compte depuis l'espace structures pour voir la file se remplir.
    </p>

    <ul>
      <li v-if="account?.status === 'pending'" class="grid grid-cols-1 gap-4 border-b border-rule py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div class="min-w-0">
          <p class="flex items-center gap-2 text-xs font-semibold text-navy"><Clock :size="14" aria-hidden="true" />Compte structure · reçu le {{ formatDate(account.createdAt) }}</p>
          <p class="display mt-1 text-[1.3rem]">{{ account.name }}</p>
          <p class="text-sm text-ink-soft">{{ structureKinds[account.kind] }} · {{ account.city }} · {{ account.contact }}</p>
          <p class="mt-1 text-sm">Preuve : {{ account.email || '—' }}{{ account.ninea ? ` · NINEA ${account.ninea}` : '' }}</p>
        </div>
        <button type="button" class="min-h-11 rounded-full bg-mint text-green px-4 font-semibold" @click="approveAccount">Valider la structure</button>
      </li>

      <li v-for="o in pendingOffers" :key="o.id" class="grid grid-cols-1 gap-4 border-b border-rule py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div class="min-w-0">
          <p class="flex items-center gap-2 text-xs font-semibold text-navy"><Clock :size="14" aria-hidden="true" />{{ opportunityTypes[o.type] }} · {{ account?.name }}</p>
          <p class="display mt-1 text-[1.3rem]">{{ o.title }}</p>
          <p class="text-sm text-ink-soft">{{ o.summary }}</p>
          <p v-if="toCheck(o).length" class="mt-1 text-sm font-semibold">Mots à vérifier : {{ toCheck(o).join(', ') }}</p>
        </div>
        <button type="button" class="min-h-11 rounded-full bg-mint text-green px-4 font-semibold" @click="approveOffer(o.id)">Mettre en ligne</button>
      </li>
    </ul>

    <h2 class="h2 mt-14 border-b border-rule pb-4">Structures</h2>
    <ul>
      <li v-for="s in structures" :key="s.id" class="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4">
        <div class="min-w-0">
          <p class="font-semibold">{{ s.name }}</p>
          <p class="text-sm text-ink-soft">{{ structureKinds[s.kind] }} · {{ s.city }}</p>
        </div>
        <span v-if="s.verified" class="inline-flex items-center gap-1.5 rounded-full bg-mint text-green px-2 py-0.5 text-xs font-semibold"><BadgeCheck :size="14" aria-hidden="true" />Vérifiée</span>
        <span v-else class="rounded-tile bg-paper-2 px-2 py-0.5 text-xs font-semibold">À vérifier</span>
      </li>
    </ul>
  </section>
</template>
