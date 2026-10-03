<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, inView, stagger } from 'motion'
import { BellRing, CalendarClock, MessageSquareOff } from 'lucide-vue-next'
import SunuMark from '@/components/brand/SunuMark.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import { EASE, prefersReducedMotion } from '@/composables/useMotion'
import { alerts } from '@/data/home'

// Les alertes arrivent sur WhatsApp : un téléphone reçoit les messages un par un.
const points = [
  { icon: BellRing, text: 'Une alerte quand une offre correspond à ton profil.' },
  { icon: CalendarClock, text: 'Un rappel sept jours, puis un jour avant la date limite.' },
  { icon: MessageSquareOff, text: 'Trois messages par semaine au plus. « STOP » suffit pour arrêter.' },
]

const thread = ref<HTMLElement | null>(null)
let stop: (() => void) | undefined
onMounted(() => {
  const el = thread.value
  if (!el || prefersReducedMotion()) return
  const bubbles = el.querySelectorAll('li')
  bubbles.forEach((b) => (b.style.opacity = '0'))
  stop = inView(
    el,
    () => {
      animate(bubbles, { opacity: [0, 1], transform: ['translateY(16px) scale(.96)', 'translateY(0px) scale(1)'] }, { delay: stagger(0.5, { startDelay: 0.2 }), duration: 0.5, ease: EASE })
      stop?.()
    },
    { amount: 0.4 },
  )
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <section aria-labelledby="alertes" class="section bg-white">
    <div class="wrap">
      <SectionHead id="alertes" title="L'info arrive là où tu es déjà." lead="Pas besoin de revenir sur le site chaque jour : SUNU HŪB te prévient sur WhatsApp, par SMS ou par e-mail, selon ton choix." />

      <div class="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <ul class="min-w-0 lg:col-span-5">
          <li v-for="p in points" :key="p.text" class="flex gap-4 border-b border-rule py-5 first:border-t-2 first:border-t-ink">
            <component :is="p.icon" :size="24" class="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
            <span class="text-[1.05rem]">{{ p.text }}</span>
          </li>
        </ul>

        <!-- Téléphone -->
        <div class="flex min-w-0 justify-center lg:col-span-6 lg:col-start-7">
          <div class="w-full max-w-[22rem] rounded-[2.2rem] border-2 border-ink bg-ink p-2.5 shadow-[10px_10px_0_var(--color-orange)]">
            <div class="overflow-hidden rounded-[1.7rem] bg-paper-2">
              <div class="flex items-center gap-3 bg-navy px-4 py-3 text-white">
                <span class="grid h-9 w-9 place-items-center rounded-full bg-navy ring-2 ring-white/60">
                  <SunuMark class="h-6" />
                </span>
                <span class="min-w-0">
                  <span class="block text-sm font-bold">SUNU HŪB</span>
                  <span class="block text-xs text-white/70">Compte vérifié</span>
                </span>
              </div>
              <ul ref="thread" class="space-y-3 px-3 py-5" aria-label="Exemples d'alertes">
                <li v-for="a in alerts" :key="a.time" class="mr-8 border-2 border-ink bg-white px-3.5 py-2.5 text-sm shadow-[3px_3px_0_var(--color-ink)]">
                  {{ a.text }}
                  <span class="mt-1 block text-right text-[0.7rem] text-ink-soft tabular-nums">{{ a.time }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
