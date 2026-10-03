<script setup lang="ts">
import { computed } from 'vue'
import { Printer } from 'lucide-vue-next'
import SunuLogo from '@/components/brand/SunuLogo.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { labelOf, questions } from '@/data/questions'
import { useProfileStore } from '@/stores/profile'

// CV généré depuis le profil (TDR P3). « Enregistrer en PDF » passe par l'impression du navigateur.
const store = useProfileStore()
const s = store.state
const q = (id: string) => labelOf(questions.find((x) => x.id === id)!, s.answers)
const phone = computed(() => s.phone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '+221 $1 $2 $3 $4'))
const print = () => window.print()
const availability = { '': '', immediate: 'Disponible tout de suite', 'trois-mois': 'Disponible dans les 3 mois', 'six-mois': 'Disponible dans les 6 mois' }
</script>

<template>
  <div class="bg-paper-2 py-10 print:bg-white print:py-0">
    <div class="wrap flex max-w-[52rem] flex-wrap items-center justify-between gap-4 print:hidden">
      <TextLink :to="{ name: 'profile' }">Retour au profil</TextLink>
      <BaseButton @click="print"><Printer :size="18" aria-hidden="true" />Enregistrer en PDF</BaseButton>
    </div>

    <article class="wrap mt-8 max-w-[52rem] border-2 border-ink bg-white p-8 sm:p-12 print:mt-0 print:border-0 print:p-0">
      <header class="flex flex-wrap items-start justify-between gap-6 border-b-2 border-ink pb-6">
        <div class="min-w-0">
          <h1 class="display text-[2.6rem] text-navy">{{ s.firstName }}</h1>
          <p class="mt-1 text-lg">{{ q('track') }} · {{ q('field') }}</p>
        </div>
        <div class="text-sm sm:text-right">
          <p class="whitespace-nowrap">{{ phone }}</p>
          <p>{{ s.answers.city }}</p>
          <p v-if="s.extras.availability" class="mt-1 font-semibold">{{ availability[s.extras.availability] }}</p>
        </div>
      </header>

      <section class="grid grid-cols-1 gap-2 border-b border-rule py-6 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <h2 class="font-bold text-navy">Objectif</h2>
        <p>Recherche : {{ q('goal').toLowerCase() }}.</p>
      </section>
      <section class="grid grid-cols-1 gap-2 border-b border-rule py-6 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <h2 class="font-bold text-navy">Formation</h2>
        <div>
          <p class="font-semibold">{{ s.extras.school || 'Établissement à préciser' }}</p>
          <p class="text-ink-soft">{{ q('stage') }} · {{ q('track') }}</p>
        </div>
      </section>
      <section class="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <h2 class="font-bold text-navy">Compétences</h2>
        <ul v-if="s.extras.skills.length" class="flex flex-wrap gap-2">
          <li v-for="k in s.extras.skills" :key="k" class="border border-ink px-2.5 py-0.5 text-sm">{{ k }}</li>
        </ul>
        <p v-else class="text-ink-soft">À compléter depuis ton profil.</p>
      </section>

      <footer class="mt-6 flex items-center justify-between gap-4 border-t-2 border-ink pt-4 text-xs text-ink-soft">
        <span>CV généré avec</span>
        <SunuLogo class="scale-75 origin-right" />
      </footer>
    </article>
  </div>
</template>
