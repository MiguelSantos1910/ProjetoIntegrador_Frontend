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
      <!-- Cabeçalho da tabela e exportação -->
      <div class="assets-table-header">
        <h2>Lista de Ativos</h2>

        <div class="export-actions">
          <button
            type="button"
            class="export-button pdf"
            :disabled="filteredRows.length === 0"
            @click="exportarAtivosPdf"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <Table
        title=""
        :headers="tableHeaders"
        :rows="filteredRows"
        :show-actions="true"
        @edit="editarAtivo"
        @delete="handleDelete"
        @detail="handleDetail"
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

    <Info
      v-model="mostrarInfo"
      :success="operacaoSucesso"
      :message="mensagem"
      :error-message="mensagemErro"
      @close="handleClose"
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
import Info from '../components/Info.vue'

import { useAtivosStore } from '../stores/ativos'
import { usePdf } from '../composables/gerarPdf.js'

import '../assets/css/Ativos.css'

const router = useRouter()
const ativosStore = useAtivosStore()
const { gerarPdf } = usePdf()

const search = ref('')
const selectedCategory = ref('')
const selectedRoom = ref('')

const showDeleteModal = ref(false)
const selectedAtivo = ref(null)

const mensagem = ref('')
const mensagemErro = ref('')
const mostrarInfo = ref(false)
const operacaoSucesso = ref(false)

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
  const termo = search.value.toLowerCase().trim()

  return ativosStore.ativos.filter((ativo) => {
    const descricao =
      ativo.descricao?.toLowerCase() || ''

    const patrimonio =
      ativo.numero_patrimonio?.toLowerCase() || ''

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

/* Exportar PDF dos ativos filtrados */
function exportarAtivosPdf() {
  if (filteredRows.value.length === 0) {
    window.alert('Não há ativos para exportar com os filtros atuais.')
    return
  }

  try {
    gerarPdf({
      titulo: 'Relatório de Ativos — Easy Asset',
      nomeArquivo: 'relatorio_ativos_easy_asset.pdf',
      colunas: tableHeaders,
      dados: filteredRows.value
    })
  } catch (error) {
    console.error('Erro ao exportar os ativos:', error)
    window.alert('Não foi possível gerar o relatório. Tente novamente.')
  }
}

const editarAtivo = (rowIndex) => {
  const ativo = filteredAtivos.value[rowIndex]

  if (!ativo) return

  router.push(`/ativos/editar/${ativo.id}`)
}

const handleDetail = (rowIndex) => {
  const ativo = filteredAtivos.value[rowIndex]

  if (!ativo) return

  router.push(`/ativos/detalhe/${ativo.id}`)
}

const handleDelete = (rowIndex) => {
  const ativo = filteredAtivos.value[rowIndex]

  if (!ativo) return

  selectedAtivo.value = ativo
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedAtivo.value) return

  const sucesso = await ativosStore.deleteAtivo(
    selectedAtivo.value.id
  )

  if (sucesso) {
    showDeleteModal.value = false
    selectedAtivo.value = null
    operacaoSucesso.value = true
    mensagem.value = 'Ativo excluído com sucesso!'
    mensagemErro.value = ''
    mostrarInfo.value = true
  } else {
    operacaoSucesso.value = false
    mensagem.value = ''
    mensagemErro.value =
      ativosStore.errorMessage ||
      'Ocorreu um erro ao excluir o ativo.'
    mostrarInfo.value = true
  }
}

const handleClose = () => {
  mostrarInfo.value = false

  if (operacaoSucesso.value) {
    router.push('/ativos')
  }
}
</script>
