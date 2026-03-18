<template>
  <div class="pointer-events-none fixed right-4 top-4 z-50 flex w-[92vw] max-w-sm flex-col gap-2">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <div
        v-for="t in items"
        :key="t.id"
        class="pointer-events-auto animate-fadeUp rounded-2xl border border-white/60 bg-white/75 p-3 shadow-soft backdrop-blur"
      >
        <div class="flex items-start gap-3">
          <div
            class="mt-0.5 grid h-8 w-8 place-items-center rounded-xl"
            :class="iconBg(t.kind)"
            aria-hidden="true"
          >
            <span class="text-white">{{ icon(t.kind) }}</span>
          </div>
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold text-slate-900">{{ t.title }}</div>
            <div v-if="t.message" class="mt-0.5 line-clamp-2 text-sm text-slate-700">
              {{ t.message }}
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { items } = useToast()

function icon(kind: string) {
  if (kind === 'success') return '✓'
  if (kind === 'error') return '!'
  return 'i'
}

function iconBg(kind: string) {
  if (kind === 'success') return 'bg-emerald-500'
  if (kind === 'error') return 'bg-rose-500'
  return 'bg-indigo-500'
}
</script>

<style scoped>
.toast-move,
.toast-enter-active,
.toast-leave-active {
  transition: all 220ms ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.toast-leave-active {
  position: absolute;
}
</style>

