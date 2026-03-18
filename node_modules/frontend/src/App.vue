<template>
  <div class="min-h-screen bg-crush-gradient">
    <RouterView />
    <ToastHost />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import ToastHost from './components/ToastHost.vue'
</script>
