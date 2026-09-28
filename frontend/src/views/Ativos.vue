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
          Tipo: Todos
        </option>

        <option value="Computador">
          Gabinete
        </option>

        <option value="Monitor">
          Monitor
        </option>

        <option value="Impressora">
          Teclado
        </option>
      </select>

      <select
        v-model="selectedRoom"
        class="filter-select"
      >
        <option value="">
          Sala: Todas
        </option>

        <option value="B-111">
          B-111
        </option>
      </select>
    </div>

    <!-- Carregando -->
    <div
      v-if="ativosStore.carregando"
      class="status-message"
    >
      Carregando ativos...
    </div>

    <!-- Erro -->
    <div
      v-else-if="ativosStore.erro"
      class="status-message error"
    >
      {{ ativosStore.erro }}
    </div>

    <!-- Tabela -->
    <div
      v-else
      class="assets-table"
    >
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
          Mostrando {{ filteredRows.length }} de {{ ativosStore.ativos.length }} ativos
        </span>

        <div class="pagination-buttons">
          <button
            type="button"
            class="pagination-button"
            disabled
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import Table from '../components/Table.vue'
import { useAtivosStore } from '../stores/ativos'

import '../assets/css/Ativos.css'

const router = useRouter()
const ativosStore = useAtivosStore()

const search = ref('')
const selectedCategory = ref('')
const selectedRoom = ref('')

const tableHeaders = [
  'Descrição',
  'Tipo',
  'Patrimônio',
  'Sala',
  'Status'
]

onMounted(() => {
  ativosStore.fetchAtivos()
})

const filteredRows = computed(() => {
  const termo = search.value.toLowerCase().trim()

  return ativosStore.ativos
    .filter((ativo) => {
      const descricao = ativo.descricao?.toLowerCase() || ''
      const patrimonio =
        ativo.numero_patrimonio?.toLowerCase() || ''

      const correspondePesquisa =
        !termo ||
        descricao.includes(termo) ||
        patrimonio.includes(termo)

      const tipo =
        ativo.tipo?.descricao ||
        ativo.tipo ||
        ''

      const correspondetipo =
        !selectedCategory.value ||
        tipo === selectedCategory.value

      const correspondeSala =
        !selectedRoom.value ||
        ativo.sala === selectedRoom.value

      return (
        correspondePesquisa &&
        correspondetipo &&
        correspondeSala
      )
    })
    .map((ativo) => [
      ativo.descricao || '-',
      ativo.tipo?.descricao || ativo.tipo || '-',
      ativo.numero_patrimonio || '-',
      ativo.sala || '-',
      ativo.status || '-'
    ])
})

const editarAtivo = (ativo) => {
  console.log('Editar ativo:', ativo)

}

const deletarAtivo = async (ativo) => {
  const confirmar = confirm(
    `Deseja excluir o ativo "${ativo.descricao}"?`
  )

  if (!confirmar) {
    return
  }

  await ativosStore.deleteAtivo(ativo.id)
}
</script>