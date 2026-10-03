<script setup lang="ts">
import IsoArt from '@/components/art/IsoArt.vue'
import FigureCaption from '@/components/ui/FigureCaption.vue'
import { commitments } from '@/data/home'

// Règles de neutralité : présentées comme un texte de règlement (numérotation justifiée).
</script>

<template>
  <section aria-labelledby="engagements" class="section bg-paper-2">
    <div class="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div class="min-w-0 lg:col-span-4">
        <h2 id="engagements" class="h2">Un avis indépendant, par écrit.</h2>
        <p class="mt-5 max-w-sm text-ink-soft">
          SUNU HŪB est gratuit pour les jeunes. Ces règles figurent dans nos conditions d'utilisation et ne changeront pas quand
          des services payants arriveront.
        </p>
        <figure class="mt-10 hidden lg:block">
          <IsoArt kind="sheets" :scale="1" />
          <FigureCaption n="2" class="mt-3">Nos règles, publiques et datées.</FigureCaption>
        </figure>
      </div>

      <ol class="min-w-0 border-t-2 border-ink lg:col-span-7 lg:col-start-6">
        <li v-for="(c, i) in commitments" :key="c" class="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-rule py-6">
          <span class="display text-[1.8rem] leading-none text-navy tabular-nums">{{ i + 1 }}.</span>
          <p class="display text-[1.3rem] leading-snug text-ink sm:text-[1.45rem]">{{ c }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
