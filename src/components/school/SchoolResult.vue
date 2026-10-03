<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SchoolStatusBadge from './SchoolStatusBadge.vue'
import { formatDate, schoolStatus } from '@/data/labels'
import type { School } from '@/types'

// Résultat du vérificateur : statut en langage simple, puis chaque formation avec ses statuts
// séparés (accréditation, CAMES). Source et date toujours affichées ; lien vers la fiche partageable.
defineProps<{ school: School }>()
</script>

<template>
  <article class="relative border-2 border-ink bg-white p-5 sm:p-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="display text-[1.5rem] text-ink">
          <RouterLink :to="{ name: 'school', params: { id: school.id } }" class="hover:underline">{{ school.name }}</RouterLink>
        </h3>
        <p class="text-sm text-ink-soft">{{ school.acronym ? `${school.acronym} · ` : '' }}{{ school.city }}</p>
      </div>
      <SchoolStatusBadge :status="school.status" />
    </div>
    <p class="mt-3 max-w-xl">{{ schoolStatus[school.status].explain }}</p>

    <ul v-if="school.programs.length" class="mt-5 border-t-2 border-ink">
      <li v-for="p in school.programs" :key="p.id" class="flex flex-wrap items-center justify-between gap-2 border-b border-rule py-3 text-sm">
        <span class="min-w-0 font-semibold">{{ p.name }}</span>
        <span class="flex flex-wrap gap-2">
          <span class="border px-2 py-0.5" :class="p.accredited ? 'border-ink' : 'border-dashed border-ink-soft text-ink-soft'">
            {{ p.accredited ? 'Accréditée' : 'Non accréditée' }}
          </span>
          <span v-if="p.cames" class="border border-ink px-2 py-0.5">Reconnue CAMES</span>
        </span>
      </li>
    </ul>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-ink-soft">Source : {{ school.source }}. Vérifié le {{ formatDate(school.verifiedAt) }}.</p>
      <RouterLink
        :to="{ name: 'school', params: { id: school.id } }"
        class="text-sm font-semibold underline decoration-navy decoration-2 underline-offset-4 hover:decoration-orange"
      >
        Voir la fiche
      </RouterLink>
    </div>
  </article>
</template>
