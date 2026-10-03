import { ref } from 'vue'

// Messages de confirmation brefs, affichés par ToastHost (un seul hôte dans App).
export interface Toast {
  id: number
  text: string
}

const toasts = ref<Toast[]>([])
let next = 0

export function useToast() {
  function show(text: string, ms = 3200) {
    const id = next++
    toasts.value.push({ id, text })
    setTimeout(() => (toasts.value = toasts.value.filter((t) => t.id !== id)), ms)
  }
  return { toasts, show }
}
