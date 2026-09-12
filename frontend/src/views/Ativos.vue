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
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Pesquisar ativos..."
          >
        </div>

        <button
          type="button"
          class="btn-new-asset"
          @click="$router.push('/ativos/novo')"
        >
          + Novo Ativo
        </button>
      </div>
    </header>

    <!-- Filtros -->
    <div class="filters">
      <select
        v-model="selectedCategory"
        class="filter-select"
      >
        <option value="">
          Categoria: Todas
        </option>

        <option value="TI">
          TI
        </option>

        <option value="Veículos">
          Veículos
        </option>

        <option value="Mobiliário">
          Mobiliário
        </option>
      </select>

      <select
        v-model="selectedLocation"
        class="filter-select"
      >
        <option value="">
          Localização: Todas
        </option>

        <option value="Sede">
          Sede
        </option>

        <option value="Filial">
          Filial
        </option>

        <option value="Datacenter">
          Datacenter
        </option>
      </select>
    </div>

    <!-- Tabela -->
    <div class="assets-table">
      <Table
        title="Lista de Ativos"
        :headers="tableHeaders"
        :rows="filteredRows"
        :show-actions="true"
        @edit="editarAtivo"
        @delete="deletarAtivo"
      />

      <!-- Paginação -->
      <div class="pagination">
        <span class="pagination-info">
          Mostrando 1-8 de {{ assets.length }} ativos
        </span>

        <div class="pagination-buttons">
          <button
            type="button"
            class="pagination-button"
          >
            Anterior
          </button>

          <button
            type="button"
            class="pagination-button active"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Table from '../components/Table.vue'

import '../assets/css/Ativos.css'

const search = ref('')
const selectedCategory = ref('')
const selectedLocation = ref('')

const assets = ref([
  {
    id: 1,
    nome: 'Ativo 1',
    categoria: 'TI',
    localizacao: 'Sede',
    status: 'Ativo'
  },
  {
    id: 2,
    nome: 'Ativo 2',
    categoria: 'Veículos',
    localizacao: 'Filial',
    status: 'Inativo'
  },
  {
    id: 3,
    nome: 'Ativo 3',
    categoria: 'Mobiliário',
    localizacao: 'Datacenter',
    status: 'Ativo'
  },
  {
    id: 4,
    nome: 'Ativo 4',
    categoria: 'TI',
    localizacao: 'Sede',
    status: 'Inativo'
  },
  {
    id: 5,
    nome: 'Ativo 5',
    categoria: 'Veículos',
    localizacao: 'Filial',
    status: 'Ativo'
  },
  {
    id: 6,
    nome: 'Ativo 6',
    categoria: 'Mobiliário',
    localizacao: 'Datacenter',
    status: 'Inativo'
  },
  {
    id: 7,
    nome: 'Ativo 7',
    categoria: 'TI',
    localizacao: 'Sede',
    status: 'Ativo'
  },
  {
    id: 8,
    nome: 'Ativo 8',
    categoria: 'Veículos',
    localizacao: 'Filial',
    status: 'Inativo'
  }
])

const tableHeaders = [
  'ID',
  'Nome',
  'Categoria',
  'Localização',
  'Status'
]

const filteredAssets = computed(() => {
  const term = search.value.toLowerCase().trim()

  return assets.value.filter((asset) => {
    const matchesSearch =
      !term ||
      asset.nome.toLowerCase().includes(term) ||
      asset.categoria.toLowerCase().includes(term) ||
      asset.localizacao.toLowerCase().includes(term)

    const matchesCategory =
      !selectedCategory.value ||
      asset.categoria === selectedCategory.value

    const matchesLocation =
      !selectedLocation.value ||
      asset.localizacao === selectedLocation.value

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation
    )
  })
})

const filteredRows = computed(() => {
  return filteredAssets.value.map((asset) => [
    asset.id,
    asset.nome,
    asset.categoria,
    asset.localizacao,
    asset.status
  ])
})

const editarAtivo = (row) => {
  console.log('Editar ativo:', row)
}

const deletarAtivo = (row) => {
  console.log('Excluir ativo:', row)
}
</script>