<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { useCountUp } from '@/composables/useMotion'
import { structuresPitch as pitch } from '@/data/home'

// Pour les structures : grand bandeau photo, texte sur voile marine, compteur de profils correspondants.
const counter = ref<HTMLElement | null>(null)
useCountUp(counter, pitch.matching.count)
</script>

<template>
  <section aria-labelledby="structures" class="bg-white pb-5 sm:pb-8">
    <div class="wrap-wide relative min-h-[40rem] overflow-hidden rounded-tile bg-navy-deep text-white">
      <ResponsiveImage name="structures" sizes="(min-width: 1440px) 1440px, 100vw" class="absolute inset-0" />
      <div class="absolute inset-0 bg-linear-to-r from-[#04112a]/92 via-[#04112a]/70 to-[#04112a]/10" aria-hidden="true"></div>

      <div class="relative grid min-h-[40rem] grid-cols-1 items-end gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
        <div class="max-w-xl">
          <p class="text-[0.9375rem] font-medium text-white/70">Écoles, entreprises, ONG, incubateurs</p>
          <h2 id="structures" class="display mt-3 text-[clamp(2rem,4.2vw,3.5rem)]">{{ pitch.title }}</h2>
          <p class="mt-5 text-[1.125rem] leading-snug text-white/80">{{ pitch.lead }}</p>
          <ul class="mt-7 space-y-2.5">
            <li v-for="p in pitch.points" :key="p" class="flex gap-3 text-white/90">
              <Check :size="20" class="mt-0.5 shrink-0 text-[#7dd3a0]" aria-hidden="true" /><span>{{ p }}</span>
            </li>
          </ul>
          <div class="mt-9 flex flex-wrap gap-3">
            <BaseButton to="/structures/publier" variant="light">Publier une opportunité</BaseButton>
            <BaseButton to="/structures" variant="glass">Comment ça marche</BaseButton>
          </div>
        </div>

        <div class="lg:justify-self-end">
          <div class="w-full max-w-xs rounded-3xl bg-white/12 p-6 ring-1 ring-white/20 backdrop-blur-xl">
            <p class="text-[0.9375rem] text-white/75">Votre offre de stage toucherait</p>
            <p class="display mt-1 text-[3.25rem] tabular-nums"><span ref="counter">{{ pitch.matching.count.toLocaleString('fr-FR') }}</span></p>
            <p class="text-[0.9375rem] text-white/75">profils correspondants, avant même de publier.</p>
            <ul class="mt-5 flex flex-wrap gap-1.5" aria-label="Critères de l'exemple">
              <li v-for="f in pitch.matching.filters" :key="f" class="rounded-full bg-white/15 px-3 py-1 text-[0.8125rem]">{{ f }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
