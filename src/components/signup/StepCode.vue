<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { DEMO_CODE } from '@/services/api'

// Étape 2 : code à 6 chiffres reçu par WhatsApp ou SMS, renvoi possible après 30 secondes.
const props = defineProps<{ phone: string; channel: string; busy: boolean; error: boolean }>()
const emit = defineEmits<{ submit: [code: string]; resend: []; back: [] }>()

const code = ref('')
const wait = ref(30)
let timer: ReturnType<typeof setInterval> | undefined

const startTimer = () => {
  wait.value = 30
  clearInterval(timer)
  timer = setInterval(() => wait.value > 0 && wait.value--, 1000)
}
onMounted(startTimer)
onBeforeUnmount(() => clearInterval(timer))

const formatted = props.phone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')

function onInput() {
  code.value = code.value.replace(/\D/g, '').slice(0, 6)
  if (code.value.length === 6) emit('submit', code.value)
}

function resend() {
  startTimer()
  emit('resend')
}
</script>

<template>
  <form novalidate @submit.prevent="emit('submit', code)">
    <h1 class="display text-[clamp(1.875rem,3.4vw,2.5rem)]">Ton code</h1>
    <p class="mt-3 text-ink-soft">
      Envoyé par {{ channel === 'whatsapp' ? 'WhatsApp' : 'SMS' }} au <span class="font-semibold whitespace-nowrap text-ink">+221 {{ formatted }}</span>.
      <button type="button" class="ml-1 font-medium text-navy hover:underline" @click="emit('back')">
        Modifier
      </button>
    </p>

    <label for="otp" class="label mt-8">Code à 6 chiffres</label>
    <input
      id="otp"
      v-model="code"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="6"
      class="field max-w-[14rem] text-center text-2xl tracking-[0.5em] tabular-nums"
      :aria-invalid="error"
      aria-describedby="otp-help"
      @input="onInput"
    />
    <p id="otp-help" class="mt-2 text-sm" :class="error ? 'font-medium text-orange' : 'text-ink-soft'" aria-live="polite">
      {{ error ? 'Ce code ne correspond pas. Réessaie.' : `Maquette : utilise le code ${DEMO_CODE}.` }}
    </p>

    <div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
      <BaseButton type="submit" :disabled="busy || code.length !== 6">{{ busy ? 'Vérification…' : 'Valider' }}</BaseButton>
      <button type="button" class="text-[0.9375rem] font-medium text-navy hover:underline disabled:text-ink-soft disabled:no-underline" :disabled="wait > 0" @click="resend">
        {{ wait > 0 ? `Renvoyer le code dans ${wait} s` : 'Renvoyer le code' }}
      </button>
    </div>
  </form>
</template>
