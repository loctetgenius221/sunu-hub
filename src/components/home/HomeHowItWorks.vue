<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, scroll } from 'motion'
import PhoneScreen from './PhoneScreen.vue'
import { prefersReducedMotion } from '@/composables/useMotion'
import { howItWorks, type HowStep } from '@/data/home'

// « Comment ça marche » : sur grand écran, le téléphone reste fixe et son écran suit l'étape lue ;
// un rail orange se remplit au rythme du défilement.
const active = ref<HowStep>(howItWorks[0].id)
const list = ref<HTMLElement | null>(null)
const fill = ref<HTMLElement | null>(null)
const animated = !prefersReducedMotion()
const stops: (() => void)[] = []

onMounted(() => {
  if (!list.value) return
  const range: Parameters<typeof scroll>[1] = { target: list.value, offset: ['start center', 'end center'] }
  // L'étape active se déduit de la position de défilement : juste dans les deux sens,
  // même après un saut (touche Page précédente, retour rapide).
  stops.push(
    scroll((progress: number) => {
      const i = Math.min(howItWorks.length - 1, Math.max(0, Math.floor(progress * howItWorks.length)))
      active.value = howItWorks[i]!.id
    }, range),
  )
  if (fill.value)
    stops.push(scroll(animate(fill.value, { transform: ['scaleY(0)', 'scaleY(1)'] }, { ease: 'linear' }), range))
})
onBeforeUnmount(() => stops.forEach((s) => s()))
</script>

<template>
  <section aria-labelledby="comment" class="section bg-white pt-10! sm:pt-12!">
    <div class="wrap">
      <div v-reveal>
        <h2 id="comment" class="h2 max-w-2xl">Comment ça marche</h2>
        <p class="lead mt-5 max-w-xl">Quatre étapes, depuis ton téléphone.</p>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
        <div class="hidden lg:block">
          <div class="sticky top-[calc(50svh-16rem)]">
            <PhoneScreen :step="active" />
          </div>
        </div>

        <div ref="list" class="relative lg:pl-10">
          <div v-if="animated" class="absolute inset-y-0 left-0 hidden w-0.5 overflow-hidden rounded-full bg-rule lg:block" aria-hidden="true">
            <div ref="fill" class="h-full origin-top bg-brand-orange" style="transform: scaleY(0)"></div>
          </div>
        <ol>
          <li
            v-for="(s, i) in howItWorks"
            :key="s.id"
            v-reveal="{ distance: 24 }"
            class="flex flex-col justify-center py-8 md:grid md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-x-12 lg:flex lg:min-h-[52svh] lg:py-0"
          >
            <!-- Tablette : texte et écran côte à côte ; grand écran : l'écran est le téléphone fixe à gauche. -->
            <div>
            <p class="text-[0.9375rem] font-semibold tabular-nums transition-colors duration-300" :class="active === s.id ? 'text-navy' : 'text-ink-soft'">
              Étape {{ i + 1 }}
            </p>
            <h3
              class="display mt-3 text-[clamp(1.875rem,3.4vw,3rem)] transition-colors duration-300"
              :class="active === s.id ? 'text-ink' : 'lg:text-ink-soft'"
            >
              {{ s.title }}
            </h3>
            <p class="lead mt-4 max-w-md">{{ s.text }}</p>
            </div>
            <div class="mt-10 md:mt-0 lg:hidden"><PhoneScreen :step="s.id" class="max-w-[16rem]!" /></div>
          </li>
        </ol>
        </div>
      </div>
    </div>
  </section>
</template>
