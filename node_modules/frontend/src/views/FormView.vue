<template>
  <AppShell>
    <section class="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-soft backdrop-blur sm:p-10">
      <HeartField />

      <div class="relative">
        <div class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-2xl font-black tracking-tight text-slate-900">Form câu hỏi</h2>
            <p class="mt-1 text-sm text-slate-600">Trả lời thật nhẹ nhàng nhé.</p>
          </div>
          <button
            type="button"
            class="rounded-2xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/85"
            @click="reload"
            :disabled="loading"
          >
            Reload
          </button>
        </div>

        <div v-if="loading" class="mt-8 grid gap-3 sm:grid-cols-2">
          <div v-for="i in 4" :key="i" class="h-28 animate-pulse rounded-2xl bg-white/60"></div>
        </div>

        <form v-else class="mt-8 space-y-4" @submit.prevent="onSubmit">
          <div
            v-for="(q, idx) in questions"
            :key="q.id"
            class="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur transition hover:bg-white/75"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-semibold text-slate-500">#{{ idx + 1 }}</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">
                  {{ q.content }}
                </div>
              </div>
              <span
                class="shrink-0 rounded-full bg-white/75 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
              >
                {{ q.type }}
              </span>
            </div>

            <div class="mt-3">
              <template v-if="q.type === 'text'">
                <textarea
                  v-if="textVariant(q) === 'textarea'"
                  v-model="values[q.id]"
                  rows="4"
                  class="w-full resize-none rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-200 focus:bg-white"
                  placeholder="Gõ nhẹ vài dòng..."
                />
                <input
                  v-else
                  v-model="values[q.id]"
                  type="text"
                  class="w-full rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-200 focus:bg-white"
                  placeholder="Gõ câu trả lời..."
                />
              </template>

              <template v-else-if="q.type === 'single'">
                <div class="grid gap-2 sm:grid-cols-2">
                  <label
                    v-for="c in choices(q)"
                    :key="c"
                    class="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm text-slate-800 transition hover:bg-white/90"
                  >
                    <input
                      class="h-4 w-4 accent-rose-400"
                      type="radio"
                      :name="q.id"
                      :value="c"
                      v-model="values[q.id]"
                    />
                    <span class="truncate">{{ c }}</span>
                  </label>
                </div>
              </template>

              <template v-else-if="q.type === 'multiple'">
                <div class="grid gap-2 sm:grid-cols-2">
                  <label
                    v-for="c in choices(q)"
                    :key="c"
                    class="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm text-slate-800 transition hover:bg-white/90"
                  >
                    <input
                      class="h-4 w-4 accent-rose-400"
                      type="checkbox"
                      :value="c"
                      :checked="Array.isArray(values[q.id]) && values[q.id].includes(c)"
                      @change="toggleMulti(q.id, c)"
                    />
                    <span class="truncate">{{ c }}</span>
                  </label>
                </div>
              </template>
            </div>

            <div v-if="errors[q.id]" class="mt-2 text-sm font-semibold text-rose-600">
              {{ errors[q.id] }}
            </div>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="text-xs text-slate-600">
              Tip: chọn câu trả lời đúng “vibe” của bạn, không cần hoàn hảo.
            </div>
            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-crush-rose to-crush-lavender px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:brightness-95 disabled:opacity-60"
              :disabled="submitting"
            >
              <span v-if="submitting" class="animate-pulse">Đang gửi...</span>
              <span v-else>Submit</span>
              <span>♥</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppShell from '../components/AppShell.vue'
import HeartField from '../components/HeartField.vue'
import { useToast } from '../composables/useToast'
import { api, type Question } from '../services/api'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const submitting = ref(false)
const questions = ref<Question[]>([])
const values = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string>>({})

function textVariant(q: Question) {
  const o = q.options ?? undefined
  const v =
    o && typeof o === 'object' && 'variant' in o ? (o as { variant?: 'input' | 'textarea' }).variant : undefined
  return v === 'textarea' ? 'textarea' : 'input'
}

function choices(q: Question): string[] {
  const o = q.options ?? undefined
  const raw = o && typeof o === 'object' && 'choices' in o ? (o as { choices?: unknown }).choices : undefined
  return Array.isArray(raw) ? raw : []
}

function setError(id: string, msg: string) {
  errors[id] = msg
}

function clearErrors() {
  for (const k of Object.keys(errors)) delete errors[k]
}

function validate(): boolean {
  clearErrors()
  let ok = true
  for (const q of questions.value) {
    const v = values[q.id]
    if (q.type === 'text') {
      if (typeof v !== 'string' || !v.trim()) {
        ok = false
        setError(q.id, 'Câu này cần bạn trả lời một chút nha.')
      }
    } else if (q.type === 'single') {
      if (typeof v !== 'string' || !v) {
        ok = false
        setError(q.id, 'Chọn 1 option giúp mình nhé.')
      }
    } else if (q.type === 'multiple') {
      if (!Array.isArray(v) || v.length === 0) {
        ok = false
        setError(q.id, 'Chọn ít nhất 1 option nha.')
      }
    }
  }
  return ok
}

function toggleMulti(questionId: string, choice: string) {
  const cur = values[questionId]
  const arr = Array.isArray(cur) ? [...cur] : []
  const idx = arr.indexOf(choice)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(choice)
  values[questionId] = arr
}

async function reload() {
  loading.value = true
  try {
    const { data } = await api.get('/questions')
    questions.value = data.data ?? []
    for (const q of questions.value) {
      if (q.type === 'multiple') values[q.id] = []
      else values[q.id] = ''
    }
  } catch (e: any) {
    toast.push({ kind: 'error', title: 'Không load được câu hỏi', message: e?.message })
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  if (!validate()) {
    toast.push({ kind: 'error', title: 'Chưa xong rồi', message: 'Bạn xem lại vài câu đang thiếu nha.' })
    return
  }

  submitting.value = true
  try {
    await api.post('/answers', {
      answers: questions.value.map((q) => ({ questionId: q.id, value: values[q.id] })),
    })
    toast.push({ kind: 'success', title: 'Gửi thành công', message: 'Cảm ơn bạn vì đã trả lời.' })
    await router.push('/thank-you')
  } catch (e: any) {
    toast.push({ kind: 'error', title: 'Gửi thất bại', message: e?.response?.data?.error?.message ?? e?.message })
  } finally {
    submitting.value = false
  }
}

onMounted(() => void reload())
</script>

