import { computed, reactive } from 'vue'

export type Toast = {
  id: string
  title: string
  message?: string
  kind: 'success' | 'error' | 'info'
}

const state = reactive({
  items: [] as Toast[],
})

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

export function useToast() {
  const items = computed(() => state.items)

  function push(t: Omit<Toast, 'id'>, ms = 2400) {
    const id = uid()
    state.items.push({ ...t, id })
    window.setTimeout(() => {
      const idx = state.items.findIndex((x) => x.id === id)
      if (idx >= 0) state.items.splice(idx, 1)
    }, ms)
  }

  return {
    items,
    push,
  }
}

