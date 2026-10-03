<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { reportReasons } from '@/data/labels'

// Signalement d'une offre suspecte (TDR Q6), dans un <dialog> natif (focus et Échap gérés par le navigateur).
const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ submit: [reason: string] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const reason = ref(reportReasons[0]!)

watch(open, (v) => (v ? dialog.value?.showModal() : dialog.value?.close()))
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(100%-2rem,32rem)] border-2 border-ink bg-white p-0 shadow-[10px_10px_0_var(--color-orange)] backdrop:bg-ink/50"
    aria-labelledby="report-title"
    @close="open = false"
  >
    <form method="dialog" class="p-6 sm:p-8" @submit.prevent="emit('submit', reason)">
      <h2 id="report-title" class="display text-[1.8rem] text-navy">Signaler cette offre</h2>
      <p class="mt-2 text-sm text-ink-soft">Après trois signalements, l'offre est masquée en attendant une vérification par l'équipe.</p>
      <fieldset class="mt-6 space-y-2">
        <legend class="label">Ce qui ne va pas</legend>
        <label v-for="r in reportReasons" :key="r" class="flex min-h-11 cursor-pointer items-center gap-3 border-2 border-ink px-4 py-2 has-[:checked]:bg-paper-2">
          <input v-model="reason" type="radio" name="reason" :value="r" class="h-4 w-4 accent-navy" />
          {{ r }}
        </label>
      </fieldset>
      <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BaseButton type="submit">Envoyer le signalement</BaseButton>
        <button type="button" class="font-semibold underline underline-offset-4" @click="open = false">Annuler</button>
      </div>
    </form>
  </dialog>
</template>
