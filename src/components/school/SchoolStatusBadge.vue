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
const tone = computed(() => ({ ok: 'bg-mint text-green', warn: 'bg-paper-2 text-ink-soft', bad: 'bg-orange-soft text-orange' })[info.value.tone])
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold"
    :class="[plain ? 'bg-white text-ink shadow-soft' : tone, large ? 'px-4 py-1.5 text-[0.9375rem]' : 'px-2.5 py-0.5 text-[0.8125rem]']"
  >
    <component :is="icon" :size="large ? 18 : 14" aria-hidden="true" />
    {{ info.label }}
  </span>
</template>
