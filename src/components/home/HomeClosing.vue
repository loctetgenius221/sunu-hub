<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { useProfileStore } from '@/stores/profile'

// Appel final, court. Disparaît une fois le profil créé.
const profile = useProfileStore()
</script>

<template>
  <section v-if="!profile.isRegistered" aria-labelledby="commencer" class="section bg-paper-2 text-center">
    <div v-reveal class="wrap">
      <h2 id="commencer" class="display mx-auto max-w-3xl text-[clamp(2.25rem,5vw,4rem)] text-balance">Ton profil, prêt en deux minutes.</h2>
      <p class="lead mx-auto mt-5 max-w-xl">Ton numéro de téléphone, cinq questions, et tu vois déjà ce qui te correspond.</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <BaseButton to="/inscription" size="lg">Créer mon profil</BaseButton>
        <TextLink to="/structures">Je représente une structure</TextLink>
      </div>
    </div>
  </section>
</template>
