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
          class="flex min-h-11 w-full items-center gap-2 border-2 border-ink px-3 py-2 text-left text-sm font-semibold transition-colors"
          :class="i <= reached ? (i === reached ? 'bg-navy text-white' : 'bg-mint') : 'bg-white hover:bg-paper-2'"
          :aria-current="i === reached ? 'step' : undefined"
          @click="activity.setStep(id, s.id)"
        >
          <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-current text-xs tabular-nums">{{ i + 1 }}</span>
          <span class="min-w-0">{{ s.label }}</span>
        </button>
      </li>
    </ol>
    <p class="mt-2 text-xs text-ink-soft" aria-live="polite">
      <template v-if="app">Mis à jour le {{ formatDate(app.updatedAt) }}. </template>
      <template v-else>Indique où en est ta candidature : tu retrouveras le suivi dans tes candidatures.</template>
      <button v-if="app" type="button" class="font-semibold underline underline-offset-2" @click="activity.removeApplication(id)">Retirer le suivi</button>
    </p>
  </div>
</template>
