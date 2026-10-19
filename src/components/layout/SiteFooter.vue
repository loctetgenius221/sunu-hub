<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AccentBar from '@/components/brand/AccentBar.vue'
import BrandIcon from '@/components/brand/BrandIcon.vue'
import SunuLogo from '@/components/brand/SunuLogo.vue'
import WaxBand from '@/components/brand/WaxBand.vue'
import { photos } from '@/data/photos'
import { socials, tagline, whatsappUrl } from '@/data/site'

// Pied de page clair, en petites colonnes. Les crédits des photos provisoires y sont listés.
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
</script>

<template>
  <footer class="bg-paper-2 text-[0.8125rem] text-ink-soft print:hidden">
    <WaxBand size="sm" />
    <div
      class="wrap grid grid-cols-1 gap-10 border-b border-rule py-12 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]"
    >
      <div class="min-w-0">
        <SunuLogo />
        <p class="mt-4 max-w-xs text-[0.9375rem] leading-snug text-ink">{{ tagline }}</p>
        <p class="mt-3">Dakar, Sénégal. Gratuit pour les jeunes, sans exception.</p>

        <h2 id="h-reseaux" class="mt-7 font-semibold text-ink">Suis-nous</h2>
        <ul class="mt-3 flex flex-wrap gap-2" aria-labelledby="h-reseaux">
          <li>
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="grid size-10 place-items-center rounded-full bg-white text-ink shadow-soft transition-colors hover:bg-[#1DAA61] hover:text-white"
              aria-label="Écrire à SUNU HŪB sur WhatsApp (nouvel onglet)"
            ><BrandIcon name="whatsapp" :size="18" /></a>
          </li>
          <li v-for="s in socials" :key="s.id">
            <a
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer me"
              class="grid size-10 place-items-center rounded-full bg-white text-ink shadow-soft transition-colors hover:bg-navy hover:text-white"
              :aria-label="`SUNU HŪB sur ${s.label} (nouvel onglet)`"
            ><BrandIcon :name="s.id" :size="18" /></a>
          </li>
        </ul>
      </div>
      <nav v-for="c in columns" :key="c.title" :aria-label="c.title" class="min-w-0">
        <h2 class="font-semibold text-ink">{{ c.title }}</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="l in c.links" :key="l.to">
            <RouterLink :to="l.to" class="transition-colors hover:text-ink hover:underline">{{
              l.label
            }}</RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="wrap flex flex-col gap-3 py-6 md:flex-row md:items-start md:justify-between">
      <div class="flex flex-col gap-2">
        <p>© 2026 SUNU HŪB. Maquette : les données présentées sont fictives.</p>
        <ul class="flex flex-wrap gap-x-5 gap-y-1">
          <li v-for="l in legal" :key="l.to"><RouterLink :to="l.to" class="hover:text-ink hover:underline">{{ l.label }}</RouterLink></li>
        </ul>
      </div>
      <details class="max-w-xl md:text-right">
        <summary class="cursor-pointer list-none hover:text-ink">
          Photos provisoires : Unsplash
        </summary>
        <p class="mt-2">
          <template v-for="(p, i) in credits" :key="p.name">
            <a :href="p.url" target="_blank" rel="noopener noreferrer" class="hover:underline">{{
              p.credit
            }}</a
            ><template v-if="i < credits.length - 1">, </template> </template
          >.
        </p>
      </details>
    </div>
  </footer>
</template>
