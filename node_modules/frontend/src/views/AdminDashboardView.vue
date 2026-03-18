<template>
  <AppShell>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-black tracking-tight text-slate-900">Admin dashboard</h2>
        <p class="mt-1 text-sm text-slate-600">CRUD câu hỏi + xem câu trả lời.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="rounded-2xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/85"
          @click="activeTab = 'questions'"
          :class="activeTab === 'questions' ? 'ring-2 ring-rose-200' : ''"
        >
          Questions
        </button>
        <button
          class="rounded-2xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/85"
          @click="activeTab = 'answers'"
          :class="activeTab === 'answers' ? 'ring-2 ring-rose-200' : ''"
        >
          Answers
        </button>
        <button
          class="rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:brightness-95"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>

    <section v-if="activeTab === 'questions'" class="mt-6 grid gap-4 lg:grid-cols-[420px_1fr]">
      <div class="rounded-3xl border border-white/60 bg-white/55 p-5 shadow-soft backdrop-blur">
        <div class="flex items-center justify-between">
          <div class="text-sm font-black text-slate-900">
            {{ editingId ? 'Update question' : 'Create question' }}
          </div>
          <button
            v-if="editingId"
            class="text-xs font-semibold text-slate-600 hover:text-slate-900"
            @click="resetForm"
          >
            Clear
          </button>
        </div>

        <div class="mt-4 space-y-3">
          <div>
            <label class="text-xs font-semibold text-slate-700">Content</label>
            <textarea
              v-model="form.content"
              rows="3"
              class="mt-1 w-full resize-none rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-200 focus:bg-white"
              placeholder="Nội dung câu hỏi..."
            />
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="text-xs font-semibold text-slate-700">Type</label>
              <select
                v-model="form.type"
                class="mt-1 w-full rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-200 focus:bg-white"
              >
                <option value="text">text</option>
                <option value="single">single</option>
                <option value="multiple">multiple</option>
              </select>
            </div>

            <div v-if="form.type === 'text'">
              <label class="text-xs font-semibold text-slate-700">Text variant</label>
              <select
                v-model="textVariant"
                class="mt-1 w-full rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-200 focus:bg-white"
              >
                <option value="input">input</option>
                <option value="textarea">textarea</option>
              </select>
            </div>
          </div>

          <div v-if="form.type !== 'text'">
            <label class="text-xs font-semibold text-slate-700">Choices (comma separated)</label>
            <input
              v-model="choicesText"
              type="text"
              class="mt-1 w-full rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-200 focus:bg-white"
              placeholder="VD: Hồng pastel, Tím lavender, Trắng sữa"
            />
          </div>

          <button
            class="w-full rounded-2xl bg-gradient-to-r from-crush-pink to-crush-lavender px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:brightness-95 disabled:opacity-60"
            :disabled="saving"
            @click="saveQuestion"
          >
            <span v-if="saving" class="animate-pulse">Đang lưu...</span>
            <span v-else>{{ editingId ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </div>

      <div class="rounded-3xl border border-white/60 bg-white/55 p-5 shadow-soft backdrop-blur">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm font-black text-slate-900">All questions</div>
          <div class="flex gap-2">
            <button
              class="rounded-2xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/85"
              @click="loadQuestions"
              :disabled="loadingQuestions"
            >
              Reload
            </button>
          </div>
        </div>

        <div v-if="loadingQuestions" class="mt-4 grid gap-3 sm:grid-cols-2">
          <div v-for="i in 6" :key="i" class="h-24 animate-pulse rounded-2xl bg-white/60"></div>
        </div>

        <div v-else class="mt-4 grid gap-3 sm:grid-cols-2">
          <div
            v-for="q in questionList"
            :key="q.id"
            class="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur transition hover:bg-white/90"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold text-slate-900">{{ q.content }}</div>
                <div class="mt-1 text-xs text-slate-600">
                  <span class="rounded-full bg-white/80 px-2 py-0.5 font-semibold">{{ q.type }}</span>
                  <span class="ml-2">{{ fmt(q.createdAt) }}</span>
                </div>
              </div>
              <div class="flex shrink-0 gap-2">
                <button
                  class="rounded-xl border border-white/70 bg-white/70 px-3 py-1 text-xs font-bold text-slate-700 transition hover:bg-white"
                  @click="startEdit(q)"
                >
                  Edit
                </button>
                <button
                  class="rounded-xl bg-rose-500 px-3 py-1 text-xs font-bold text-white transition hover:brightness-105 active:brightness-95"
                  @click="removeQuestion(q.id)"
                >
                  Delete
                </button>
              </div>
            </div>

            <div v-if="q.type !== 'text'" class="mt-3 flex flex-wrap gap-1">
              <span
                v-for="c in getChoices(q)"
                :key="c"
                class="rounded-full border border-white/70 bg-white/75 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
              >
                {{ c }}
              </span>
            </div>
            <div v-else class="mt-3 text-xs text-slate-600">
              variant:
              <span class="font-semibold">{{ getVariant(q) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="mt-6 rounded-3xl border border-white/60 bg-white/55 p-5 shadow-soft backdrop-blur">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-sm font-black text-slate-900">Answers</div>
          <div class="mt-1 text-xs text-slate-600">Search sẽ match trong câu hỏi + trong answer (JSON stringify).</div>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            v-model="search"
            type="text"
            class="w-full rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-200 focus:bg-white sm:w-72"
            placeholder="Search..."
            @keydown.enter="loadAnswers"
          />
          <button
            class="rounded-2xl bg-gradient-to-r from-crush-rose to-crush-lavender px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:brightness-95 disabled:opacity-60"
            @click="loadAnswers"
            :disabled="loadingAnswers"
          >
            Reload
          </button>
        </div>
      </div>

      <div v-if="loadingAnswers" class="mt-4 h-40 animate-pulse rounded-2xl bg-white/60"></div>

      <div v-else class="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-white/70">
        <table class="w-full table-auto text-left text-sm">
          <thead class="bg-white/70 text-xs font-bold text-slate-600">
            <tr>
              <th class="px-4 py-3">Question</th>
              <th class="px-4 py-3">Answer</th>
              <th class="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in answerList" :key="a.id" class="border-t border-white/70">
              <td class="px-4 py-3 align-top">
                <div class="font-semibold text-slate-900">{{ a.question.content }}</div>
                <div class="mt-1 text-xs text-slate-600">
                  <span class="rounded-full bg-white/80 px-2 py-0.5 font-semibold">{{ a.question.type }}</span>
                </div>
              </td>
              <td class="px-4 py-3 align-top">
                <div class="whitespace-pre-wrap font-mono text-xs text-slate-800">{{ pretty(a.answer) }}</div>
              </td>
              <td class="px-4 py-3 align-top text-xs text-slate-600">
                {{ fmt(a.createdAt) }}
              </td>
            </tr>
            <tr v-if="answerList.length === 0">
              <td colspan="3" class="px-4 py-6 text-center text-sm text-slate-600">No answers yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppShell from '../components/AppShell.vue'
import { useAdminAuth } from '../composables/useAdminAuth'
import { useToast } from '../composables/useToast'
import { api, type AnswerRow, type Question, type QuestionType } from '../services/api'

const router = useRouter()
const toast = useToast()
const auth = useAdminAuth()

const activeTab = ref<'questions' | 'answers'>('questions')

const loadingQuestions = ref(false)
const saving = ref(false)
const questionList = ref<Question[]>([])
const editingId = ref<string | null>(null)
const form = reactive<{ content: string; type: QuestionType }>({ content: '', type: 'text' })
const textVariant = ref<'input' | 'textarea'>('input')
const choicesText = ref('')

const loadingAnswers = ref(false)
const answerList = ref<AnswerRow[]>([])
const search = ref('')

const normalizedChoices = computed(() =>
  choicesText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20),
)

function fmt(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

function pretty(v: any) {
  if (typeof v === 'string') return v
  return JSON.stringify(v, null, 2)
}

function resetForm() {
  editingId.value = null
  form.content = ''
  form.type = 'text'
  textVariant.value = 'input'
  choicesText.value = ''
}

function startEdit(q: Question) {
  editingId.value = q.id
  form.content = q.content
  form.type = q.type
  if (q.type === 'text') {
    textVariant.value = getVariant(q) === 'textarea' ? 'textarea' : 'input'
    choicesText.value = ''
  } else {
    textVariant.value = 'input'
    choicesText.value = getChoices(q).join(', ')
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getVariant(q: Question): 'input' | 'textarea' {
  const o = q.options ?? undefined
  const v =
    o && typeof o === 'object' && 'variant' in o ? (o as { variant?: 'input' | 'textarea' }).variant : undefined
  return v === 'textarea' ? 'textarea' : 'input'
}

function getChoices(q: Question): string[] {
  const o = q.options ?? undefined
  const raw = o && typeof o === 'object' && 'choices' in o ? (o as { choices?: unknown }).choices : undefined
  return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : []
}

async function loadQuestions() {
  loadingQuestions.value = true
  try {
    const { data } = await api.get('/admin/questions')
    questionList.value = data.data ?? []
  } catch (e: any) {
    toast.push({ kind: 'error', title: 'Load questions failed', message: e?.message })
  } finally {
    loadingQuestions.value = false
  }
}

function questionPayload() {
  if (form.type === 'text') {
    return { content: form.content, type: form.type, options: { variant: textVariant.value } }
  }
  return { content: form.content, type: form.type, options: { choices: normalizedChoices.value } }
}

async function saveQuestion() {
  if (!form.content.trim()) {
    toast.push({ kind: 'error', title: 'Thiếu content' })
    return
  }
  if (form.type !== 'text' && normalizedChoices.value.length === 0) {
    toast.push({ kind: 'error', title: 'Thiếu choices', message: 'Nhập choices, cách nhau bằng dấu phẩy.' })
    return
  }

  saving.value = true
  try {
    if (!editingId.value) {
      await api.post('/admin/questions', questionPayload())
      toast.push({ kind: 'success', title: 'Created question' })
    } else {
      await api.put(`/admin/questions/${editingId.value}`, questionPayload())
      toast.push({ kind: 'success', title: 'Updated question' })
    }
    resetForm()
    await loadQuestions()
  } catch (e: any) {
    toast.push({
      kind: 'error',
      title: 'Save failed',
      message: e?.response?.data?.error?.message ?? e?.message,
    })
  } finally {
    saving.value = false
  }
}

async function removeQuestion(id: string) {
  if (!window.confirm('Delete question?')) return
  try {
    await api.delete(`/admin/questions/${id}`)
    toast.push({ kind: 'success', title: 'Deleted' })
    await loadQuestions()
  } catch (e: any) {
    toast.push({ kind: 'error', title: 'Delete failed', message: e?.message })
  }
}

async function loadAnswers() {
  loadingAnswers.value = true
  try {
    const { data } = await api.get('/admin/answers', { params: search.value ? { q: search.value } : undefined })
    answerList.value = data.data ?? []
  } catch (e: any) {
    toast.push({ kind: 'error', title: 'Load answers failed', message: e?.message })
  } finally {
    loadingAnswers.value = false
  }
}

async function logout() {
  auth.setToken(null)
  toast.push({ kind: 'info', title: 'Logged out' })
  await router.push('/admin')
}

onMounted(async () => {
  await loadQuestions()
  await loadAnswers()
})
</script>

