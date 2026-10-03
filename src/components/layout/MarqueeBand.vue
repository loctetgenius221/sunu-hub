<script setup lang="ts">
// Bande défilante orange : mots-clés séparés par des pastilles qui alternent marine / blanc / vert.
defineProps<{ words: string[] }>()
const dots = ['bg-navy', 'bg-white', 'bg-green']
</script>

<template>
  <div class="overflow-hidden border-y-2 border-ink bg-orange py-4" aria-hidden="true">
    <div class="marquee flex w-max">
      <ul v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
        <li v-for="(w, i) in words" :key="w" class="display flex items-center text-[1.5rem] text-ink sm:text-[1.85rem]">
          <span class="px-6">{{ w }}</span>
          <span class="h-4 w-4 rounded-full border-2 border-ink" :class="dots[i % 3]"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  animation: marquee 38s linear infinite;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    animation: none;
  }
}
</style>
