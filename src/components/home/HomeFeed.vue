<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import OpportunityCard from '@/components/opportunity/OpportunityCard.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { demoProfile } from '@/data/home'
import { getFeed } from '@/services/api'
import { useProfileStore } from '@/stores/profile'
import type { ScoredOpportunity } from '@/types'

// Aperçu du fil en rayonnage horizontal : calculé pour le profil du visiteur, sinon pour un profil d'exemple.
const store = useProfileStore()
const mine = store.profile
const feed = ref<ScoredOpportunity[]>([])
onMounted(async () => (feed.value = (await getFeed(mine ?? demoProfile)).slice(0, 8)))

const shelf = ref<HTMLElement | null>(null)
const slide = (dir: -1 | 1) => shelf.value?.scrollBy({ left: dir * shelf.value.clientWidth * 0.8, behavior: 'smooth' })
</script>

<template>
  <section aria-labelledby="fil" class="section overflow-hidden bg-paper-2">
    <div class="wrap flex flex-wrap items-end justify-between gap-6">
      <div class="max-w-2xl">
        <h2 id="fil" class="h2">{{ mine ? `Ton fil, ${mine.firstName}.` : 'Ton fil, trié pour toi.' }}</h2>
        <p class="lead mt-4">
          {{ mine ? 'Calculé à partir de ton profil.' : 'Exemple pour Awa, en licence d’informatique à Dakar.' }}
          Chaque offre dit pourquoi elle est à sa place.
        </p>
      </div>
      <div class="flex items-center gap-4">
        <TextLink to="/opportunites">Tout voir</TextLink>
        <div class="hidden gap-2 md:flex">
          <button type="button" class="grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition hover:bg-[#ececf0]" @click="slide(-1)">
            <ChevronLeft :size="20" aria-hidden="true" /><span class="sr-only">Offres précédentes</span>
          </button>
          <button type="button" class="grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition hover:bg-[#ececf0]" @click="slide(1)">
            <ChevronRight :size="20" aria-hidden="true" /><span class="sr-only">Offres suivantes</span>
          </button>
        </div>
      </div>
    </div>

    <ul
      ref="shelf"
      class="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[max(1.25rem,calc((100vw_-_76rem)/2))] scroll-px-[max(1.25rem,calc((100vw_-_76rem)/2))] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      :aria-busy="feed.length === 0"
    >
      <template v-if="feed.length">
        <li v-for="o in feed" :key="o.id" class="w-[min(84vw,22rem)] shrink-0 snap-start">
          <OpportunityCard :item="o" />
        </li>
      </template>
      <template v-else>
        <li v-for="n in 4" :key="n" class="h-72 w-[min(84vw,22rem)] shrink-0 animate-pulse rounded-card bg-white"></li>
      </template>
    </ul>
  </section>
</template>
