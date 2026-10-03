<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import IsoArt from '@/components/art/IsoArt.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { useCountUp } from '@/composables/useMotion'
import { structuresPitch as pitch } from '@/data/home'

// Pour les structures : publication gratuite, avec le nombre de profils correspondants avant de publier.
const counter = ref<HTMLElement | null>(null)
useCountUp(counter, pitch.matching.count)
</script>

<template>
  <section aria-labelledby="structures" class="section bg-navy text-white">
    <div class="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h2 id="structures" class="display text-[clamp(1.9rem,3.2vw,2.9rem)]">{{ pitch.title }}</h2>
        <p class="mt-5 max-w-lg text-[1.1rem] text-white/80">{{ pitch.lead }}</p>
        <ul class="mt-8 border-t-2 border-white">
          <li v-for="p in pitch.points" :key="p" class="flex gap-3 border-b border-white/20 py-3.5">
            <Check :size="20" class="mt-0.5 shrink-0 text-mint" aria-hidden="true" />
            <span>{{ p }}</span>
          </li>
        </ul>
        <div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
          <BaseButton to="/structures">Publier une opportunité</BaseButton>
          <TextLink to="/structures" on-dark>Comment ça marche</TextLink>
        </div>
      </div>

      <!-- Aperçu : profils correspondants avant publication -->
      <div class="min-w-0 lg:col-span-5 lg:col-start-8">
        <div class="relative border-2 border-ink bg-white p-6 text-ink shadow-[10px_10px_0_var(--color-green)] sm:p-8">
          <p class="text-sm font-semibold">Votre offre de stage toucherait</p>
          <p class="display mt-2 text-[clamp(3rem,6vw,4.5rem)] leading-none text-navy tabular-nums">
            <span ref="counter">{{ pitch.matching.count.toLocaleString('fr-FR') }}</span>
          </p>
          <p class="mt-1 text-sm text-ink-soft">profils correspondants (exemple)</p>
          <ul class="mt-6 flex flex-wrap gap-2 border-t-2 border-ink pt-5" aria-label="Critères">
            <li v-for="f in pitch.matching.filters" :key="f" class="rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold">{{ f }}</li>
          </ul>
          <IsoArt kind="pawns" :scale="0.6" class="absolute -top-14 right-4 lg:-right-6" />
        </div>
      </div>
    </div>
  </section>
</template>
