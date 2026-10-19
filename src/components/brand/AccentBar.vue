<script setup lang="ts">
// Barre d'accent orange, reprise du macron du logo (au-dessus du « U » de HŪB).
// Signature discrète : une par en-tête, au-dessus du titre. Décorative, jamais porteuse de sens.
withDefaults(defineProps<{ center?: boolean }>(), { center: false })
</script>

<template>
  <span class="block h-1 w-10 bg-brand-orange sm:h-[5px] sm:w-12" :class="center && 'mx-auto'" aria-hidden="true"></span>
</template>
