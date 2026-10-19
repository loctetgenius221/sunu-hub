<script setup lang="ts">
import WaxTexture from '@/components/brand/WaxTexture.vue'
import Doodle from '@/components/brand/Doodle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { useProfileStore } from '@/stores/profile'

// Appel final, court. Disparaît une fois le profil créé.
const profile = useProfileStore()
</script>

<template>
  <section v-if="!profile.isRegistered" aria-labelledby="commencer" class="section relative isolate bg-paper-2 text-center">
    <WaxTexture motif="bogolan" tone="text-navy/[0.07]" from="edges" />
    <div v-reveal class="wrap">
      <h2 id="commencer" class="display mx-auto max-w-3xl text-[clamp(2.25rem,5vw,4rem)] text-balance">Ton profil, prêt en deux minutes.</h2>
      <p class="lead mx-auto mt-5 max-w-xl">Ton numéro de téléphone, cinq questions, et tu vois déjà ce qui te correspond.</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <div class="relative max-sm:w-full">
          <Doodle name="arrow-loop" class="absolute top-1/2 right-full mr-4 hidden w-24 -translate-y-[85%] sm:block" />
          <BaseButton to="/inscription" size="lg">Créer mon profil</BaseButton>
        </div>
        <TextLink to="/structures">Je représente une structure</TextLink>
      </div>
    </div>
  </section>
</template>
