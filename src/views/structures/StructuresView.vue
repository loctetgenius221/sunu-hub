<script setup lang="ts">
import { Check, Clock, FileText, Inbox, ShieldCheck } from 'lucide-vue-next'
import AccentBar from '@/components/brand/AccentBar.vue'
import WaxBand from '@/components/brand/WaxBand.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import { freeNow, howItWorks, later } from '@/data/structuresPage'
import { useStructureStore } from '@/stores/structure'

// Présentation de l'espace structures (TDR §5.2) : gratuit dès le lancement, services payants plus tard.
const store = useStructureStore()
const icons = { shield: ShieldCheck, file: FileText, inbox: Inbox }
</script>

<template>
  <section class="bg-navy-deep text-white">
    <div class="wrap py-14 sm:py-20">
      <div v-reveal.once.stagger="{ distance: 20 }" class="max-w-3xl">
        <AccentBar class="mb-7" />
        <p class="text-[0.9375rem] font-medium text-white/70">Écoles, entreprises, ONG, incubateurs</p>
        <h1 class="display mt-3 text-[clamp(2.5rem,5vw,4.25rem)]">Vos opportunités, devant les bons profils.</h1>
        <p class="mt-5 max-w-xl text-[1.125rem] leading-snug text-white/80">
          Publiez gratuitement vos stages, emplois juniors, bourses, concours et formations. Ils arrivent aux jeunes dont le
          niveau et la filière correspondent.
        </p>
        <div class="mt-9 flex flex-wrap gap-3">
          <BaseButton v-if="store.state.account" :to="{ name: 'structure-dashboard' }" variant="light" size="lg">Accéder à mon espace</BaseButton>
          <BaseButton v-else :to="{ name: 'structure-signup' }" variant="light" size="lg">Créer un compte structure</BaseButton>
          <BaseButton href="#gratuit" variant="glass" size="lg">Ce qui est gratuit</BaseButton>
        </div>
      </div>
    </div>
    <WaxBand />
  </section>

  <section aria-labelledby="etapes" class="section bg-white">
    <div class="wrap">
      <SectionHead id="etapes" title="Trois étapes, sans engagement." lead="Pas d'abonnement ni de contrat : un compte vérifié suffit pour commencer." />
      <ol class="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        <li v-for="(s, i) in howItWorks" :key="s.title" class="min-w-0">
          <span class="grid h-12 w-12 place-items-center rounded-2xl bg-navy-soft text-navy" aria-hidden="true">
            <component :is="icons[s.icon]" :size="22" />
          </span>
          <p class="mt-6 text-[0.9375rem] font-semibold text-navy">Étape {{ i + 1 }}</p>
          <h3 class="mt-1 text-[1.5rem] font-semibold tracking-[-0.025em]">{{ s.title }}</h3>
          <p class="mt-2 text-ink-soft">{{ s.text }}</p>
          <p class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1 text-[0.875rem] font-medium">
            <Clock :size="15" class="text-navy" aria-hidden="true" />{{ s.delay }}
          </p>
        </li>
      </ol>
    </div>
  </section>

  <section id="gratuit" aria-labelledby="h-gratuit" class="section scroll-mt-20 bg-paper-2">
    <div class="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h2 id="h-gratuit" class="h2">Gratuit dès le lancement.</h2>
        <ul class="mt-10 divide-y divide-rule">
          <li v-for="f in freeNow" :key="f" class="flex gap-3 py-4 first:pt-0">
            <Check :size="20" class="mt-0.5 shrink-0 text-green" aria-hidden="true" /><span class="text-[1.0625rem]">{{ f }}</span>
          </li>
        </ul>
      </div>
      <div class="min-w-0 lg:col-span-5 lg:col-start-8">
        <div class="rounded-tile bg-white p-7 shadow-soft sm:p-9">
          <h2 class="text-[1.625rem] font-semibold tracking-[-0.025em]">Plus tard, en option</h2>
          <ul class="mt-5 space-y-3 text-ink-soft">
            <li v-for="l in later" :key="l">{{ l }}</li>
          </ul>
          <p class="mt-6 border-t border-rule pt-5 text-[0.9375rem]">
            Quoi qu'il arrive, le classement des offres ne dépend jamais d'un paiement, et une offre qui demande de l'argent au
            candidat est refusée.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
