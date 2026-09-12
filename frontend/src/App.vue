<template>
  <Navbar v-if="!hideNavbar" />

  <main
    class="main-content"
    :class="contentClass"
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
  return ['login', 'cadastro-usuario'].includes(route.name)
})

const contentClass = computed(() => {
  if (route.name === 'login') return 'login-content'
  if (route.name === 'cadastro-usuario') return 'cadastro-content'
  return ''
})
</script>

<style>
@import './assets/css/App.css';
</style>