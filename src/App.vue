<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ToastHost from '@/components/layout/ToastHost.vue'
</script>

<template>
  <a
    href="#contenu"
    class="sr-only z-50 bg-orange px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
  >
    Aller au contenu
  </a>
  <SiteHeader />
  <main id="contenu" class="overflow-x-clip">
    <RouterView v-slot="{ Component, route }">
      <!-- Changement de page : la page sortante s'efface vite, la suivante monte doucement. -->
      <Transition
        mode="out-in"
        enter-from-class="translate-y-3 opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        leave-active-class="transition-opacity duration-150 ease-in"
      >
        <!-- Enveloppe : <Transition> exige un élément racine unique, les vues peuvent en avoir plusieurs. -->
        <div :key="route.path">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
  <ToastHost />
</template>
