import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { levelFromTrack, questions } from '@/data/questions'
import type { AlertPrefs, Consent, EntryAnswers, Profile } from '@/types'

// Profil du jeune, conservé sur l'appareil tant que l'API n'existe pas.
// Chaque réponse est sauvegardée aussitôt : le questionnaire reprend après une coupure (TDR §7).

const KEY = 'sunu-hub:profile'

interface Extras {
  school: string
  skills: string[]
  availability: '' | 'immediate' | 'trois-mois' | 'six-mois'
}

interface Saved {
  phone: string
  verified: boolean
  firstName: string
  birthYear: number | null
  consent: Consent | null
  answers: EntryAnswers
  extras: Extras
  alerts: AlertPrefs
  publicCv: boolean
}

const blank = (): Saved => ({
  phone: '',
  verified: false,
  firstName: '',
  birthYear: null,
  consent: null,
  answers: {},
  extras: { school: '', skills: [], availability: '' },
  alerts: { channel: 'whatsapp', types: [], perWeek: 3 },
  publicCv: false,
})

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...blank(), ...JSON.parse(raw) } : blank()
  } catch {
    return blank()
  }
}

export const useProfileStore = defineStore('profile', () => {
  const state = ref<Saved>(load())

  watch(
    state,
    (s) => {
      try {
        localStorage.setItem(KEY, JSON.stringify(s))
      } catch {
        /* stockage indisponible : le profil reste en mémoire */
      }
    },
    { deep: true },
  )

  const age = computed(() => (state.value.birthYear ? new Date().getFullYear() - state.value.birthYear : null))
  const isMinor = computed(() => age.value !== null && age.value < 18)
  const answered = computed(() => questions.filter((q) => state.value.answers[q.id]).length)
  const isRegistered = computed(() => state.value.verified && !!state.value.consent && answered.value === questions.length)

  /** Profil lu par le moteur ; null tant que le questionnaire n'est pas terminé. */
  const profile = computed<Profile | null>(() => {
    const a = state.value.answers
    if (!isRegistered.value || !a.stage || !a.field || !a.city || !a.goal) return null
    return {
      phone: state.value.phone,
      firstName: state.value.firstName,
      stage: a.stage,
      level: levelFromTrack(a),
      field: a.field,
      city: a.city,
      goal: a.goal,
    }
  })

  /** Jauge (TDR P2) : les 5 réponses d'abord, puis les compléments. */
  const checklist = computed(() => [
    { label: 'Questionnaire d’entrée', done: answered.value === questions.length, weight: 50 },
    { label: 'Prénom et âge', done: !!state.value.firstName && !!state.value.birthYear, weight: 10 },
    { label: 'Établissement', done: !!state.value.extras.school, weight: 15 },
    { label: 'Trois compétences', done: state.value.extras.skills.length >= 3, weight: 15 },
    { label: 'Disponibilité', done: !!state.value.extras.availability, weight: 10 },
  ])
  const completion = computed(() => checklist.value.reduce((n, c) => n + (c.done ? c.weight : 0), 0))

  function answer<K extends keyof EntryAnswers>(id: K, value: EntryAnswers[K]) {
    const a = state.value.answers
    // Changer de stade invalide les options qui en dépendent.
    if (id === 'stage' && a.stage !== value) {
      delete a.track
      delete a.goal
    }
    a[id] = value
    // L'objectif choisi devient le type d'alerte par défaut.
    if (a.goal && a.goal !== 'orientation' && id === 'goal') state.value.alerts.types = [a.goal]
  }

  function giveConsent(guardian?: Consent['guardian']) {
    state.value.consent = { acceptedAt: new Date().toISOString(), guardian }
  }

  function exportData() {
    return JSON.stringify(state.value, null, 2)
  }

  function reset() {
    state.value = blank()
  }

  return { state, age, isMinor, answered, isRegistered, profile, checklist, completion, answer, giveConsent, exportData, reset }
})
