<template>
  <div class="backups">
    <!-- CABEÇALHO -->

    <header class="backups-header">
      <div class="backups-title-area">
        <h1>
          Backup do Banco
        </h1>

        <span>
          Gere cópias de segurança e restaure o sistema a partir delas.
        </span>
      </div>
    </header>


    <!-- CONTEÚDO -->

    <main class="backups-content">
      <!-- AÇÕES -->

      <div class="page-actions">
        <div>
          <h2>
            Backups
          </h2>

          <span>
            Cópias completas do banco: ativos, usuários, ordens e logs.
          </span>
        </div>

        <button
          type="button"
          class="new-backup-button"
          :disabled="backupsStore.processando"
          @click="handleCriarBackup"
        >
          <DatabaseBackup
            :size="15"
            :stroke-width="2"
          />

          {{ backupsStore.processando ? 'Processando...' : 'Gerar backup agora' }}
        </button>
      </div>


      <!-- CARDS DE RESUMO -->

      <section class="summary-grid">
        <article class="summary-card">
          <div class="summary-icon">
            <Database
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div class="summary-info">
            <span>
              Backups disponíveis
            </span>

            <strong>
              {{ backupsStore.backupsCount }}
            </strong>
          </div>
        </article>


        <article class="summary-card">
          <div class="summary-icon">
            <History
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div class="summary-info">
            <span>
              Último backup
            </span>

            <strong>
              {{ dataHoraFormatada(backupsStore.ultimoBackup?.criado_em) }}
            </strong>
          </div>
        </article>


        <article class="summary-card">
          <div class="summary-icon">
            <Package
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div class="summary-info">
            <span>
              Ativos no último backup
            </span>

            <strong>
              {{ backupsStore.ultimoBackup?.contagens?.ativos ?? '-' }}
            </strong>
          </div>
        </article>
      </section>


      <!-- AVISO -->

      <p class="backup-warning">
        Restaurar volta <strong>o banco inteiro</strong> à data do backup,
        inclusive usuários, senhas e logs de auditoria. Antes de restaurar, o
        estado atual é salvo automaticamente como "Antes da restauração".
      </p>


      <!-- CARREGANDO -->

      <div
        v-if="backupsStore.carregando"
        class="status-message"
      >
        Carregando backups...
      </div>


      <!-- ERRO -->

      <div
        v-else-if="erroLista"
        class="status-message error"
      >
        {{ erroLista }}
      </div>


      <!-- TABELA -->

      <section
        v-else
        class="backups-table"
      >
        <Table
          title="Lista de Backups"
          :headers="tableHeaders"
          :rows="tableRows"
          :show-actions="true"
          :show-detail="false"
          :show-edit="false"
          :show-inactive="false"
        >
          <template #acoes="{ rowIndex }">
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
      </section>
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
  DatabaseBackup,
  History,
  Package,
  RotateCcw
} from 'lucide-vue-next'

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


const showRestoreModal = ref(false)
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

const tableRows = computed(() => {
  return backupsStore.backups.map((backup) => [
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


const handleRestaurar = (rowIndex) => {
  const backup = backupsStore.backups[rowIndex]

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
