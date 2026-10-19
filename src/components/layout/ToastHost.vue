<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
    <TransitionGroup
      enter-from-class="opacity-0 translate-y-3 scale-95"
      leave-to-class="opacity-0 scale-95"
      enter-active-class="transition duration-300 ease-[var(--ease-out-soft)]"
      leave-active-class="transition duration-200"
    >
      <p
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto max-w-md rounded-2xl bg-ink/90 px-5 py-3 text-[0.9375rem] font-medium text-white shadow-lift backdrop-blur-xl"
      >
        {{ t.text }}
      </p>
    </TransitionGroup>
  </div>
</template>
