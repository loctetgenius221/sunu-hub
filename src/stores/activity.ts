import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Application, ApplicationStep } from '@/types'

// Ce que le jeune fait des offres : sauvegardes, candidatures, retours et signalements.
// Conservé sur l'appareil en attendant l'API.

const KEY = 'sunu-hub:activity'

interface Saved {
  saved: string[]
  applications: Record<string, Application>
  feedback: Record<string, boolean> // true = pertinent
  reported: string[]
}

const blank = (): Saved => ({ saved: [], applications: {}, feedback: {}, reported: [] })

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...blank(), ...JSON.parse(raw) } : blank()
  } catch {
    return blank()
  }
}

export const useActivityStore = defineStore('activity', () => {
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

  const isSaved = (id: string) => state.value.saved.includes(id)

  function toggleSave(id: string) {
    const list = state.value.saved
    const i = list.indexOf(id)
    if (i === -1) list.push(id)
    else list.splice(i, 1)
    return i === -1
  }

  function setStep(id: string, step: ApplicationStep) {
    state.value.applications[id] = { step, updatedAt: new Date().toISOString() }
    if (!isSaved(id)) state.value.saved.push(id)
  }

  function removeApplication(id: string) {
    delete state.value.applications[id]
  }

  function reset() {
    state.value = blank()
  }

  return { state, isSaved, toggleSave, setStep, removeApplication, reset }
})
