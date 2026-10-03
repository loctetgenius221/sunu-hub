<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import IsoArt from '@/components/art/IsoArt.vue'
import AdvisorDialog from '@/components/orient/AdvisorDialog.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { orientQuestions } from '@/data/orientQuestions'
import { useOrientationStore } from '@/stores/orientation'

// Porte « Orienter » (TDR O3–O8) : présentation et point d'entrée du questionnaire.
const store = useOrientationStore()
const advisor = ref(false)

const steps = [
  { title: 'Quinze questions', text: 'Tes goûts, tes matières, tes contraintes. Environ huit minutes, chaque réponse est enregistrée.', art: 'signpost' as const },
  { title: 'Trois pistes, et deux pour élargir', text: 'Chacune avec son statut officiel, son coût, ses débouchés et la raison de sa place.', art: 'steps' as const },
  { title: 'Ta liste Campusen', text: 'Une liste ordonnée avec un plan B, prête à saisir toi-même sur Campusen.', art: 'sheets' as const },
]

const promises = [
  'Aucune école non habilitée parmi les propositions',
  'Des chances en fourchette, jamais en faux pourcentage',
  'Un résumé d’une page à montrer à ta famille',
  'Un conseiller humain si tu hésites',
]
</script>

<template>
  <section class="border-b-2 border-ink bg-navy text-white">
    <div class="wrap grid grid-cols-1 items-center gap-10 py-14 sm:py-20 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-7">
        <h1 class="display text-[clamp(2.2rem,4vw,3.6rem)]">Choisir ta voie, avec des informations vérifiées.</h1>
        <p class="mt-5 max-w-xl text-[1.15rem] text-white/80">
          Pour les élèves de Terminale, les nouveaux bacheliers et les étudiants qui veulent se réorienter.
        </p>
        <div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
          <template v-if="store.done">
            <BaseButton :to="{ name: 'orient-results' }">Voir mes pistes</BaseButton>
            <TextLink :to="{ name: 'orient-quiz' }" on-dark>Refaire le questionnaire</TextLink>
          </template>
          <template v-else>
            <BaseButton :to="{ name: 'orient-quiz' }">
              {{ store.answered ? `Reprendre (${store.answered}/${orientQuestions.length})` : 'Commencer le questionnaire' }}
            </BaseButton>
            <TextLink :to="{ name: 'orient-assistant' }" on-dark>Poser une question</TextLink>
          </template>
        </div>
      </div>
      <div class="flex min-w-0 justify-center lg:col-span-5">
        <IsoArt kind="signpost" :scale="1.6" />
      </div>
    </div>
  </section>

  <section aria-labelledby="comment" class="section bg-white">
    <div class="wrap">
      <h2 id="comment" class="h2 border-b-2 border-ink pb-6">Comment ça marche</h2>
      <ol class="grid grid-cols-1 md:grid-cols-3">
        <li v-for="(s, i) in steps" :key="s.title" class="border-b border-rule py-8 md:border-r md:border-b-0 md:px-8 md:first:pl-0 md:last:border-r-0">
          <IsoArt :kind="s.art" :scale="0.6" mono />
          <h3 class="display mt-5 text-[1.5rem] text-navy">{{ i + 1 }}. {{ s.title }}</h3>
          <p class="mt-2 text-ink-soft">{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section bg-paper-2">
    <div class="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h2 class="h2">Nos engagements</h2>
        <ul class="mt-8 border-t-2 border-ink">
          <li v-for="p in promises" :key="p" class="flex gap-3 border-b border-rule py-4">
            <Check :size="20" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" /><span>{{ p }}</span>
          </li>
        </ul>
      </div>
      <div class="min-w-0 lg:col-span-5 lg:col-start-8">
        <div class="border-2 border-ink bg-white p-6 shadow-[10px_10px_0_var(--color-orange)] sm:p-8">
          <h2 class="display text-[1.7rem] text-navy">SUNU HŪB ne remplace pas Campusen</h2>
          <p class="mt-3">
            Campusen reste le guichet officiel des vœux. Nous t'aidons à préparer ta liste, mais
            <span class="font-bold">tu la saisis toi-même</span> : personne ne doit déposer ton dossier à ta place.
          </p>
          <button type="button" class="mt-6 font-semibold underline decoration-navy decoration-2 underline-offset-4" @click="advisor = true">
            Parler à un conseiller
          </button>
        </div>
      </div>
    </div>
  </section>

  <AdvisorDialog v-model="advisor" />
</template>
