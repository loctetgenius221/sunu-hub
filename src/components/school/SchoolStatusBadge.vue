<script setup lang="ts">
import { computed } from 'vue'
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-vue-next'
import { schoolStatus } from '@/data/labels'
import type { SchoolStatus } from '@/types'

// Statut de l'établissement : icône + libellé (jamais la couleur seule).
// `plain` : fond blanc, quand le badge est posé sur une bande déjà colorée.
const props = defineProps<{ status: SchoolStatus; large?: boolean; plain?: boolean }>()
const info = computed(() => schoolStatus[props.status])
const icon = computed(() => ({ ok: ShieldCheck, warn: ShieldQuestion, bad: ShieldAlert })[info.value.tone])
const tone = computed(() => ({ ok: 'bg-green', warn: 'bg-white border-dashed', bad: 'bg-orange' })[info.value.tone])
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center gap-2 border-2 border-ink font-bold"
    :class="[plain ? (info.tone === 'warn' ? 'border-dashed bg-white' : 'bg-white') : tone, large ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm']"
  >
    <component :is="icon" :size="large ? 20 : 16" aria-hidden="true" />
    {{ info.label }}
  </span>
</template>
