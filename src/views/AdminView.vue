<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AdminCuration from '@/components/admin/AdminCuration.vue'
import AdminIndicators from '@/components/admin/AdminIndicators.vue'
import AdminStructures from '@/components/admin/AdminStructures.vue'
import { readCuration } from '@/services/curation'

// Back-office léger de l'équipe (TDR A1, A2, A3, A7). Maquette : sans authentification.
const route = useRoute()
const tabs = [
  { id: 'indicateurs', label: 'Indicateurs' },
  { id: 'opportunites', label: 'Opportunités' },
  { id: 'structures', label: 'Structures' },
  { id: 'journal', label: 'Journal' },
] as const
type Tab = (typeof tabs)[number]['id']
const tab = computed<Tab>(() => (tabs.some((t) => t.id === route.query.vue) ? (route.query.vue as Tab) : 'indicateurs'))

const log = computed(() => (tab.value === 'journal' ? readCuration().log : []))
</script>

<template>
  <section class="border-b-2 border-ink bg-ink text-white">
    <div class="wrap pt-10 sm:pt-12">
      <p class="inline-block border-2 border-white px-3 py-1 text-sm font-bold">Espace équipe · maquette sans connexion</p>
      <h1 class="display mt-5 text-[clamp(2rem,3.6vw,3rem)]">Back-office</h1>
      <nav aria-label="Sections du back-office" class="mt-8 -mb-0.5 flex gap-1 overflow-x-auto">
        <RouterLink
          v-for="t in tabs"
          :key="t.id"
          :to="{ query: t.id === 'indicateurs' ? {} : { vue: t.id } }"
          class="shrink-0 border-2 border-b-0 border-ink px-4 py-3 font-semibold"
          :class="tab === t.id ? 'bg-white text-ink' : 'bg-white/10 text-white hover:bg-white/20'"
          :aria-current="tab === t.id ? 'page' : undefined"
        >
          {{ t.label }}
        </RouterLink>
      </nav>
    </div>
  </section>

  <div class="wrap py-10 lg:py-14">
    <AdminIndicators v-if="tab === 'indicateurs'" />
    <AdminCuration v-else-if="tab === 'opportunites'" />
    <AdminStructures v-else-if="tab === 'structures'" />
    <section v-else aria-labelledby="h-log">
      <h2 id="h-log" class="h2 border-b-2 border-ink pb-4">Journal des modifications</h2>
      <p v-if="!log.length" class="mt-8 text-ink-soft">Aucune modification pour l'instant.</p>
      <ol class="mt-2">
        <li v-for="(l, i) in log" :key="i" class="grid grid-cols-1 gap-1 border-b border-rule py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
          <span class="text-sm text-ink-soft tabular-nums">{{ new Date(l.at).toLocaleString('fr-FR') }}</span>
          <span>{{ l.action }}</span>
        </li>
      </ol>
    </section>
  </div>
</template>
