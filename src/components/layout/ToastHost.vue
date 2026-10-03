<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
    <TransitionGroup
      enter-from-class="opacity-0 translate-y-3"
      leave-to-class="opacity-0"
      enter-active-class="transition duration-200"
      leave-active-class="transition duration-200"
    >
      <p
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto max-w-md border-2 border-ink bg-navy px-5 py-3 font-semibold text-white shadow-[5px_5px_0_var(--color-orange)]"
      >
        {{ t.text }}
      </p>
    </TransitionGroup>
  </div>
</template>
