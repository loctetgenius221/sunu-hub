<script setup lang="ts">
import { computed } from 'vue'
import { Printer, Share2 } from 'lucide-vue-next'
import SunuLogo from '@/components/brand/SunuLogo.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { schoolStatus } from '@/data/labels'
import { orientQuestions } from '@/data/orientQuestions'
import { accessLabels } from '@/services/orientation'
import { useOrientationStore } from '@/stores/orientation'
import { useProfileStore } from '@/stores/profile'

// Résumé d'une page pour la famille (TDR O7) : profil, pistes, coûts, risques.
const store = useOrientationStore()
const profile = useProfileStore()
const results = store.results!
const a = store.state.answers

const label = (id: string) => {
  const q = orientQuestions.find((x) => x.id === id)!
  const v = a[id]
  const values = Array.isArray(v) ? v : v ? [v] : []
  return values.map((x) => q.options.find((o) => o.value === x)?.label ?? x).join(', ') || '—'
}
const name = computed(() => profile.state.firstName || 'Votre enfant')
const fcfa = (r: [number, number] | null) => (r ? `${r[0].toLocaleString('fr-FR')} à ${r[1].toLocaleString('fr-FR')} FCFA / an` : 'Coût non communiqué')
const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const text = computed(() =>
  [
    `Pistes d'orientation de ${name.value} (SUNU HŪB, ${today}) :`,
    ...results.top.map((p, i) => `${i + 1}. ${p.program.name}, ${p.school.name}. ${fcfa(p.program.costRange)}. Chances : ${accessLabels[p.access].toLowerCase()}.`),
  ].join('\n'),
)
const whatsapp = computed(() => `https://wa.me/?text=${encodeURIComponent(text.value)}`)
const print = () => window.print()
</script>

<template>
  <div class="bg-paper-2 py-10 print:bg-white print:py-0">
    <div class="wrap flex max-w-[56rem] flex-wrap items-center justify-between gap-4 print:hidden">
      <TextLink :to="{ name: 'orient-results' }">Retour aux pistes</TextLink>
      <div class="flex flex-wrap gap-3 max-sm:w-full">
        <BaseButton :href="whatsapp" target="_blank" rel="noopener noreferrer" variant="light" class="shadow-soft"><Share2 :size="18" aria-hidden="true" />WhatsApp</BaseButton>
        <BaseButton @click="print"><Printer :size="18" aria-hidden="true" />Enregistrer en PDF</BaseButton>
      </div>
    </div>

    <article class="wrap mt-8 max-w-[56rem] rounded-tile bg-white p-7 sm:p-10 print:mt-0 print:border-0 print:p-0">
      <header class="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-5">
        <div class="min-w-0">
          <p class="text-sm text-ink-soft">Résumé d'orientation · {{ today }}</p>
          <h1 class="display mt-1 text-[2.2rem]">Les pistes de {{ name }}</h1>
        </div>
        <SunuLogo />
      </header>

      <section class="grid grid-cols-1 gap-x-8 gap-y-1.5 border-b border-rule py-5 text-sm sm:grid-cols-2">
        <p><span class="text-ink-soft">Série :</span> {{ label('serie') }} · <span class="text-ink-soft">mention visée :</span> {{ label('mention') }}</p>
        <p><span class="text-ink-soft">Budget annuel :</span> {{ label('budget') }}</p>
        <p><span class="text-ink-soft">Attiré par :</span> {{ label('interests') }}</p>
        <p><span class="text-ink-soft">Métiers envisagés :</span> {{ label('jobs') }}</p>
      </section>

      <section class="py-5">
        <h2 class="font-semibold text-navy">Les trois pistes recommandées</h2>
        <ol class="mt-3">
          <li v-for="(p, i) in results.top" :key="p.program.id" class="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-rule py-4 last:border-0">
            <span class="display text-[1.6rem] leading-none">{{ i + 1 }}</span>
            <div class="min-w-0 text-sm">
              <p class="text-base font-semibold">{{ p.program.name }}</p>
              <p>{{ p.school.name }}, {{ p.school.city }} · {{ schoolStatus[p.school.status].label }}{{ p.program.accredited ? ', formation accréditée' : '' }}{{ p.program.cames ? ', reconnue CAMES' : '' }}</p>
              <p class="mt-1"><span class="text-ink-soft">Coût :</span> {{ fcfa(p.program.costRange) }} · <span class="text-ink-soft">durée :</span> {{ p.program.durationYears }} ans · <span class="text-ink-soft">chances :</span> {{ accessLabels[p.access].toLowerCase() }}</p>
              <p class="mt-1"><span class="text-ink-soft">Débouchés (estimation) :</span> {{ p.outcomes.join(', ') }}</p>
              <p v-if="p.risks.length" class="mt-1 font-semibold">À surveiller : {{ p.risks.join(' ; ').toLowerCase() }}.</p>
            </div>
          </li>
        </ol>
      </section>

      <footer class="border-t border-rule pt-4 text-xs text-ink-soft">
        Ces recommandations s'appuient sur les réponses de {{ name }} et sur des informations vérifiées (source et date sur chaque fiche).
        Elles ne garantissent ni une admission ni un emploi. Les vœux publics se saisissent par le bachelier lui-même sur Campusen.
        <template v-if="a.family === 'forte'"> Votre avis compte : parlez-en ensemble, un conseiller peut vous accompagner gratuitement.</template>
      </footer>
    </article>
  </div>
</template>
