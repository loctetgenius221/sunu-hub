<script setup lang="ts">
import { Bookmark, BookmarkCheck } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { useActivityStore } from '@/stores/activity'

// Sauvegarder une offre active les rappels J-7 et J-1 (TDR Q4).
const props = defineProps<{ id: string; title: string; compact?: boolean }>()
const activity = useActivityStore()
const { show } = useToast()

function toggle() {
  const saved = activity.toggleSave(props.id)
  show(saved ? 'Offre sauvegardée : rappels sept jours et un jour avant la date limite.' : 'Offre retirée de tes sauvegardes.')
}
</script>

<template>
  <button
    type="button"
    class="relative z-10 inline-flex min-h-11 items-center gap-2 border-2 border-ink font-semibold transition-colors"
    :class="[activity.isSaved(id) ? 'bg-navy text-white' : 'bg-white hover:bg-paper-2', compact ? 'min-w-11 justify-center px-2.5' : 'px-4']"
    :aria-pressed="activity.isSaved(id)"
    @click="toggle"
  >
    <component :is="activity.isSaved(id) ? BookmarkCheck : Bookmark" :size="18" aria-hidden="true" />
    <span :class="compact && 'sr-only'">{{ activity.isSaved(id) ? 'Sauvegardée' : 'Sauvegarder' }}</span>
    <span v-if="compact" class="sr-only">: {{ title }}</span>
  </button>
</template>
