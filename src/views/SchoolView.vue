<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Check, Link2, MapPin, Minus, Share2 } from 'lucide-vue-next'
import SchoolStatusBadge from '@/components/school/SchoolStatusBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDate, schoolStatus } from '@/data/labels'
import { useToast } from '@/composables/useToast'
import { getSchool } from '@/services/api'
import type { School } from '@/types'

// Fiche d'établissement partageable (TDR O1–O2) : statut de l'école, puis statuts séparés
// de chaque formation. Aucune fiche sans source ni date de vérification.
const route = useRoute()
const { show } = useToast()

const school = ref<School | null | undefined>(undefined)
onMounted(async () => {
  school.value = await getSchool(String(route.params.id))
  if (school.value) document.title = `${school.value.name} · Vérifier une école · SUNU HŪB`
})

const status = computed(() => (school.value ? schoolStatus[school.value.status] : null))
const fcfa = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`
const shareText = computed(() =>
  school.value ? `${school.value.name} : ${status.value?.label}. Vérifié sur SUNU HŪB le ${formatDate(school.value.verifiedAt)}. ${location.href}` : '',
)
const whatsapp = computed(() => `https://wa.me/?text=${encodeURIComponent(shareText.value)}`)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href)
    show('Lien copié.')
  } catch {
    show('Copie impossible : sélectionne l’adresse dans la barre du navigateur.')
  }
}
</script>

