<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import SunuLogo from '@/components/brand/SunuLogo.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { nav } from '@/data/site'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()
const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header class="sticky top-0 z-40 print:hidden border-b-2 border-ink bg-white">
    <div class="wrap flex h-16 items-center justify-between gap-6">
      <RouterLink to="/" aria-label="SUNU HŪB, accueil" class="shrink-0">
        <SunuLogo />
      </RouterLink>

      <nav aria-label="Navigation principale" class="hidden lg:block">
        <ul class="flex items-center gap-7 text-[0.95rem] font-semibold">
          <li v-for="item in nav" :key="item.to">
            <RouterLink
              :to="item.to"
              class="border-b-2 border-transparent py-1 transition-colors hover:border-orange"
              active-class="border-navy! text-navy"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <div class="hidden sm:block">
          <BaseButton v-if="store.isRegistered" to="/profil" variant="secondary" class="px-5!">Mon profil</BaseButton>
          <BaseButton v-else to="/inscription" class="px-5!">Créer mon profil</BaseButton>
        </div>
        <button
          type="button"
          class="grid h-11 w-11 place-items-center border-2 border-ink lg:hidden"
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
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
      enter-active-class="transition duration-200"
      leave-active-class="transition duration-150"
    >
      <nav v-if="open" id="menu-mobile" aria-label="Navigation mobile" class="border-t-2 border-ink bg-white lg:hidden">
        <ul class="wrap py-2">
          <li v-for="item in nav" :key="item.to" class="border-b border-rule last:border-0">
            <RouterLink :to="item.to" class="display block py-3.5 text-xl text-navy">{{ item.label }}</RouterLink>
          </li>
        </ul>
        <div class="wrap pb-5 sm:hidden">
          <BaseButton v-if="store.isRegistered" to="/profil" variant="secondary" block>Mon profil</BaseButton>
          <BaseButton v-else to="/inscription" block>Créer mon profil</BaseButton>
        </div>
      </nav>
    </Transition>
  </header>
</template>
