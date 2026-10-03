<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { BellRing, Search, SlidersHorizontal, X } from 'lucide-vue-next'
import IsoArt from '@/components/art/IsoArt.vue'
import ApplicationTracker from '@/components/opportunity/ApplicationTracker.vue'
import FilterPanel from '@/components/opportunity/FilterPanel.vue'
import OpportunityTicket from '@/components/opportunity/OpportunityTicket.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDate } from '@/data/labels'
import { getFeed } from '@/services/api'
import { activeCount, applyFilters, emptyFilters, type Filters } from '@/services/filters'
import { reminders } from '@/services/matching'
import { useActivityStore } from '@/stores/activity'
import { useProfileStore } from '@/stores/profile'
import type { Level, OpportunityType, ScoredOpportunity } from '@/types'

// Fil d'opportunités (TDR Q1–Q5) : trois vues (fil, sauvegardes, candidatures),
// filtres synchronisés avec l'URL pour pouvoir partager une recherche.

const route = useRoute()
const router = useRouter()
const profile = useProfileStore()
const activity = useActivityStore()

type View = 'fil' | 'sauvegardes' | 'candidatures'
const view = computed<View>(() => (['sauvegardes', 'candidatures'].includes(String(route.query.vue)) ? (route.query.vue as View) : 'fil'))

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const filters = computed<Filters>({
  get: () => ({
    q: str(route.query.q),
    types: str(route.query.types).split(',').filter(Boolean) as OpportunityType[],
    level: str(route.query.niveau) as Level | '',
    field: str(route.query.filiere),
    city: str(route.query.ville),
    within: str(route.query.delai) as Filters['within'],
  }),
  set: (f) =>
    router.replace({
      query: Object.fromEntries(
        Object.entries({ vue: route.query.vue, q: f.q, types: f.types.join(','), niveau: f.level, filiere: f.field, ville: f.city, delai: f.within }).filter(([, v]) => v),
      ),
    }),
})

// La recherche texte est appliquée après une courte pause de frappe.
const search = ref(filters.value.q)
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (q) => {
  clearTimeout(timer)
  timer = setTimeout(() => (filters.value = { ...filters.value, q }), 250)
})

const all = ref<ScoredOpportunity[] | null>(null)
onMounted(async () => (all.value = await getFeed(profile.profile)))

const results = computed(() => {
  if (!all.value) return null
  if (view.value === 'sauvegardes') return all.value.filter((o) => activity.isSaved(o.id))
  if (view.value === 'candidatures') return all.value.filter((o) => activity.state.applications[o.id])
  return applyFilters(all.value, filters.value)
})

const tabs = computed(() => [
  { id: 'fil', label: profile.profile ? 'Pour toi' : 'Toutes les offres' },
  { id: 'sauvegardes', label: 'Sauvegardées', count: activity.state.saved.length },
  { id: 'candidatures', label: 'Candidatures', count: Object.keys(activity.state.applications).length },
])

const showFilters = ref(false)
</script>

