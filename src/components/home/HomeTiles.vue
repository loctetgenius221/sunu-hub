<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { BadgeCheck, Search } from 'lucide-vue-next'
import SunuMark from '@/components/brand/SunuMark.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import { alerts, demoProfile } from '@/data/home'
import { formatDate } from '@/data/labels'
import { getFeed } from '@/services/api'
import { useProfileStore } from '@/stores/profile'
import type { ScoredOpportunity } from '@/types'

// Les quatre services, en tuiles de tailles différentes : deux photos, une recherche active, une alerte.
const router = useRouter()
const profile = useProfileStore()

const top = ref<ScoredOpportunity | null>(null)
onMounted(async () => (top.value = (await getFeed(profile.profile ?? demoProfile))[0] ?? null))

const q = ref('')
const search = () => router.push({ name: 'school-checker', query: q.value.trim() ? { q: q.value.trim() } : {} })
</script>

<template>
  <section aria-labelledby="services" class="section bg-white">
    <div class="wrap">
      <SectionHead id="services" title="Tout ton parcours, au même endroit." lead="Un seul profil, de la Terminale au premier emploi. Quatre services pour avancer sans perdre de temps." />
    </div>

    <div class="wrap-wide mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[20rem_20rem_auto]">
      <!-- Opportunités : grande tuile photo -->
      <article class="group relative min-h-[28rem] overflow-hidden rounded-tile bg-navy-deep text-white lg:col-span-2 lg:row-span-2">
        <ResponsiveImage name="opportunites" sizes="(min-width: 1024px) 66vw, 100vw" class="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
        <div class="absolute inset-0 bg-linear-to-b from-[#04112a]/75 via-[#04112a]/10 to-[#04112a]/60" aria-hidden="true"></div>
        <div class="absolute inset-x-0 top-0 p-8 sm:p-10">
          <h3 class="display max-w-md text-[clamp(1.75rem,3vw,2.75rem)]">Des opportunités qui te correspondent.</h3>
          <p class="mt-3 max-w-md text-white/80">Stages, emplois juniors, bourses, concours et financements, vérifiés et triés pour toi.</p>
          <RouterLink to="/opportunites" class="mt-5 inline-block font-medium text-white underline-offset-4 after:absolute after:inset-0 hover:underline">
            Voir les opportunités
          </RouterLink>
        </div>
        <!-- Aperçu réel : la meilleure offre du fil -->
        <div v-if="top" class="absolute inset-x-6 bottom-6 max-w-sm rounded-2xl bg-white/14 p-4 ring-1 ring-white/25 backdrop-blur-xl sm:left-10">
          <p class="flex items-center gap-1.5 text-[0.8125rem] text-white/80">
            <BadgeCheck :size="14" aria-hidden="true" />{{ top.structure.name }}, {{ top.city }}
          </p>
          <p class="mt-1 font-semibold">{{ top.title }}</p>
          <p class="mt-2 flex justify-between text-[0.8125rem] text-white/80">
            <span>Clôture le {{ formatDate(top.deadline) }}</span>
            <span class="font-semibold text-white tabular-nums">{{ top.score }} / 100</span>
          </p>
        </div>
      </article>

      <!-- Orienter : tuile portrait -->
      <article class="group relative min-h-[28rem] overflow-hidden rounded-tile bg-navy-deep text-white lg:row-span-2">
        <ResponsiveImage name="orienter" sizes="(min-width: 1024px) 33vw, 100vw" class="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
        <div class="absolute inset-0 bg-linear-to-t from-[#04112a]/85 via-[#04112a]/20 to-transparent" aria-hidden="true"></div>
        <div class="absolute inset-x-0 bottom-0 p-8">
          <h3 class="display text-[clamp(1.6rem,2.4vw,2.25rem)]">Choisir ta voie.</h3>
          <p class="mt-2 text-white/80">Trois pistes expliquées et ta liste de vœux Campusen.</p>
          <RouterLink to="/orienter" class="mt-4 inline-block font-medium underline-offset-4 after:absolute after:inset-0 hover:underline">Commencer</RouterLink>
        </div>
      </article>

      <!-- Vérifier une école : recherche active -->
      <article class="flex flex-col justify-between gap-8 rounded-tile bg-paper-2 p-8 sm:p-10 lg:col-span-2">
        <div>
          <h3 class="display text-[clamp(1.6rem,2.4vw,2.25rem)]">Ton école est-elle reconnue&nbsp;?</h3>
          <p class="lead mt-2 max-w-lg">Habilitation, accréditation, CAMES : la réponse en clair, avec sa source.</p>
        </div>
        <form role="search" class="flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-soft focus-within:ring-4 focus-within:ring-navy/15" @submit.prevent="search">
          <Search :size="20" class="shrink-0 text-ink-soft" aria-hidden="true" />
          <label for="tile-school" class="sr-only">Nom ou sigle de l'établissement</label>
          <input id="tile-school" v-model="q" type="search" placeholder="Nom ou sigle de l’école" class="min-w-0 flex-1 bg-transparent py-2 text-[1.0625rem] outline-none placeholder:text-ink-soft" />
          <button type="submit" class="min-h-10 shrink-0 rounded-full bg-navy px-5 font-medium text-white hover:bg-[#0a2c60]">Vérifier</button>
        </form>
      </article>

      <!-- Alertes : un vrai message -->
      <article class="flex flex-col justify-between gap-8 rounded-tile bg-navy-deep p-8 text-white">
        <div>
          <h3 class="display text-[clamp(1.6rem,2.4vw,2.25rem)]">Prévenu à temps.</h3>
          <p class="mt-2 text-white/75">Sur WhatsApp, avant chaque date limite.</p>
        </div>
        <div class="flex items-end gap-2.5">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy p-1.5" aria-hidden="true"><SunuMark class="h-full" /></span>
          <p class="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[0.9375rem] text-ink">
            {{ alerts[1]!.text }}
            <span class="mt-1 block text-right text-[0.6875rem] text-ink-soft tabular-nums">{{ alerts[1]!.time }}</span>
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
