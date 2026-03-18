<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    <span
      v-for="h in hearts"
      :key="h.id"
      class="absolute select-none text-rose-400/70 blur-[0.2px]"
      :style="{
        left: h.left,
        bottom: h.bottom,
        fontSize: h.size,
        animationDelay: h.delay,
        animationDuration: h.duration,
      }"
      aria-hidden="true"
    >
      ♥
    </span>
  </div>
</template>

<script setup lang="ts">
const hearts = Array.from({ length: 14 }).map((_, i) => {
  const pct = (n: number) => `${n}%`
  const rand = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1))
  return {
    id: i,
    left: pct(rand(2, 98)),
    bottom: pct(rand(-10, 30)),
    size: `${rand(12, 22)}px`,
    delay: `${rand(0, 45) / 10}s`,
    duration: `${rand(45, 75) / 10}s`,
  }
})
</script>

<style scoped>
span {
  animation-name: heartDrift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
</style>

