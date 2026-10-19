<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Consent } from '@/types'

// Étape 3 : prénom, année de naissance et consentement horodaté.
// Sous 18 ans, l'accord d'un parent ou tuteur est obligatoire (TDR P1, §7).
const props = defineProps<{ firstName: string; birthYear: number | null }>()
const emit = defineEmits<{ submit: [firstName: string, birthYear: number, guardian?: Consent['guardian']] }>()

const thisYear = new Date().getFullYear()
const years = Array.from({ length: 24 }, (_, i) => thisYear - 13 - i)

const form = reactive({
  firstName: props.firstName,
  birthYear: props.birthYear ?? ('' as number | ''),
  guardianName: '',
  guardianPhone: '',
  guardianOk: false,
  terms: false,
})
const touched = ref(false)

const minor = computed(() => !!form.birthYear && thisYear - Number(form.birthYear) < 18)
const errors = computed(() => ({
  firstName: !form.firstName.trim(),
  birthYear: !form.birthYear,
  guardian: minor.value && (!form.guardianName.trim() || !/^7[05678]\d{7}$/.test(form.guardianPhone.replace(/\D/g, '')) || !form.guardianOk),
  terms: !form.terms,
}))
const valid = computed(() => !Object.values(errors.value).some(Boolean))

function submit() {
  touched.value = true
  if (!valid.value) return
  const guardian = minor.value ? { name: form.guardianName.trim(), phone: form.guardianPhone.replace(/\D/g, '') } : undefined
  emit('submit', form.firstName.trim(), Number(form.birthYear), guardian)
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <h1 class="display text-[clamp(1.875rem,3.4vw,2.5rem)]">Faisons connaissance</h1>
    <p class="mt-3 text-ink-soft">Ton profil reste privé. Aucune structure ne te contacte sans ton accord.</p>

    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="min-w-0">
        <label for="first" class="label">Prénom</label>
        <input id="first" v-model="form.firstName" autocomplete="given-name" class="field" :aria-invalid="touched && errors.firstName" />
      </div>
      <div class="min-w-0">
        <label for="year" class="label">Année de naissance</label>
        <select id="year" v-model="form.birthYear" class="field" :aria-invalid="touched && errors.birthYear">
          <option value="" disabled>Choisir</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <Transition enter-from-class="opacity-0 -translate-y-2" enter-active-class="transition duration-300">
      <fieldset v-if="minor" class="mt-7 rounded-card bg-paper-2 p-5 sm:p-6">
        <legend class="float-left mb-2 w-full font-semibold">Tu as moins de 18 ans</legend>
        <p class="text-sm text-ink-soft">Un parent ou tuteur doit donner son accord. Nous lui enverrons un message de confirmation.</p>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="min-w-0">
            <label for="g-name" class="label">Nom du parent ou tuteur</label>
            <input id="g-name" v-model="form.guardianName" class="field" :aria-invalid="touched && !form.guardianName.trim()" />
          </div>
          <div class="min-w-0">
            <label for="g-phone" class="label">Son numéro</label>
            <input id="g-phone" v-model="form.guardianPhone" type="tel" inputmode="numeric" placeholder="77 000 00 00" class="field" />
          </div>
        </div>
        <label class="mt-4 flex items-start gap-3 text-sm">
          <input v-model="form.guardianOk" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 accent-navy" />
          Mon parent ou tuteur est d'accord pour que j'utilise SUNU HŪB.
        </label>
      </fieldset>
    </Transition>

    <label class="mt-7 flex items-start gap-3 text-sm">
      <input v-model="form.terms" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 accent-navy" :aria-invalid="touched && errors.terms" />
      <span>J'accepte les conditions d'utilisation et la politique de confidentialité. Je peux exporter ou supprimer mes données à tout moment.</span>
    </label>

    <p v-if="touched && !valid" class="mt-5 rounded-control bg-orange-soft px-4 py-3 text-[0.9375rem] font-medium text-orange" role="alert">
      Il manque une information. Vérifie les champs signalés.
    </p>

    <div class="mt-9">
      <BaseButton type="submit">Continuer</BaseButton>
    </div>
  </form>
</template>
