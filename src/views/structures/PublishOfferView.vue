<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { animate } from 'motion'
import { ShieldAlert, Users } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import ChoiceChips from '@/components/ui/ChoiceChips.vue'
import { opportunityTypes } from '@/data/labels'
import { cities, fields } from '@/data/questions'
import { prefersReducedMotion } from '@/composables/useMotion'
import { useToast } from '@/composables/useToast'
import { estimateAudience, paymentTerms, suspectTerms } from '@/services/moderation'
import { useStructureStore } from '@/stores/structure'
import type { Level, OpportunityType } from '@/types'

// Publication en formulaire court (TDR S2) : audience visible avant de publier,
// refus des offres qui demandent de l'argent, validation par l'équipe avant mise en ligne.
const store = useStructureStore()
const router = useRouter()
const { show } = useToast()

const today = new Date().toISOString().slice(0, 10)
const form = reactive({
  type: 'stage' as OpportunityType,
  title: '',
  summary: '',
  levels: [] as Level[],
  fields: [] as string[],
  city: store.state.account?.city ?? 'Dakar',
  remote: false,
  deadline: '',
  conditions: '',
  free: false,
})
const touched = ref(false)

const typeOptions = Object.entries(opportunityTypes).map(([value, label]) => ({ value, label }))
const levelOptions = [
  { value: 'bac', label: 'Bac' },
  { value: 'licence', label: 'Licence' },
  { value: 'master', label: 'Master' },
]

const text = computed(() => `${form.title} ${form.summary} ${form.conditions}`)
const flagged = computed(() => paymentTerms(text.value))
const suspect = computed(() => suspectTerms(text.value))
const audience = computed(() => estimateAudience(form))

// Le compteur d'audience s'anime vers sa nouvelle valeur.
const shown = ref(0)
watch(
  audience,
  (to, from) => {
    if (prefersReducedMotion()) return void (shown.value = to)
    animate(from ?? 0, to, { duration: 0.5, onUpdate: (v) => (shown.value = Math.round(v)) })
  },
  { immediate: true },
)

const errors = computed(() => ({
  title: form.title.trim().length < 6,
  summary: form.summary.trim().length < 20,
  levels: !form.levels.length,
  fields: !form.fields.length,
  deadline: !form.deadline || form.deadline < today,
  free: !form.free,
  payment: flagged.value.length > 0,
}))
const valid = computed(() => !Object.values(errors.value).some(Boolean))

function submit() {
  touched.value = true
  if (!valid.value) return
  store.publish({
    type: form.type,
    title: form.title.trim(),
    summary: form.summary.trim(),
    levels: form.levels,
    fields: form.fields,
    city: form.city,
    remote: form.remote,
    deadline: form.deadline,
    conditions: form.conditions.split('\n').map((c) => c.trim()).filter(Boolean),
  })
  show('Offre envoyée : elle sera en ligne après validation, sous 24 h.')
  router.push({ name: 'structure-dashboard' })
}
</script>

