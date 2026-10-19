<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { BellRing, Briefcase, Compass, Search } from 'lucide-vue-next'
import SectionHead from '@/components/ui/SectionHead.vue'
import { alerts } from '@/data/home'
import { useProfileStore } from '@/stores/profile'

// Les quatre services, en entrées directes. Chaque tuile mène quelque part en un clic ;
// la vérification d'école se fait sur place.
const router = useRouter()
const profile = useProfileStore()

const q = ref('')
const search = () => router.push({ name: 'school-checker', query: q.value.trim() ? { q: q.value.trim() } : {} })
</script>

<template>
  <section aria-labelledby="services" class="section bg-white pb-10! sm:pb-12!">
    <div class="wrap">
      <SectionHead id="services" title="Que veux-tu faire ?" lead="Un seul profil, de la Terminale au premier emploi." />

      <div v-reveal.stagger class="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- Opportunités -->
        <RouterLink to="/opportunites" class="group flex min-h-[15rem] flex-col justify-between rounded-tile bg-navy p-8 text-white transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift sm:p-10">
          <Briefcase :size="28" aria-hidden="true" />
          <div>
            <h3 class="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">Trouver un stage, une bourse, un emploi</h3>
            <p class="mt-2 text-white/75">Des offres vérifiées, triées pour toi.</p>
            <span class="mt-5 inline-block font-medium group-hover:underline">Voir les opportunités</span>
          </div>
        </RouterLink>

        <!-- Orienter -->
        <RouterLink to="/orienter" class="group flex min-h-[15rem] flex-col justify-between rounded-tile bg-paper-2 p-8 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift sm:p-10">
          <Compass :size="28" class="text-navy" aria-hidden="true" />
          <div>
            <h3 class="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">Choisir ma formation</h3>
            <p class="mt-2 text-ink-soft">Trois pistes expliquées et ta liste de vœux Campusen.</p>
            <span class="mt-5 inline-block font-medium text-navy group-hover:underline">Commencer</span>
          </div>
        </RouterLink>

        <!-- Vérifier une école : sur place -->
        <div class="flex min-h-[15rem] flex-col justify-between gap-6 rounded-tile bg-paper-2 p-8 sm:p-10">
          <Search :size="28" class="text-navy" aria-hidden="true" />
          <div>
            <h3 class="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">Vérifier une école</h3>
            <p class="mt-2 text-ink-soft">Est-elle reconnue par l’État ? La réponse en clair.</p>
            <form role="search" class="mt-5 flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-soft focus-within:ring-4 focus-within:ring-navy/15" @submit.prevent="search">
              <label for="tile-school" class="sr-only">Nom ou sigle de l'établissement</label>
              <input id="tile-school" v-model="q" type="search" placeholder="Nom ou sigle de l’école" class="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-ink-soft" />
              <button type="submit" class="min-h-10 shrink-0 rounded-full bg-navy px-5 font-medium text-white hover:bg-[#0a2c60]">Vérifier</button>
            </form>
          </div>
        </div>

        <!-- Alertes -->
        <RouterLink :to="profile.isRegistered ? '/profil#alertes' : '/inscription'" class="group flex min-h-[15rem] flex-col justify-between gap-6 rounded-tile bg-navy-soft p-8 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift sm:p-10">
          <BellRing :size="28" class="text-navy" aria-hidden="true" />
          <div>
            <h3 class="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">Être prévenu sur WhatsApp</h3>
            <p class="mt-2 max-w-md rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[0.9375rem] shadow-soft">{{ alerts[1]!.text }}</p>
            <span class="mt-5 inline-block font-medium text-navy group-hover:underline">{{ profile.isRegistered ? 'Régler mes alertes' : 'Activer mes alertes' }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
