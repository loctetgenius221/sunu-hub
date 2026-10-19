<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, Flag, Mail, MessageCircle, Search } from 'lucide-vue-next'
import AccentBar from '@/components/brand/AccentBar.vue'
import LegalText from '@/components/legal/LegalText.vue'
import { contact, faq } from '@/data/legal'
import { normalize } from '@/services/filters'

// Aide : questions fréquentes filtrables, puis les moyens de nous joindre.
const q = ref('')
const groups = computed(() => {
  const n = normalize(q.value.trim())
  if (!n) return faq
  return faq
    .map((g) => ({ ...g, items: g.items.filter((i) => normalize(`${i.q} ${i.a}`).includes(n)) }))
    .filter((g) => g.items.length)
})
</script>

<template>
  <section class="bg-navy-deep text-white">
    <div v-reveal.once.stagger="{ distance: 20 }" class="wrap max-w-3xl py-14 text-center sm:py-20">
      <AccentBar center class="mb-6" />
      <h1 class="display text-[clamp(2.25rem,5vw,3.75rem)]">Aide et contact</h1>
      <p class="mx-auto mt-4 max-w-xl text-[1.125rem] text-white/80">Les réponses aux questions les plus fréquentes. Tu ne trouves pas ? Écris-nous.</p>
      <form role="search" class="mx-auto mt-8 flex max-w-xl items-center rounded-full bg-white text-ink shadow-lift" @submit.prevent>
        <Search :size="20" class="ml-5 shrink-0 text-ink-soft" aria-hidden="true" />
        <label for="faq-q" class="sr-only">Chercher dans l'aide</label>
        <input id="faq-q" v-model="q" type="search" placeholder="Ex. : supprimer mon compte, Campusen" class="min-w-0 flex-1 bg-transparent px-3 py-4 outline-none placeholder:text-ink-soft" />
      </form>
    </div>
  </section>

  <div class="bg-paper-2">
    <div class="wrap grid max-w-6xl grid-cols-1 gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14 lg:py-16">
      <div class="min-w-0" aria-live="polite">
        <p v-if="!groups.length" class="rounded-tile bg-white p-6 shadow-soft">
          Aucune réponse pour « {{ q }} ». Essaie un autre mot, ou écris-nous : nous répondons sous 48 heures.
        </p>
        <section v-for="g in groups" :key="g.theme" class="mb-10 last:mb-0" :aria-labelledby="`faq-${g.theme}`">
          <h2 :id="`faq-${g.theme}`" class="text-[1.375rem] font-semibold tracking-[-0.02em]">{{ g.theme }}</h2>
          <div class="mt-4 divide-y divide-rule overflow-hidden rounded-tile bg-white shadow-soft">
            <details v-for="i in g.items" :key="i.q" class="group" :open="!!q.trim()">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium hover:bg-paper-2/60 [&::-webkit-details-marker]:hidden">
                {{ i.q }}
                <ChevronDown :size="18" class="shrink-0 text-ink-soft transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p class="px-6 pb-5 leading-relaxed text-ink-soft">{{ i.a }}</p>
            </details>
          </div>
        </section>
      </div>

      <aside aria-labelledby="h-contact" class="min-w-0">
        <div class="space-y-4 lg:sticky lg:top-24">
          <div class="rounded-tile bg-white p-6 shadow-soft">
            <h2 id="h-contact" class="text-[1.25rem] font-semibold">Nous écrire</h2>
            <p class="mt-2 text-[0.9375rem] text-ink-soft">Réponse sous 48 heures, du lundi au vendredi.</p>
            <ul class="mt-5 space-y-3 text-[0.9375rem]">
              <li class="flex items-start gap-3"><Mail :size="18" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" /><span class="break-words"><LegalText :text="contact.email" /></span></li>
              <li class="flex items-start gap-3"><MessageCircle :size="18" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" /><span>WhatsApp : <LegalText :text="contact.whatsapp" /></span></li>
            </ul>
          </div>
          <div class="rounded-tile bg-white p-6 shadow-soft">
            <h2 class="text-[1.125rem] font-semibold">Une question d'orientation ?</h2>
            <p class="mt-2 text-[0.9375rem] text-ink-soft">L'assistant répond tout de suite, un conseiller sous 48 heures.</p>
            <RouterLink to="/orienter/assistant" class="mt-4 inline-block font-medium text-navy hover:underline">Poser une question</RouterLink>
          </div>
          <div class="rounded-tile bg-white p-6 shadow-soft">
            <h2 class="flex items-center gap-2 text-[1.125rem] font-semibold"><Flag :size="18" class="text-orange" aria-hidden="true" />Une offre suspecte ?</h2>
            <p class="mt-2 text-[0.9375rem] text-ink-soft">Ouvre l'offre et touche « Signaler cette offre ». Ne paie jamais pour candidater.</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
