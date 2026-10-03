<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SunuLogo from '@/components/brand/SunuLogo.vue'
import { nav, tagline } from '@/data/site'
</script>

<template>
  <footer class="print:hidden border-t-2 border-ink bg-navy text-white/75">
    <!-- Liseré aux couleurs de la marque -->
    <!-- <div class="flex h-1.5" aria-hidden="true">
      <span class="flex-1 bg-green"></span><span class="flex-1 bg-white"></span><span class="flex-1 bg-orange"></span>
    </div> -->

    <div class="wrap grid grid-cols-1 gap-10 py-14 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-6">
        <SunuLogo tone="dark" size="lg" />
        <p class="display mt-6 max-w-md text-[1.6rem] text-white">{{ tagline }}</p>
      </div>

      <nav aria-label="Pied de page" class="min-w-0 lg:col-span-3 lg:col-start-8">
        <ul class="space-y-2.5 font-semibold">
          <li v-for="item in nav" :key="item.to">
            <RouterLink :to="item.to" class="hover:text-green">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="min-w-0 text-sm lg:col-span-2">
        <p>Dakar, Sénégal</p>
        <p class="mt-2">Gratuit pour les jeunes, sans exception.</p>
      </div>
    </div>

    <div class="border-t border-white/15">
      <p class="wrap flex flex-wrap justify-between gap-2 py-5 text-sm">
        <span>© 2026 SUNU HŪB</span>
        <span>Maquette : données et photos provisoires. <RouterLink to="/equipe" class="underline underline-offset-2 hover:text-green">Espace équipe</RouterLink></span>
      </p>
    </div>
  </footer>
</template>
