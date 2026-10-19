<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ChoiceChips from '@/components/ui/ChoiceChips.vue'
import { orientQuestions } from '@/data/orientQuestions'
import { useOrientationStore } from '@/stores/orientation'
import { useProfileStore } from '@/stores/profile'

// Questionnaire d'orientation (TDR O3) : une question par écran, sauvegarde à chaque réponse.
// Les réponses déjà connues par le profil (série, ville) sont pré-remplies.
const store = useOrientationStore()
const profile = useProfileStore()
const router = useRouter()

const a = store.state.answers
const p = profile.state.answers
if (!a.serie && p.track && (p.stage === 'terminale' || p.stage === 'bachelier')) a.serie = p.track
if (!a.city && p.city) a.city = p.city

const firstOpen = orientQuestions.findIndex((q) => !store.isAnswered(q.id))
const index = ref(firstOpen === -1 ? 0 : firstOpen)
const question = computed(() => orientQuestions[index.value]!)
watch(index, () => window.scrollY > 120 && window.scrollTo({ top: 0, behavior: 'smooth' }))

const value = computed({
  get: () => a[question.value.id] as string | string[] | undefined,
  set: (v) => {
    if (v === undefined) return
    const q = question.value
    if (q.multiple && Array.isArray(v) && q.max && v.length > q.max) return
    a[q.id] = v
    // Choix unique : on passe à la suite ; choix multiples : le jeune valide lui-même.
    if (!q.multiple) setTimeout(next, 280)
  },
})

function next() {
  if (index.value < orientQuestions.length - 1) index.value++
  else router.push({ name: 'orient-results' })
}
</script>

<template>
  <section class="grid-paper min-h-[calc(100svh-4rem)]">
    <div class="wrap grid grid-cols-1 items-start gap-12 py-10 sm:py-14 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-7">
        <h1 class="sr-only">Questionnaire d'orientation</h1>
        <div class="flex items-center gap-4">
          <button v-if="index > 0" type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-soft transition hover:bg-[#ececf0]" @click="index--">
            <ArrowLeft :size="18" aria-hidden="true" /><span class="sr-only">Question précédente</span>
          </button>
          <div class="h-1 flex-1 overflow-hidden rounded-full bg-[#dcdce1]" role="progressbar" :aria-valuenow="index + 1" aria-valuemin="1" :aria-valuemax="orientQuestions.length" aria-label="Avancement">
            <div class="h-full rounded-full bg-navy transition-[width] duration-500" :style="{ width: `${((index + 1) / orientQuestions.length) * 100}%` }"></div>
          </div>
          <span class="text-[0.875rem] font-medium text-ink-soft tabular-nums">{{ index + 1 }} sur {{ orientQuestions.length }}</span>
        </div>

        <div class="mt-8 rounded-tile bg-white p-7 shadow-soft sm:p-10">
          <Transition
            mode="out-in"
            enter-from-class="opacity-0 translate-x-3"
            leave-to-class="opacity-0 -translate-x-3"
            enter-active-class="transition duration-200"
            leave-active-class="transition duration-150"
          >
            <div :key="question.id">
              <ChoiceChips
                v-model="value"
                :multiple="question.multiple"
                :legend="question.title"
                legend-class="display mb-4 text-[clamp(1.875rem,3.4vw,2.5rem)]"
                :options="question.options"
              />
              <p v-if="question.hint" class="mt-4 text-sm text-ink-soft">{{ question.hint }}</p>
              <div v-if="question.multiple" class="mt-8">
                <BaseButton :disabled="!store.isAnswered(question.id)" @click="next">
                  {{ index === orientQuestions.length - 1 ? 'Voir mes pistes' : 'Continuer' }}
                </BaseButton>
              </div>
            </div>
          </Transition>
        </div>
        <p class="mt-6 text-sm text-ink-soft">Chaque réponse est enregistrée : tu peux fermer et reprendre plus tard.</p>
      </div>

      <div class="hidden aspect-[4/5] overflow-hidden rounded-tile lg:sticky lg:top-24 lg:col-span-5 lg:col-start-8 lg:block">
        <ResponsiveImage name="lyceen" sizes="40vw" />
      </div>
    </div>
  </section>
</template>
