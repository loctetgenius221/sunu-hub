<script setup lang="ts">
import HomeAlerts from '@/components/home/HomeAlerts.vue'
import HomeChecker from '@/components/home/HomeChecker.vue'
import HomeClosing from '@/components/home/HomeClosing.vue'
import HomeCommitments from '@/components/home/HomeCommitments.vue'
import HomeDoors from '@/components/home/HomeDoors.vue'
import HomeFeed from '@/components/home/HomeFeed.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeStructures from '@/components/home/HomeStructures.vue'
import MarqueeBand from '@/components/layout/MarqueeBand.vue'
import { marquee } from '@/data/site'
</script>

<template>
  <HomeHero />
  <HomeDoors />
  <HomeFeed />
  <HomeChecker />
  <HomeAlerts />
  <HomeStructures />
  <HomeCommitments />
  <MarqueeBand :words="marquee" />
  <HomeClosing />
</template>
