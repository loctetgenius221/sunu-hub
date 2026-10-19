<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Award, FileText, Globe, ShieldCheck } from 'lucide-vue-next'
import SchoolSearch from '@/components/school/SchoolSearch.vue'
import AccentBar from '@/components/brand/AccentBar.vue'
import WaxBand from '@/components/brand/WaxBand.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import { cities } from '@/data/questions'
import { officialStatuses, reflexes } from '@/data/schoolGuide'
import { useToast } from '@/composables/useToast'
import { requestSchoolCheck } from '@/services/api'

// Vérificateur d'école (TDR O1) : recherche, explication des statuts, demande de vérification.
const icons = { file: FileText, shield: ShieldCheck, award: Award, globe: Globe }
const route = useRoute()
const router = useRouter()
const { show } = useToast()

const initial = typeof route.query.q === 'string' ? route.query.q : ''
const syncQuery = (q: string) => router.replace({ query: q.trim() ? { q } : {}, hash: route.hash })

const request = reactive({ name: typeof route.query.demande === 'string' ? route.query.demande : '', city: '' })
const sending = ref(false)
const sent = ref(false)

function prefill(q: string) {
  request.name = q
  document.getElementById('demande')?.scrollIntoView({ behavior: 'smooth' })
}

async function submitRequest() {
  if (!request.name.trim()) return
  sending.value = true
  await requestSchoolCheck(request.name, request.city)
  sending.value = false
  sent.value = true
  show('Demande envoyée : notre équipe vérifie cet établissement.')
}
</script>

<template>
  <!-- Recherche, posée sur une photo de diplômés -->
  <section class="bg-white pb-16">
    <div class="relative overflow-hidden bg-navy-deep">
      <div v-parallax="40" class="absolute inset-x-0 -inset-y-12">
        <ResponsiveImage name="ecoles" sizes="100vw" eager />
      </div>
      <div class="absolute inset-0 bg-linear-to-b from-[#071e44]/85 via-[#071e44]/60 to-[#071e44]/85" aria-hidden="true"></div>
      <WaxBand class="absolute inset-x-0 bottom-0" />
      <div v-reveal.once.stagger="{ distance: 20 }" class="relative mx-auto max-w-3xl px-6 pt-16 pb-24 text-center text-white sm:pt-24 sm:pb-32">
        <AccentBar center class="mb-6" />
        <h1 class="display text-[clamp(2.5rem,5.5vw,4.5rem)]">Vérifier une école</h1>
        <p class="mx-auto mt-4 max-w-xl text-[clamp(1.0625rem,1.5vw,1.25rem)] text-white/85">
          Avant de payer une inscription, vérifie que l'établissement est habilité et que ta formation est accréditée. Gratuit et
          sans inscription.
        </p>
      </div>
    </div>
    <div class="wrap relative -mt-10 max-w-3xl">
      <SchoolSearch :initial="initial" @query="syncQuery" @missing="prefill" />
    </div>
  </section>

  <!-- Les statuts -->
  <section aria-labelledby="statuts" class="section bg-paper-2">
    <div class="wrap">
      <h2 id="statuts" class="h2 max-w-2xl">Quatre mots à ne pas confondre.</h2>
      <p class="lead mt-5 max-w-2xl">Sur chaque fiche, nous affichons ces statuts séparément, avec leur source et la date de vérification.</p>
      <ul class="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="s in officialStatuses" :key="s.term" class="min-w-0">
          <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy shadow-soft" aria-hidden="true">
            <component :is="icons[s.icon]" :size="22" />
          </span>
          <h3 class="mt-5 text-[1.375rem] font-semibold tracking-[-0.02em]">{{ s.term }}</h3>
          <p class="mt-1 text-[0.875rem] font-medium text-navy">{{ s.who }}</p>
          <p class="mt-3 text-ink-soft">{{ s.meaning }}</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- Réflexes + demande -->
  <section class="section bg-white">
    <div class="wrap grid grid-cols-1 gap-14 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h2 class="h2">Avant de payer, quatre réflexes.</h2>
        <ol class="mt-10 divide-y divide-rule">
          <li v-for="(r, i) in reflexes" :key="r" class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 py-5 first:pt-0">
            <span class="text-[1.375rem] leading-none font-semibold text-navy tabular-nums">{{ i + 1 }}</span>
            <p class="text-[1.0625rem]">{{ r }}</p>
          </li>
        </ol>
      </div>

      <div id="demande" class="min-w-0 scroll-mt-24 lg:col-span-5 lg:col-start-8">
        <div class="rounded-tile bg-paper-2 p-7 sm:p-9">
          <h2 class="text-[1.75rem] font-semibold tracking-[-0.025em]">Ton école n'est pas dans la liste&nbsp;?</h2>
          <p class="mt-3 text-ink-soft">Indique-la : notre équipe cherche sa décision officielle et publie la fiche avec sa source.</p>
          <form v-if="!sent" class="mt-6 space-y-5" @submit.prevent="submitRequest">
            <div>
              <label for="r-name" class="label">Nom de l'établissement</label>
              <input id="r-name" v-model="request.name" required class="field" />
            </div>
            <div>
              <label for="r-city" class="label">Ville</label>
              <select id="r-city" v-model="request.city" class="field">
                <option value="">Je ne sais pas</option>
                <option v-for="c in cities" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>
            <BaseButton type="submit" :disabled="sending || !request.name.trim()">{{ sending ? 'Envoi…' : 'Demander une vérification' }}</BaseButton>
          </form>
          <p v-else class="mt-6 rounded-control bg-mint px-4 py-3 font-medium text-green" role="status">
            Merci. Nous vérifions « {{ request.name }} » et publierons sa fiche dès que nous aurons une source officielle.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
