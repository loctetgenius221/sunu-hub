<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, scroll } from 'motion'
import { prefersReducedMotion } from '@/composables/useMotion'
import WaxBand from '@/components/brand/WaxBand.vue'
import WaxTexture from '@/components/brand/WaxTexture.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import HubNetwork from './HubNetwork.vue'
import { useProfileStore } from '@/stores/profile'
import type { Stage } from '@/types'

// Héros sur la couleur principale : le positionnement, une phrase, une action.
// À droite, le réseau « Toi » : ce que la plateforme relie autour de toi. Il allume les
// destinations du stade choisi dans la section suivante (« Je suis… »).
defineProps<{ stage: Stage }>()
const profile = useProfileStore()

// En quittant le haut de page, le texte remonte et s'estompe, le réseau un peu moins vite :
// une profondeur légère, réglée sur le défilement (dans les deux sens).
const section = ref<HTMLElement | null>(null)
const copy = ref<HTMLElement | null>(null)
const aside = ref<HTMLElement | null>(null)
const stops: VoidFunction[] = []

onMounted(() => {
  if (prefersReducedMotion() || !section.value) return
  const range: Parameters<typeof scroll>[1] = { target: section.value, offset: ['start start', 'end start'] }
  stops.push(
    scroll(animate(copy.value!, { opacity: [1, 0], transform: ['translateY(0px)', 'translateY(-80px)'] }, { ease: 'linear' }), range),
    scroll(animate(aside.value!, { opacity: [1, 0.2], transform: ['translateY(0px)', 'translateY(-36px)'] }, { ease: 'linear' }), range),
  )
})
onBeforeUnmount(() => stops.forEach((s) => s()))
</script>

<template>
  <section ref="section" class="relative isolate bg-navy-deep text-white" aria-labelledby="hero-title">
    <WaxTexture parallax tone="text-white/[0.045]" />
    <div
      class="wrap grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:py-24"
    >
      <!-- Tablette (sm à lg) : une colonne, contenu centré. Mobile : aligné à gauche, pour la lecture. -->
      <div ref="copy" v-reveal.once.stagger="{ distance: 24 }" class="min-w-0 sm:text-center lg:text-left">
        <p class="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] px-4 py-2 text-[0.75rem] font-semibold tracking-[0.08em] text-brand-orange uppercase ring-1 ring-white/15">
          <span class="size-2 shrink-0 rounded-full bg-[#7dd3a0]" aria-hidden="true"></span>
          Plateforme numérique intelligente
        </p>
        <h1 id="hero-title" class="display text-[clamp(2.5rem,6vw,5rem)] text-balance">
          <span class="block">Choisis ta voie.</span> <span class="block">Trouve ta place.</span>
        </h1>

        <p class="mt-6 max-w-xl text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-snug text-white/80 sm:mx-auto lg:mx-0">
          SUNU HŪB accompagne, connecte et valorise la jeunesse sénégalaise. Un profil unique qui évolue avec vous, du
          baccalauréat à l’insertion professionnelle.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3 sm:justify-center lg:justify-start">
          <BaseButton v-if="profile.isRegistered" to="/profil" variant="light" size="lg"
            >Voir mon fil</BaseButton
          >
          <BaseButton v-else to="/inscription" variant="light" size="lg"
            >Créer mon profil</BaseButton
          >
          <BaseButton to="/opportunites" variant="glass" size="lg"
            >Voir les opportunités</BaseButton
          >
        </div>
        <p v-if="!profile.isRegistered" class="mt-4 text-[0.875rem] text-white/60">
          Gratuit. Deux minutes, avec ton numéro de téléphone.
        </p>
      </div>

      <!-- Réseau « Toi » : illustration animée, les destinations du stade choisi s'allument -->
      <div ref="aside" class="mx-auto w-full min-w-0 sm:max-w-md lg:max-w-[34rem]">
        <HubNetwork :stage="stage" />
      </div>
    </div>
    <WaxBand />
  </section>
</template>
