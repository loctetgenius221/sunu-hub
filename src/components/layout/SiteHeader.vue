<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import SunuLogo from '@/components/brand/SunuLogo.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { nav } from '@/data/site'
import { useProfileStore } from '@/stores/profile'

// Barre de navigation translucide : le contenu défile dessous, flouté.
const store = useProfileStore()
const open = ref(false)
const route = useRoute()
watch(
  () => route.fullPath,
  () => (open.value = false),
)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-black/8 bg-white/75 backdrop-blur-xl backdrop-saturate-150 print:hidden">
    <div class="wrap flex h-14 items-center justify-between gap-6">
      <RouterLink to="/" aria-label="SUNU HŪB, accueil" class="shrink-0">
        <SunuLogo size="sm" />
      </RouterLink>

      <nav aria-label="Navigation principale" class="hidden lg:block">
        <ul class="flex items-center gap-1 text-[0.875rem]">
          <li v-for="item in nav" :key="item.to">
            <RouterLink
              :to="item.to"
              class="relative rounded-full px-3.5 py-1.5 text-ink/80 transition-colors hover:bg-black/4 hover:text-ink"
              active-class="text-ink! font-medium after:absolute after:inset-x-3.5 after:-bottom-[0.6rem] after:h-0.5 after:bg-brand-orange"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <div class="hidden sm:block">
          <BaseButton v-if="store.isRegistered" to="/profil" variant="secondary" size="sm">Mon profil</BaseButton>
          <BaseButton v-else to="/inscription" size="sm">Créer mon profil</BaseButton>
        </div>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-black/5 lg:hidden"
          :aria-expanded="open"
          aria-controls="menu-mobile"
          @click="open = !open"
        >
          <component :is="open ? X : Menu" :size="20" aria-hidden="true" />
          <span class="sr-only">{{ open ? 'Fermer le menu' : 'Ouvrir le menu' }}</span>
        </button>
      </div>
    </div>

    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition duration-200"
      leave-active-class="transition duration-150"
    >
      <nav v-if="open" id="menu-mobile" aria-label="Navigation mobile" class="h-[calc(100svh-3.5rem)] overflow-y-auto bg-white lg:hidden">
        <ul class="wrap pt-6">
          <li v-for="item in nav" :key="item.to">
            <RouterLink :to="item.to" class="display block py-2.5 text-[1.75rem] text-ink">{{ item.label }}</RouterLink>
          </li>
        </ul>
        <div class="wrap mt-8 sm:hidden">
          <BaseButton v-if="store.isRegistered" to="/profil" variant="secondary" block>Mon profil</BaseButton>
          <BaseButton v-else to="/inscription" block>Créer mon profil</BaseButton>
        </div>
      </nav>
    </Transition>
  </header>
</template>
