<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { animate, scroll, stagger } from 'motion'
import { EASE, prefersReducedMotion } from '@/composables/useMotion'
import { BadgeCheck, CalendarClock } from 'lucide-vue-next'
import AccentBar from '@/components/brand/AccentBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { demoProfile, stages } from '@/data/home'
import { formatDate } from '@/data/labels'
import { getFeed } from '@/services/api'
import { useProfileStore } from '@/stores/profile'
import type { ScoredOpportunity, Stage } from '@/types'

// Héros sur la couleur principale : une phrase, le choix « Je suis… », une action.
// À droite, de vraies offres du fil montrent tout de suite ce que propose le service.
const profile = useProfileStore()
const current = ref<Stage>(profile.state.answers.stage ?? 'etudiant')
const stage = computed(() => stages.find((s) => s.id === current.value)!)

// Aperçu adapté au stade choisi (niveau bac pour les lycéens et bacheliers).
const preview = ref<ScoredOpportunity[]>([])
async function load() {
  const base = profile.profile ?? demoProfile
  const atSchool = current.value === 'terminale' || current.value === 'bachelier'
  const feed = await getFeed({
    ...base,
    stage: current.value,
    level: atSchool ? 'bac' : base.level,
    goal: atSchool ? 'concours' : base.goal,
  })
  preview.value = feed.slice(0, 3)
  // Les cartes arrivent l'une après l'autre : au chargement, puis à chaque changement de stade.
  await nextTick()
  if (list.value && !prefersReducedMotion())
    animate(
      Array.from(list.value.children),
      { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0px)'] },
      { duration: 0.5, ease: EASE, delay: stagger(0.06, { startDelay: first ? 0.35 : 0 }) },
    )
  first = false
}
watch(current, load)

// En quittant le haut de page, le texte remonte et s'estompe, l'aperçu un peu moins vite :
// une profondeur légère, réglée sur le défilement (dans les deux sens).
const section = ref<HTMLElement | null>(null)
const copy = ref<HTMLElement | null>(null)
const aside = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
let first = true
const stops: VoidFunction[] = []

onMounted(() => {
  load()
  if (prefersReducedMotion() || !section.value) return
  const range: Parameters<typeof scroll>[1] = { target: section.value, offset: ['start start', 'end start'] }
  stops.push(
    scroll(animate(copy.value!, { opacity: [1, 0], transform: ['translateY(0px)', 'translateY(-80px)'] }, { ease: 'linear' }), range),
    scroll(animate(aside.value!, { opacity: [1, 0.2], transform: ['translateY(0px)', 'translateY(-36px)'] }, { ease: 'linear' }), range),
  )
})
onBeforeUnmount(() => stops.forEach((s) => s()))
</script>

<template>
  <section ref="section" class="bg-navy-deep text-white" aria-labelledby="hero-title">
    <div
      class="wrap grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:py-24"
    >
      <div ref="copy" v-reveal.once.stagger="{ distance: 24 }" class="min-w-0">
        <h1 id="hero-title" class="display text-[clamp(2.5rem,6vw,5rem)] text-balance">
          Choisis ta voie. Trouve ta place.
        </h1>

        <fieldset class="mt-8">
          <legend class="mb-3 text-[0.9375rem] text-white/70">Je suis</legend>
          <div class="inline-flex max-w-full flex-wrap gap-1 rounded-[1.375rem] bg-white/10 p-1">
            <label
              v-for="s in stages"
              :key="s.id"
              class="cursor-pointer rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-200 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-white"
              :class="current === s.id ? 'bg-white text-ink' : 'text-white/80 hover:text-white'"
            >
              <input v-model="current" type="radio" name="stage" :value="s.id" class="sr-only" />
              {{ s.label }}
            </label>
          </div>
        </fieldset>

        <p
          class="mt-5 min-h-[3em] max-w-xl text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-snug text-white/80"
          aria-live="polite"
        >
          {{ stage.promise }}
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <BaseButton v-if="profile.isRegistered" to="/profil" variant="light" size="lg"
            >Voir mon fil</BaseButton
          >
          <BaseButton v-else to="/inscription" variant="light" size="lg"
            >Créer mon profil</BaseButton
          >
          <BaseButton to="/opportunites" variant="glass" size="lg"
            >Voir les opportunités</BaseButton
          >
        </div>
        <p v-if="!profile.isRegistered" class="mt-4 text-[0.875rem] text-white/60">
          Gratuit. Deux minutes, avec ton numéro de téléphone.
        </p>
      </div>

      <!-- Aperçu du fil : offres réelles, cliquables -->
      <div ref="aside" class="min-w-0">
        <p class="mb-3 flex items-center gap-2 text-[0.9375rem] text-white/70">
          <span class="relative flex h-2 w-2" aria-hidden="true"
            ><span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-60"
            ></span
            ><span class="relative inline-flex h-2 w-2 rounded-full bg-brand-orange"></span
          ></span>
          Ouvertes en ce moment
        </p>
        <ul ref="list" class="space-y-3" :aria-busy="!preview.length">
          <li v-for="o in preview" :key="o.id">
            <RouterLink
              :to="`/opportunites/${o.id}`"
              class="block rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 transition-colors hover:bg-white/12"
            >
              <p class="flex items-center gap-1.5 text-[0.8125rem] text-white/65">
                <BadgeCheck v-if="o.status === 'verifiee'" :size="14" aria-label="Vérifiée" />{{
                  o.structure.name
                }}, {{ o.city }}
              </p>
              <p class="mt-1 font-semibold">{{ o.title }}</p>
              <p class="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-white/65">
                <CalendarClock :size="14" aria-hidden="true" />Clôture le
                {{ formatDate(o.deadline) }}
              </p>
            </RouterLink>
          </li>
          <template v-if="!preview.length">
            <li v-for="n in 3" :key="n" class="h-26 animate-pulse rounded-2xl bg-white/[0.07]"></li>
          </template>
        </ul>
      </div>
    </div>
  </section>
</template>
