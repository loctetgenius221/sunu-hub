<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowUp } from 'lucide-vue-next'
import BrandIcon from '@/components/brand/BrandIcon.vue'
import SunuLogo from '@/components/brand/SunuLogo.vue'
import WaxBand from '@/components/brand/WaxBand.vue'
import { photos } from '@/data/photos'
import { socials, tagline } from '@/data/site'

// Pied de page. Mobile : liens sur deux colonnes, cibles tactiles larges, retour en haut.
// Tablette : la marque sur toute la largeur, puis trois colonnes. Grand écran : quatre colonnes.
const columns = [
  {
    title: 'Pour les jeunes',
    links: [
      { label: 'Opportunités', to: '/opportunites' },
      { label: 'Orienter', to: '/orienter' },
      { label: 'Vérifier une école', to: '/verifier-ecole' },
      { label: 'Créer mon profil', to: '/inscription' },
    ],
  },
  {
    title: 'Pour les structures',
    links: [
      { label: 'Espace structures', to: '/structures' },
      { label: 'Publier une opportunité', to: '/structures/publier' },
    ],
  },
  {
    title: 'Aide et informations',
    links: [
      { label: 'Aide et contact', to: '/aide' },
      { label: 'Charte de neutralité', to: '/charte-neutralite' },
      { label: 'Accessibilité', to: '/accessibilite' },
      { label: 'Espace équipe', to: '/equipe' },
    ],
  },
]
const credits = Object.values(photos)
const legal = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Conditions d’utilisation', to: '/conditions-utilisation' },
  { label: 'Confidentialité', to: '/confidentialite' },
]

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <footer class="bg-paper-2 text-ink-soft print:hidden">
    <WaxBand size="sm" />

    <div class="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 md:grid-cols-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-x-10 lg:py-16">
      <!-- Marque : toute la largeur sur mobile et tablette -->
      <div class="col-span-2 min-w-0 md:col-span-3 md:flex md:items-end md:justify-between md:gap-10 lg:col-span-1 lg:block">
        <div>
          <SunuLogo />
          <p class="mt-4 max-w-sm text-[1rem] leading-snug text-ink">{{ tagline }}</p>
          <p class="mt-2 text-[0.875rem]">Dakar, Sénégal. Gratuit pour les jeunes, sans exception.</p>
        </div>

        <div class="mt-6 md:mt-0 lg:mt-7">
          <h2 id="h-reseaux" class="text-[0.875rem] font-semibold text-ink">Suis-nous</h2>
          <ul class="mt-3 flex flex-wrap gap-2" aria-labelledby="h-reseaux">
            <li v-for="s in socials" :key="s.id">
              <a
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer me"
                class="grid size-11 place-items-center rounded-full bg-white text-ink shadow-soft transition-colors hover:bg-navy hover:text-white lg:size-10"
                :aria-label="`SUNU HŪB sur ${s.label} (nouvel onglet)`"
                ><BrandIcon :name="s.id" :size="18"
              /></a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Liens : la dernière colonne passe sur toute la largeur sur mobile -->
      <nav
        v-for="(c, i) in columns"
        :key="c.title"
        :aria-label="c.title"
        class="min-w-0"
        :class="i === columns.length - 1 && 'col-span-2 md:col-span-1'"
      >
        <h2 class="text-[0.9375rem] font-semibold text-ink">{{ c.title }}</h2>
        <ul class="mt-2 sm:mt-3" :class="i === columns.length - 1 && 'grid grid-cols-2 gap-x-6 md:block'">
          <li v-for="l in c.links" :key="l.to">
            <RouterLink
              :to="l.to"
              class="inline-block py-2 text-[0.9375rem] transition-colors hover:text-ink hover:underline lg:py-1.5 lg:text-[0.875rem]"
              >{{ l.label }}</RouterLink
            >
          </li>
        </ul>
      </nav>
    </div>

    <div class="border-t border-rule">
      <!-- Marges basse (mobile) et droite (grand écran) : la place du bouton WhatsApp flottant. -->
      <div class="wrap flex flex-col gap-4 pt-6 pb-24 text-[0.8125rem] sm:pb-28 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pr-20 lg:pb-6 2xl:pr-0">
        <ul class="flex flex-wrap gap-x-5 gap-y-1 lg:order-2">
          <li v-for="l in legal" :key="l.to">
            <RouterLink :to="l.to" class="inline-block py-1.5 hover:text-ink hover:underline">{{ l.label }}</RouterLink>
          </li>
        </ul>
        <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:order-1 lg:justify-start">
          <p>© 2026 SUNU HŪB. Maquette : données fictives.</p>
          <details class="lg:hidden">
            <summary class="list-none py-1.5 hover:text-ink">Crédits photo</summary>
            <p class="mt-1">
              <template v-for="(p, i) in credits" :key="p.name">
                <a :href="p.url" target="_blank" rel="noopener noreferrer" class="hover:underline">{{ p.credit }}</a
                ><template v-if="i < credits.length - 1">, </template>
              </template>
              (Unsplash).
            </p>
          </details>
        </div>
        <div class="flex items-center justify-between gap-6 lg:order-3">
          <details class="relative hidden lg:block">
            <summary class="list-none py-1.5 hover:text-ink">Crédits photo</summary>
            <p class="absolute right-0 bottom-full mb-2 w-72 rounded-control bg-white p-3 shadow-lift">
              <template v-for="(p, i) in credits" :key="p.name">
                <a :href="p.url" target="_blank" rel="noopener noreferrer" class="hover:underline">{{ p.credit }}</a
                ><template v-if="i < credits.length - 1">, </template>
              </template>
              (Unsplash).
            </p>
          </details>
          <button
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-medium text-ink shadow-soft transition-colors hover:bg-navy hover:text-white lg:min-h-9"
            @click="toTop"
          >
            <ArrowUp :size="16" aria-hidden="true" />Haut de page
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
