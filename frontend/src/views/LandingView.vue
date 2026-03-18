<template>
  <AppShell>
    <section class="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-6 shadow-soft backdrop-blur sm:p-10">
      <HeartField />

      <div class="relative">
        <div
          class="inline-flex animate-fadeUp items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700"
        >
          <span class="h-2 w-2 rounded-full bg-rose-400"></span>
          A tiny form for big feelings
        </div>

        <h1 class="mt-4 animate-fadeUp text-balance text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          get-in4 — hỏi chút thôi, hiểu nhau thêm.
        </h1>

        <p class="mt-4 max-w-2xl animate-fadeUp text-pretty text-base text-slate-700 sm:text-lg">
          Một chiếc landing nhẹ nhàng để bạn gửi vài câu hỏi dễ thương, 
          giúp hai người hiểu nhau hơn một chút mỗi ngày 💗
        </p>

        <div class="mt-7 flex flex-col gap-3 sm:flex-row">
          <RouterLink
            to="/form"
            class="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-crush-pink to-crush-lavender px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:brightness-95"
          >
            Điền form ngay
            <span class="transition group-hover:translate-x-0.5">→</span>
          </RouterLink>
          <RouterLink
            to="/admin"
            class="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/60 px-5 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/85"
          >
            Vào admin
          </RouterLink>
        </div>

        <div class="mt-10 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur">
            <div class="text-sm font-semibold text-slate-900">🌸Giao diện nhẹ nhàng</div>
            <div class="mt-1 text-sm text-slate-600"> Màu pastel dịu mắt, phù hợp mọi cảm xúc.</div>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur">
            <div class="text-sm font-semibold text-slate-900">💬Câu hỏi linh hoạt</div>
            <div class="mt-1 text-sm text-slate-600">Text, chọn đáp án, checkbox – hỏi gì cũng được.</div>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur">
            <div class="text-sm font-semibold text-slate-900">⚙️Quản lý dễ dàng</div>
            <div class="mt-1 text-sm text-slate-600">Tạo, sửa, xoá câu hỏi và xem câu trả lời nhanh chóng.</div>
          </div>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AppShell from '../components/AppShell.vue'
import HeartField from '../components/HeartField.vue'
</script>

