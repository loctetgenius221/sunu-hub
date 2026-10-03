<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import IsoArt from '@/components/art/IsoArt.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { structureKinds } from '@/data/labels'
import { cities } from '@/data/questions'
import { useStructureStore } from '@/stores/structure'
import type { StructureKind } from '@/types'

// Compte structure (TDR S1) : e-mail professionnel ou NINEA, validation manuelle sous 48 h ouvrées.
const store = useStructureStore()
const router = useRouter()

const form = reactive({ name: '', kind: '' as StructureKind | '', city: '', contact: '', email: '', ninea: '', terms: false })
const touched = ref(false)

// Les messageries grand public ne prouvent pas l'appartenance à la structure.
const PUBLIC_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud)\./i
const proEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && !PUBLIC_MAIL.test(form.email))
const ninea = computed(() => /^\d{7,9}[A-Z0-9]{0,3}$/i.test(form.ninea.replace(/\s/g, '')))

const errors = computed(() => ({
  name: !form.name.trim(),
  kind: !form.kind,
  city: !form.city,
  contact: !form.contact.trim(),
  proof: !proEmail.value && !ninea.value,
  terms: !form.terms,
}))
const valid = computed(() => !Object.values(errors.value).some(Boolean))

function submit() {
  touched.value = true
  if (!valid.value || !form.kind) return
  store.createAccount({
    name: form.name.trim(),
    kind: form.kind,
    city: form.city,
    contact: form.contact.trim(),
    email: form.email.trim(),
    ninea: form.ninea.replace(/\s/g, ''),
  })
  router.push({ name: 'structure-dashboard' })
}
</script>

<template>
  <section class="grid-paper">
    <div class="wrap grid grid-cols-1 items-start gap-12 py-12 sm:py-16 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-7">
        <h1 class="display text-[clamp(2rem,3.6vw,3rem)] text-navy">Créer un compte structure</h1>
        <p class="mt-4 max-w-xl text-[1.1rem] text-ink-soft">
          Chaque compte est vérifié par notre équipe avant de pouvoir publier. C'est ce qui permet aux jeunes de faire confiance aux
          offres.
        </p>

        <form novalidate class="mt-10 border-2 border-ink bg-white p-6 shadow-[10px_10px_0_var(--color-navy)] sm:p-9" @submit.prevent="submit">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="min-w-0 sm:col-span-2">
              <label for="s-name" class="label">Nom de la structure</label>
              <input id="s-name" v-model="form.name" class="field" autocomplete="organization" :aria-invalid="touched && errors.name" />
            </div>
            <div class="min-w-0">
              <label for="s-kind" class="label">Type</label>
              <select id="s-kind" v-model="form.kind" class="field" :aria-invalid="touched && errors.kind">
                <option value="" disabled>Choisir</option>
                <option v-for="(label, k) in structureKinds" :key="k" :value="k">{{ label }}</option>
              </select>
            </div>
            <div class="min-w-0">
              <label for="s-city" class="label">Ville</label>
              <select id="s-city" v-model="form.city" class="field" :aria-invalid="touched && errors.city">
                <option value="" disabled>Choisir</option>
                <option v-for="c in cities" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>
            <div class="min-w-0 sm:col-span-2">
              <label for="s-contact" class="label">Nom et fonction du contact</label>
              <input id="s-contact" v-model="form.contact" class="field" placeholder="Ex. : Aminata Fall, responsable RH" :aria-invalid="touched && errors.contact" />
            </div>
          </div>

          <fieldset class="mt-8 border-t-2 border-ink pt-6">
            <legend class="pr-3 font-bold">Preuve d'appartenance (l'un ou l'autre)</legend>
            <div class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="min-w-0">
                <label for="s-email" class="label">E-mail professionnel</label>
                <input id="s-email" v-model="form.email" type="email" class="field" placeholder="prenom@structure.sn" :aria-invalid="touched && errors.proof" />
              </div>
              <div class="min-w-0">
                <label for="s-ninea" class="label">NINEA</label>
                <input id="s-ninea" v-model="form.ninea" class="field" inputmode="numeric" :aria-invalid="touched && errors.proof" />
              </div>
            </div>
            <p class="mt-2 text-sm" :class="touched && errors.proof ? 'font-semibold' : 'text-ink-soft'">
              Les adresses Gmail, Yahoo ou Outlook ne suffisent pas : utilisez l'adresse de la structure, ou son NINEA.
            </p>
          </fieldset>

          <label class="mt-7 flex items-start gap-3 text-sm">
            <input v-model="form.terms" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 accent-navy" :aria-invalid="touched && errors.terms" />
            <span>Je m'engage à ne publier que des offres gratuites pour les candidats et à ne contacter les jeunes qu'avec leur accord.</span>
          </label>

          <p v-if="touched && !valid" class="mt-5 border-l-4 border-orange pl-3 text-sm font-semibold" role="alert">
            Il manque une information. Vérifiez les champs signalés.
          </p>
          <div class="mt-8"><BaseButton type="submit">Envoyer ma demande</BaseButton></div>
        </form>
      </div>

      <aside class="min-w-0 lg:col-span-4 lg:col-start-9 lg:pt-28">
        <IsoArt kind="shield" :scale="1" />
        <ol class="mt-8 space-y-4 border-t-2 border-ink pt-5 text-sm">
          <li><span class="font-bold">1.</span> Vous envoyez la demande.</li>
          <li><span class="font-bold">2.</span> Nous vérifions l'e-mail ou le NINEA, sous 48 h ouvrées.</li>
          <li><span class="font-bold">3.</span> Vous publiez votre première offre.</li>
        </ol>
      </aside>
    </div>
  </section>
</template>
