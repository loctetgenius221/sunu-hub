<script setup lang="ts">
import { useId } from 'vue'
import type { Option } from '@/data/questions'

// Choix unique (radio) ou multiple (checkbox) présenté en pastilles, cibles tactiles de 44 px.
const props = defineProps<{ options: Option[]; legend: string; multiple?: boolean; legendClass?: string }>()
const model = defineModel<string | string[] | undefined>()
const name = useId()

const checked = (v: string) => (props.multiple ? (model.value as string[] | undefined)?.includes(v) : model.value === v)

function toggle(v: string) {
  if (!props.multiple) return (model.value = v)
  const list = (model.value as string[] | undefined) ?? []
  model.value = list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}
</script>

<template>
  <fieldset>
    <legend :class="legendClass ?? 'label'">{{ legend }}</legend>
    <div class="flex flex-wrap gap-2.5">
      <label
        v-for="o in options"
        :key="o.value"
        class="inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 border-ink px-4 py-2 font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange"
        :class="checked(o.value) ? 'bg-navy text-white' : 'bg-white hover:bg-paper-2'"
      >
        <input
          :type="multiple ? 'checkbox' : 'radio'"
          :name="name"
          :value="o.value"
          :checked="checked(o.value)"
          class="sr-only"
          @change="toggle(o.value)"
        />
        {{ o.label }}
      </label>
    </div>
  </fieldset>
</template>
