<script setup lang="ts">
import { computed, ref } from 'vue'
import HubScene from '@/components/art/HubScene.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { stages, type BuildingId } from '@/data/home'

// Héros : « Je suis… » choisit le stade, adapte la promesse et allume un bâtiment du Hub.
const current = ref(stages[2]!.id)
const stage = computed(() => stages.find((s) => s.id === current.value)!)
const selectBuilding = (id: BuildingId) => {
  const s = stages.find((x) => x.building === id)
  if (s) current.value = s.id
}
</script>

<template>
  <section class="grid-paper overflow-hidden border-b-2 border-ink">
    <div class="wrap grid grid-cols-1 items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-6 lg:py-20">
      <div class="min-w-0 lg:col-span-5">
        <h1 class="display text-[clamp(2.2rem,4.4vw,3.8rem)] text-navy">Les opportunités qui te trouvent.</h1>

        <fieldset class="mt-8">
          <legend class="text-sm font-semibold text-ink">Je suis&nbsp;:</legend>
          <div class="mt-3 flex flex-wrap gap-2">
            <label
              v-for="s in stages"
              :key="s.id"
              class="cursor-pointer rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange"
              :class="current === s.id ? 'bg-navy text-white' : 'bg-white hover:bg-paper-2'"
            >
              <input v-model="current" type="radio" name="stage" :value="s.id" class="sr-only" />
              {{ s.label }}
            </label>
          </div>
        </fieldset>

        <Transition
          mode="out-in"
          enter-from-class="opacity-0 translate-y-1"
          leave-to-class="opacity-0"
          enter-active-class="transition duration-200"
          leave-active-class="transition duration-150"
        >
          <p :key="stage.id" class="mt-6 max-w-md min-h-[4.5em] text-[1.15rem] text-ink-soft sm:text-[1.25rem]" aria-live="polite">
            {{ stage.promise }}
          </p>
        </Transition>

        <div class="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5">
          <BaseButton to="/inscription">Créer mon profil</BaseButton>
          <TextLink to="/verifier-ecole">Vérifier une école</TextLink>
        </div>
        <p class="mt-6 text-sm text-ink-soft">Gratuit pour les jeunes. Inscription avec ton numéro de téléphone.</p>
      </div>

      <div class="mx-auto w-full max-w-2xl min-w-0 lg:col-span-7 lg:max-w-none">
        <HubScene :active="stage.building" @select="selectBuilding" />
      </div>
    </div>
  </section>
</template>
