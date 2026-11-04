<template>
  <div class="backups">
    <!-- ========================================
         CABEÇALHO
    ======================================== -->

    <header class="backups-header">
      <div>
        <h1>Backup do Banco</h1>
        <p>Gere cópias de segurança e restaure o sistema a partir delas.</p>
      </div>

      <div class="header-actions">
        <div class="search-box">
          <Search
            :size="14"
            :stroke-width="2"
          />

          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar backups..."
            aria-label="Pesquisar backups"
          >
        </div>
      </div>
    </header>

    <main class="backups-content">
      <!-- Carregamento dos backups -->
      <div
        v-if="backupsStore.carregando && !backupsStore.backups.length"
        class="status-message"
      >
        Carregando backups...
      </div>

      <!-- Erro ao carregar backups -->
      <div
        v-else-if="erroLista"
        class="status-message error"
      >
        {{ erroLista }}

        <button
          type="button"
          class="retry-button"
          @click="carregarBackups"
        >
          Tentar novamente
        </button>
      </div>

      <template v-else>
        <!-- ========================================
             VISÃO GERAL
        ======================================== -->

        <section class="backup-section">
          <div class="section-heading">
            <h2>Visão geral</h2>
          </div>

          <div class="backup-indicators-grid">
            <Card
              title="Backups Disponíveis"
              :value="String(backupsStore.backupsCount)"
              :icon="Database"
            />

            <Card
              title="Último Backup"
              :value="dataHoraFormatada(backupsStore.ultimoBackup?.criado_em)"
              :icon="History"
            />

            <Card
              title="Ativos no Último Backup"
              :value="String(backupsStore.ultimoBackup?.contagens?.ativos ?? '-')"
              :icon="Package"
            />

            <Card
              title="Usuários no Último Backup"
              :value="String(backupsStore.ultimoBackup?.contagens?.usuarios ?? '-')"
              :icon="Users"
            />
          </div>
        </section>

        <!-- ========================================
             GERENCIAMENTO
        ======================================== -->

        <section class="backup-section">
          <div class="section-heading">
            <h2>Gerenciamento</h2>
          </div>

          <section class="backup-card">
            <div class="backup-table-header">
              <div>
                <h2>Backups disponíveis</h2>

                <p>
                  Restaurar volta o banco inteiro à data do backup, inclusive
                  usuários, senhas e logs de auditoria. O estado atual é salvo
                  antes, como "Antes da restauração". O arquivo baixado contém
                  os hashes de senha de todos: guarde-o em local privado.
                </p>
              </div>

              <button
                type="button"
                class="save-button"
                :disabled="backupsStore.processando"
                @click="handleCriarBackup"
              >
                {{
                  backupsStore.processando
                    ? 'Processando...'
                    : 'Gerar backup agora'
                }}
              </button>
            </div>

            <div class="backup-table-container">
              <Table
                title=""
                :headers="tableHeaders"
                :rows="tableRows"
                :show-actions="true"
                :show-detail="false"
                :show-edit="false"
                :show-inactive="false"
                :max-height="520"
              >
                <template #acoes="{ rowIndex }">
                  <button
                    type="button"
                    class="btn-download"
                    title="Baixar"
                    aria-label="Baixar este backup"
                    :disabled="backupsStore.processando || baixando"
                    @click="handleBaixar(rowIndex)"
                  >
                    <Download :size="16" />
                  </button>

                  <button
                    type="button"
                    class="btn-restore"
                    title="Restaurar"
                    aria-label="Restaurar este backup"
                    :disabled="backupsStore.processando"
                    @click="handleRestaurar(rowIndex)"
                  >
                    <RotateCcw :size="16" />
                  </button>
                </template>
              </Table>
            </div>

            <div class="backup-table-footer">
              <span>
                Mostrando {{ backupsFiltrados.length }}
                de {{ backupsStore.backupsCount }} backups
              </span>
            </div>
          </section>
        </section>
      </template>
    </main>


    <!-- MODAL DE RESTAURAÇÃO -->

    <ConfirmModal
      v-model="showRestoreModal"
      variant="warning"
      title="Restaurar Backup?"
      subtitle="Todos os dados atuais serão substituídos."
      :item-name="
        selectedBackup
          ? `Backup de ${dataHoraFormatada(selectedBackup.criado_em)}`
          : ''
      "
      :item-info="selectedBackup ? resumoContagens(selectedBackup) : ''"
      message="O sistema voltará ao estado desta data. O estado atual será salvo antes, e a sua sessão será encerrada ao final."
      confirm-text="Confirmar Restauração"
      :loading="backupsStore.processando"
      @confirm="confirmRestaurar"
    />

    <Info
      v-model="mostrarInfo"
      :success="operacaoSucesso"
      :message="mensagem"
      :error-message="mensagemErro"
      @close="handleInfoClose"
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

import {
  Database,
  Download,
  History,
  Package,
  RotateCcw,
  Search,
  Users
} from 'lucide-vue-next'

import Card from '../components/Card.vue'
import Table from '../components/Table.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import Info from '../components/Info.vue'

