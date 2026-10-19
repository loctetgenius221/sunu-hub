<script setup lang="ts">
import { BadgeCheck, ExternalLink, Clock } from 'lucide-vue-next'
import { verification } from '@/data/labels'
import type { VerificationStatus } from '@/types'

// Statut de vérification d'une offre : icône + libellé ; le vert est réservé à « Vérifiée ».
defineProps<{ status: VerificationStatus }>()
const icons = { verifiee: BadgeCheck, externe: ExternalLink, 'a-verifier': Clock }
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold"
    :class="{
      'bg-mint text-green': status === 'verifiee',
      'bg-paper-2 text-ink-soft': status === 'externe',
      'bg-white text-ink-soft ring-1 ring-rule ring-inset': status === 'a-verifier',
    }"
    :title="verification[status].hint"
  >
    <component :is="icons[status]" :size="13" aria-hidden="true" />
    {{ verification[status].label }}
  </span>
</template>
