<script setup lang="ts">
import { useRoute } from 'vue-router'
import IsoArt from '@/components/art/IsoArt.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// Page d'attente pour les modules pas encore construits.
const route = useRoute()
</script>

<template>
  <section class="grid-paper section">
    <div class="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h1 class="h2 text-[clamp(2rem,3.6vw,3.2rem)]!">{{ route.meta.title ?? 'Page introuvable' }}</h1>
        <p class="mt-5 max-w-md text-lg text-ink-soft">
          <template v-if="route.meta.phase">Ce module arrive à l'étape {{ route.meta.phase }} du chantier.</template>
          <template v-else>Cette page n'existe pas, ou plus.</template>
        </p>
        <div class="mt-8">
          <BaseButton to="/" variant="secondary">Retour à l'accueil</BaseButton>
        </div>
      </div>
      <div class="flex min-w-0 justify-center lg:col-span-5 lg:col-start-8">
        <IsoArt :key="route.fullPath" :kind="route.meta.art ?? 'signpost'" :scale="1.4" />
      </div>
    </div>
  </section>
</template>
