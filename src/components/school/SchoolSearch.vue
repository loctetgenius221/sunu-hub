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
      <label for="school-q" class="text-sm font-bold">Nom ou sigle de l'établissement</label>
      <div
        class="mt-2 flex border-2 border-ink bg-white shadow-[6px_6px_0_var(--color-ink)] focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-navy"
      >
        <Search :size="22" class="ml-4 shrink-0 self-center" aria-hidden="true" />
        <input
          id="school-q"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Ex. : Institut Cap-Vert"
          class="min-w-0 flex-1 bg-transparent px-3 py-4 text-lg outline-none placeholder:text-ink-soft"
        />
      </div>
    </form>
    <p class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <span>Essaie&nbsp;:</span>
      <button v-for="e in examples" :key="e" type="button" class="border-b-2 border-ink font-semibold hover:border-navy" @click="query = e">
        {{ e }}
      </button>
    </p>

    <div class="mt-8 space-y-5" aria-live="polite">
      <p v-if="results?.length" class="text-sm font-semibold">
        {{ results.length }} {{ results.length > 1 ? 'établissements trouvés' : 'établissement trouvé' }}
      </p>
      <SchoolResult v-for="s in results ?? []" :key="s.id" :school="s" />
      <div v-if="results && !results.length" class="border-2 border-dashed border-ink bg-white p-5">
        <p class="font-semibold">Aucun établissement trouvé pour « {{ query }} ».</p>
        <p class="mt-2">
          S'il n'est pas dans notre base, il n'a pas encore été vérifié : demande son arrêté d'habilitation avant de payer.
        </p>
        <button type="button" class="mt-3 font-semibold underline decoration-navy decoration-2 underline-offset-4" @click="emit('missing', query)">
          Demander une vérification
        </button>
      </div>
    </div>
  </div>
</template>
