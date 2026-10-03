<script setup lang="ts">
import { computed } from 'vue'
import ChoiceChips from '@/components/ui/ChoiceChips.vue'
import { opportunityTypes } from '@/data/labels'
import { useProfileStore } from '@/stores/profile'
import type { AlertChannel, OpportunityType } from '@/types'

// Préférences d'alertes (TDR P4) : canal, types, plafond hebdomadaire. Arrêt en un mot : STOP.
const store = useProfileStore()
const alerts = store.state.alerts

const channel = computed({ get: () => alerts.channel, set: (v) => (alerts.channel = v as AlertChannel) })
const types = computed({ get: () => alerts.types, set: (v) => (alerts.types = v as OpportunityType[]) })
const perWeek = computed({ get: () => String(alerts.perWeek), set: (v) => (alerts.perWeek = Number(v) as 1 | 2 | 3) })

const typeOptions = Object.entries(opportunityTypes).map(([value, label]) => ({ value, label }))
</script>

<template>
  <div class="grid grid-cols-1 gap-7">
    <ChoiceChips
      v-model="channel"
      legend="Recevoir mes alertes par"
      :options="[
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'sms', label: 'SMS' },
        { value: 'email', label: 'E-mail' },
      ]"
    />
    <ChoiceChips v-model="types" multiple legend="Types d'opportunités" :options="typeOptions" />
    <ChoiceChips
      v-model="perWeek"
      legend="Messages par semaine, au plus"
      :options="[
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ]"
    />
    <p class="border-l-4 border-navy pl-3 text-sm text-ink-soft">
      Les rappels de date limite (sept jours et un jour avant) concernent seulement les offres que tu as sauvegardées. Réponds
      <span class="font-bold text-ink">STOP</span> à un message pour tout arrêter.
    </p>
  </div>
</template>
