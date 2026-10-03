import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { orientQuestions, type OrientAnswers } from '@/data/orientQuestions'
import { recommend } from '@/services/orientation'

// Parcours d'orientation : réponses (sauvegardées à chaque choix), vœux Campusen et retours.

const KEY = 'sunu-hub:orientation'
/** Campusen accepte une liste ordonnée de 18 choix (TDR §4). */
export const CAMPUSEN_MAX = 18

interface Saved {
  answers: OrientAnswers
  wishes: string[] // identifiants de programmes, dans l'ordre
  planB: string[]
  helpful: Record<string, boolean>
}

const blank = (): Saved => ({ answers: {}, wishes: [], planB: [], helpful: {} })

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...blank(), ...JSON.parse(raw) } : blank()
  } catch {
    return blank()
  }
}

export const useOrientationStore = defineStore('orientation', () => {
  const state = ref<Saved>(load())

  watch(
    state,
    (s) => {
      try {
        localStorage.setItem(KEY, JSON.stringify(s))
      } catch {
        /* stockage indisponible */
      }
    },
    { deep: true },
  )

  const isAnswered = (id: string) => {
    const v = state.value.answers[id]
    return Array.isArray(v) ? v.length > 0 : !!v
  }
  const answered = computed(() => orientQuestions.filter((q) => isAnswered(q.id)).length)
  const done = computed(() => answered.value === orientQuestions.length)
  const results = computed(() => (done.value ? recommend(state.value.answers) : null))

  function addWish(id: string) {
    if (!state.value.wishes.includes(id) && state.value.wishes.length < CAMPUSEN_MAX) state.value.wishes.push(id)
  }

  function removeWish(id: string) {
    state.value.wishes = state.value.wishes.filter((w) => w !== id)
    state.value.planB = state.value.planB.filter((w) => w !== id)
  }

  /** Échange deux vœux (les vœux Campusen se classent entre eux, sans les écoles privées). */
  function swapWishes(a: string, b: string) {
    const w = state.value.wishes
    const i = w.indexOf(a)
    const j = w.indexOf(b)
    if (i < 0 || j < 0) return
    ;[w[i], w[j]] = [w[j]!, w[i]!]
  }

  function togglePlanB(id: string) {
    const b = state.value.planB
    state.value.planB = b.includes(id) ? b.filter((x) => x !== id) : [...b, id]
  }

  function reset() {
    state.value = blank()
  }

  return { state, isAnswered, answered, done, results, addWish, removeWish, swapWishes, togglePlanB, reset }
})
