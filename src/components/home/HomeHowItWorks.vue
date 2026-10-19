<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { inView } from 'motion'
import PhoneScreen from './PhoneScreen.vue'
import { howItWorks, type HowStep } from '@/data/home'

// « Comment ça marche » : sur grand écran, le téléphone reste fixe et son écran suit l'étape lue.
const active = ref<HowStep>(howItWorks[0].id)
const steps = ref<HTMLElement[]>([])
const stops: (() => void)[] = []

onMounted(() => {
  steps.value.forEach((el, i) =>
    stops.push(inView(el, () => void (active.value = howItWorks[i]!.id), { margin: '-45% 0px -45% 0px' })),
  )
})
onBeforeUnmount(() => stops.forEach((s) => s()))
</script>

<template>
  <section aria-labelledby="comment" class="section bg-white">
    <div class="wrap">
      <h2 id="comment" class="h2 max-w-2xl">Comment ça marche.</h2>
      <p class="lead mt-5 max-w-xl">Quatre étapes, depuis ton téléphone.</p>

      <div class="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
        <div class="hidden lg:block">
          <div class="sticky top-[calc(50svh-17rem)]">
            <PhoneScreen :step="active" />
          </div>
        </div>

        <ol>
          <li
            v-for="(s, i) in howItWorks"
            :key="s.id"
            :ref="(el) => el && (steps[i] = el as HTMLElement)"
            class="flex flex-col justify-center py-10 lg:min-h-[75svh] lg:py-0"
          >
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
            <div class="mt-10 lg:hidden"><PhoneScreen :step="s.id" class="max-w-[16rem]!" /></div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
