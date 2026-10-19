<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Flag, SendHorizontal } from 'lucide-vue-next'
import SunuMark from '@/components/brand/SunuMark.vue'
import AdvisorDialog from '@/components/orient/AdvisorDialog.vue'
import { useToast } from '@/composables/useToast'
import { answer, assistantExamples, type AssistantReply } from '@/services/assistant'

// Assistant d'orientation (TDR O6) : réponses tirées de la base vérifiée, avec source et date.
// Limite de messages par jour pour maîtriser les coûts (TDR §7).
const DAILY_LIMIT = 20

type Message = { from: 'me'; text: string } | { from: 'bot'; reply: AssistantReply; flagged?: boolean }

const messages = ref<Message[]>([])
const input = ref('')
const thinking = ref(false)
const advisor = ref(false)
const thread = ref<HTMLElement | null>(null)
const { show } = useToast()

const sent = () => messages.value.filter((m) => m.from === 'me').length

async function ask(text = input.value) {
  const q = text.trim()
  if (!q || thinking.value || sent() >= DAILY_LIMIT) return
  messages.value.push({ from: 'me', text: q })
  input.value = ''
  thinking.value = true
  await new Promise((r) => setTimeout(r, 500))
  messages.value.push({ from: 'bot', reply: answer(q) })
  thinking.value = false
  await nextTick()
  thread.value?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function flag(m: Message) {
  if (m.from !== 'bot') return
  m.flagged = true
  show('Merci : cette réponse sera relue par notre équipe.')
}
</script>

<template>
  <section class="grid-paper border-b border-rule">
    <div class="wrap py-10 sm:py-12">
      <h1 class="display text-[clamp(2rem,3.6vw,3rem)]">Poser une question</h1>
      <p class="mt-3 max-w-2xl text-ink-soft">
        L'assistant répond uniquement à partir de notre base vérifiée, en citant la source et la date. S'il ne sait pas, il le dit.
        Maquette : réponses simulées.
      </p>
    </div>
  </section>

  <div class="wrap grid grid-cols-1 gap-10 py-10 lg:grid-cols-12">
    <div class="flex min-w-0 flex-col overflow-hidden rounded-tile bg-white shadow-soft lg:col-span-8">
      <ol ref="thread" class="min-h-[22rem] flex-1 space-y-5 p-5 sm:p-6" aria-live="polite">
        <li v-if="!messages.length" class="text-ink-soft">
          <p>Exemples de questions :</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button v-for="e in assistantExamples" :key="e" type="button" class="rounded-full bg-paper-2 px-3.5 py-1.5 text-[0.9375rem] font-medium text-ink hover:bg-paper-2" @click="ask(e)">
              {{ e }}
            </button>
          </div>
        </li>
        <li v-for="(m, i) in messages" :key="i" :class="m.from === 'me' ? 'flex justify-end' : 'flex gap-3'">
          <p v-if="m.from === 'me'" class="max-w-[85%] rounded-full bg-navy px-4 py-2.5 text-white">{{ m.text }}</p>
          <template v-else>
            <span class="grid h-9 w-9 shrink-0 place-items-center bg-navy p-1.5" aria-hidden="true"><SunuMark class="h-full" /></span>
            <div class="min-w-0 max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3" :class="m.reply.unknown ? 'bg-orange-soft' : 'bg-paper-2'">
              <p>{{ m.reply.text }}</p>
              <ul v-if="m.reply.sources.length" class="mt-3 border-t border-rule pt-2 text-xs text-ink-soft">
                <li v-for="s in m.reply.sources" :key="s.label + s.date">Source : {{ s.label }}{{ s.date ? `, vérifié le ${s.date}` : '' }}</li>
              </ul>
              <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <button v-if="m.reply.suggestAdvisor" type="button" class="font-semibold text-navy hover:underline" @click="advisor = true">
                  Parler à un conseiller
                </button>
                <button type="button" class="inline-flex items-center gap-1.5 text-ink-soft hover:text-ink disabled:no-underline" :disabled="m.flagged" @click="flag(m)">
                  <Flag :size="14" aria-hidden="true" />{{ m.flagged ? 'Erreur signalée' : 'Signaler une erreur' }}
                </button>
              </div>
            </div>
          </template>
        </li>
        <li v-if="thinking" class="text-sm text-ink-soft">L'assistant cherche dans la base…</li>
      </ol>

      <form class="flex border-t border-rule" @submit.prevent="ask()">
        <label for="ask" class="sr-only">Ta question</label>
        <input id="ask" v-model="input" class="min-w-0 flex-1 px-4 py-4 outline-none" placeholder="Ex. : l'ISMST est-elle habilitée ?" :disabled="sent() >= DAILY_LIMIT" />
        <button type="submit" class="m-1.5 grid w-12 shrink-0 place-items-center rounded-full bg-navy text-white disabled:opacity-50" :disabled="!input.trim() || thinking">
          <SendHorizontal :size="20" aria-hidden="true" /><span class="sr-only">Envoyer</span>
        </button>
      </form>
    </div>

    <aside class="min-w-0 space-y-6 text-sm lg:col-span-4">
      <div class="rounded-tile bg-white p-5">
        <h2 class="font-semibold">Ce que l'assistant fait</h2>
        <ul class="mt-3 space-y-2 text-ink-soft">
          <li>Explique les statuts des écoles et des formations.</li>
          <li>Donne coûts, durées et sélectivité des formations de notre base.</li>
          <li>Rappelle les règles et les dates de Campusen.</li>
        </ul>
        <h2 class="mt-5 font-semibold">Ce qu'il ne fait pas</h2>
        <ul class="mt-3 space-y-2 text-ink-soft">
          <li>Inventer une formation, une école ou un statut.</li>
          <li>Promettre une admission, un salaire ou un emploi.</li>
          <li>Décider à ta place : pour cela, un conseiller te répond sous 48 heures.</li>
        </ul>
      </div>
      <p class="text-ink-soft tabular-nums">{{ sent() }}/{{ DAILY_LIMIT }} questions aujourd'hui.</p>
    </aside>
  </div>

  <AdvisorDialog v-model="advisor" />
</template>