<template>
  <div v-if="school === undefined" class="wrap py-20" aria-busy="true">
    <div class="h-64 animate-pulse rounded-tile bg-paper-2"></div>
  </div>

  <section v-else-if="school === null" class="wrap py-20">
    <h1 class="h2">Établissement introuvable</h1>
    <p class="mt-4 text-ink-soft">Cette fiche n'existe pas ou a été retirée.</p>
    <BaseButton to="/verifier-ecole" variant="secondary" class="mt-8">Chercher une école</BaseButton>
  </section>

  <template v-else>
    <section class="bg-white">
      <div class="wrap py-10 sm:py-14">
        <nav aria-label="Fil d'Ariane" class="text-sm">
          <RouterLink to="/verifier-ecole" class="font-medium text-navy hover:underline">Vérifier une école</RouterLink>
          <span class="mx-2 text-ink-soft">/</span><span class="text-ink-soft">{{ school.acronym ?? school.name }}</span>
        </nav>

        <div class="mt-6 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div class="min-w-0 lg:col-span-8">
            <h1 class="display text-[clamp(2.25rem,4.4vw,3.75rem)] text-balance">{{ school.name }}</h1>
            <p class="mt-3 flex items-center gap-1.5 text-ink-soft">
              <MapPin :size="16" aria-hidden="true" />{{ school.acronym ? `${school.acronym} · ` : '' }}{{ school.city }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Verdict -->
    <section class="bg-white pb-6" aria-labelledby="verdict">
      <div
        class="wrap grid grid-cols-1 gap-6 rounded-tile p-7 sm:p-10 lg:grid-cols-12 lg:items-center"
        :class="{ 'bg-mint': status?.tone === 'ok', 'bg-orange-soft': status?.tone === 'bad', 'bg-paper-2': status?.tone === 'warn' }"
      >
        <div class="min-w-0 lg:col-span-8">
          <h2 id="verdict" class="sr-only">Statut de l'établissement</h2>
          <SchoolStatusBadge :status="school.status" large plain />
          <p class="mt-5 max-w-2xl text-[clamp(1.375rem,2.4vw,1.875rem)] leading-snug font-semibold tracking-[-0.02em] text-ink">{{ status?.explain }}</p>
        </div>
        <div class="flex min-w-0 flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <BaseButton :href="whatsapp" target="_blank" rel="noopener noreferrer" variant="light" class="shadow-soft">
            <Share2 :size="18" aria-hidden="true" />Partager sur WhatsApp
          </BaseButton>
          <button type="button" class="inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-medium text-navy transition hover:bg-white/60" @click="copyLink">
            <Link2 :size="18" aria-hidden="true" />Copier le lien
          </button>
        </div>
      </div>
    </section>

    <div class="wrap py-12 lg:py-16">
      <section aria-labelledby="formations">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
          <h2 id="formations" class="text-[2rem] font-semibold tracking-[-0.025em]">Formations</h2>
          <p class="text-sm text-ink-soft">Chaque statut est affiché séparément.</p>
        </div>

        <p v-if="!school.programs.length" class="mt-6 rounded-tile bg-paper-2 p-6 text-ink-soft">
          Aucune formation vérifiée pour cet établissement.
        </p>

        <!-- Tableau (≥ 768 px) -->
        <table v-if="school.programs.length" class="mt-2 hidden w-full text-left md:table">
          <thead class="text-[0.875rem] text-ink-soft">
            <tr class="border-b border-rule">
              <th scope="col" class="py-3 pr-4 font-medium">Formation</th>
              <th scope="col" class="py-3 pr-4 font-medium">Accréditée</th>
              <th scope="col" class="py-3 pr-4 font-medium">CAMES</th>
              <th scope="col" class="py-3 pr-4 font-medium">Séries admises</th>
              <th scope="col" class="py-3 pr-4 font-medium">Durée</th>
              <th scope="col" class="py-3 font-medium">Coût par an</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in school.programs" :key="p.id" class="border-b border-rule align-top">
              <th scope="row" class="py-4 pr-4 font-medium">{{ p.name }}</th>
              <td v-for="ok in [p.accredited, p.cames]" :key="String(ok) + p.id" class="py-4 pr-4">
                <span class="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium" :class="ok ? 'text-green' : 'text-ink-soft'">
                  <component :is="ok ? Check : Minus" :size="16" aria-hidden="true" />{{ ok ? 'Oui' : 'Non' }}
                </span>
              </td>
              <td class="py-4 pr-4 text-sm">{{ p.admittedSeries.length ? p.admittedSeries.join(', ') : 'Après une licence' }}</td>
              <td class="py-4 pr-4 text-sm whitespace-nowrap">{{ p.durationYears }} ans</td>
              <td class="py-4 text-sm tabular-nums">
                {{ p.costRange ? `${fcfa(p.costRange[0])} à ${fcfa(p.costRange[1])}` : 'Non communiqué' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Liste (mobile) -->
        <ul v-if="school.programs.length" class="md:hidden">
          <li v-for="p in school.programs" :key="p.id" class="border-b border-rule py-5">
            <p class="font-medium">{{ p.name }}</p>
            <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt class="text-ink-soft">Accréditée</dt><dd class="font-medium">{{ p.accredited ? 'Oui' : 'Non' }}</dd>
              <dt class="text-ink-soft">CAMES</dt><dd class="font-medium">{{ p.cames ? 'Oui' : 'Non' }}</dd>
              <dt class="text-ink-soft">Séries</dt><dd>{{ p.admittedSeries.join(', ') || 'Après une licence' }}</dd>
              <dt class="text-ink-soft">Durée</dt><dd>{{ p.durationYears }} ans</dd>
              <dt class="text-ink-soft">Coût par an</dt>
              <dd class="tabular-nums">{{ p.costRange ? `${fcfa(p.costRange[0])} à ${fcfa(p.costRange[1])}` : 'Non communiqué' }}</dd>
            </dl>
          </li>
        </ul>
        <p v-if="school.programs.length" class="mt-4 text-sm text-ink-soft">Les coûts sont des fourchettes indicatives : confirme-les auprès de l'établissement.</p>
      </section>

      <section class="mt-12 grid grid-cols-1 gap-6 rounded-tile bg-paper-2 p-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div class="min-w-0">
          <h2 class="text-[0.9375rem] font-semibold">Source</h2>
          <p class="mt-1">{{ school.source }}. Vérifié le {{ formatDate(school.verifiedAt) }} par l'équipe SUNU HŪB.</p>
          <p class="mt-1 text-sm text-ink-soft">Une erreur ? L'établissement peut proposer une correction : elle est validée par notre équipe avant publication.</p>
        </div>
        <BaseButton to="/verifier-ecole" variant="light" class="shadow-soft">Vérifier une autre école</BaseButton>
      </section>
    </div>
  </template>
</template>
