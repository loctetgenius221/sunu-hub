<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import HubScene from '@/components/art/HubScene.vue'
import StepCode from '@/components/signup/StepCode.vue'
import StepIdentity from '@/components/signup/StepIdentity.vue'
import StepPhone from '@/components/signup/StepPhone.vue'
import ChoiceChips from '@/components/ui/ChoiceChips.vue'
import { stages } from '@/data/home'
import { questions } from '@/data/questions'
import { requestCode, verifyCode } from '@/services/api'
import { useProfileStore } from '@/stores/profile'
import type { Consent, EntryAnswers } from '@/types'

// Inscription en moins de 2 minutes (TDR P1–P2) : téléphone, code, identité et consentement,
// puis 5 questions. Le parcours reprend là où il s'était arrêté.

type Step = 'phone' | 'code' | 'identity' | number // number = index de la question

const store = useProfileStore()
const route = useRoute()
const router = useRouter()

function resumeStep(): Step {
  const s = store.state
  if (!s.verified) return 'phone'
  if (!s.consent) return 'identity'
  if (route.query.etape === 'questions') return 0
  const next = questions.findIndex((q) => !s.answers[q.id])
  return next === -1 ? 0 : next
}

const step = ref<Step>(resumeStep())
// Chaque étape s'affiche depuis le haut (les formulaires n'ont pas la même hauteur).
watch(step, () => window.scrollY > 120 && window.scrollTo({ top: 0, behavior: 'smooth' }))
const order: Step[] = ['phone', 'code', 'identity', ...questions.map((_, i) => i)]
const position = computed(() => order.indexOf(step.value))

const channel = ref<'whatsapp' | 'sms'>('whatsapp')
const busy = ref(false)
const codeError = ref(false)

async function onPhone(phone: string, ch: 'whatsapp' | 'sms') {
  busy.value = true
  store.state.phone = phone
  channel.value = ch
  await requestCode(phone, ch)
  busy.value = false
  step.value = 'code'
}

async function onCode(code: string) {
  busy.value = true
  codeError.value = false
  const ok = await verifyCode(code)
  busy.value = false
  if (!ok) return void (codeError.value = true)
  store.state.verified = true
  step.value = store.state.consent ? 0 : 'identity'
}

function onIdentity(firstName: string, birthYear: number, guardian?: Consent['guardian']) {
  store.state.firstName = firstName
  store.state.birthYear = birthYear
  store.giveConsent(guardian)
  step.value = 0
}

// Questions : un choix fait passer à la suivante après un court instant.
const question = computed(() => (typeof step.value === 'number' ? questions[step.value]! : null))
const current = computed({
  get: () => (question.value ? (store.state.answers[question.value.id] as string | undefined) : undefined),
  set: (v) => {
    if (!question.value || typeof v !== 'string') return
    store.answer(question.value.id, v as EntryAnswers[typeof question.value.id])
    setTimeout(next, 280)
  },
})

function next() {
  if (typeof step.value !== 'number') return
  if (step.value < questions.length - 1) step.value++
  else router.push({ name: 'profile', query: { bienvenue: '1' } })
}

function back() {
  const i = position.value
  if (i <= 0) return
  const prev = order[i - 1]!
  // On ne revient pas à la saisie du code une fois le numéro vérifié.
  step.value = prev === 'code' && store.state.verified ? 'phone' : prev
  if (step.value === 'phone') store.state.verified = false
}

const building = computed(() => stages.find((s) => s.id === store.state.answers.stage)?.building)
</script>

<template>
  <section class="grid-paper min-h-[calc(100svh-4rem)]">
    <div class="wrap grid grid-cols-1 items-start gap-12 py-10 sm:py-14 lg:grid-cols-12 lg:py-16">
      <div class="min-w-0 lg:col-span-6">
        <!-- Progression -->
        <div class="flex items-center gap-4">
          <button
            v-if="position > 0 && step !== 'code'"
            type="button"
            class="grid h-11 w-11 shrink-0 place-items-center border-2 border-ink bg-white"
            @click="back"
          >
            <ArrowLeft :size="18" aria-hidden="true" />
            <span class="sr-only">Étape précédente</span>
          </button>
          <ol class="flex flex-1 gap-1.5" :aria-label="`Étape ${position + 1} sur ${order.length}`">
            <li
              v-for="(s, i) in order"
              :key="String(s)"
              class="h-2 flex-1 border border-ink transition-colors duration-300"
              :class="i < position ? 'bg-navy' : i === position ? 'bg-orange' : 'bg-white'"
            ></li>
          </ol>
          <span class="text-sm font-semibold tabular-nums">{{ position + 1 }}/{{ order.length }}</span>
        </div>

        <div class="mt-8 border-2 border-ink bg-white p-6 shadow-[10px_10px_0_var(--color-navy)] sm:p-9">
          <Transition
            mode="out-in"
            enter-from-class="opacity-0 translate-x-3"
            leave-to-class="opacity-0 -translate-x-3"
            enter-active-class="transition duration-200"
            leave-active-class="transition duration-150"
          >
            <StepPhone v-if="step === 'phone'" :initial="store.state.phone" :busy="busy" @submit="onPhone" />
            <StepCode
              v-else-if="step === 'code'"
              :phone="store.state.phone"
              :channel="channel"
              :busy="busy"
              :error="codeError"
              @submit="onCode"
              @resend="requestCode(store.state.phone, channel)"
              @back="step = 'phone'"
            />
            <StepIdentity
              v-else-if="step === 'identity'"
              :first-name="store.state.firstName"
              :birth-year="store.state.birthYear"
              @submit="onIdentity"
            />
            <div v-else-if="question" :key="question.id">
              <h1 class="sr-only">Créer mon profil : questionnaire d'entrée</h1>
              <p class="text-sm font-semibold text-ink-soft">Question {{ (step as number) + 1 }} sur {{ questions.length }}</p>
              <ChoiceChips
                v-model="current"
                class="mt-2"
                :legend="question.title(store.state.answers)"
                legend-class="display mb-6 text-[clamp(1.8rem,3vw,2.4rem)] text-navy"
                :options="question.options(store.state.answers)"
              />
              <p class="mt-8 text-sm text-ink-soft">Chaque réponse est enregistrée : tu peux reprendre plus tard.</p>
            </div>
          </Transition>
        </div>
      </div>

      <div class="hidden min-w-0 lg:col-span-6 lg:block">
        <HubScene :active="building" />
      </div>
    </div>
  </section>
</template>
