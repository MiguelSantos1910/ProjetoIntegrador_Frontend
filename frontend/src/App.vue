<template>
  <Navbar v-if="!hideNavbar" />

  <main
    class="main-content"
    :class="{ 'login-content': hideNavbar }"
  >
    <RouterView />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Navbar from './components/Navbar.vue'

const route = useRoute()

const hideNavbar = computed(() => {
  return ['login', 'cadastro'].includes(route.name)
})
</script>

<style>
@import './assets/css/App.css';
</style>