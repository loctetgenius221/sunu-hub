<script setup lang="ts">
import { ref } from 'vue'
import { FileText, ListOrdered, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-vue-next'
import AdvisorDialog from '@/components/orient/AdvisorDialog.vue'
import PisteCard from '@/components/orient/PisteCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { useToast } from '@/composables/useToast'
import { useOrientationStore } from '@/stores/orientation'

// Résultats d'orientation (TDR O4) : trois pistes classées, deux pistes élargies, puis la suite.
const store = useOrientationStore()
const { show } = useToast()
const advisor = ref(false)
const results = store.results!

function rate(helpful: boolean) {
  store.state.helpful.resultats = helpful
  show(helpful ? 'Merci ! Ton retour améliore les recommandations.' : 'Merci. Un conseiller peut t’aider à y voir plus clair.')
  if (!helpful) advisor.value = true
}
</script>

<template>
  <section class="grid-paper border-b border-rule">
    <div class="wrap flex flex-wrap items-end justify-between gap-6 py-12 sm:py-14">
      <div class="min-w-0">
        <h1 class="display text-[clamp(2.2rem,4vw,3.4rem)]">Tes pistes</h1>
        <p class="mt-3 max-w-xl text-[1.1rem] text-ink-soft">
          Classées selon tes réponses. Nous ne proposons que des écoles publiques ou habilitées, et tes chances sont données en fourchette, sans faux pourcentage.
        </p>
      </div>
      <TextLink :to="{ name: 'orient-quiz' }">Modifier mes réponses</TextLink>
    </div>
  </section>

  <div class="wrap py-12 lg:py-16">
    <section aria-labelledby="h-top">
      <h2 id="h-top" class="h2">Les trois qui te correspondent le mieux</h2>
      <ol class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <li v-for="(p, i) in results.top" :key="p.program.id" class="min-w-0"><PisteCard :piste="p" :rank="i + 1" /></li>
      </ol>
    </section>

    <section v-if="results.wide.length" aria-labelledby="h-wide" class="mt-16">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
        <h2 id="h-wide" class="h2">Deux pistes pour élargir</h2>
        <p class="max-w-sm text-sm text-ink-soft">Des domaines auxquels tu n'as peut-être pas pensé, mais qui collent à tes matières fortes.</p>
      </div>
      <ul class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <li v-for="p in results.wide" :key="p.program.id" class="min-w-0"><PisteCard :piste="p" wide /></li>
      </ul>
    </section>

    <!-- Suite -->
    <section aria-labelledby="h-next" class="mt-16 grid grid-cols-1 gap-6 border-t border-rule pt-10 md:grid-cols-3">
      <h2 id="h-next" class="sr-only">Et maintenant</h2>
      <div class="rounded-tile bg-navy p-7 text-white">
        <ListOrdered :size="24" aria-hidden="true" />
        <h3 class="display mt-3 text-[1.5rem]">Ma liste de vœux</h3>
        <p class="mt-2">{{ store.state.wishes.length }} formation{{ store.state.wishes.length > 1 ? 's' : '' }} dans ta liste. Classe-les et ajoute un plan B.</p>
        <BaseButton :to="{ name: 'orient-wishes' }" variant="light" class="mt-6">Ordonner ma liste</BaseButton>
      </div>
      <div class="rounded-tile bg-white p-6">
        <FileText :size="24" class="text-navy" aria-hidden="true" />
        <h3 class="display mt-3 text-[1.5rem]">Résumé pour ma famille</h3>
        <p class="mt-2 text-ink-soft">Une page : ton profil, tes pistes, les coûts et les risques.</p>
        <TextLink :to="{ name: 'orient-summary' }" class="mt-5 inline-block">Voir le résumé</TextLink>
      </div>
      <div class="rounded-tile bg-white p-6">
        <MessageCircle :size="24" class="text-navy" aria-hidden="true" />
        <h3 class="display mt-3 text-[1.5rem]">Une question&nbsp;?</h3>
        <p class="mt-2 text-ink-soft">L'assistant répond à partir de notre base vérifiée, un conseiller sous 48 heures.</p>
        <div class="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          <TextLink :to="{ name: 'orient-assistant' }">Poser une question</TextLink>
          <button type="button" class="font-semibold text-navy hover:underline" @click="advisor = true">Parler à un conseiller</button>
        </div>
      </div>
    </section>

    <!-- Retour (indicateur « utilité de l'orientation ») -->
    <div class="mt-12 flex flex-wrap items-center gap-4 rounded-tile bg-paper-2 p-5">
      <p class="font-semibold">Ces pistes t'ont-elles aidé&nbsp;?</p>
      <div class="flex gap-2">
        <button
          v-for="opt in [{ v: true, label: 'Oui', icon: ThumbsUp }, { v: false, label: 'Pas vraiment', icon: ThumbsDown }]"
          :key="opt.label"
          type="button"
          class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-medium transition-colors"
          :class="store.state.helpful.resultats === opt.v ? 'bg-navy text-white' : 'bg-white hover:bg-paper-2'"
          :aria-pressed="store.state.helpful.resultats === opt.v"
          @click="rate(opt.v)"
        >
          <component :is="opt.icon" :size="16" aria-hidden="true" />{{ opt.label }}
        </button>
      </div>
    </div>
  </div>

  <AdvisorDialog v-model="advisor" />
</template>
