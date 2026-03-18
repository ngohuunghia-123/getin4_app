import { computed, ref, watchEffect } from 'vue'

import { setAdminToken } from '../services/api'

const KEY = 'get-in4.adminToken'
const token = ref<string | null>(localStorage.getItem(KEY))

watchEffect(() => setAdminToken(token.value))

export function useAdminAuth() {
  const isAuthed = computed(() => Boolean(token.value))

  function setToken(next: string | null) {
    token.value = next
    if (next) localStorage.setItem(KEY, next)
    else localStorage.removeItem(KEY)
  }

  return { token, isAuthed, setToken }
}

