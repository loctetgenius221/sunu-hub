<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { FileWarning } from 'lucide-vue-next'
import AccentBar from '@/components/brand/AccentBar.vue'
import LegalText from '@/components/legal/LegalText.vue'
import { LEGAL_UPDATED, legalPages } from '@/data/legal'

// Page légale ou d'information : « En bref » en langage simple, puis le texte complet, avec sommaire.
const props = defineProps<{ slug: string }>()
const page = computed(() => legalPages.find((p) => p.slug === props.slug)!)
const others = computed(() => legalPages.filter((p) => p.slug !== props.slug))
const updated = new Date(LEGAL_UPDATED).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<template>
  <section class="bg-white">
    <div class="wrap max-w-4xl pt-12 pb-8 sm:pt-16">
      <AccentBar class="mb-6" />
      <h1 class="display text-[clamp(2.25rem,5vw,3.75rem)]">{{ page.title }}</h1>
      <p class="lead mt-4">{{ page.description }}</p>
      <p class="mt-4 text-[0.875rem] text-ink-soft">Mise à jour le {{ updated }}</p>
      <p class="mt-6 flex items-start gap-3 rounded-control bg-orange-soft px-4 py-3 text-[0.9375rem] text-orange" role="note">
        <FileWarning :size="18" class="mt-0.5 shrink-0" aria-hidden="true" />
        Projet de texte, en cours de validation par un juriste. Les informations surlignées restent à compléter.
      </p>
    </div>
  </section>

  <div class="bg-paper-2">
    <div class="wrap grid max-w-6xl grid-cols-1 gap-10 py-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14 lg:py-14">
      <!-- Sommaire -->
      <nav aria-label="Sommaire" class="hidden lg:block">
        <div class="sticky top-24">
          <p class="text-[0.875rem] font-semibold">Sur cette page</p>
          <ul class="mt-3 space-y-1 border-l border-rule">
            <li><a href="#en-bref" class="-ml-px block border-l border-transparent py-1 pl-4 text-[0.9375rem] text-ink-soft hover:border-navy hover:text-ink">En bref</a></li>
            <li v-for="s in page.sections" :key="s.id">
              <a :href="`#${s.id}`" class="-ml-px block border-l border-transparent py-1 pl-4 text-[0.9375rem] text-ink-soft hover:border-navy hover:text-ink">{{ s.title }}</a>
            </li>
          </ul>
        </div>
      </nav>

      <article class="min-w-0 max-w-3xl">
        <section id="en-bref" aria-labelledby="h-en-bref" class="scroll-mt-24 rounded-tile bg-navy-soft p-6 sm:p-8">
          <h2 id="h-en-bref" class="text-[1.25rem] font-semibold text-navy">En bref</h2>
          <ul class="mt-4 space-y-2.5">
            <li v-for="s in page.summary" :key="s" class="flex gap-3 text-[1.0625rem]">
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" aria-hidden="true"></span>{{ s }}
            </li>
          </ul>
        </section>

        <div class="mt-6 rounded-tile bg-white p-6 shadow-soft sm:p-10">
          <section v-for="s in page.sections" :id="s.id" :key="s.id" class="scroll-mt-24 border-b border-rule pb-8 not-first:pt-8 last:border-0 last:pb-0">
            <h2 class="text-[1.375rem] font-semibold tracking-[-0.02em]">{{ s.title }}</h2>
            <template v-for="(b, i) in s.body" :key="i">
              <p v-if="typeof b === 'string'" class="mt-3 leading-relaxed text-ink/90"><LegalText :text="b" /></p>
              <ul v-else-if="'list' in b" class="mt-3 space-y-2">
                <li v-for="item in b.list" :key="item" class="flex gap-3 leading-relaxed text-ink/90">
                  <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-soft" aria-hidden="true"></span><span><LegalText :text="item" /></span>
                </li>
              </ul>
              <p v-else class="mt-3 rounded-control bg-paper-2 px-4 py-3 text-[0.9375rem]"><LegalText :text="b.note" /></p>
            </template>
          </section>
        </div>

        <nav aria-label="Autres informations" class="mt-10">
          <h2 class="text-[0.9375rem] font-semibold">À lire aussi</h2>
          <ul class="mt-3 flex flex-wrap gap-2">
            <li v-for="o in others" :key="o.slug">
              <RouterLink :to="`/${o.slug}`" class="inline-block rounded-full bg-white px-4 py-2 text-[0.9375rem] font-medium shadow-soft hover:bg-[#ececf0]">{{ o.title }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/aide" class="inline-block rounded-full bg-white px-4 py-2 text-[0.9375rem] font-medium shadow-soft hover:bg-[#ececf0]">Aide et contact</RouterLink>
            </li>
          </ul>
        </nav>
      </article>
    </div>
  </div>
</template>