<template>
  <section class="grid-paper border-b border-rule">
    <div class="wrap py-10 sm:py-14">
      <h1 class="display text-[clamp(2rem,3.6vw,3rem)]">Publier une opportunité</h1>
      <p class="mt-3 max-w-xl text-ink-soft">Gratuit. L'offre est relue par notre équipe avant d'être mise en ligne.</p>
    </div>
  </section>

  <form novalidate class="wrap grid grid-cols-1 gap-12 py-10 lg:grid-cols-12 lg:py-14" @submit.prevent="submit">
    <div class="min-w-0 space-y-8 lg:col-span-7">
      <ChoiceChips v-model="form.type" legend="Type d'opportunité" :options="typeOptions" />

      <div>
        <label for="o-title" class="label">Intitulé</label>
        <input id="o-title" v-model="form.title" class="field" maxlength="90" placeholder="Ex. : Stage assistant marketing (3 mois)" :aria-invalid="touched && errors.title" />
      </div>

      <div>
        <label for="o-summary" class="label">Description courte</label>
        <textarea id="o-summary" v-model="form.summary" rows="3" maxlength="280" class="field" :aria-invalid="touched && (errors.summary || errors.payment)"></textarea>
        <p class="mt-1 text-right text-xs text-ink-soft tabular-nums">{{ form.summary.length }}/280</p>
      </div>

      <ChoiceChips v-model="form.levels" multiple legend="Niveaux visés" :options="levelOptions" />
      <ChoiceChips
        v-model="form.fields"
        multiple
        legend="Filières visées"
        :options="fields"
        class="[&_label]:min-h-9 [&_label]:px-3 [&_label]:py-1 [&_label]:text-sm"
      />

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="min-w-0">
          <label for="o-city" class="label">Lieu</label>
          <select id="o-city" v-model="form.city" class="field" :disabled="form.remote">
            <option v-for="c in cities.slice(0, -1)" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
          <label class="mt-3 flex items-center gap-2 text-sm font-semibold">
            <input v-model="form.remote" type="checkbox" class="h-5 w-5 accent-navy" />À distance, ouvert à tout le Sénégal
          </label>
        </div>
        <div class="min-w-0">
          <label for="o-deadline" class="label">Date limite</label>
          <input id="o-deadline" v-model="form.deadline" type="date" :min="today" class="field" :aria-invalid="touched && errors.deadline" />
        </div>
      </div>

      <div>
        <label for="o-conditions" class="label">Conditions (une par ligne)</label>
        <textarea id="o-conditions" v-model="form.conditions" rows="3" class="field" placeholder="Étudiant en L3 minimum&#10;Disponible 3 mois" :aria-invalid="touched && errors.payment"></textarea>
      </div>

      <!-- Refus des offres payantes -->
      <p v-if="flagged.length" class="flex items-start gap-3 rounded-card bg-orange-soft p-4 font-medium text-orange" role="alert">
        <ShieldAlert :size="22" class="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          Votre texte mentionne « {{ flagged.join(' », « ') }} ». Une offre qui demande de l'argent au candidat est refusée : retirez
          toute demande de paiement.
        </span>
      </p>

      <p v-else-if="suspect.length" class="rounded-control bg-paper-2 px-4 py-3 text-[0.9375rem]" role="status">
        Votre texte mentionne « {{ suspect.join(' », « ') }} ». S'il ne s'agit pas d'un paiement demandé au candidat, vous pouvez
        publier : notre équipe vérifiera ce point lors de la relecture.
      </p>

      <label class="flex items-start gap-3 border-t border-rule pt-6 text-sm">
        <input v-model="form.free" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 accent-navy" :aria-invalid="touched && errors.free" />
        <span class="font-semibold">Je confirme que cette opportunité est entièrement gratuite pour les candidats.</span>
      </label>

      <p v-if="touched && !valid && !flagged.length" class="rounded-control bg-orange-soft px-4 py-3 text-[0.9375rem] font-medium text-orange" role="alert">
        Il manque une information : intitulé (6 caractères), description (20 caractères), niveaux, filières, date limite et
        confirmation de gratuité.
      </p>

      <div class="flex flex-wrap items-center gap-x-8 gap-y-4">
        <BaseButton type="submit">Envoyer pour validation</BaseButton>
        <button type="button" class="font-semibold underline underline-offset-4" @click="router.back()">Annuler</button>
      </div>
    </div>

    <!-- Audience estimée -->
    <aside class="min-w-0 lg:col-span-4 lg:col-start-9">
      <div class="rounded-tile bg-navy-deep p-7 text-white shadow-lift lg:sticky lg:top-24">
        <p class="flex items-center gap-2 text-sm font-semibold"><Users :size="18" aria-hidden="true" />Profils correspondants</p>
        <p class="display mt-2 text-[3.4rem] leading-none tabular-nums" aria-live="polite">{{ shown.toLocaleString('fr-FR') }}</p>
        <p class="mt-2 text-sm text-white/75">
          <template v-if="audience">jeunes recevront votre offre dans leur fil, et une alerte s'ils l'ont demandé.</template>
          <template v-else>Choisissez au moins un niveau et une filière.</template>
        </p>
        <p class="mt-6 border-t border-white/25 pt-4 text-xs text-white/60">Estimation de maquette, calculée sur une base fictive.</p>
      </div>
    </aside>
  </form>
</template>
