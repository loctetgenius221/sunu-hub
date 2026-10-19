<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import TextLink from '@/components/ui/TextLink.vue'

// Appel final : centré, court, avec trois portraits du public visé.
const portraits = ['lyceen', 'etudiante', 'etudiant'] as const
</script>

<template>
  <section aria-labelledby="commencer" class="section bg-paper-2 text-center">
    <div class="wrap">
      <ul class="flex justify-center -space-x-4" aria-hidden="true">
        <li v-for="p in portraits" :key="p" class="h-20 w-20 overflow-hidden rounded-full ring-4 ring-paper-2 sm:h-24 sm:w-24">
          <ResponsiveImage :name="p" sizes="96px" decorative />
        </li>
      </ul>
      <h2 id="commencer" class="display mx-auto mt-10 max-w-3xl text-[clamp(2.25rem,5vw,4.25rem)] text-balance">Ton profil, prêt en deux minutes.</h2>
      <p class="lead mx-auto mt-5 max-w-xl">Ton numéro de téléphone, cinq questions, et tu vois déjà ce qui te correspond.</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <BaseButton to="/inscription" size="lg">Créer mon profil</BaseButton>
        <TextLink to="/structures">Je représente une structure</TextLink>
      </div>
    </div>
  </section>
</template>
