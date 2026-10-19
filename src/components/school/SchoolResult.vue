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
  <article class="relative rounded-tile bg-white p-6 shadow-soft sm:p-7">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-[1.375rem] font-semibold tracking-[-0.02em]">
          <RouterLink :to="{ name: 'school', params: { id: school.id } }" class="hover:underline">{{ school.name }}</RouterLink>
        </h3>
        <p class="text-sm text-ink-soft">{{ school.acronym ? `${school.acronym} · ` : '' }}{{ school.city }}</p>
      </div>
      <SchoolStatusBadge :status="school.status" />
    </div>
    <p class="mt-3 max-w-xl text-ink-soft">{{ schoolStatus[school.status].explain }}</p>

    <ul v-if="school.programs.length" class="mt-5 divide-y divide-rule border-t border-rule">
      <li v-for="p in school.programs" :key="p.id" class="flex flex-wrap items-center justify-between gap-2 py-3 text-[0.9375rem]">
        <span class="min-w-0 font-medium">{{ p.name }}</span>
        <span class="flex flex-wrap gap-2">
          <span class="rounded-full px-2.5 py-0.5 text-[0.8125rem] font-medium" :class="p.accredited ? 'bg-mint text-green' : 'bg-paper-2 text-ink-soft'">
            {{ p.accredited ? 'Accréditée' : 'Non accréditée' }}
          </span>
          <span v-if="p.cames" class="rounded-full bg-navy-soft px-2.5 py-0.5 text-[0.8125rem] font-medium text-navy">Reconnue CAMES</span>
        </span>
      </li>
    </ul>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-ink-soft">Source : {{ school.source }}. Vérifié le {{ formatDate(school.verifiedAt) }}.</p>
      <RouterLink
        :to="{ name: 'school', params: { id: school.id } }"
        class="text-[0.9375rem] font-medium text-navy hover:underline"
      >
        Voir la fiche
      </RouterLink>
    </div>
  </article>
</template>
