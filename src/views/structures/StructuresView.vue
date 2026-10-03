<script setup lang="ts">
import { Check, Clock } from 'lucide-vue-next'
import IsoArt from '@/components/art/IsoArt.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { freeNow, howItWorks, later } from '@/data/structuresPage'
import { useStructureStore } from '@/stores/structure'

// Présentation de l'espace structures (TDR §5.2) : gratuit dès le lancement, services payants plus tard.
const store = useStructureStore()
</script>

<template>
  <section class="border-b-2 border-ink bg-navy text-white">
    <div class="wrap grid grid-cols-1 items-center gap-10 py-14 sm:py-20 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-7">
        <p class="inline-block border-2 border-ink bg-white px-3 py-1 text-sm font-bold text-ink">Écoles, entreprises, ONG, incubateurs</p>
        <h1 class="display mt-6 text-[clamp(2.2rem,4vw,3.6rem)]">Vos opportunités, devant les bons profils.</h1>
        <p class="mt-5 max-w-xl text-[1.15rem] text-white/80">
          Publiez gratuitement vos stages, emplois juniors, bourses, concours et formations. Ils arrivent aux jeunes dont le
          niveau et la filière correspondent.
        </p>
        <div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
          <BaseButton v-if="store.state.account" :to="{ name: 'structure-dashboard' }">Accéder à mon espace</BaseButton>
          <BaseButton v-else :to="{ name: 'structure-signup' }">Créer un compte structure</BaseButton>
          <TextLink to="#gratuit" on-dark>Ce qui est gratuit</TextLink>
        </div>
      </div>
      <div class="flex min-w-0 justify-center lg:col-span-5">
        <IsoArt kind="pawns" :scale="1.5" />
      </div>
    </div>
  </section>

  <section aria-labelledby="etapes" class="section bg-white">
    <div class="wrap">
      <SectionHead id="etapes" title="Trois étapes, sans démarchage." lead="Pas d'abonnement ni de contrat : un compte vérifié suffit pour commencer." />
      <ol>
        <li
          v-for="(s, i) in howItWorks"
          :key="s.title"
          class="group grid grid-cols-1 items-center gap-5 border-b border-rule py-8 sm:grid-cols-[8rem_minmax(0,1fr)] lg:grid-cols-[10rem_minmax(0,1fr)_14rem] lg:gap-10"
        >
          <IsoArt :kind="s.art" :scale="0.6" class="transition-transform duration-300 group-hover:-translate-y-2" />
          <div class="min-w-0">
            <h3 class="display text-[1.6rem] text-navy">{{ i + 1 }}. {{ s.title }}</h3>
            <p class="mt-2 max-w-xl text-ink-soft">{{ s.text }}</p>
          </div>
          <p class="flex items-center gap-2 font-semibold sm:col-start-2 lg:col-start-auto lg:justify-end">
            <Clock :size="18" class="text-navy" aria-hidden="true" />{{ s.delay }}
          </p>
        </li>
      </ol>
    </div>
  </section>

  <section id="gratuit" aria-labelledby="h-gratuit" class="section scroll-mt-20 bg-paper-2">
    <div class="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h2 id="h-gratuit" class="h2">Gratuit dès le lancement</h2>
        <ul class="mt-8 border-t-2 border-ink">
          <li v-for="f in freeNow" :key="f" class="flex gap-3 border-b border-rule py-4">
            <Check :size="20" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" /><span>{{ f }}</span>
          </li>
        </ul>
      </div>
      <div class="min-w-0 lg:col-span-5 lg:col-start-8">
        <div class="border-2 border-dashed border-ink bg-white p-6 sm:p-8">
          <h2 class="display text-[1.6rem] text-navy">Plus tard, en option</h2>
          <ul class="mt-5 space-y-3 text-ink-soft">
            <li v-for="l in later" :key="l">{{ l }}</li>
          </ul>
          <p class="mt-6 border-t-2 border-ink pt-4 text-sm">
            Quoi qu'il arrive, le classement des offres ne dépend jamais d'un paiement, et une offre qui demande de l'argent au
            candidat est refusée.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
