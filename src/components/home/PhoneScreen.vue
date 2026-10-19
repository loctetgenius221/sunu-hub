<script setup lang="ts">
import { BadgeCheck, Check } from 'lucide-vue-next'
import SunuMark from '@/components/brand/SunuMark.vue'
import { alerts, type HowStep } from '@/data/home'

// Écran de téléphone simplifié pour chaque étape de « Comment ça marche ». Purement illustratif.
defineProps<{ step: HowStep }>()

const offers = [
  { title: 'Stage développeur web', org: 'Teranga Digital, Dakar', score: 100 },
  { title: 'Bourse d’excellence en sciences', org: 'Fondation Baobab', score: 90 },
  { title: 'Concours de pitch', org: 'Ndaje Lab, Dakar', score: 90 },
]
const tracker = ['Enregistrée', 'Envoyée', 'Entretien', 'Réponse reçue']
</script>

<template>
  <div class="relative mx-auto aspect-[9/19] w-full max-w-[19rem] rounded-[3rem] bg-[#0b0b0f] p-2.5 shadow-lift" aria-hidden="true">
    <div class="relative h-full overflow-hidden rounded-[2.4rem] bg-white">
      <div class="absolute top-2.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-[#0b0b0f]"></div>

      <Transition
        mode="out-in"
        enter-from-class="opacity-0 scale-[0.98]"
        leave-to-class="opacity-0"
        enter-active-class="transition duration-300 ease-[var(--ease-out-soft)]"
        leave-active-class="transition duration-150"
      >
        <!-- 1. Inscription -->
        <div v-if="step === 'profil'" key="profil" class="flex h-full flex-col px-5 pt-14">
          <p class="text-[0.6875rem] font-medium text-ink-soft">Étape 1 sur 8</p>
          <p class="mt-2 text-[1.35rem] leading-tight font-semibold tracking-[-0.02em]">Ton numéro de téléphone</p>
          <p class="mt-5 text-[0.75rem] font-semibold">Numéro de mobile</p>
          <div class="mt-1.5 flex rounded-xl ring-1 ring-rule">
            <span class="border-r border-rule px-3 py-2.5 text-[0.875rem]">+221</span>
            <span class="px-3 py-2.5 text-[0.875rem] tabular-nums">77 123 45 67</span>
          </div>
          <div class="mt-5 flex gap-2 text-[0.8125rem]">
            <span class="rounded-full bg-navy px-3 py-1.5 font-medium text-white">WhatsApp</span>
            <span class="rounded-full px-3 py-1.5 ring-1 ring-rule">SMS</span>
          </div>
          <span class="mt-auto mb-8 rounded-full bg-navy py-3 text-center text-[0.875rem] font-medium text-white">Recevoir mon code</span>
        </div>

        <!-- 2. Le fil -->
        <div v-else-if="step === 'fil'" key="fil" class="h-full bg-paper-2 px-4 pt-14">
          <p class="px-1 text-[1.35rem] font-semibold tracking-[-0.02em]">Pour toi</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="o in offers" :key="o.title" class="rounded-2xl bg-white p-3.5">
              <p class="flex items-center gap-1 text-[0.6875rem] font-semibold text-green"><BadgeCheck :size="11" />Vérifiée</p>
              <p class="mt-1 text-[0.875rem] leading-snug font-semibold">{{ o.title }}</p>
              <p class="text-[0.6875rem] text-ink-soft">{{ o.org }}</p>
              <div class="mt-2 h-1 rounded-full bg-paper-2"><div class="h-full rounded-full bg-navy" :style="{ width: `${o.score}%` }"></div></div>
            </li>
          </ul>
        </div>

        <!-- 3. Alerte WhatsApp -->
        <div v-else-if="step === 'alerte'" key="alerte" class="flex h-full flex-col bg-[#efeae2]">
          <div class="flex items-center gap-2.5 bg-navy-deep px-4 pt-11 pb-3 text-white">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-navy p-1.5"><SunuMark class="h-full" /></span>
            <span class="text-[0.875rem] font-semibold">SUNU HŪB</span>
          </div>
          <ul class="space-y-2 px-3 pt-4">
            <li v-for="a in alerts" :key="a.time" class="mr-8 rounded-xl rounded-tl-sm bg-white px-3 py-2 text-[0.75rem] leading-snug shadow-sm">
              {{ a.text }}
              <span class="block text-right text-[0.625rem] text-ink-soft">{{ a.time }}</span>
            </li>
          </ul>
        </div>

        <!-- 4. Suivi de candidature -->
        <div v-else key="suivi" class="h-full px-5 pt-14">
          <p class="text-[0.6875rem] font-semibold text-navy">Stage</p>
          <p class="mt-1 text-[1.2rem] leading-tight font-semibold tracking-[-0.02em]">Stage développeur web</p>
          <p class="text-[0.75rem] text-ink-soft">Teranga Digital, Dakar</p>
          <ol class="mt-6 space-y-3">
            <li v-for="(t, i) in tracker" :key="t" class="flex items-center gap-3 text-[0.875rem]">
              <span class="grid h-7 w-7 place-items-center rounded-full" :class="i < 3 ? 'bg-navy text-white' : 'ring-1 ring-rule text-ink-soft'">
                <Check v-if="i < 3" :size="14" /><template v-else>{{ i + 1 }}</template>
              </span>
              <span :class="i === 2 ? 'font-semibold' : i > 2 ? 'text-ink-soft' : ''">{{ t }}</span>
            </li>
          </ol>
          <p class="mt-6 rounded-2xl bg-navy-soft p-3 text-[0.75rem] text-navy">Teranga Digital te propose un entretien.</p>
        </div>
      </Transition>
    </div>
  </div>
</template>
