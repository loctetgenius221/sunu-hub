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
      <Transition
        mode="out-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-150"
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
