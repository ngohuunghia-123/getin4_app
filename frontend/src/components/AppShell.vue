<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    <header class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <RouterLink
        to="/"
        class="group inline-flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 backdrop-blur transition hover:bg-white/80"
      >
        <span class="text-xl font-black tracking-tight text-slate-900">get-in4</span>
        <span
          class="rounded-full bg-gradient-to-r from-crush-pink to-crush-lavender px-2 py-0.5 text-[11px] font-semibold text-white shadow-soft"
        >
          crush vibe
        </span>
      </RouterLink>

      <nav class="flex flex-wrap gap-2">
        <RouterLink
          to="/form"
          class="rounded-2xl border border-white/60 bg-white/55 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/80"
        >
          Điền form
        </RouterLink>
        <RouterLink
          to="/admin"
          class="rounded-2xl border border-white/60 bg-white/55 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/80"
        >
          Admin
        </RouterLink>
      </nav>
    </header>

    <main class="mt-8">
      <slot />
    </main>

    <footer class="mt-10 pb-6 text-center text-xs text-slate-500">
      Made with pastel gradients & soft hearts.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

