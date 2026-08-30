<template>
  <div class="ativos-page">
    <!-- Cabeçalho -->
    <header class="ativos-header">
      <h1 class="ativos-title">
        Ativos Cadastrados
      </h1>

      <div class="ativos-actions">
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Pesquisar ativos..."
          >
        </div>

        <button
          class="btn-new-asset"
          @click="$router.push('/ativos/novo')"
        >
          + Novo Ativo
        </button>
      </div>
    </header>


    <!-- Filtros -->
    <div class="filters">
      <select class="filter-select">
        <option>Categoria: Todas</option>
        <option>TI</option>
        <option>Veículos</option>
        <option>Mobiliário</option>
      </select>

      <select class="filter-select">
        <option>Localização: Todas</option>
        <option>Sede</option>
        <option>Filial</option>
        <option>Datacenter</option>
      </select>
    </div>


    <!-- Tabela -->
    <div class="assets-table">
      <Table
        title="Lista de Ativos"
        :headers="['ID', 'Nome', 'Categoria', 'Localização', 'Status']"
        :rows="[
          [1, 'Ativo 1', 'TI', 'Sede', 'Ativo'],
          [2, 'Ativo 2', 'Veículos', 'Filial', 'Inativo'],
          [3, 'Ativo 3', 'Mobiliário', 'Datacenter', 'Ativo'],
          [4, 'Ativo 4', 'TI', 'Sede', 'Inativo'],
          [5, 'Ativo 5', 'Veículos', 'Filial', 'Ativo'],
          [6, 'Ativo 6', 'Mobiliário', 'Datacenter', 'Inativo'],
          [7, 'Ativo 7', 'TI', 'Sede', 'Ativo'],
          [8, 'Ativo 8', 'Veículos', 'Filial', 'Inativo']
        ]"
        @edit="editarAtivo"
        @delete="deletarAtivo"
      />

      <!-- Paginação -->
      <div class="pagination">
        <span class="pagination-info">
          Mostrando 1-8 de 432 ativos
        </span>

        <div class="pagination-buttons">
          <button class="pagination-button">
            Anterior
          </button>

          <button class="pagination-button active">
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Table from '../components/Table.vue'

import '../assets/css/Ativos.css'
</script>