<script setup lang="ts">
import { computed } from 'vue'
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-vue-next'
import { indicators, statusOf, type Indicator, type IndicatorStatus } from '@/data/indicators'

// Tableau de bord des indicateurs (TDR A7). Pas de graphique : une valeur, une jauge vers la cible
// avec un repère au seuil d'alerte, et un statut toujours écrit (icône + libellé, jamais la couleur seule).
const statusInfo: Record<IndicatorStatus, { label: string; icon: typeof CircleCheck; cls: string }> = {
  ok: { label: 'Dans la cible', icon: CircleCheck, cls: 'bg-mint' },
  watch: { label: 'À surveiller', icon: TriangleAlert, cls: 'bg-white border-dashed' },
  alert: { label: 'Sous le seuil', icon: CircleAlert, cls: 'bg-orange' },
}

const rows = computed(() => indicators.map((i) => ({ ...i, status: statusOf(i) })))
const counts = computed(() => ({
  ok: rows.value.filter((r) => r.status === 'ok').length,
  watch: rows.value.filter((r) => r.status === 'watch').length,
  alert: rows.value.filter((r) => r.status === 'alert').length,
}))

const fmt = (i: Indicator, v: number) => `${v.toLocaleString('fr-FR')}${i.unit ? ` ${i.unit}` : ''}`
// Jauge pour les indicateurs « plus haut est meilleur » : échelle de 0 à 120 % de la cible.
const scale = (i: Indicator) => i.target * 1.2
const pct = (i: Indicator, v: number) => `${Math.min(100, (v / scale(i)) * 100)}%`
</script>

<template>
  <section aria-labelledby="h-kpi">
    <div class="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
      <h2 id="h-kpi" class="h2">Indicateurs</h2>
      <p class="text-sm text-ink-soft">Cibles de fin septembre 2027 · valeurs de maquette</p>
    </div>

    <!-- Synthèse -->
    <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <li v-for="(n, s) in counts" :key="s" class="flex items-center gap-4 border-2 border-ink bg-white p-4">
        <span class="display text-[2.4rem] leading-none text-navy tabular-nums">{{ n }}</span>
        <span class="inline-flex items-center gap-2 border-2 border-ink px-2.5 py-0.5 text-sm font-bold" :class="statusInfo[s].cls">
          <component :is="statusInfo[s].icon" :size="16" aria-hidden="true" />{{ statusInfo[s].label }}
        </span>
      </li>
    </ul>

    <table class="mt-8 w-full text-left">
      <caption class="sr-only">Indicateurs du MVP : valeur actuelle, cible, seuil d'alerte et statut</caption>
      <thead class="hidden text-sm md:table-header-group">
        <tr class="border-b-2 border-ink">
          <th scope="col" class="py-3 pr-4 font-bold">Indicateur</th>
          <th scope="col" class="py-3 pr-4 text-right font-bold">Valeur</th>
          <th scope="col" class="w-[30%] py-3 pr-4 font-bold">Vers la cible</th>
          <th scope="col" class="py-3 font-bold">Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.label" class="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-rule py-4 md:table-row md:py-0">
          <th scope="row" class="col-span-2 font-normal md:py-4 md:pr-4">
            <span class="block font-semibold">{{ r.label }}</span>
            <span class="block text-sm text-ink-soft">{{ r.definition }}</span>
          </th>
          <td class="md:py-4 md:pr-4 md:text-right">
            <span class="display text-[1.6rem] text-navy tabular-nums">{{ fmt(r, r.value) }}</span>
          </td>
          <td class="col-span-2 row-start-3 text-xs text-ink-soft md:row-auto md:py-4 md:pr-4">
            <div
              v-if="r.better === 'up'"
              class="relative h-2.5 border border-ink bg-paper-2"
              role="img"
              :aria-label="`${fmt(r, r.value)} sur une cible de ${fmt(r, r.target)}, seuil d'alerte ${fmt(r, r.alert)}`"
              :title="`Cible ${fmt(r, r.target)} · seuil d'alerte ${fmt(r, r.alert)}`"
            >
              <div class="h-full bg-navy" :style="{ width: pct(r, r.value) }"></div>
              <span class="absolute -top-1.5 -bottom-1.5 w-0.5 bg-ink" :style="{ left: pct(r, r.target) }" aria-hidden="true"></span>
              <span class="absolute -top-1 -bottom-1 w-0.5 bg-orange" :style="{ left: pct(r, r.alert) }" aria-hidden="true"></span>
            </div>
            <p class="mt-1.5 tabular-nums">
              Cible {{ r.better === 'up' ? '' : '≤ ' }}{{ fmt(r, r.target) }} · alerte {{ r.better === 'up' ? '< ' : '> ' }}{{ fmt(r, r.alert) }}
            </p>
          </td>
          <td class="self-center md:py-4">
            <span class="inline-flex items-center gap-1.5 border-2 border-ink px-2 py-0.5 text-xs font-bold whitespace-nowrap" :class="statusInfo[r.status].cls">
              <component :is="statusInfo[r.status].icon" :size="14" aria-hidden="true" />{{ statusInfo[r.status].label }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-soft">
      <span class="inline-flex items-center gap-2"><span class="h-3 w-0.5 bg-ink" aria-hidden="true"></span>Cible</span>
      <span class="inline-flex items-center gap-2"><span class="h-3 w-0.5 bg-orange" aria-hidden="true"></span>Seuil d'alerte</span>
    </p>
  </section>
</template>
