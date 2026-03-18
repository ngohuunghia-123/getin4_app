<template>
  <AppShell>
    <section class="mx-auto max-w-xl rounded-3xl border border-white/60 bg-white/55 p-6 shadow-soft backdrop-blur sm:p-10">
      <h2 class="text-2xl font-black tracking-tight text-slate-900">Admin login</h2>
      <p class="mt-1 text-sm text-slate-600">Simple auth (password) để CRUD câu hỏi.</p>

      <form class="mt-6 space-y-4" @submit.prevent="onLogin">
        <div>
          <label class="text-sm font-semibold text-slate-800">Password</label>
          <input
            v-model="password"
            type="password"
            class="mt-2 w-full rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-200 focus:bg-white"
            placeholder="Nhập admin password..."
            autocomplete="current-password"
          />
        </div>

        <button
          type="submit"
          class="w-full rounded-2xl bg-gradient-to-r from-crush-pink to-crush-lavender px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:brightness-95 disabled:opacity-60"
          :disabled="loading"
        >
          <span v-if="loading" class="animate-pulse">Đang đăng nhập...</span>
          <span v-else>Login</span>
        </button>

        <div class="text-center text-xs text-slate-500">
         
        </div>
      </form>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppShell from '../components/AppShell.vue'
import { useAdminAuth } from '../composables/useAdminAuth'
import { useToast } from '../composables/useToast'
import { api } from '../services/api'

const router = useRouter()
const toast = useToast()
const auth = useAdminAuth()

const password = ref('')
const loading = ref(false)

async function onLogin() {
  if (!password.value.trim()) {
    toast.push({ kind: 'error', title: 'Thiếu password' })
    return
  }

  loading.value = true
  try {
    const { data } = await api.post('/admin/login', { password: password.value })
    auth.setToken(data.data.token)
    toast.push({ kind: 'success', title: 'Đăng nhập OK' })
    await router.push('/admin/dashboard')
  } catch (e: any) {
    toast.push({
      kind: 'error',
      title: 'Login thất bại',
      message: e?.response?.data?.error?.message ?? e?.message,
    })
  } finally {
    loading.value = false
  }
}
</script>

