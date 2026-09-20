<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link
        to="/dashboard"
        class="logo"
      >
        <img
          src="../assets/easy-asset-logo-verde.svg"
          alt="Easy Asset"
          class="logo-img"
        >
      </router-link>

      <!-- Menu -->
      <ul class="nav-links">
        <!-- Dashboard -->
        <li>
          <router-link to="/dashboard">
            <LayoutDashboard
              class="nav-icon"
              :size="15"
              :stroke-width="1.8"
            />
            <span>Dashboard</span>
          </router-link>
        </li>

        <!-- Ativos -->
        <li>
          <router-link to="/ativos">
            <Package
              class="nav-icon"
              :size="15"
              :stroke-width="1.8"
            />
            <span>Ativos</span>
          </router-link>
        </li>

        <!-- Manutenção -->
        <li>
          <router-link to="/manutencao">
            <Wrench
              class="nav-icon"
              :size="15"
              :stroke-width="1.8"
            />
            <span>Manutenção</span>
          </router-link>
        </li>

        <!-- Categorias -->
        <li>
          <router-link to="/categorias">
            <Grid2X2
              class="nav-icon"
              :size="15"
              :stroke-width="1.8"
            />
            <span>Categorias</span>
          </router-link>
        </li>

        <!-- Relatórios -->
        <li>
          <router-link to="/relatorios">
            <ChartNoAxesColumnIncreasing
              class="nav-icon"
              :size="15"
              :stroke-width="1.8"
            />
            <span>Relatórios</span>
          </router-link>
        </li>

        <!-- Configurações -->
        <li>
          <router-link to="/configuracoes">
            <Settings
              class="nav-icon"
              :size="15"
              :stroke-width="1.8"
            />
            <span>Configurações</span>
          </router-link>
        </li>
      </ul>

      <!-- Usuário -->
      <div class="user-menu">
        <!-- Avatar -->
        <div class="user-avatar">
          <span>
            {{ primeiraLetra }}
          </span>
        </div>

        <!-- Informações -->
        <div class="user-info">
          <span class="user-name">
            {{ nomeUsuario }}
          </span>

          <span class="user-role">
            {{ papelUsuario }}
          </span>

          <button
            type="button"
            class="logout-button"
            @click="handleLogout"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

import {
  Settings,
  LayoutDashboard,
  Package,
  Wrench,
  Grid2X2,
  ChartNoAxesColumnIncreasing
} from 'lucide-vue-next'

import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import '../assets/css/Navbar.css'

const router = useRouter()
const authStore = useAuthStore()

/*
 * Nome do usuário
 */
const nomeUsuario = computed(() => {
  return (
    authStore.usuario?.first_name ||
    authStore.usuario?.username ||
    'Usuário'
  )
})

/*
 * Papel do usuário
 */
const papelUsuario = computed(() => {
  return authStore.usuario?.papel || 'Usuário'
})

/*
 * Primeira letra para o avatar
 */
const primeiraLetra = computed(() => {
  return nomeUsuario.value
    .charAt(0)
    .toUpperCase()
})

/*
 * Logout
 */
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>