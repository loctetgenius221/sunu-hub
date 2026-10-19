<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import StepCode from '@/components/signup/StepCode.vue'
import StepIdentity from '@/components/signup/StepIdentity.vue'
import StepPhone from '@/components/signup/StepPhone.vue'
import ChoiceChips from '@/components/ui/ChoiceChips.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import type { PhotoName } from '@/data/photos'
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

// Photo et promesse suivent le stade choisi (étudiant par défaut).
const stagePhotos: Record<string, PhotoName> = { terminale: 'lyceen', bachelier: 'orienter', etudiant: 'etudiant', diplome: 'etudiante' }
const photo = computed(() => stagePhotos[store.state.answers.stage ?? 'etudiant']!)
const promise = computed(() => (stages.find((s) => s.id === (store.state.answers.stage ?? 'etudiant')) ?? stages[2]!).promise)
</script>

<template>
  <section class="min-h-[calc(100svh-3.5rem)] bg-paper-2">
    <div class="wrap grid grid-cols-1 items-start gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:py-16">
      <div class="min-w-0">
        <!-- Progression -->
        <div class="flex items-center gap-4">
          <button
            v-if="position > 0 && step !== 'code'"
            type="button"
            class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-soft transition hover:bg-[#ececf0]"
            @click="back"
          >
            <ArrowLeft :size="18" aria-hidden="true" />
            <span class="sr-only">Étape précédente</span>
          </button>
          <ol class="flex flex-1 gap-1" :aria-label="`Étape ${position + 1} sur ${order.length}`">
            <li
              v-for="(s, i) in order"
              :key="String(s)"
              class="h-1 flex-1 rounded-full transition-colors duration-500"
              :class="i <= position ? 'bg-navy' : 'bg-[#dcdce1]'"
            ></li>
          </ol>
          <span class="text-[0.875rem] font-medium text-ink-soft tabular-nums">{{ position + 1 }} sur {{ order.length }}</span>
        </div>

        <div class="mt-8 rounded-tile bg-white p-7 shadow-soft sm:p-10">
          <Transition
            mode="out-in"
            enter-from-class="opacity-0 translate-y-2"
            leave-to-class="opacity-0"
            enter-active-class="transition duration-300 ease-[var(--ease-out-soft)]"
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
              <p class="text-[0.9375rem] font-medium text-navy">Question {{ (step as number) + 1 }} sur {{ questions.length }}</p>
              <ChoiceChips
                v-model="current"
                class="mt-2"
                :legend="question.title(store.state.answers)"
                legend-class="display mb-7 text-[clamp(1.875rem,3.4vw,2.5rem)]"
                :options="question.options(store.state.answers)"
              />
              <p class="mt-9 text-[0.875rem] text-ink-soft">Chaque réponse est enregistrée : tu peux reprendre plus tard.</p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Photo qui suit le stade choisi -->
      <figure class="relative hidden overflow-hidden rounded-tile bg-navy-deep lg:sticky lg:top-24 lg:block lg:aspect-[4/5]">
        <Transition
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
          enter-active-class="transition duration-700"
          leave-active-class="transition duration-700 absolute inset-0"
        >
          <ResponsiveImage :key="photo" :name="photo" sizes="40vw" class="absolute inset-0" />
        </Transition>
        <div class="absolute inset-0 bg-linear-to-t from-[#04112a]/80 via-transparent to-transparent" aria-hidden="true"></div>
        <figcaption class="absolute inset-x-0 bottom-0 p-8 text-white">
          <p class="text-[1.375rem] leading-snug font-semibold tracking-[-0.02em]">{{ promise }}</p>
          <p class="mt-2 text-[0.875rem] text-white/70">Gratuit, sans e-mail ni mot de passe.</p>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
