<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShieldCheck } from 'lucide-vue-next'
import { commitments, keyFigures } from '@/data/home'

// Le contexte en trois chiffres sourcés, puis les règles de neutralité, écrites et publiques.
</script>

<template>
  <section id="engagements" aria-labelledby="h-engagements" class="section scroll-mt-14 bg-white">
    <div class="wrap">
      <dl v-reveal.stagger class="grid grid-cols-1 gap-10 border-b border-rule pb-16 md:grid-cols-3 md:gap-8">
        <div v-for="f in keyFigures" :key="f.value" class="min-w-0">
          <dt class="sr-only">{{ f.label }}</dt>
          <dd>
            <span class="display block text-[clamp(2.75rem,5vw,4.25rem)] text-navy tabular-nums">{{ f.value }}</span>
            <span class="mt-2 block max-w-[16rem] text-[1.0625rem] leading-snug">{{ f.label }}</span>
            <span class="mt-1 block text-[0.8125rem] text-ink-soft">Source : {{ f.source }}</span>
          </dd>
        </div>
      </dl>

      <div class="grid grid-cols-1 gap-12 pt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div v-reveal>
          <h2 id="h-engagements" class="h2">Un avis indépendant, par écrit.</h2>
          <p class="lead mt-5">
            Ces règles figurent dans nos conditions d’utilisation. Elles ne changeront pas quand des services payants arriveront
            pour les structures.
          </p>
          <RouterLink to="/charte-neutralite" class="mt-6 inline-block font-medium text-navy hover:underline">Lire la charte de neutralité</RouterLink>
        </div>
        <ul v-reveal.stagger class="divide-y divide-rule">
          <li v-for="c in commitments" :key="c" class="flex gap-4 py-5 first:pt-0">
            <ShieldCheck :size="22" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
            <p class="text-[1.1875rem] leading-snug tracking-[-0.01em]">{{ c }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
