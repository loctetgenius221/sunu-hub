<script setup lang="ts">
import { ref } from 'vue'
import { Check, ListChecks, ListOrdered, Route } from 'lucide-vue-next'
import AccentBar from '@/components/brand/AccentBar.vue'
import WaxBand from '@/components/brand/WaxBand.vue'
import AdvisorDialog from '@/components/orient/AdvisorDialog.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { orientQuestions } from '@/data/orientQuestions'
import { useOrientationStore } from '@/stores/orientation'

// Porte « Orienter » (TDR O3–O8) : présentation et point d'entrée du questionnaire.
const store = useOrientationStore()
const advisor = ref(false)

const steps = [
  { title: 'Quinze questions', text: 'Tes goûts, tes matières, tes contraintes. Environ huit minutes, chaque réponse est enregistrée.', icon: ListChecks },
  { title: 'Trois pistes, et deux pour élargir', text: 'Chacune avec son statut officiel, son coût, ses débouchés et la raison de sa place.', icon: Route },
  { title: 'Ta liste Campusen', text: 'Une liste ordonnée avec un plan B, prête à saisir toi-même sur Campusen.', icon: ListOrdered },
]

const promises = [
  'Aucune école non habilitée parmi les propositions',
  'Des chances en fourchette, jamais en faux pourcentage',
  'Un résumé d’une page à montrer à ta famille',
  'Un conseiller humain si tu hésites',
]
</script>

<template>
  <section class="bg-navy-deep text-white">
    <div class="wrap py-14 sm:py-20">
      <div v-reveal.once.stagger="{ distance: 20 }" class="max-w-3xl">
        <AccentBar class="mb-7" />
        <h1 class="display text-[clamp(2.5rem,5vw,4.25rem)] text-balance">Choisir ta voie, avec des informations vérifiées.</h1>
        <p class="mt-5 max-w-xl text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-snug text-white/80">Pour les élèves de Terminale, les nouveaux bacheliers et les étudiants qui veulent se réorienter.</p>
        <div class="mt-9 flex flex-wrap items-center gap-3">
          <template v-if="store.done">
            <BaseButton :to="{ name: 'orient-results' }" variant="light" size="lg">Voir mes pistes</BaseButton>
            <BaseButton :to="{ name: 'orient-quiz' }" variant="glass" size="lg">Refaire le questionnaire</BaseButton>
          </template>
          <template v-else>
            <BaseButton :to="{ name: 'orient-quiz' }" variant="light" size="lg">
              {{ store.answered ? `Reprendre (${store.answered} sur ${orientQuestions.length})` : 'Commencer le questionnaire' }}
            </BaseButton>
            <BaseButton :to="{ name: 'orient-assistant' }" variant="glass" size="lg">Poser une question</BaseButton>
          </template>
        </div>
      </div>
    </div>
    <WaxBand />
  </section>

  <section aria-labelledby="comment" class="section bg-paper-2">
    <div class="wrap">
      <h2 id="comment" class="h2">Comment ça marche</h2>
      <ol class="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        <li v-for="(s, i) in steps" :key="s.title" class="min-w-0">
          <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy shadow-soft" aria-hidden="true">
            <component :is="s.icon" :size="22" />
          </span>
          <p class="mt-6 text-[0.9375rem] font-semibold text-navy">Étape {{ i + 1 }}</p>
          <h3 class="mt-1 text-[1.5rem] font-semibold tracking-[-0.025em]">{{ s.title }}</h3>
          <p class="mt-2 text-ink-soft">{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section bg-white">
    <div class="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h2 class="h2">Nos engagements</h2>
        <ul class="mt-10 divide-y divide-rule">
          <li v-for="p in promises" :key="p" class="flex gap-3 py-4 first:pt-0">
            <Check :size="20" class="mt-0.5 shrink-0 text-green" aria-hidden="true" /><span class="text-[1.0625rem]">{{ p }}</span>
          </li>
        </ul>
      </div>
      <div class="min-w-0 lg:col-span-5 lg:col-start-8">
        <div class="rounded-tile bg-navy-deep p-7 text-white sm:p-9">
          <h2 class="text-[1.625rem] font-semibold tracking-[-0.025em]">SUNU HŪB ne remplace pas Campusen</h2>
          <p class="mt-3 text-white/80">
            Campusen reste le guichet officiel des vœux. Nous t'aidons à préparer ta liste, mais
            <span class="font-semibold text-white">tu la saisis toi-même</span> : personne ne doit déposer ton dossier à ta place.
          </p>
          <BaseButton variant="light" class="mt-7" @click="advisor = true">Parler à un conseiller</BaseButton>
        </div>
      </div>
    </div>
  </section>

  <AdvisorDialog v-model="advisor" />
</template>
