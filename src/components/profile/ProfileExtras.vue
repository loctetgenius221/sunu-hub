<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'

// Compléments de profil, enregistrés au fil de la saisie.
const store = useProfileStore()
const extras = store.state.extras
const skill = ref('')

function addSkill() {
  const s = skill.value.trim()
  if (s && !extras.skills.includes(s) && extras.skills.length < 10) extras.skills.push(s)
  skill.value = ''
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div>
      <label for="school" class="label">Établissement actuel ou dernier fréquenté</label>
      <input id="school" v-model.lazy.trim="extras.school" class="field" placeholder="Ex. : Lycée Blaise Diagne" />
    </div>

    <div>
      <label for="skill" class="label">Compétences (jusqu'à 10)</label>
      <form class="flex gap-2" @submit.prevent="addSkill">
        <input id="skill" v-model="skill" class="field" placeholder="Ex. : Excel, prise de parole, Python" />
        <button type="submit" class="shrink-0 rounded-control bg-paper-2 px-5 font-medium transition-colors hover:bg-[#e8e8ed]">Ajouter</button>
      </form>
      <ul v-if="extras.skills.length" class="mt-3 flex flex-wrap gap-2">
        <li v-for="s in extras.skills" :key="s" class="inline-flex items-center gap-1 rounded-full bg-navy-soft py-1 pr-1.5 pl-3.5 text-[0.9375rem] font-medium text-navy">
          {{ s }}
          <button type="button" class="grid h-6 w-6 place-items-center rounded-full hover:bg-white/70" @click="extras.skills.splice(extras.skills.indexOf(s), 1)">
            <X :size="14" aria-hidden="true" />
            <span class="sr-only">Retirer {{ s }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div>
      <label for="avail" class="label">Disponibilité</label>
      <select id="avail" v-model="extras.availability" class="field">
        <option value="">Non précisée</option>
        <option value="immediate">Tout de suite</option>
        <option value="trois-mois">Dans les 3 mois</option>
        <option value="six-mois">Dans les 6 mois</option>
      </select>
    </div>
  </div>
</template>
