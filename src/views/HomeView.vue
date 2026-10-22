<script setup lang="ts">
import { ref } from 'vue'
import HomeClosing from '@/components/home/HomeClosing.vue'
import HomeCommitments from '@/components/home/HomeCommitments.vue'
import HomeAudiences from '@/components/home/HomeAudiences.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeHowItWorks from '@/components/home/HomeHowItWorks.vue'
import HomeLive from '@/components/home/HomeLive.vue'
import HomeTiles from '@/components/home/HomeTiles.vue'
import { useProfileStore } from '@/stores/profile'
import type { Stage } from '@/types'

// Accueil : l'essentiel d'abord (agir, puis comprendre), sans photo.
// Le stade choisi dans « Je suis » (section 2) pilote les offres et allume le réseau du héros.
const stage = ref<Stage>(useProfileStore().state.answers.stage ?? 'etudiant')
</script>

<template>
  <HomeHero :stage="stage" />
  <HomeLive v-model:stage="stage" />
  <HomeTiles />
  <HomeHowItWorks />
  <HomeAudiences />
  <HomeCommitments />
  <HomeClosing />
</template>
