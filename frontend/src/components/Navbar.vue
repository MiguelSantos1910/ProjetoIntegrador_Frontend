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
        <div class="user-avatar">
          <span>A</span>
        </div>

        <div class="user-info">
          <span class="user-name">
            Admin
          </span>

          <span class="user-role">
            Admin
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>


<script setup>
import {
  Settings,
  LayoutDashboard,
  Package,
  Wrench,
  Grid2X2,
  ChartNoAxesColumnIncreasing
} from 'lucide-vue-next'

import '../assets/css/Navbar.css'
</script>