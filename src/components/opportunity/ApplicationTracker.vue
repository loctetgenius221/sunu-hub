<script setup lang="ts">
import { computed } from 'vue'
import { applicationSteps, formatDate } from '@/data/labels'
import { useActivityStore } from '@/stores/activity'

// Suivi de candidature (TDR Q5) : quatre étapes que le jeune fait avancer lui-même.
const props = defineProps<{ id: string }>()
const activity = useActivityStore()

const app = computed(() => activity.state.applications[props.id])
const reached = computed(() => applicationSteps.findIndex((s) => s.id === app.value?.step))
</script>

<template>
  <div>
    <ol class="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Étapes de la candidature">
      <li v-for="(s, i) in applicationSteps" :key="s.id" class="min-w-0">
        <button
          type="button"
          class="flex min-h-11 w-full items-center gap-2 rounded-control px-3 py-2 text-left text-[0.875rem] font-medium transition-colors"
          :class="i <= reached ? (i === reached ? 'bg-navy text-white' : 'bg-navy-soft text-navy') : 'bg-paper-2 text-ink-soft hover:text-ink'"
          :aria-current="i === reached ? 'step' : undefined"
          @click="activity.setStep(id, s.id)"
        >
          <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-current text-xs tabular-nums">{{ i + 1 }}</span>
          <span class="min-w-0">{{ s.label }}</span>
        </button>
      </li>
    </ol>
    <p class="mt-2 text-xs text-ink-soft" aria-live="polite">
      <template v-if="app">Mis à jour le {{ formatDate(app.updatedAt) }}. </template>
      <template v-else>Touche une étape pour indiquer où tu en es. Le suivi apparaît dans « Candidatures ».</template>
      <button v-if="app" type="button" class="font-medium text-navy hover:underline" @click="activity.removeApplication(id)">Retirer le suivi</button>
    </p>
  </div>
</template>
