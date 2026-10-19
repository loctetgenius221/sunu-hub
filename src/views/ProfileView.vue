<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BadgeCheck, Download, FileText, Trash2 } from 'lucide-vue-next'
import OpportunityCard from '@/components/opportunity/OpportunityCard.vue'
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
  <div class="bg-paper-2">
    <section class="wrap flex flex-wrap items-center gap-6 pt-12 pb-10 sm:pt-16">
      <span class="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-navy text-[2rem] font-semibold text-white" aria-hidden="true">
        {{ store.state.firstName.charAt(0).toUpperCase() }}
      </span>
      <div class="min-w-0">
        <p v-if="welcome" class="mb-2 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[0.8125rem] font-semibold text-green">
          <BadgeCheck :size="14" aria-hidden="true" />Ton profil est créé
        </p>
        <h1 class="display text-[clamp(2.25rem,4.4vw,3.5rem)]">Bonjour {{ store.state.firstName }}.</h1>
        <p class="lead mt-2">Voici ce qui te correspond aujourd'hui. Plus ton profil est complet, plus ton fil est précis.</p>
      </div>
    </section>

    <div class="wrap grid grid-cols-1 gap-10 pb-20 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
      <!-- Colonne latérale -->
      <aside class="min-w-0">
        <div class="rounded-tile bg-white p-6 shadow-soft lg:sticky lg:top-24">
          <ProfileGauge />
          <nav aria-label="Sections du profil" class="mt-6 hidden border-t border-rule pt-4 lg:block">
            <ul>
              <li v-for="s in sections" :key="s.id">
                <a :href="`#${s.id}`" class="block rounded-lg px-3 py-2 text-[0.9375rem] text-ink/80 transition-colors hover:bg-paper-2 hover:text-ink">{{ s.label }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <div class="min-w-0 space-y-14">
        <section id="fil" aria-labelledby="h-fil" class="scroll-mt-24">
          <div class="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="h-fil" class="text-[1.75rem] font-semibold tracking-[-0.025em]">Mon fil</h2>
            <TextLink to="/opportunites">Tout voir</TextLink>
          </div>
          <ul class="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <li v-for="o in feed" :key="o.id" class="min-w-0"><OpportunityCard :item="o" /></li>
          </ul>
        </section>

        <section id="parcours" aria-labelledby="h-parcours" class="scroll-mt-24">
          <div class="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="h-parcours" class="text-[1.75rem] font-semibold tracking-[-0.025em]">Mon parcours</h2>
            <TextLink :to="{ name: 'signup', query: { etape: 'questions' } }">Modifier mes réponses</TextLink>
          </div>
          <dl class="mt-5 divide-y divide-rule rounded-tile bg-white px-6 shadow-soft">
            <div v-for="q in questions" :key="q.id" class="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
              <dt class="text-[0.9375rem] text-ink-soft">{{ q.title(store.state.answers) }}</dt>
              <dd class="font-medium sm:text-right">{{ labelOf(q, store.state.answers) }}</dd>
            </div>
          </dl>
        </section>

        <section id="completer" aria-labelledby="h-completer" class="scroll-mt-24">
          <h2 id="h-completer" class="text-[1.75rem] font-semibold tracking-[-0.025em]">Compléter mon profil</h2>
          <div class="mt-5 rounded-tile bg-white p-6 shadow-soft sm:p-8"><ProfileExtras /></div>
        </section>

        <section id="alertes" aria-labelledby="h-alertes" class="scroll-mt-24">
          <h2 id="h-alertes" class="text-[1.75rem] font-semibold tracking-[-0.025em]">Mes alertes</h2>
          <div class="mt-5 rounded-tile bg-white p-6 shadow-soft sm:p-8"><AlertPrefs /></div>
        </section>

        <section id="cv" aria-labelledby="h-cv" class="scroll-mt-24">
          <h2 id="h-cv" class="text-[1.75rem] font-semibold tracking-[-0.025em]">Mon CV</h2>
          <div class="mt-5 rounded-tile bg-white p-6 shadow-soft sm:p-8">
            <p class="max-w-xl text-ink-soft">Ton CV se remplit tout seul à partir de ton profil. Ouvre-le pour l'enregistrer en PDF.</p>
            <div class="mt-6 flex flex-wrap items-center gap-x-8 gap-y-5">
              <BaseButton :to="{ name: 'cv' }" variant="secondary"><FileText :size="18" aria-hidden="true" />Voir mon CV</BaseButton>
              <label class="flex cursor-pointer items-center gap-3 font-medium">
                <input v-model="store.state.publicCv" type="checkbox" class="peer sr-only" />
                <span class="relative h-7 w-12 rounded-full bg-[#e3e3e8] transition-colors peer-checked:bg-green peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy after:absolute after:top-0.5 after:left-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" aria-hidden="true"></span>
                Partager mon CV par un lien
              </label>
            </div>
            <p v-if="store.state.publicCv" class="mt-5 max-w-full rounded-control bg-paper-2 px-4 py-3 text-[0.9375rem] break-all">
              {{ publicLink }} <span class="text-ink-soft">(maquette)</span>
            </p>
          </div>
        </section>

        <section id="donnees" aria-labelledby="h-donnees" class="scroll-mt-24">
          <h2 id="h-donnees" class="text-[1.75rem] font-semibold tracking-[-0.025em]">Mes données</h2>
          <div class="mt-5 rounded-tile bg-white p-6 shadow-soft sm:p-8">
            <p class="max-w-xl text-ink-soft">
              Consentement donné le {{ new Date(store.state.consent?.acceptedAt ?? '').toLocaleDateString('fr-FR') }}<template
                v-if="store.state.consent?.guardian"
              >, avec l'accord de {{ store.state.consent.guardian.name }}</template>.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <BaseButton variant="secondary" @click="exportData"><Download :size="18" aria-hidden="true" />Exporter mes données</BaseButton>
              <button type="button" class="inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-medium text-orange transition-colors hover:bg-orange-soft" @click="deleteAccount">
                <Trash2 :size="18" aria-hidden="true" />Supprimer mon compte
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
