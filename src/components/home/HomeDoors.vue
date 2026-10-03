<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import IsoArt from '@/components/art/IsoArt.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { doors } from '@/data/home'

// Deux portes, un seul profil : Orienter (marine) et Opportunités (blanc), côte à côte.
const { orienter, opportunites } = doors
</script>

<template>
  <section aria-labelledby="portes" class="border-b-2 border-ink">
    <h2 id="portes" class="sr-only">Deux portes, un seul profil</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2">
      <!-- Orienter -->
      <div class="bg-navy text-white">
        <div class="ml-auto flex h-full max-w-[41rem] flex-col px-4 py-14 sm:px-10 lg:py-20 lg:pr-14 lg:pl-6">
          <div class="flex items-end justify-between gap-6">
            <h3 class="display text-[clamp(2rem,3.4vw,3rem)]">{{ orienter.title }}</h3>
            <IsoArt kind="signpost" :scale="0.75" class="shrink-0" />
          </div>
          <p class="mt-4 max-w-sm text-[1.1rem] text-white/85">{{ orienter.lead }}</p>
          <ul class="mt-8 flex-1 border-t-2 border-white">
            <li v-for="p in orienter.points" :key="p" class="flex gap-3 border-b border-white/20 py-3.5">
              <Check :size="20" class="mt-0.5 shrink-0 text-mint" aria-hidden="true" />
              <span>{{ p }}</span>
            </li>
          </ul>
          <div class="mt-9">
            <BaseButton :to="orienter.cta.to" variant="secondary">{{ orienter.cta.label }}</BaseButton>
          </div>
        </div>
      </div>

      <!-- Opportunités -->
      <div class="bg-white">
        <div class="flex h-full max-w-[41rem] flex-col px-4 py-14 sm:px-10 lg:py-20 lg:pr-6 lg:pl-14">
          <div class="flex items-end justify-between gap-6">
            <h3 class="display text-[clamp(2rem,3.4vw,3rem)] text-navy">{{ opportunites.title }}</h3>
            <IsoArt kind="network" :scale="0.75" live class="shrink-0" />
          </div>
          <p class="mt-4 max-w-sm text-[1.1rem] text-ink-soft">{{ opportunites.lead }}</p>
          <ul class="mt-8 flex-1 border-t-2 border-ink">
            <li v-for="p in opportunites.points" :key="p" class="flex gap-3 border-b border-rule py-3.5">
              <Check :size="20" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
              <span>{{ p }}</span>
            </li>
          </ul>
          <div class="mt-9">
            <BaseButton :to="opportunites.cta.to" variant="secondary">{{ opportunites.cta.label }}</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
