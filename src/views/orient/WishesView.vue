<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown, ArrowUp, Printer, Share2, X } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { schools } from '@/data/schools'
import { CAMPUSEN_MAX, useOrientationStore } from '@/stores/orientation'

// Liste de vœux classée pour Campusen (TDR O5) : ordre explicite, plan B, export.
// Aucun dépôt à la place du jeune : il saisit lui-même sa liste sur Campusen.
const store = useOrientationStore()

const items = computed(() =>
  store.state.wishes.flatMap((id) => {
    const school = schools.find((s) => s.programs.some((p) => p.id === id))
    const program = school?.programs.find((p) => p.id === id)
    return school && program ? [{ id, school, program, campusen: school.status === 'public', planB: store.state.planB.includes(id) }] : []
  }),
)
const campusen = computed(() => items.value.filter((i) => i.campusen))
const direct = computed(() => items.value.filter((i) => !i.campusen))

const shareText = computed(() =>
  [
    'Ma liste de vœux (préparée avec SUNU HŪB) :',
    ...campusen.value.map((w, i) => `${i + 1}. ${w.program.name}, ${w.school.name}${w.planB ? ' (plan B)' : ''}`),
    ...(direct.value.length ? ['Écoles privées (inscription directe) :', ...direct.value.map((w) => `- ${w.program.name}, ${w.school.name}`)] : []),
  ].join('\n'),
)
const whatsapp = computed(() => `https://wa.me/?text=${encodeURIComponent(shareText.value)}`)
const print = () => window.print()
</script>

<template>
  <section class="grid-paper border-b-2 border-ink print:border-0 print:bg-none">
    <div class="wrap flex flex-wrap items-end justify-between gap-6 py-12 sm:py-14 print:py-4">
      <div class="min-w-0">
        <h1 class="display text-[clamp(2.2rem,4vw,3.4rem)] text-navy">Ma liste de vœux</h1>
        <p class="mt-3 max-w-xl text-[1.1rem] text-ink-soft">L'ordre compte : place en premier la formation que tu veux le plus.</p>
      </div>
      <div class="flex flex-wrap gap-3 print:hidden">
        <BaseButton :href="whatsapp" target="_blank" rel="noopener noreferrer" variant="secondary" :class="!items.length && 'pointer-events-none opacity-50'">
          <Share2 :size="18" aria-hidden="true" />WhatsApp
        </BaseButton>
        <BaseButton variant="secondary" :disabled="!items.length" @click="print"><Printer :size="18" aria-hidden="true" />PDF</BaseButton>
      </div>
    </div>
  </section>

  <div class="wrap grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:py-16 print:py-4">
    <div class="min-w-0 lg:col-span-8">
      <p v-if="!items.length" class="border-2 border-dashed border-ink p-6">
        Ta liste est vide. Ajoute des formations depuis <TextLink :to="{ name: 'orient-results' }">tes pistes</TextLink>.
      </p>

      <section v-if="campusen.length" aria-labelledby="h-campusen">
        <div class="flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
          <h2 id="h-campusen" class="text-lg font-bold">À saisir sur Campusen</h2>
          <span class="text-sm font-semibold tabular-nums">{{ campusen.length }}/{{ CAMPUSEN_MAX }}</span>
        </div>
        <ol>
          <li v-for="(w, i) in campusen" :key="w.id" class="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 border-b border-rule py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
            <span class="display text-[1.7rem] leading-none text-navy tabular-nums">{{ i + 1 }}</span>
            <div class="min-w-0">
              <p class="font-semibold">{{ w.program.name }}</p>
              <p class="text-sm text-ink-soft">{{ w.school.name }} · {{ w.school.city }}</p>
              <span v-if="w.planB" class="mt-1 inline-block border-2 border-ink bg-mint px-2 py-0.5 text-xs font-bold">Plan B</span>
            </div>
            <div class="col-start-2 flex flex-wrap items-center gap-1.5 sm:col-start-auto print:hidden">
              <button type="button" class="grid h-11 w-11 place-items-center border-2 border-ink bg-white disabled:opacity-30" :disabled="i === 0" @click="store.swapWishes(w.id, campusen[i - 1]!.id)">
                <ArrowUp :size="16" aria-hidden="true" /><span class="sr-only">Monter {{ w.program.name }}</span>
              </button>
              <button type="button" class="grid h-11 w-11 place-items-center border-2 border-ink bg-white disabled:opacity-30" :disabled="i === campusen.length - 1" @click="store.swapWishes(w.id, campusen[i + 1]!.id)">
                <ArrowDown :size="16" aria-hidden="true" /><span class="sr-only">Descendre {{ w.program.name }}</span>
              </button>
              <button type="button" class="min-h-11 border-2 border-ink px-3 text-sm font-semibold" :class="w.planB ? 'bg-mint' : 'bg-white'" :aria-pressed="w.planB" @click="store.togglePlanB(w.id)">
                Plan B
              </button>
              <button type="button" class="grid h-11 w-11 place-items-center border-2 border-dashed border-ink bg-white" @click="store.removeWish(w.id)">
                <X :size="16" aria-hidden="true" /><span class="sr-only">Retirer {{ w.program.name }}</span>
              </button>
            </div>
          </li>
        </ol>
      </section>

      <section v-if="direct.length" aria-labelledby="h-direct" class="mt-12">
        <h2 id="h-direct" class="border-b-2 border-ink pb-3 text-lg font-bold">Écoles privées : inscription directe</h2>
        <ul>
          <li v-for="w in direct" :key="w.id" class="flex items-center justify-between gap-4 border-b border-rule py-4">
            <div class="min-w-0">
              <p class="font-semibold">{{ w.program.name }}</p>
              <p class="text-sm text-ink-soft">{{ w.school.name }} · {{ w.program.accredited ? 'formation accréditée' : 'formation non accréditée' }}</p>
            </div>
            <button type="button" class="grid h-11 w-11 shrink-0 place-items-center border-2 border-dashed border-ink bg-white print:hidden" @click="store.removeWish(w.id)">
              <X :size="16" aria-hidden="true" /><span class="sr-only">Retirer {{ w.program.name }}</span>
            </button>
          </li>
        </ul>
      </section>
    </div>

    <aside class="min-w-0 lg:col-span-4">
      <div class="border-2 border-ink bg-white p-6 shadow-[8px_8px_0_var(--color-orange)] lg:sticky lg:top-24">
        <h2 class="display text-[1.5rem] text-navy">À retenir</h2>
        <ul class="mt-4 space-y-3 text-sm">
          <li>Campusen accepte jusqu'à {{ CAMPUSEN_MAX }} choix, dans un ordre obligatoire.</li>
          <li>En 2026, la plateforme était ouverte du 17 août au 13 septembre. Les dates 2027 seront publiées par le ministère.</li>
          <li>Mets au moins un <span class="font-bold">plan B</span> accessible : une formation moins sélective dans un domaine proche.</li>
          <li class="border-t-2 border-ink pt-3 font-bold">Tu saisis toi-même ta liste sur Campusen. Personne ne doit le faire à ta place.</li>
        </ul>
      </div>
    </aside>
  </div>
</template>
