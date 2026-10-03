<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IsoArt from '@/components/art/IsoArt.vue'
import SchoolSearch from '@/components/school/SchoolSearch.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { cities } from '@/data/questions'
import { officialStatuses, reflexes } from '@/data/schoolGuide'
import { useToast } from '@/composables/useToast'
import { requestSchoolCheck } from '@/services/api'

// Vérificateur d'école (TDR O1) : recherche, explication des statuts, demande de vérification.
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
  <!-- Recherche -->
  <section class="border-b-2 border-ink bg-orange">
    <div class="wrap grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-5">
        <h1 class="display text-[clamp(2.2rem,4vw,3.4rem)] text-ink">Vérifier une école</h1>
        <p class="mt-4 max-w-md text-[1.15rem] font-medium">
          Avant de payer une inscription, vérifie que l'établissement est habilité et que ta formation est accréditée. C'est
          gratuit et sans inscription.
        </p>
        <IsoArt kind="shield" :scale="1.1" class="mt-10 hidden lg:block" />
      </div>
      <div class="min-w-0 lg:col-span-6 lg:col-start-7">
        <SchoolSearch :initial="initial" @query="syncQuery" @missing="prefill" />
      </div>
    </div>
  </section>

  <!-- Les statuts -->
  <section aria-labelledby="statuts" class="section bg-white">
    <div class="wrap">
      <div class="grid grid-cols-1 gap-5 border-b-2 border-ink pb-8 lg:grid-cols-12">
        <h2 id="statuts" class="h2 min-w-0 lg:col-span-7">Quatre mots à ne pas confondre.</h2>
        <p class="min-w-0 text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end">
          Sur chaque fiche, nous affichons ces statuts séparément, avec leur source et la date de vérification.
        </p>
      </div>
      <ul>
        <li
          v-for="s in officialStatuses"
          :key="s.term"
          class="group relative grid grid-cols-1 items-center gap-4 border-b border-rule py-8 sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-[11rem_minmax(0,16rem)_minmax(0,1fr)] lg:gap-10"
        >
          <span class="absolute inset-y-0 -left-4 w-1.5 origin-top scale-y-0 bg-orange transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true"></span>
          <IsoArt :kind="s.art" :scale="0.6" mono class="transition-transform duration-300 group-hover:-translate-y-2" />
          <div class="min-w-0">
            <h3 class="display text-[1.6rem] text-navy">{{ s.term }}</h3>
            <p class="mt-1 text-sm font-semibold text-ink-soft">{{ s.who }}</p>
          </div>
          <p class="min-w-0 text-[1.05rem] sm:col-span-2 lg:col-span-1">{{ s.meaning }}</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- Réflexes + demande -->
  <section class="section bg-paper-2">
    <div class="wrap grid grid-cols-1 gap-14 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <h2 class="h2">Avant de payer, quatre réflexes.</h2>
        <ol class="mt-8 border-t-2 border-ink">
          <li v-for="(r, i) in reflexes" :key="r" class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-rule py-5">
            <span class="display text-[1.6rem] leading-none text-navy tabular-nums">{{ i + 1 }}.</span>
            <p>{{ r }}</p>
          </li>
        </ol>
      </div>

      <div id="demande" class="min-w-0 scroll-mt-24 lg:col-span-5 lg:col-start-8">
        <div class="border-2 border-ink bg-white p-6 shadow-[10px_10px_0_var(--color-navy)] sm:p-8">
          <h2 class="display text-[1.8rem] text-navy">Ton école n'est pas dans la liste&nbsp;?</h2>
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
          <p v-else class="mt-6 border-l-4 border-green pl-3 font-semibold" role="status">
            Merci. Nous vérifions « {{ request.name }} » et publierons sa fiche dès que nous aurons une source officielle.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
