<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WaxTexture from '@/components/brand/WaxTexture.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCountUp } from '@/composables/useMotion'
import { audiences } from '@/data/home'
import { listOpportunities } from '@/services/api'
import { useProfileStore } from '@/stores/profile'

// Deux publics, deux promesses, côte à côte : la gratuité pour les jeunes, le bon profil sans
// tri pour les structures. Le mot fort en menthe, la couleur de « Toi » dans le héros.
const profile = useProfileStore()
const { youth, orgs } = audiences

const counter = ref<HTMLElement | null>(null)
useCountUp(counter, orgs.proof.count)

// Preuve côté jeunes, symétrique : le nombre réel d'opportunités ouvertes (listOpportunities
// ne renvoie que les offres dont la date limite n'est pas passée).
const open = ref<number | null>(null)
onMounted(async () => (open.value = (await listOpportunities()).length))
</script>

<template>
  <!-- Fonds bord à bord, sans espace ni arrondi ; le contenu de chaque moitié s'aligne sur la
       largeur max des autres sections (.wrap = 76rem au plus, marges de 1,25rem) : chaque moitié
       garde la marge de son côté extérieur et cale son contenu sur 38rem, la moitié de 76rem. -->
  <section aria-label="Pour les jeunes et pour les structures" class="grid grid-cols-1 lg:grid-cols-2">
      <!-- Pour les jeunes -->
      <article aria-labelledby="aud-jeunes" class="relative isolate overflow-hidden bg-navy-deep px-5 py-16 lg:pr-0 text-white sm:py-20 lg:py-24">
        <WaxTexture tone="text-white/[0.05]" from="right" />
        <div v-reveal class="flex h-full flex-col lg:ml-auto lg:max-w-[38rem] lg:pr-12 xl:pr-16">
        <p class="text-[0.8125rem] font-semibold tracking-[0.08em] text-white/70 uppercase">{{ youth.eyebrow }}</p>
        <h2 id="aud-jeunes" class="display mt-5 text-[clamp(2.75rem,5.5vw,4.5rem)]">
          <span class="block text-[#7dd3a0]">{{ youth.title[0] }}</span>
          <span class="block">{{ youth.title[1] }}</span>
        </h2>
        <p class="mt-6 max-w-md text-[1.125rem] leading-snug text-white/80">{{ youth.lead }}</p>

        <!-- La preuve : des offres réelles, ouvertes maintenant -->
        <p class="mt-8 flex max-w-md items-baseline gap-3 border-t border-white/15 pt-6 text-[0.9375rem] text-white/75">
          <span class="display shrink-0 text-[2.25rem] text-white tabular-nums">{{ open ?? '–' }}</span>
          <span>{{ youth.proof }}</span>
        </p>

        <div class="mt-auto pt-10">
          <BaseButton v-if="profile.isRegistered" to="/profil" variant="light">Voir mon fil</BaseButton>
          <BaseButton v-else to="/inscription" variant="light">Créer mon profil</BaseButton>
        </div>
        </div>
      </article>

      <!-- Pour les structures -->
      <article aria-labelledby="aud-structures" class="relative isolate overflow-hidden bg-navy px-5 py-16 lg:pl-0 text-white sm:py-20 lg:py-24">
        <WaxTexture tone="text-white/[0.05]" from="right" />
        <div v-reveal="{ delay: 0.12 }" class="flex h-full flex-col lg:mr-auto lg:max-w-[38rem] lg:pl-12 xl:pl-16">
        <p class="text-[0.8125rem] font-semibold tracking-[0.08em] text-white/70 uppercase">{{ orgs.eyebrow }}</p>
        <h2 id="aud-structures" class="display mt-5 text-[clamp(2.75rem,5.5vw,4.5rem)]">
          <span class="block">{{ orgs.title[0] }}</span>
          <span class="block text-[#7dd3a0]">{{ orgs.title[1] }}</span>
        </h2>
        <p class="mt-6 max-w-md text-[1.125rem] leading-snug text-white/80">{{ orgs.lead }}</p>

        <!-- La preuve : le nombre de profils correspondants, connu avant de publier -->
        <p class="mt-8 flex max-w-md items-baseline gap-3 border-t border-white/15 pt-6 text-[0.9375rem] text-white/75">
          <span ref="counter" class="display shrink-0 text-[2.25rem] text-white tabular-nums">{{ orgs.proof.count.toLocaleString('fr-FR') }}</span>
          <span>{{ orgs.proof.label }}</span>
        </p>

        <div class="mt-auto flex flex-wrap gap-3 pt-10">
          <BaseButton to="/structures/publier" variant="light">Publier une opportunité</BaseButton>
          <BaseButton to="/structures" variant="glass">Découvrir l’espace structures</BaseButton>
        </div>
        </div>
      </article>
  </section>
</template>
