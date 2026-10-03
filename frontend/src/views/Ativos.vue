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
          @click="router.push('/ativos/novo')"
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

        <option value="GABINETE">
          Gabinete
        </option>

        <option value="MONITOR">
          Monitor
        </option>

        <option value="TECLADO">
          Teclado
        </option>

        <option value="MESA">
          Mesa
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
        @delete="handleDelete"
      />

      <!-- Paginação -->
      <div class="pagination">
        <span class="pagination-info">
          Mostrando
          {{ filteredRows.length }}
          de
          {{ ativosStore.ativos.length }}
          ativos
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
            disabled
          >
            Próximo
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de exclusão -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Excluir Ativo?"
      subtitle="Esta ação não poderá ser desfeita."
      :item-name="selectedAtivo?.descricao || ''"
      :item-info="
        selectedAtivo
          ? `${selectedAtivo.tipo || 'Ativo'} • ${selectedAtivo.sala || '-'}`
          : ''
      "
      message="O ativo será removido do sistema."
      confirm-text="Confirmar Exclusão"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import { useRouter } from 'vue-router'

import Table from '../components/Table.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

import { useAtivosStore } from '../stores/ativos'

import '../assets/css/Ativos.css'

const router = useRouter()
const ativosStore = useAtivosStore()

const search = ref('')
const selectedCategory = ref('')
const selectedRoom = ref('')

const showDeleteModal = ref(false)
const selectedAtivo = ref(null)

const tableHeaders = [
  'Descrição',
  'Tipo',
  'Patrimônio',
  'Sala',
  'Status'
]


onMounted(async () => {
  await ativosStore.fetchAtivos()
})


const filteredAtivos = computed(() => {
  const termo = search.value
    .toLowerCase()
    .trim()

  return ativosStore.ativos.filter((ativo) => {
    const descricao =
      ativo.descricao?.toLowerCase() || ''

    const patrimonio =
      ativo.numero_patrimonio
        ?.toLowerCase() || ''

    const correspondePesquisa =
      !termo ||
      descricao.includes(termo) ||
      patrimonio.includes(termo)

    const tipo = ativo.tipo || ''

    const correspondeTipo =
      !selectedCategory.value ||
      tipo === selectedCategory.value

    const correspondeSala =
      !selectedRoom.value ||
      ativo.sala === selectedRoom.value

    return (
      correspondePesquisa &&
      correspondeTipo &&
      correspondeSala
    )
  })
})


const filteredRows = computed(() => {
  return filteredAtivos.value.map((ativo) => [
    ativo.descricao || '-',
    ativo.tipo || '-',
    ativo.numero_patrimonio || '-',
    ativo.sala || '-',
    ativo.status || '-'
  ])
})


const editarAtivo = (rowIndex) => {
  const ativo = filteredAtivos.value[rowIndex]

  if (!ativo) {
    return
  }

}



const handleDelete = (rowIndex) => {
  const ativo = filteredAtivos.value[rowIndex]

  if (!ativo) {
    return
  }

  selectedAtivo.value = ativo
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedAtivo.value) {
    return
  }

  const sucesso = await ativosStore.deleteAtivo(
    selectedAtivo.value.id
  )

  if (sucesso) {
    showDeleteModal.value = false
    selectedAtivo.value = null
  }
}
</script>