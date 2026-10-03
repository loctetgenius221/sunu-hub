<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ChoiceChips from '@/components/ui/ChoiceChips.vue'

// Étape 1 : numéro de téléphone sénégalais (9 chiffres, 70/75/76/77/78) et canal du code.
const emit = defineEmits<{ submit: [phone: string, channel: 'whatsapp' | 'sms'] }>()
const props = defineProps<{ initial: string; busy: boolean }>()

const phone = ref(props.initial)
const channel = ref<'whatsapp' | 'sms'>('whatsapp')
const touched = ref(false)

const digits = computed(() => phone.value.replace(/\D/g, '').replace(/^221/, ''))
const valid = computed(() => /^7[05678]\d{7}$/.test(digits.value))

function submit() {
  touched.value = true
  if (valid.value) emit('submit', digits.value, channel.value)
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <h1 class="display text-[clamp(1.8rem,3vw,2.4rem)] text-navy">Ton numéro de téléphone</h1>
    <p class="mt-3 text-ink-soft">C'est ton identifiant. Pas besoin d'e-mail ni de mot de passe.</p>

    <label for="phone" class="label mt-8">Numéro de mobile</label>
    <div class="flex">
      <span class="grid place-items-center border-2 border-r-0 border-ink bg-paper-2 px-3 font-semibold">+221</span>
      <input
        id="phone"
        v-model="phone"
        type="tel"
        inputmode="numeric"
        autocomplete="tel-national"
        placeholder="77 123 45 67"
        class="field tabular-nums"
        :aria-invalid="touched && !valid"
        aria-describedby="phone-help"
      />
    </div>
    <p id="phone-help" class="mt-2 text-sm" :class="touched && !valid ? 'font-semibold text-ink' : 'text-ink-soft'">
      {{ touched && !valid ? 'Vérifie ton numéro : 9 chiffres, commençant par 70, 75, 76, 77 ou 78.' : 'Nous ne le partageons avec personne.' }}
    </p>

    <ChoiceChips
      v-model="channel"
      class="mt-7"
      legend="Recevoir le code par"
      :options="[
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'sms', label: 'SMS' },
      ]"
    />

    <div class="mt-9">
      <BaseButton type="submit" :disabled="busy">{{ busy ? 'Envoi…' : 'Recevoir mon code' }}</BaseButton>
    </div>
  </form>
</template>