<template>
  <section class="grid-paper border-b-2 border-ink">
    <div class="wrap grid grid-cols-1 items-end gap-8 pt-12 sm:pt-16 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-8">
        <h1 class="display text-[clamp(2.2rem,4vw,3.4rem)] text-navy">Opportunités</h1>
        <p class="mt-4 max-w-xl text-[1.15rem] text-ink-soft">
          <template v-if="profile.profile">Triées pour toi, {{ profile.profile.firstName }} : le score dit pourquoi chaque offre est à sa place.</template>
          <template v-else>Stages, emplois juniors, bourses, concours, formations et financements, vérifiés et datés.</template>
        </p>
      </div>
      <div class="hidden justify-end lg:col-span-4 lg:flex">
        <IsoArt kind="network" live :scale="0.9" />
      </div>

      <!-- Onglets -->
      <nav aria-label="Vues" class="-mb-0.5 flex gap-1 overflow-x-auto lg:col-span-12">
        <RouterLink
          v-for="t in tabs"
          :key="t.id"
          :to="{ query: t.id === 'fil' ? {} : { vue: t.id } }"
          class="flex shrink-0 items-center gap-2 border-2 border-b-0 border-ink px-4 py-3 font-semibold"
          :class="view === t.id ? 'bg-white' : 'bg-paper-2 text-ink-soft hover:text-ink'"
          :aria-current="view === t.id ? 'page' : undefined"
        >
          {{ t.label }}
          <span v-if="t.count" class="grid h-6 min-w-6 place-items-center rounded-full bg-navy px-1.5 text-xs text-white tabular-nums">{{ t.count }}</span>
        </RouterLink>
      </nav>
    </div>
  </section>

  <div class="wrap py-10 lg:py-14">
    <!-- Invitation à créer un profil -->
    <aside v-if="!profile.profile && view === 'fil'" class="mb-10 flex flex-wrap items-center justify-between gap-5 border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-orange)]">
      <p class="max-w-xl"><span class="font-bold">Crée ton profil en deux minutes</span> pour voir les offres triées selon ton niveau et ta filière, avec un score et sa raison.</p>
      <BaseButton to="/inscription">Créer mon profil</BaseButton>
    </aside>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <!-- Filtres -->
      <aside v-if="view === 'fil'" class="min-w-0 lg:col-span-3" aria-label="Filtres">
        <button
          type="button"
          class="flex min-h-11 w-full items-center justify-between border-2 border-ink bg-white px-4 font-semibold lg:hidden"
          :aria-expanded="showFilters"
          aria-controls="filtres"
          @click="showFilters = !showFilters"
        >
          <span class="flex items-center gap-2"><SlidersHorizontal :size="18" aria-hidden="true" />Filtres</span>
          <span v-if="activeCount(filters)" class="grid h-6 min-w-6 place-items-center rounded-full bg-orange text-xs tabular-nums">{{ activeCount(filters) }}</span>
        </button>
        <div id="filtres" class="mt-5 lg:sticky lg:top-24 lg:mt-0 lg:block" :class="showFilters ? 'block' : 'hidden'">
          <FilterPanel v-model="filters" />
        </div>
      </aside>

      <div class="min-w-0" :class="view === 'fil' ? 'lg:col-span-9' : 'lg:col-span-12'">
        <div v-if="view === 'fil'" class="flex border-2 border-ink bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-orange">
          <Search :size="20" class="ml-4 shrink-0 self-center" aria-hidden="true" />
          <label for="q" class="sr-only">Rechercher une opportunité</label>
          <input id="q" v-model="search" type="search" placeholder="Rechercher : développeur, bourse, Thiès…" class="min-w-0 flex-1 bg-transparent px-3 py-3.5 outline-none" />
          <button v-if="search" type="button" class="px-4" @click="search = ''"><X :size="18" aria-hidden="true" /><span class="sr-only">Effacer</span></button>
        </div>

        <h2 class="sr-only">Résultats</h2>
        <p class="mt-6 border-b-2 border-ink pb-3 text-sm font-semibold" aria-live="polite">
          <template v-if="results">{{ results.length }} {{ results.length > 1 ? 'opportunités' : 'opportunité' }}</template>
          <template v-else>Chargement…</template>
        </p>

        <ul v-if="!results" class="mt-6 grid grid-cols-1 gap-7 xl:grid-cols-2" aria-busy="true">
          <li v-for="n in 4" :key="n" class="h-44 animate-pulse border-2 border-dashed border-rule bg-white"></li>
        </ul>

        <!-- Fil et sauvegardes -->
        <ul v-else-if="view !== 'candidatures' && results.length" class="mt-6 grid grid-cols-1 gap-7 xl:grid-cols-2">
          <li v-for="o in results" :key="o.id" class="min-w-0">
            <OpportunityTicket :item="o" notch="var(--color-paper)" />
            <p v-if="view === 'sauvegardes'" class="mt-3 flex items-center gap-2 text-sm text-ink-soft">
              <BellRing :size="16" class="shrink-0 text-navy" aria-hidden="true" />
              <template v-if="reminders(o.deadline).length">
                Rappel{{ reminders(o.deadline).length > 1 ? 's' : '' }} :
                {{ reminders(o.deadline).map((r) => `${formatDate(r.date)} (${r.label})`).join(' et ') }}
              </template>
              <template v-else>Date limite très proche : pas de rappel supplémentaire.</template>
            </p>
          </li>
        </ul>

        <!-- Candidatures -->
        <ul v-else-if="results.length" class="mt-6 space-y-10">
          <li v-for="o in results" :key="o.id" class="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <OpportunityTicket :item="o" notch="var(--color-paper)" />
            <ApplicationTracker :id="o.id" class="self-center" />
          </li>
        </ul>

        <div v-else class="mt-8 flex flex-col items-start gap-5 border-2 border-dashed border-ink p-8">
          <p class="display text-[1.5rem] text-navy">
            <template v-if="view === 'fil'">Aucune offre ne correspond à ces filtres.</template>
            <template v-else-if="view === 'sauvegardes'">Tu n'as encore rien sauvegardé.</template>
            <template v-else>Aucune candidature suivie pour l'instant.</template>
          </p>
          <p class="max-w-lg text-ink-soft">
            <template v-if="view === 'fil'">Élargis la ville ou la date limite, ou efface les filtres.</template>
            <template v-else-if="view === 'sauvegardes'">Sauvegarde une offre pour recevoir un rappel sept jours et un jour avant sa date limite.</template>
            <template v-else>Depuis la fiche d'une offre, indique « J'ai candidaté » pour suivre les étapes.</template>
          </p>
          <BaseButton v-if="view === 'fil' && activeCount(filters)" variant="secondary" @click="filters = emptyFilters(); search = ''">Effacer les filtres</BaseButton>
          <BaseButton v-else-if="view !== 'fil'" :to="{ query: {} }" variant="secondary">Voir les offres</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
