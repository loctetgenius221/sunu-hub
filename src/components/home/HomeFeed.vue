<script setup lang="ts">
import { onMounted, ref } from 'vue'
import OpportunityTicket from '@/components/opportunity/OpportunityTicket.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { demoProfile } from '@/data/home'
import { getFeed } from '@/services/api'
import { useProfileStore } from '@/stores/profile'
import type { ScoredOpportunity } from '@/types'

// Aperçu du fil : calculé pour le profil du visiteur s'il existe, sinon pour un profil d'exemple.
const store = useProfileStore()
const mine = store.profile
const feed = ref<ScoredOpportunity[]>([])
onMounted(async () => (feed.value = (await getFeed(mine ?? demoProfile)).slice(0, 4)))
</script>

<template>
  <section aria-labelledby="fil" class="section bg-paper-2">
    <div class="wrap">
      <SectionHead
        id="fil"
        :title="mine ? `Ton fil, ${mine.firstName}.` : 'Ton fil, trié pour toi.'"
        :lead="
          mine
            ? 'Calculé à partir de ton profil : chaque offre a un score sur 100 et la raison de sa place.'
            : 'Exemple pour Awa, en licence d’informatique à Dakar : chaque offre a un score sur 100 et la raison de sa place.'
        "
      />

      <ul class="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-2" :aria-busy="feed.length === 0">
        <template v-if="feed.length">
          <li v-for="o in feed" :key="o.id" class="min-w-0">
            <OpportunityTicket :item="o" />
          </li>
        </template>
        <template v-else>
          <li v-for="n in 4" :key="n" class="h-44 animate-pulse border-2 border-dashed border-rule bg-white"></li>
        </template>
      </ul>

      <p class="mt-10 text-sm text-ink-soft">
        Données d'exemple.
        <TextLink to="/opportunites" class="ml-2">Voir toutes les opportunités</TextLink>
      </p>
    </div>
  </section>
</template>
