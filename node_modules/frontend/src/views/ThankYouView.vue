<template>
  <AppShell>
    <section class="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-soft backdrop-blur sm:p-12">
      <HeartField />

      <div class="relative text-center">
        <div class="mx-auto grid h-14 w-14 animate-floaty place-items-center rounded-2xl bg-gradient-to-r from-crush-pink to-crush-lavender text-2xl text-white shadow-soft">
          ♥
        </div>
        <h2 class="mt-5 text-3xl font-black tracking-tight text-slate-900">Thank you!</h2>
        <p class="mt-2 text-sm text-slate-600">Câu trả lời của bạn đã được lưu lại.</p>

        <div class="mx-auto mt-7 max-w-2xl rounded-2xl border border-white/70 bg-white/70 p-5 text-left backdrop-blur">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Quote tình yêu (random)</div>
          <div class="mt-2 text-balance text-lg font-semibold text-slate-900">“{{ quote }}”</div>
        </div>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <RouterLink
            to="/"
            class="rounded-2xl border border-white/70 bg-white/60 px-5 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/85"
          >
            Về landing
          </RouterLink>
          <RouterLink
            to="/form"
            class="rounded-2xl bg-gradient-to-r from-crush-rose to-crush-lavender px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:brightness-95"
          >
            Điền lại form
          </RouterLink>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import AppShell from '../components/AppShell.vue'
import HeartField from '../components/HeartField.vue'

const quotes = [
  'Thích một người là thấy cả thế giới bỗng mềm hơn.',
  'Em không bận, em chỉ đang… nhớ anh một chút thôi.',
  'Có những ngày chẳng cần gì nhiều, chỉ cần một tin nhắn “em ổn không?”.',
  'Nếu được chọn lại, mình vẫn muốn gặp nhau đúng lúc ấy.',
  'Romantic nhất là khi ai đó để ý những điều rất nhỏ.',
  'Anh là lý do khiến “về nhà” nghe ấm hơn.',
]

const quote = computed(() => quotes[Math.floor(Math.random() * quotes.length)])
</script>

