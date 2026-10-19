<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BadgeCheck, BellRing, ExternalLink, Flag, MapPin, ThumbsDown, ThumbsUp } from 'lucide-vue-next'
import ApplicationTracker from '@/components/opportunity/ApplicationTracker.vue'
import ReportDialog from '@/components/opportunity/ReportDialog.vue'
import SaveButton from '@/components/opportunity/SaveButton.vue'
import VerificationBadge from '@/components/opportunity/VerificationBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDate, opportunityTypes, verification } from '@/data/labels'
import { REPORT_LIMIT, getOpportunity, reportOpportunity, sendFeedback } from '@/services/api'
import { daysLeft, reminders, scoreOpportunity } from '@/services/matching'
import { useToast } from '@/composables/useToast'
import { useActivityStore } from '@/stores/activity'
import { useProfileStore } from '@/stores/profile'

// Fiche d'opportunité (TDR Q2) : source et date toujours visibles, lien vers l'annonce d'origine.
type Detail = NonNullable<Awaited<ReturnType<typeof getOpportunity>>>

const route = useRoute()
const profile = useProfileStore()
const activity = useActivityStore()
const { show } = useToast()

const item = ref<Detail | null | undefined>(undefined)
onMounted(async () => (item.value = await getOpportunity(String(route.params.id))))

const scored = computed(() => (item.value && profile.profile ? scoreOpportunity(item.value, item.value.structure, profile.profile) : null))
const left = computed(() => (item.value ? daysLeft(item.value.deadline) : 0))
const fullDate = computed(() =>
  item.value ? new Date(item.value.deadline).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '',
)

const feedback = computed(() => (item.value ? activity.state.feedback[item.value.id] : undefined))
async function rate(useful: boolean) {
  if (!item.value) return
  activity.state.feedback[item.value.id] = useful
  await sendFeedback(item.value.id, useful)
  show('Merci, ton avis améliore tes recommandations.')
}

const reporting = ref(false)
const reported = computed(() => !!item.value && activity.state.reported.includes(item.value.id))
async function report(reason: string) {
  if (!item.value) return
  reporting.value = false
  activity.state.reported.push(item.value.id)
  const count = await reportOpportunity(item.value.id, reason)
  if (count >= REPORT_LIMIT) item.value.hidden = true
  show(count >= REPORT_LIMIT ? 'Merci. L’offre est masquée en attendant sa vérification.' : 'Merci. Notre équipe va vérifier cette offre.')
}
</script>

