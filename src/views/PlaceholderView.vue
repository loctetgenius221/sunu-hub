<script setup lang="ts">
import WaxTexture from '@/components/brand/WaxTexture.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'

// Page introuvable.
</script>

<template>
  <section class="section relative isolate bg-paper-2 text-center">
    <WaxTexture motif="bogolan" tone="text-navy/[0.07]" from="edges" />
    <div class="wrap">
      <p class="text-[0.9375rem] font-medium text-navy">Erreur 404</p>
      <h1 class="display mx-auto mt-3 max-w-2xl text-[clamp(2.5rem,5vw,4rem)]">Cette page n'existe pas, ou plus.</h1>
      <p class="lead mx-auto mt-5 max-w-lg">Le lien est peut-être ancien. Repars de l'accueil ou cherche une opportunité.</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <BaseButton to="/">Retour à l'accueil</BaseButton>
        <TextLink to="/opportunites">Voir les opportunités</TextLink>
      </div>
    </div>
  </section>
</template>
