<script setup lang="ts">
import { BadgeCheck, Clock, Plus, Users } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDate, opportunityTypes, structureKinds } from '@/data/labels'
import { useStructureStore } from '@/stores/structure'

// Tableau de bord d'une structure : statut du compte, offres et nombre de candidats.
const store = useStructureStore()
const account = store.state.account!
</script>

<template>
  <section class="grid-paper border-b-2 border-ink">
    <div class="wrap flex flex-wrap items-end justify-between gap-6 py-12 sm:py-14">
      <div class="min-w-0">
        <p class="text-sm font-semibold text-ink-soft">{{ structureKinds[account.kind] }} · {{ account.city }}</p>
        <h1 class="display mt-2 flex flex-wrap items-center gap-3 text-[clamp(2rem,3.6vw,3rem)] text-navy">
          {{ account.name }}
          <BadgeCheck v-if="store.verified" :size="30" aria-label="Structure vérifiée" />
        </h1>
      </div>
      <BaseButton v-if="store.verified" :to="{ name: 'structure-publish' }"><Plus :size="18" aria-hidden="true" />Publier une opportunité</BaseButton>
    </div>
  </section>

  <div class="wrap py-10 lg:py-14">
    <!-- Compte en attente -->
    <div v-if="!store.verified" class="flex flex-wrap items-center justify-between gap-5 border-2 border-dashed border-ink bg-paper-2 p-6">
      <p class="flex max-w-2xl items-start gap-3">
        <Clock :size="22" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
        <span>
          <span class="font-bold">Demande reçue le {{ formatDate(account.createdAt) }}.</span>
          Notre équipe vérifie votre structure sous 48 h ouvrées ; vous pourrez ensuite publier.
        </span>
      </p>
      <button type="button" class="border-2 border-ink bg-white px-4 py-2 text-sm font-semibold hover:bg-mint" @click="store.simulateAccountReview()">
        Maquette : simuler la validation
      </button>
    </div>

    <section aria-labelledby="mes-offres" :class="!store.verified && 'mt-12'">
      <h2 id="mes-offres" class="h2 border-b-2 border-ink pb-4">Mes opportunités</h2>

      <p v-if="!store.state.offers.length" class="mt-8 max-w-xl text-ink-soft">
        Aucune opportunité pour l'instant.
        <template v-if="store.verified">Publiez la première : cela prend environ trois minutes.</template>
      </p>

      <ul v-else>
        <li
          v-for="o in store.state.offers"
          :key="o.id"
          class="grid grid-cols-1 items-center gap-4 border-b border-rule py-6 md:grid-cols-[minmax(0,1fr)_10rem_12rem]"
        >
          <div class="min-w-0">
            <p class="text-xs font-bold text-navy">{{ opportunityTypes[o.type] }}</p>
            <p class="display mt-1 text-[1.35rem]">{{ o.title }}</p>
            <p class="text-sm text-ink-soft">Clôture le {{ formatDate(o.deadline) }} · {{ o.remote ? 'à distance' : o.city }}</p>
          </div>
          <div>
            <span
              class="inline-block border-2 border-ink px-2.5 py-0.5 text-xs font-bold"
              :class="o.status === 'publiee' ? 'bg-green' : 'border-dashed bg-white'"
            >
              {{ o.status === 'publiee' ? 'En ligne' : 'En cours de validation' }}
            </span>
            <button
              v-if="o.status === 'en-revue'"
              type="button"
              class="mt-2 block text-xs font-semibold underline underline-offset-2"
              @click="store.simulateOfferReview(o.id)"
            >
              Maquette : valider
            </button>
          </div>
          <RouterLink
            v-if="o.status === 'publiee'"
            :to="{ name: 'structure-offer', params: { id: o.id } }"
            class="inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-navy decoration-2 underline-offset-4 hover:decoration-orange md:justify-end"
          >
            <Users :size="18" aria-hidden="true" />{{ store.candidatesFor(o).length }} candidatures
          </RouterLink>
          <p v-else class="text-sm text-ink-soft md:text-right">Validation sous 24 h</p>
        </li>
      </ul>
    </section>
  </div>
</template>
