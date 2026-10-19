<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { BellRing, Search, SlidersHorizontal, X } from 'lucide-vue-next'
import ApplicationTracker from '@/components/opportunity/ApplicationTracker.vue'
import FilterPanel from '@/components/opportunity/FilterPanel.vue'
import OpportunityCard from '@/components/opportunity/OpportunityCard.vue'
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
  <section class="bg-white">
    <div class="wrap pt-12 pb-8 sm:pt-16">
      <h1 class="display text-[clamp(2.5rem,5vw,4rem)]">Opportunités</h1>
      <p class="lead mt-4 max-w-2xl">
        <template v-if="profile.profile">Triées pour toi, {{ profile.profile.firstName }} : la pertinence dit pourquoi chaque offre est à sa place.</template>
        <template v-else>Stages, emplois juniors, bourses, concours, formations et financements, vérifiés et datés.</template>
      </p>

      <!-- Vues : commande segmentée -->
      <nav aria-label="Vues" class="mt-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-paper-2 p-1">
        <RouterLink
          v-for="t in tabs"
          :key="t.id"
          :to="{ query: t.id === 'fil' ? {} : { vue: t.id } }"
          class="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors"
          :class="view === t.id ? 'bg-white text-ink shadow-soft' : 'text-ink-soft hover:text-ink'"
          :aria-current="view === t.id ? 'page' : undefined"
        >
          {{ t.label }}
          <span v-if="t.count" class="grid h-5 min-w-5 place-items-center rounded-full bg-navy px-1.5 text-[0.6875rem] text-white tabular-nums">{{ t.count }}</span>
        </RouterLink>
      </nav>
    </div>
  </section>

  <div class="bg-paper-2">
  <div class="wrap py-10 lg:py-14">
    <!-- Invitation à créer un profil -->
    <aside v-if="!profile.profile && view === 'fil'" class="mb-10 flex flex-wrap items-center justify-between gap-5 rounded-tile bg-navy-soft p-6 sm:p-7">
      <p class="max-w-xl"><span class="font-semibold">Crée ton profil en deux minutes</span> pour voir les offres triées selon ton niveau et ta filière, avec un score et sa raison.</p>
      <BaseButton to="/inscription">Créer mon profil</BaseButton>
    </aside>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <!-- Filtres -->
      <aside v-if="view === 'fil'" class="min-w-0 lg:col-span-3" aria-label="Filtres">
        <button
          type="button"
          class="flex min-h-11 w-full items-center justify-between rounded-full bg-white px-5 font-medium shadow-soft lg:hidden"
          :aria-expanded="showFilters"
          aria-controls="filtres"
          @click="showFilters = !showFilters"
        >
          <span class="flex items-center gap-2"><SlidersHorizontal :size="18" aria-hidden="true" />Filtres</span>
          <span v-if="activeCount(filters)" class="grid h-6 min-w-6 place-items-center rounded-full bg-navy text-xs text-white tabular-nums">{{ activeCount(filters) }}</span>
        </button>
        <div id="filtres" class="mt-5 lg:sticky lg:top-24 lg:mt-0 lg:block" :class="showFilters ? 'block' : 'hidden'">
          <FilterPanel v-model="filters" />
        </div>
      </aside>

      <div class="min-w-0" :class="view === 'fil' ? 'lg:col-span-9' : 'lg:col-span-12'">
        <div v-if="view === 'fil'" class="flex rounded-full bg-white shadow-soft ring-1 ring-rule transition focus-within:ring-4 focus-within:ring-navy/15">
          <Search :size="20" class="ml-5 shrink-0 self-center text-ink-soft" aria-hidden="true" />
          <label for="q" class="sr-only">Rechercher une opportunité</label>
          <input id="q" v-model="search" type="search" placeholder="Rechercher : développeur, bourse, Thiès…" class="min-w-0 flex-1 bg-transparent px-3 py-3.5 outline-none placeholder:text-ink-soft" />
          <button v-if="search" type="button" class="mr-2 grid w-10 place-items-center rounded-full text-ink-soft hover:text-ink" @click="search = ''"><X :size="18" aria-hidden="true" /><span class="sr-only">Effacer</span></button>
        </div>

        <h2 class="sr-only">Résultats</h2>
        <p class="mt-6 text-[0.9375rem] text-ink-soft" aria-live="polite">
          <template v-if="results">{{ results.length }} {{ results.length > 1 ? 'opportunités' : 'opportunité' }}</template>
          <template v-else>Chargement…</template>
        </p>

        <ul v-if="!results" class="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2" aria-busy="true">
          <li v-for="n in 4" :key="n" class="h-64 animate-pulse rounded-card bg-white"></li>
        </ul>

        <!-- Fil et sauvegardes -->
        <ul v-else-if="view !== 'candidatures' && results.length" class="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <li v-for="o in results" :key="o.id" class="min-w-0">
            <OpportunityCard :item="o" />
            <p v-if="view === 'sauvegardes'" class="mt-2.5 flex items-center gap-2 px-2 text-[0.875rem] text-ink-soft">
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
        <ul v-else-if="results.length" class="mt-5 space-y-4">
          <li v-for="o in results" :key="o.id" class="grid grid-cols-1 gap-5 rounded-tile bg-white p-3 shadow-soft lg:grid-cols-2 lg:items-center lg:p-4">
            <OpportunityCard :item="o" />
            <ApplicationTracker :id="o.id" class="self-center" />
          </li>
        </ul>

        <div v-else class="mt-6 flex flex-col items-start gap-4 rounded-tile bg-white p-8 shadow-soft sm:p-10">
          <p class="text-[1.5rem] font-semibold tracking-[-0.02em]">
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
  </div>
</template>
