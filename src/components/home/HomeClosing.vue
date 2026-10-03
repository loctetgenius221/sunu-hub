<script setup lang="ts">
import IsoArt from '@/components/art/IsoArt.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
</script>

<template>
  <section aria-labelledby="commencer" class="grid-paper section overflow-hidden">
    <div class="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-7">
        <h2 id="commencer" class="display text-[clamp(2rem,3.8vw,3.4rem)] text-navy">Ton profil, prêt en deux minutes.</h2>
        <p class="mt-5 max-w-lg text-[1.15rem] text-ink-soft">
          Ton numéro de téléphone, cinq questions, et tu vois déjà ce qui te correspond. Le même profil te suit de la
          Terminale au premier emploi.
        </p>
        <div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
          <BaseButton to="/inscription">Créer mon profil</BaseButton>
          <TextLink to="/structures">Je représente une structure</TextLink>
        </div>
      </div>
      <div class="flex min-w-0 justify-center lg:col-span-4 lg:col-start-9">
        <IsoArt kind="steps" live :scale="1.5" />
      </div>
    </div>
  </section>
</template>
