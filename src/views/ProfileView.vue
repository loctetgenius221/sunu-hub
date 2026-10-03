<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, FileText, Trash2 } from 'lucide-vue-next'
import IsoArt from '@/components/art/IsoArt.vue'
import OpportunityTicket from '@/components/opportunity/OpportunityTicket.vue'
import AlertPrefs from '@/components/profile/AlertPrefs.vue'
import ProfileExtras from '@/components/profile/ProfileExtras.vue'
import ProfileGauge from '@/components/profile/ProfileGauge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TextLink from '@/components/ui/TextLink.vue'
import { labelOf, questions } from '@/data/questions'
import { getFeed } from '@/services/api'
import { useActivityStore } from '@/stores/activity'
import { useOrientationStore } from '@/stores/orientation'
import { useProfileStore } from '@/stores/profile'
import type { ScoredOpportunity } from '@/types'

// Espace du jeune : premier contenu utile dès la fin du questionnaire, puis réglages du profil.
const store = useProfileStore()
const activity = useActivityStore()
const orientation = useOrientationStore()
const route = useRoute()
const router = useRouter()
const welcome = route.query.bienvenue === '1'

const feed = ref<ScoredOpportunity[]>([])
onMounted(async () => {
  if (store.profile) feed.value = (await getFeed(store.profile)).slice(0, 3)
})

const sections = [
  { id: 'fil', label: 'Mon fil' },
  { id: 'parcours', label: 'Mon parcours' },
  { id: 'completer', label: 'Compléter mon profil' },
  { id: 'alertes', label: 'Mes alertes' },
  { id: 'cv', label: 'Mon CV' },
  { id: 'donnees', label: 'Mes données' },
]

const publicLink = `${location.origin}/cv/${store.state.phone.slice(-4)}`

function exportData() {
  const url = URL.createObjectURL(new Blob([store.exportData()], { type: 'application/json' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'mes-donnees-sunu-hub.json' })
  a.click()
  URL.revokeObjectURL(url)
}

function deleteAccount() {
  if (!confirm('Supprimer ton compte et toutes tes données ? Cette action est définitive.')) return
  store.reset()
  activity.reset()
  orientation.reset()
  router.push('/')
}
</script>

<template>
  <section class="grid-paper border-b-2 border-ink">
    <div class="wrap grid grid-cols-1 items-end gap-8 py-12 sm:py-16 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-8">
        <p v-if="welcome" class="inline-block border-2 border-ink bg-green px-3 py-1 text-sm font-bold">Ton profil est créé</p>
        <h1 class="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)] text-navy">Bonjour {{ store.state.firstName }}.</h1>
        <p class="mt-4 max-w-xl text-[1.15rem] text-ink-soft">
          Voici ce qui te correspond aujourd'hui. Plus ton profil est complet, plus ton fil est précis.
        </p>
      </div>
      <div class="hidden justify-end lg:col-span-4 lg:flex">
        <IsoArt kind="steps" live :scale="1" />
      </div>
    </div>
  </section>

  <div class="wrap grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:py-16">
    <!-- Colonne latérale -->
    <aside class="min-w-0 lg:col-span-4">
      <div class="border-2 border-ink bg-white p-6 shadow-[8px_8px_0_var(--color-orange)] lg:sticky lg:top-24">
        <ProfileGauge />
        <nav aria-label="Sections du profil" class="mt-7 hidden border-t-2 border-ink pt-4 lg:block">
          <ul class="space-y-1">
            <li v-for="s in sections" :key="s.id">
              <a :href="`#${s.id}`" class="block py-1.5 font-semibold hover:text-navy hover:underline">{{ s.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <div class="min-w-0 space-y-16 lg:col-span-8">
      <section id="fil" aria-labelledby="h-fil" class="scroll-mt-24">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <h2 id="h-fil" class="h2">Mon fil</h2>
          <TextLink to="/opportunites">Tout voir</TextLink>
        </div>
        <ul class="mt-7 grid grid-cols-1 gap-6">
          <li v-for="o in feed" :key="o.id"><OpportunityTicket :item="o" notch="var(--color-paper)" /></li>
        </ul>
      </section>

      <section id="parcours" aria-labelledby="h-parcours" class="scroll-mt-24">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <h2 id="h-parcours" class="h2">Mon parcours</h2>
          <TextLink :to="{ name: 'signup', query: { etape: 'questions' } }">Modifier mes réponses</TextLink>
        </div>
        <dl class="mt-2">
          <div v-for="q in questions" :key="q.id" class="grid grid-cols-1 gap-1 border-b border-rule py-4 sm:grid-cols-[14rem_minmax(0,1fr)]">
            <dt class="text-sm text-ink-soft">{{ q.title(store.state.answers) }}</dt>
            <dd class="font-semibold">{{ labelOf(q, store.state.answers) }}</dd>
          </div>
        </dl>
      </section>

      <section id="completer" aria-labelledby="h-completer" class="scroll-mt-24">
        <h2 id="h-completer" class="h2 border-b-2 border-ink pb-4">Compléter mon profil</h2>
        <div class="mt-7"><ProfileExtras /></div>
      </section>

      <section id="alertes" aria-labelledby="h-alertes" class="scroll-mt-24">
        <h2 id="h-alertes" class="h2 border-b-2 border-ink pb-4">Mes alertes</h2>
        <div class="mt-7"><AlertPrefs /></div>
      </section>

      <section id="cv" aria-labelledby="h-cv" class="scroll-mt-24">
        <h2 id="h-cv" class="h2 border-b-2 border-ink pb-4">Mon CV</h2>
        <p class="mt-6 max-w-xl text-ink-soft">Ton CV est généré à partir de ton profil. Tu peux l'enregistrer en PDF depuis l'aperçu.</p>
        <div class="mt-6 flex flex-wrap items-center gap-x-8 gap-y-5">
          <BaseButton :to="{ name: 'cv' }" variant="secondary"><FileText :size="18" aria-hidden="true" />Voir mon CV</BaseButton>
          <label class="flex items-center gap-3 font-semibold">
            <input v-model="store.state.publicCv" type="checkbox" class="h-5 w-5 accent-navy" />
            Lien public activé
          </label>
        </div>
        <p v-if="store.state.publicCv" class="mt-4 max-w-full border-2 border-dashed border-ink bg-paper-2 px-4 py-3 text-sm break-all">
          {{ publicLink }} <span class="text-ink-soft">(maquette)</span>
        </p>
      </section>

      <section id="donnees" aria-labelledby="h-donnees" class="scroll-mt-24">
        <h2 id="h-donnees" class="h2 border-b-2 border-ink pb-4">Mes données</h2>
        <p class="mt-6 max-w-xl text-ink-soft">
          Consentement donné le {{ new Date(store.state.consent?.acceptedAt ?? '').toLocaleDateString('fr-FR') }}<template
            v-if="store.state.consent?.guardian"
          >, avec l'accord de {{ store.state.consent.guardian.name }}</template>.
        </p>
        <div class="mt-6 flex flex-wrap gap-4">
          <button type="button" class="inline-flex min-h-11 items-center gap-2 border-2 border-ink bg-white px-5 font-semibold hover:bg-paper-2" @click="exportData">
            <Download :size="18" aria-hidden="true" />Exporter mes données
          </button>
          <button type="button" class="inline-flex min-h-11 items-center gap-2 border-2 border-dashed border-ink px-5 font-semibold hover:bg-orange" @click="deleteAccount">
            <Trash2 :size="18" aria-hidden="true" />Supprimer mon compte
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