<template>
  <div v-if="item === undefined" class="wrap py-20" aria-busy="true">
    <div class="h-64 animate-pulse rounded-tile bg-paper-2"></div>
  </div>

  <section v-else-if="item === null" class="wrap py-20">
    <h1 class="h2">Offre introuvable</h1>
    <p class="mt-4 text-ink-soft">Elle a peut-être été retirée ou sa date limite est passée.</p>
    <BaseButton to="/opportunites" variant="secondary" class="mt-8">Voir les opportunités</BaseButton>
  </section>

  <template v-else>
    <section class="bg-white">
      <div class="wrap py-10 sm:py-14">
        <nav aria-label="Fil d'Ariane" class="text-sm">
          <RouterLink to="/opportunites" class="font-medium text-navy hover:underline">Opportunités</RouterLink>
          <span class="mx-2 text-ink-soft">/</span><span class="text-ink-soft">{{ opportunityTypes[item.type] }}</span>
        </nav>

        <p v-if="item.hidden" class="mt-6 rounded-control bg-orange-soft px-4 py-3 font-medium text-orange" role="alert">
          Cette offre est masquée : elle a été signalée et attend une vérification.
        </p>

        <div class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div class="min-w-0 lg:col-span-8">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[0.9375rem] font-semibold text-navy">{{ opportunityTypes[item.type] }}</span>
              <VerificationBadge :status="item.status" />
            </div>
            <h1 class="display mt-3 text-[clamp(2.25rem,4.4vw,3.75rem)] text-balance">{{ item.title }}</h1>
            <p class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-soft">
              <span class="flex items-center gap-1.5 font-medium text-ink">
                {{ item.structure.name }}
                <BadgeCheck v-if="item.structure.verified" :size="18" class="text-navy" aria-label="Structure vérifiée" />
              </span>
              <span class="flex items-center gap-1.5"><MapPin :size="16" aria-hidden="true" />{{ item.city }}{{ item.remote ? ' · à distance possible' : '' }}</span>
            </p>
          </div>

          <!-- Date limite -->
          <div class="min-w-0 lg:col-span-4">
            <div class="rounded-tile p-6" :class="left <= 7 ? 'bg-orange-soft text-orange' : 'bg-paper-2'">
              <p class="text-[0.9375rem] font-medium">Date limite</p>
              <p class="display mt-1 text-[2.75rem] leading-none tabular-nums">{{ left === 0 ? "Aujourd'hui" : `J-${left}` }}</p>
              <p class="mt-2 first-letter:uppercase" :class="left > 7 && 'text-ink-soft'">{{ fullDate }}</p>
            </div>
          </div>
        </div>

        <!-- Mobile : l'action principale tout de suite, sans faire défiler la fiche -->
        <div class="mt-6 flex gap-2 lg:hidden">
          <BaseButton :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" class="flex-1">Candidater</BaseButton>
          <SaveButton :id="item.id" :title="item.title" />
        </div>
      </div>
    </section>

    <div class="bg-paper-2">
    <div class="wrap grid grid-cols-1 gap-8 py-12 lg:grid-cols-12 lg:py-16">
      <div class="min-w-0 space-y-6 lg:col-span-7">
        <section aria-labelledby="h-resume" class="rounded-tile bg-white p-7 shadow-soft sm:p-9">
          <h2 id="h-resume" class="text-[1.375rem] font-semibold tracking-[-0.02em]">En bref</h2>
          <p class="mt-3 text-[1.1875rem] leading-relaxed">{{ item.summary }}</p>
        </section>

        <section aria-labelledby="h-conditions" class="rounded-tile bg-white p-7 shadow-soft sm:p-9">
          <h2 id="h-conditions" class="text-[1.375rem] font-semibold tracking-[-0.02em]">Conditions</h2>
          <ul class="mt-2 divide-y divide-rule">
            <li v-for="c in item.conditions" :key="c" class="py-3.5">{{ c }}</li>
            <li class="flex items-center gap-2 py-3.5 font-medium text-green">
              <BadgeCheck :size="18" aria-hidden="true" />
              Gratuit pour le candidat
            </li>
          </ul>
          <p class="mt-3 text-sm text-ink-soft">Si on te demande de l'argent pour candidater, c'est une arnaque : signale l'offre.</p>
        </section>

        <section aria-labelledby="h-candidature" class="rounded-tile bg-white p-7 shadow-soft sm:p-9">
          <h2 id="h-candidature" class="text-[1.375rem] font-semibold tracking-[-0.02em]">Ma candidature</h2>
          <p class="mt-2 mb-5 text-ink-soft">Tu candidates sur le site de la structure. Ensuite, indique ici où tu en es.</p>
          <ApplicationTracker :id="item.id" />
        </section>

        <!-- Source (obligatoire) -->
        <section aria-labelledby="h-source" class="px-2">
          <h2 id="h-source" class="text-[0.9375rem] font-semibold">Source</h2>
          <p class="mt-2 text-sm">
            {{ item.sourceName }}, collectée le {{ formatDate(item.collectedAt) }}. {{ verification[item.status].hint }}.
          </p>
          <a :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-navy hover:underline">
            Voir l'annonce d'origine<ExternalLink :size="14" aria-hidden="true" />
          </a>
        </section>
      </div>

      <!-- Actions -->
      <aside class="min-w-0 lg:col-span-4 lg:col-start-9">
        <div class="space-y-6 lg:sticky lg:top-24">
          <div class="rounded-tile bg-white p-6 shadow-soft">
            <BaseButton :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" block>Candidater</BaseButton>
            <SaveButton :id="item.id" :title="item.title" class="mt-3 w-full justify-center" />
            <p v-if="activity.isSaved(item.id) && reminders(item.deadline).length" class="mt-3 flex items-start gap-2 text-sm text-ink-soft">
              <BellRing :size="16" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
              Rappel le {{ reminders(item.deadline).map((r) => formatDate(r.date)).join(' et le ') }}.
            </p>
          </div>

          <div v-if="scored" class="rounded-tile bg-white p-6 shadow-soft">
            <p class="flex items-baseline justify-between font-medium">
              Pertinence pour toi <span class="text-[2rem] font-semibold tracking-[-0.03em] text-navy tabular-nums">{{ scored.score }}<span class="text-[1rem] text-ink-soft"> / 100</span></span>
            </p>
            <p v-if="scored.reasons.length" class="mt-2 text-sm text-ink-soft">Pourquoi : {{ scored.reasons.join(', ') }}.</p>

            <div class="mt-5 border-t border-rule pt-5">
              <p class="text-[0.9375rem] font-medium">Cette offre te correspond-elle&nbsp;?</p>
              <div class="mt-3 flex gap-2">
                <button
                  v-for="opt in [{ v: true, label: 'Oui', icon: ThumbsUp }, { v: false, label: 'Pas vraiment', icon: ThumbsDown }]"
                  :key="opt.label"
                  type="button"
                  class="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-3 text-[0.9375rem] font-medium transition-colors"
                  :class="feedback === opt.v ? 'bg-navy text-white' : 'bg-paper-2 hover:bg-[#e8e8ed]'"
                  :aria-pressed="feedback === opt.v"
                  @click="rate(opt.v)"
                >
                  <component :is="opt.icon" :size="16" aria-hidden="true" />{{ opt.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="px-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-orange disabled:hover:text-ink-soft"
              :disabled="reported"
              @click="reporting = true"
            >
              <Flag :size="16" aria-hidden="true" />{{ reported ? 'Offre signalée' : 'Signaler cette offre' }}
            </button>
          </div>
        </div>
      </aside>
    </div>
    </div>

    <ReportDialog v-model="reporting" @submit="report" />
  </template>
</template>
