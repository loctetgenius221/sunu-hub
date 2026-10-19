<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useToast } from '@/composables/useToast'

// Demande de conseil humain (TDR O8) : réponse sous 48 h par un conseiller partenaire.
const open = defineModel<boolean>({ required: true })
const dialog = ref<HTMLDialogElement | null>(null)
const message = ref('')
const channel = ref<'whatsapp' | 'appel'>('whatsapp')
const { show } = useToast()

watch(open, (v) => (v ? dialog.value?.showModal() : dialog.value?.close()))

function submit() {
  if (message.value.trim().length < 10) return
  open.value = false
  message.value = ''
  show('Demande envoyée : un conseiller te répond sous 48 heures.')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(100%-2rem,34rem)] rounded-tile bg-white p-0 shadow-lift backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    aria-labelledby="advisor-title"
    @close="open = false"
  >
    <form class="p-6 sm:p-8" @submit.prevent="submit">
      <h2 id="advisor-title" class="display text-[1.875rem]">Parler à un conseiller</h2>
      <p class="mt-2 text-sm text-ink-soft">Un conseiller d'orientation partenaire te répond sous 48 heures. C'est gratuit.</p>
      <label for="adv-msg" class="label mt-6">Ta question</label>
      <textarea id="adv-msg" v-model="message" rows="4" class="field" placeholder="Ex. : j'hésite entre l'informatique et la gestion…"></textarea>
      <fieldset class="mt-5">
        <legend class="label">Être recontacté par</legend>
        <div class="flex gap-4">
          <label class="flex items-center gap-2"><input v-model="channel" type="radio" value="whatsapp" class="accent-navy" />WhatsApp</label>
          <label class="flex items-center gap-2"><input v-model="channel" type="radio" value="appel" class="accent-navy" />Appel</label>
        </div>
      </fieldset>
      <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BaseButton type="submit" :disabled="message.trim().length < 10">Envoyer ma question</BaseButton>
        <button type="button" class="font-semibold underline underline-offset-4" @click="open = false">Annuler</button>
      </div>
    </form>
  </dialog>
</template>