import { useBackupsStore } from '../stores/backups'
import { useAuthStore } from '../stores/auth'

import { dataHoraFormatada } from '../composables/formatData.js'

import '../assets/css/Backups.css'


const router = useRouter()
const backupsStore = useBackupsStore()
const authStore = useAuthStore()


const search = ref('')

const showRestoreModal = ref(false)
const baixando = ref(false)
const selectedBackup = ref(null)

const mensagem = ref('')
const mensagemErro = ref('')
const mostrarInfo = ref(false)
const operacaoSucesso = ref(false)

// Depois de restaurar, a sessão é encerrada ao fechar o popup.
const sessaoEncerrar = ref(false)

// Erro exibido no lugar da tabela: só o da listagem. Erros de gerar ou
// restaurar vão para o popup, para a tabela não sumir.
const erroLista = ref('')


const TIPOS_BACKUP = {
  db: 'Backup',
  pre_restauracao: 'Antes da restauração'
}

const tableHeaders = [
  'Data',
  'Tipo',
  'Tamanho',
  'Ativos',
  'Usuários',
  'Ordens'
]

const formatarTamanho = (bytes) => {
  if (bytes == null) return '-'

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const resumoContagens = (backup) => {
  const contagens = backup.contagens || {}

  return (
    `${contagens.ativos ?? '-'} ativos · ` +
    `${contagens.usuarios ?? '-'} usuários · ` +
    `${contagens.ordens ?? '-'} ordens`
  )
}

// Busca por data (como exibida), tipo ou nome do arquivo.
const backupsFiltrados = computed(() => {
  const termo = search.value.toLowerCase().trim()

  if (!termo) return backupsStore.backups

  return backupsStore.backups.filter((backup) => {
    return [
      dataHoraFormatada(backup.criado_em),
      TIPOS_BACKUP[backup.tipo] || backup.tipo,
      backup.nome
    ].some((texto) => String(texto).toLowerCase().includes(termo))
  })
})

const tableRows = computed(() => {
  return backupsFiltrados.value.map((backup) => [
    dataHoraFormatada(backup.criado_em),
    TIPOS_BACKUP[backup.tipo] || backup.tipo,
    formatarTamanho(backup.tamanho_bytes),
    backup.contagens?.ativos ?? '-',
    backup.contagens?.usuarios ?? '-',
    backup.contagens?.ordens ?? '-'
  ])
})


const carregarBackups = async () => {
  erroLista.value = ''

  const sucesso = await backupsStore.fetchBackups()

  if (!sucesso) {
    erroLista.value = backupsStore.erro
  }
}

onMounted(carregarBackups)


const handleCriarBackup = async () => {
  const backup = await backupsStore.criarBackup()

  if (backup) {
    operacaoSucesso.value = true
    mensagem.value = `Backup gerado com sucesso (${resumoContagens(backup)}).`
    mensagemErro.value = ''
  } else {
    operacaoSucesso.value = false
    mensagem.value = ''
    mensagemErro.value =
      backupsStore.erro ||
      'Ocorreu um erro ao gerar o backup.'
    backupsStore.erro = null
  }

  mostrarInfo.value = true
}


const handleBaixar = async (rowIndex) => {
  const backup = backupsFiltrados.value[rowIndex]

  if (!backup || baixando.value) return

  baixando.value = true

  const sucesso = await backupsStore.baixarBackup(backup.nome)

  baixando.value = false

  // Sucesso: o próprio navegador mostra o download. Só o erro vai ao popup.
  if (!sucesso) {
    operacaoSucesso.value = false
    mensagem.value = ''
    mensagemErro.value =
      backupsStore.erro ||
      'Ocorreu um erro ao baixar o backup.'
    backupsStore.erro = null
    mostrarInfo.value = true
  }
}

const handleRestaurar = (rowIndex) => {
  const backup = backupsFiltrados.value[rowIndex]

  if (!backup) return

  selectedBackup.value = backup
  showRestoreModal.value = true
}

const confirmRestaurar = async () => {
  if (!selectedBackup.value) return

  const resultado = await backupsStore.restaurarBackup(
    selectedBackup.value.nome
  )

  showRestoreModal.value = false

  if (resultado) {
    operacaoSucesso.value = true
    mensagem.value =
      'Banco restaurado com sucesso. Faça login novamente para continuar.'
    mensagemErro.value = ''
    sessaoEncerrar.value = true
  } else {
    operacaoSucesso.value = false
    mensagem.value = ''
    mensagemErro.value =
      backupsStore.erro ||
      'Ocorreu um erro ao restaurar o backup.'
    backupsStore.erro = null
  }

  selectedBackup.value = null
  mostrarInfo.value = true
}


// Usuários e tokens podem ter mudado com a restauração: encerra a sessão.
const handleInfoClose = async () => {
  mostrarInfo.value = false

  if (sessaoEncerrar.value) {
    sessaoEncerrar.value = false
    await authStore.logout()
    router.push('/login')
  }
}
</script>
