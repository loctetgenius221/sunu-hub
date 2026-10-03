<script setup lang="ts">
import { useRouter } from 'vue-router'
import IsoArt from '@/components/art/IsoArt.vue'
import SchoolSearch from '@/components/school/SchoolSearch.vue'
import TextLink from '@/components/ui/TextLink.vue'

// Vérificateur express (TDR O1) : bande orange, recherche instantanée.
const router = useRouter()
const askCheck = (q: string) => router.push({ name: 'school-checker', query: { demande: q }, hash: '#demande' })
</script>

<template>
  <section aria-labelledby="verifier" class="section border-y-2 border-ink bg-orange">
    <div class="wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-5">
        <p class="inline-block border-2 border-ink bg-white px-3 py-1 text-sm font-bold">Avant de payer une inscription</p>
        <h2 id="verifier" class="display mt-5 text-[clamp(1.9rem,3.4vw,3rem)] text-ink">Ton école est-elle reconnue&nbsp;?</h2>
        <p class="mt-4 max-w-md text-[1.1rem] font-medium">
          Tape le nom d'un établissement : on te dit en clair s'il est habilité, et si ta formation est accréditée.
        </p>
        <TextLink to="/verifier-ecole" class="mt-6 inline-block">Comprendre les statuts</TextLink>
        <IsoArt kind="shield" :scale="0.9" class="mt-8 hidden lg:block" />
      </div>

      <div class="min-w-0 lg:col-span-6 lg:col-start-7">
        <SchoolSearch @missing="askCheck" />
      </div>
    </div>
  </section>
</template>
