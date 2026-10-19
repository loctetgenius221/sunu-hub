<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BrandIcon from '@/components/brand/BrandIcon.vue'
import { whatsappUrl } from '@/data/site'

// Bouton WhatsApp flottant : le canal que les jeunes utilisent déjà. Masqué sur les parcours
// où il distrairait ou couvrirait une action (inscription, questionnaire, publication, CV).
const route = useRoute()
const HIDDEN = new Set(['signup', 'orient-quiz', 'structure-signup', 'structure-publish', 'cv', 'orient-summary'])
const visible = computed(() => !HIDDEN.has(String(route.name)))
</script>

<template>
  <Transition
    enter-from-class="translate-y-4 scale-90 opacity-0"
    leave-to-class="translate-y-4 scale-90 opacity-0"
    enter-active-class="transition-[opacity,translate,scale] duration-300 ease-out"
    leave-active-class="transition-[opacity,translate,scale] duration-200 ease-in"
  >
    <!-- Repère nommé : le bouton flottant reste dans une région de la page. -->
    <aside v-if="visible" aria-label="Contact WhatsApp" class="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 sm:right-6 sm:bottom-6 print:hidden">
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="group flex items-center gap-3"
      aria-label="Écrire à SUNU HŪB sur WhatsApp (nouvel onglet)"
    >
      <!-- Libellé visible au survol sur grand écran -->
      <span
        class="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-[0.9375rem] font-medium text-ink opacity-0 shadow-lift transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:block"
        aria-hidden="true"
      >Une question ? Écris-nous</span>
      <span
        class="grid size-14 place-items-center rounded-full bg-[#1DAA61] text-white shadow-lift ring-4 ring-white/70 transition-[scale,background-color] duration-200 group-hover:scale-105 group-hover:bg-[#178f51] group-active:scale-95"
      >
        <BrandIcon name="whatsapp" :size="28" />
      </span>
    </a>
    </aside>
  </Transition>
</template>
