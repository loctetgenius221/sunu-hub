<script setup lang="ts">
import ChoiceChips from '@/components/ui/ChoiceChips.vue'
import { cities, fields } from '@/data/questions'
import { activeCount, emptyFilters, type Filters } from '@/services/filters'

// Filtres détaillés du fil (TDR Q3) : niveau, filière, ville, date limite.
// Le type se choisit par les filtres rapides, au-dessus des résultats.
const filters = defineModel<Filters>({ required: true })

const set = <K extends keyof Filters>(k: K, v: Filters[K]) => (filters.value = { ...filters.value, [k]: v })
</script>

<template>
  <div class="space-y-7">
    <div>
      <label for="f-level" class="label">Niveau</label>
      <select id="f-level" :value="filters.level" class="field" @change="set('level', ($event.target as HTMLSelectElement).value as Filters['level'])">
        <option value="">Tous niveaux</option>
        <option value="bac">Bac</option>
        <option value="licence">Licence</option>
        <option value="master">Master</option>
      </select>
    </div>

    <div>
      <label for="f-field" class="label">Filière</label>
      <select id="f-field" :value="filters.field" class="field" @change="set('field', ($event.target as HTMLSelectElement).value)">
        <option value="">Toutes filières</option>
        <option v-for="f in fields" :key="f.value" :value="f.value">{{ f.label }}</option>
      </select>
    </div>

    <div>
      <label for="f-city" class="label">Ville</label>
      <select id="f-city" :value="filters.city" class="field" @change="set('city', ($event.target as HTMLSelectElement).value)">
        <option value="">Partout</option>
        <option v-for="c in cities.slice(0, -1)" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
      <p class="mt-1.5 text-xs text-ink-soft">Les offres à distance restent visibles.</p>
    </div>

    <ChoiceChips
      :model-value="filters.within"
      legend="Date limite"
      :options="[
        { value: '', label: 'Toutes' },
        { value: '7', label: 'Sous 7 jours' },
        { value: '30', label: 'Sous 30 jours' },
      ]"
      class="[&_label]:min-h-9 [&_label]:px-3 [&_label]:py-1 [&_label]:text-sm"
      @update:model-value="set('within', $event as Filters['within'])"
    />

    <button
      v-if="activeCount(filters)"
      type="button"
      class="font-medium text-navy hover:underline"
      @click="filters = emptyFilters()"
    >
      Effacer les filtres
    </button>
  </div>
</template>
