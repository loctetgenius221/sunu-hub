<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import SchoolResult from './SchoolResult.vue'
import { searchSchools } from '@/services/api'
import type { School } from '@/types'

// Recherche instantanée d'un établissement (TDR O1 : réponse en moins de 3 secondes).
// `initial` permet de pré-remplir depuis l'URL ; l'événement `query` la tient à jour.
const props = defineProps<{ initial?: string }>()
const emit = defineEmits<{ query: [q: string]; missing: [q: string] }>()

const query = ref(props.initial ?? '')
const results = ref<School[] | null>(null)
const examples = ['ICVM', 'Horizon', 'Littoral', 'Santé']

let timer: ReturnType<typeof setTimeout> | undefined
async function run(q: string) {
  emit('query', q)
  if (q.trim().length < 2) return void (results.value = null)
  results.value = await searchSchools(q)
}
watch(query, (q) => {
  clearTimeout(timer)
  timer = setTimeout(() => run(q), 250)
})
if (query.value) run(query.value)
</script>

<template>
  <div>
    <form role="search" @submit.prevent="run(query)">
      <label for="school-q" class="sr-only">Nom ou sigle de l'établissement</label>
      <div
        class="flex rounded-full bg-white shadow-lift ring-1 ring-black/5 transition focus-within:ring-4 focus-within:ring-navy/20"
      >
        <Search :size="22" class="ml-6 shrink-0 self-center text-ink-soft" aria-hidden="true" />
        <input
          id="school-q"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Ex. : Institut Cap-Vert"
          class="min-w-0 flex-1 bg-transparent px-3 py-4.5 text-[1.125rem] outline-none placeholder:text-ink-soft"
        />
      </div>
    </form>
    <p class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 px-2 text-[0.9375rem]">
      <span>Essaie&nbsp;:</span>
      <button v-for="e in examples" :key="e" type="button" class="rounded-full bg-white/70 px-3 py-1 font-medium text-ink ring-1 ring-black/5 backdrop-blur hover:bg-white" @click="query = e">
        {{ e }}
      </button>
    </p>

    <div class="mt-8 space-y-4" aria-live="polite">
      <h2 v-if="results" class="sr-only">Résultats de la recherche</h2>
      <p v-if="results?.length" class="px-2 text-[0.9375rem] font-medium">
        {{ results.length }} {{ results.length > 1 ? 'établissements trouvés' : 'établissement trouvé' }}
      </p>
      <SchoolResult v-for="s in results ?? []" :key="s.id" :school="s" />
      <div v-if="results && !results.length" class="rounded-tile bg-white p-6 shadow-soft">
        <p class="text-[1.125rem] font-semibold">Aucun établissement trouvé pour « {{ query }} ».</p>
        <p class="mt-2 text-ink-soft">
          S'il n'est pas dans notre base, il n'a pas encore été vérifié : demande son arrêté d'habilitation avant de payer.
        </p>
        <button type="button" class="mt-4 font-medium text-navy hover:underline" @click="emit('missing', query)">
          Demander une vérification
        </button>
      </div>
    </div>
  </div>
</template>
