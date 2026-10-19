<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, scroll } from 'motion'
import BaseButton from '@/components/ui/BaseButton.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { prefersReducedMotion } from '@/composables/useMotion'
import { stages } from '@/data/home'

// Héros : une photo qui s'ouvre au défilement, du cadre arrondi au plein écran.
// C'est le seul effet marquant de la page. « Je suis… » adapte la promesse au stade du jeune.
const current = ref(stages[2]!.id)
const stage = computed(() => stages.find((s) => s.id === current.value)!)

const root = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
const photo = ref<HTMLElement | null>(null)
let stop: (() => void) | undefined
// Mouvement réduit : la photo est directement en plein cadre.
const still = prefersReducedMotion()

onMounted(() => {
  if (!root.value || !frame.value || !photo.value || still) return
  const opening = animate([
    [frame.value, { clipPath: ['inset(3% 3% 3% 3% round 2rem)', 'inset(0% 0% 0% 0% round 0rem)'] }, { at: 0 }],
    [photo.value, { transform: ['scale(1.12)', 'scale(1)'] }, { at: 0 }],
  ])
  opening.pause()
  stop = scroll(opening, { target: root.value, offset: ['start start', 'end end'] })
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <section ref="root" :class="still ? 'h-[calc(100svh-3.5rem)]' : 'h-[150svh] lg:h-[170svh]'" class="relative bg-white" aria-labelledby="hero-title">
    <div class="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
      <div ref="frame" class="absolute inset-0 overflow-hidden bg-navy-deep"
        :style="{ clipPath: still ? 'none' : 'inset(3% 3% 3% 3% round 2rem)' }">
        <div ref="photo" class="h-full w-full origin-center">
          <ResponsiveImage name="hero" sizes="100vw" eager />
        </div>
        <!-- Voile pour la lisibilité du texte, du bas vers le haut. -->
        <div class="absolute inset-0 bg-linear-to-t from-[#04112a]/85 via-[#04112a]/35 to-transparent" aria-hidden="true"></div>
      </div>

      <div class="wrap relative z-10 flex h-full flex-col justify-end pb-[9svh] text-white">
        <h1 id="hero-title" class="display max-w-4xl text-[clamp(2.75rem,7vw,6rem)] text-balance">Les opportunités qui te trouvent.</h1>

        <fieldset class="mt-8">
          <legend class="sr-only">Je suis</legend>
          <div class="inline-flex max-w-full flex-wrap gap-1 rounded-[1.375rem] bg-white/12 p-1 ring-1 ring-white/20 backdrop-blur-xl">
            <label
              v-for="s in stages"
              :key="s.id"
              class="cursor-pointer rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white"
              :class="current === s.id ? 'bg-white text-ink' : 'text-white/85 hover:text-white'"
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
          enter-active-class="transition duration-300"
          leave-active-class="transition duration-150"
        >
          <p :key="stage.id" class="mt-5 min-h-[3em] max-w-xl text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug text-white/85" aria-live="polite">
            {{ stage.promise }}
          </p>
        </Transition>

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <BaseButton to="/inscription" variant="light" size="lg">Créer mon profil</BaseButton>
          <BaseButton to="/opportunites" variant="glass" size="lg">Voir les opportunités</BaseButton>
        </div>
        <p class="mt-5 text-[0.875rem] text-white/65">Gratuit pour les jeunes. Inscription avec ton numéro de téléphone.</p>
      </div>
    </div>
  </section>
</template>
