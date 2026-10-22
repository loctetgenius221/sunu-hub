<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { animate, stagger } from 'motion'
import { BadgeCheck, CalendarClock } from 'lucide-vue-next'
import TextLink from '@/components/ui/TextLink.vue'
import { EASE, prefersReducedMotion } from '@/composables/useMotion'
import { demoProfile, stages } from '@/data/home'
import { formatDate, opportunityTypes } from '@/data/labels'
import { getFeed } from '@/services/api'
import { useProfileStore } from '@/stores/profile'
import type { ScoredOpportunity, Stage } from '@/types'

// Juste sous le héros : « Je suis… », puis trois offres réelles, ouvertes maintenant, pour ce
// stade. La preuve immédiate de la promesse. Le stade est partagé avec le réseau du héros.
const current = defineModel<Stage>('stage', { required: true })
const profile = useProfileStore()
const stage = computed(() => stages.find((s) => s.id === current.value)!)

const preview = ref<ScoredOpportunity[]>([])
const list = ref<HTMLElement | null>(null)

async function load(animateIn: boolean) {
  const base = profile.profile ?? demoProfile
  const atSchool = current.value === 'terminale' || current.value === 'bachelier'
  const feed = await getFeed({
    ...base,
    stage: current.value,
    level: atSchool ? 'bac' : base.level,
    goal: atSchool ? 'concours' : base.goal,
  })
  preview.value = feed.slice(0, 3)
  // Au changement de stade, les cartes se renouvellent l'une après l'autre.
  await nextTick()
  if (animateIn && list.value && !prefersReducedMotion())
    animate(
      Array.from(list.value.children),
      { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0px)'] },
      { duration: 0.5, ease: EASE, delay: stagger(0.06) },
    )
}
onMounted(() => load(false))
watch(current, () => load(true))
</script>

<template>
  <section aria-labelledby="live" class="bg-paper-2 py-12 sm:py-16">
    <div class="wrap">
      <div v-reveal class="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <h2 id="live" class="flex items-center gap-3 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">
            <span class="relative flex size-2.5" aria-hidden="true">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-60"></span>
              <span class="relative inline-flex size-2.5 rounded-full bg-brand-orange"></span>
            </span>
            Ouvertes en ce moment
          </h2>
        </div>
        <TextLink to="/opportunites">Voir toutes les opportunités</TextLink>
      </div>

      <fieldset v-reveal class="mt-6">
        <legend class="mb-3 text-[0.9375rem] text-ink-soft">Je suis</legend>
        <!-- Mobile : grille 2 × 2 à cases égales (tout visible, cibles larges). Ensuite : une rangée. -->
        <div class="grid grid-cols-2 gap-1 rounded-[1.375rem] bg-white p-1 shadow-soft sm:inline-flex sm:flex-wrap">
          <label
            v-for="s in stages"
            :key="s.id"
            class="flex min-h-11 cursor-pointer items-center justify-center rounded-full px-3 py-2 text-center text-[0.9375rem] leading-tight font-medium transition-colors duration-200 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-navy sm:px-4"
            :class="current === s.id ? 'bg-navy text-white' : 'text-ink-soft hover:text-ink'"
          >
            <input v-model="current" type="radio" name="stage" :value="s.id" class="sr-only" />
            {{ s.label }}
          </label>
        </div>
        <p class="mt-4 max-w-2xl text-[1.0625rem] leading-snug text-ink" aria-live="polite">{{ stage.promise }}</p>
      </fieldset>

      <ul ref="list" v-reveal class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" :aria-busy="!preview.length">
        <li v-for="o in preview" :key="o.id" class="min-w-0">
          <RouterLink
            :to="`/opportunites/${o.id}`"
            class="flex h-full flex-col rounded-card bg-white p-5 shadow-soft transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:p-6"
          >
            <p class="flex items-center gap-2 text-[0.8125rem]">
              <span class="font-semibold text-navy">{{ opportunityTypes[o.type] }}</span>
              <span v-if="o.status === 'verifiee'" class="inline-flex items-center gap-1 text-green"><BadgeCheck :size="14" aria-hidden="true" />Vérifiée</span>
            </p>
            <p class="mt-2 text-[1.0625rem] leading-snug font-semibold">{{ o.title }}</p>
            <p class="mt-1 text-[0.875rem] text-ink-soft">{{ o.structure.name }}, {{ o.city }}</p>
            <p class="mt-auto flex items-center gap-1.5 pt-4 text-[0.8125rem] text-ink-soft">
              <CalendarClock :size="14" aria-hidden="true" />Clôture le {{ formatDate(o.deadline) }}
            </p>
          </RouterLink>
        </li>
        <template v-if="!preview.length">
          <li v-for="n in 3" :key="n" class="h-40 animate-pulse rounded-card bg-white"></li>
        </template>
      </ul>
    </div>
  </section>
</template>
