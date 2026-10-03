<script setup lang="ts">
import { BadgeCheck, ExternalLink, Clock } from 'lucide-vue-next'
import { verification } from '@/data/labels'
import type { VerificationStatus } from '@/types'

defineProps<{ status: VerificationStatus }>()
const icons = { verifiee: BadgeCheck, externe: ExternalLink, 'a-verifier': Clock }
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 border-2 px-2 py-0.5 text-xs font-bold"
    :class="{
      'border-ink bg-green text-ink': status === 'verifiee',
      'border-ink bg-white text-ink': status === 'externe',
      'border-dashed border-ink-soft bg-white text-ink-soft': status === 'a-verifier',
    }"
    :title="verification[status].hint"
  >
    <component :is="icons[status]" :size="14" aria-hidden="true" />
    {{ verification[status].label }}
  </span>
</template>
