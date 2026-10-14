<template>
  <div class="detalhes-manutencao">
    <!-- CABEÇALHO -->
    <header class="manutencao-header">
      <h1>Detalhes da Manutenção</h1>

      <div class="header-actions">
        <div class="search-box">
          <Search
            :size="14"
            :stroke-width="2"
          />

          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar manutenções..."
          >
        </div>

        <button
          type="button"
          class="notification-button"
          title="Notificações"
        >
          <Bell
            :size="16"
            :stroke-width="1.8"
          />
        </button>
      </div>
    </header>

    <!-- CONTEÚDO -->
    <main class="manutencao-content">
      <div
        v-if="carregando"
        class="status-message"
      >
        Carregando detalhes da manutenção...
      </div>

      <div
        v-else-if="erro"
        class="status-message error"
        role="alert"
      >
        {{ erro }}
      </div>

      <template v-else>
        <!-- COLUNA PRINCIPAL -->
        <div class="manutencao-main">
          <section class="maintenance-card">
            <div class="maintenance-card-header">
              <div>
                <h2>Manutenção</h2>

                <span class="maintenance-code">
                  Ordem de manutenção: {{ manutencao.id || '-' }}
                </span>
              </div>

              <span
                class="maintenance-status"
                :class="statusClass"
              >
                {{ statusLabel }}
              </span>
            </div>

            <!-- INFORMAÇÕES DO ATIVO -->
            <div class="section-block">
              <h3 class="section-title">
                Ativo
              </h3>

              <div class="asset-summary">
                <div class="summary-field">
                  <span>Descrição</span>
                  <strong>
                    {{ manutencao.ativo.descricao || '-' }}
                  </strong>
                </div>

                <div class="summary-field">
                  <span>Patrimônio</span>
                  <strong>
                    {{ manutencao.ativo.numero_patrimonio || '-' }}
                  </strong>
                </div>

                <div class="summary-field">
                  <span>Tipo</span>
                  <strong>
                    {{ formatarTipo(manutencao.ativo.tipo) }}
                  </strong>
                </div>

                <div class="summary-field">
                  <span>Sala</span>
                  <strong>
                    {{ manutencao.ativo.sala || '-' }}
                  </strong>
                </div>
              </div>
            </div>

            <!-- INFORMAÇÕES DA MANUTENÇÃO -->
            <div class="section-block">
              <h3 class="section-title">
                Informações da Manutenção
              </h3>

              <div class="maintenance-fields">
                <div class="detail-field">
                  <label>Status</label>
                  <div class="detail-value">
                    <span
                      class="maintenance-status"
                      :class="statusClass"
                    >
                      {{ statusLabel }}
                    </span>
                  </div>
                </div>

                <div class="detail-field">
                  <label>Responsável</label>
                  <div class="detail-value">
                    {{ formatarResponsavel(manutencao.responsavel) }}
                  </div>
                </div>

                <div class="detail-field">
                  <label>Data de Abertura</label>
                  <div class="detail-value">
                    {{ dataFormatada(manutencao.data_abertura) }}
                  </div>
                </div>

                <div class="detail-field">
                  <label>Data de Conclusão</label>
                  <div class="detail-value">
                    {{ dataFormatada(manutencao.data_conclusao) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- DESCRIÇÃO -->
            <div class="section-block">
              <h3 class="section-title">
                Descrição
              </h3>

              <div class="text-display">
                {{ manutencao.descricao || 'Nenhuma descrição informada.' }}
              </div>
            </div>

            <!-- SERVIÇO REALIZADO -->
            <div class="section-block">
              <h3 class="section-title">
                Serviço Realizado
              </h3>

              <div class="text-display">
                {{
                  manutencao.servico_realizado ||
                    'Nenhum serviço realizado informado.'
                }}
              </div>
            </div>

            <!-- CUSTO ESTIMADO -->
            <div class="section-block">
              <h3 class="section-title">
                Custo Estimado
              </h3>

              <div class="cost-display">
                <span>R$</span>
                <strong>
                  {{ formatarCusto(manutencao.custo_estimado) }}
                </strong>
              </div>
            </div>

            <!-- OBSERVAÇÕES -->
            <div class="section-block">
              <h3 class="section-title">
                Observações
              </h3>

              <div class="text-display">
                {{
                  manutencao.observacoes ||
                    'Nenhuma observação informada.'
                }}
              </div>
            </div>

            <!-- AÇÕES -->
            <div class="maintenance-actions">
              <button
                type="button"
                class="back-button"
                @click="handleBack"
              >
                Voltar
              </button>

              <button
                type="button"
                class="delete-button"
                :disabled="excluindo"
                @click="handleDelete"
              >
                {{ excluindo ? 'Excluindo...' : 'Excluir Manutenção' }}
              </button>
            </div>
          </section>
        </div>

        <!-- SIDEBAR -->
        <aside class="manutencao-sidebar">
          <!-- STATUS -->
          <section class="sidebar-card">
            <div class="sidebar-header">
              <h2>Status da Manutenção</h2>
            </div>

            <div class="sidebar-status">
              <span
                class="maintenance-status large"
                :class="statusClass"
              >
                {{ statusLabel }}
              </span>
            </div>
          </section>

          <!-- INFORMAÇÕES DO ATIVO -->
          <section class="sidebar-card">
            <div class="sidebar-header">
              <h2>Informações do Ativo</h2>
            </div>

            <div class="asset-info-row">
              <span>Descrição</span>
              <strong>
                {{ manutencao.ativo.descricao || '-' }}
              </strong>
            </div>

            <div class="asset-info-row">
              <span>Tipo</span>
              <strong>
                {{ formatarTipo(manutencao.ativo.tipo) }}
              </strong>
            </div>

            <div class="asset-info-row">
              <span>Patrimônio</span>
              <strong>
                {{ manutencao.ativo.numero_patrimonio || '-' }}
              </strong>
            </div>

            <div class="asset-info-row">
              <span>Sala</span>
              <strong>
                {{ manutencao.ativo.sala || '-' }}
              </strong>
            </div>

            <div class="asset-info-row">
              <span>Status do Ativo</span>
              <strong>
                {{ formatarStatusAtivo(manutencao.ativo.status) }}
              </strong>
            </div>
          </section>

          <!-- DATAS -->
          <section class="sidebar-card">
            <div class="sidebar-header">
              <h2>Datas</h2>
            </div>

            <div class="asset-info-row">
              <span>Abertura</span>
              <strong>
                {{ dataFormatada(manutencao.data_abertura) }}
              </strong>
            </div>

            <div class="asset-info-row">
              <span>Conclusão</span>
              <strong>
                {{ dataFormatada(manutencao.data_conclusao) }}
              </strong>
            </div>
          </section>
        </aside>
      </template>
    </main>

    <!-- MODAL DE CONFIRMAÇÃO -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Excluir Manutenção?"
      subtitle="Esta ação não poderá ser desfeita."
      :item-name="manutencao.ativo.descricao || 'Manutenção'"
      :item-info="`Patrimônio: ${manutencao.ativo.numero_patrimonio || '-'}`"
      message="A manutenção será removida do sistema."
      confirm-text="Confirmar Exclusão"
      @confirm="confirmDelete"
    />

    <!-- POPUP DE RESULTADO -->
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
  ref,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  Search,
  Bell
} from 'lucide-vue-next'

import ConfirmModal from '../components/ConfirmModal.vue'
import Info from '../components/Info.vue'

import { useOrdensStore } from '../stores/ordens'
import api from '../services/api'

import { STATUS_ATIVO } from '../composables/status.js'
import { dataFormatada } from '../composables/formatData.js'

import '../assets/css/DetalheManutencao.css'

const route = useRoute()
const router = useRouter()
const ordensStore = useOrdensStore()

const search = ref('')

const showDeleteModal = ref(false)
const mostrarInfo = ref(false)

const carregando = ref(false)
const excluindo = ref(false)
const erro = ref('')

const operacaoSucesso = ref(false)
const mensagem = ref('')
const mensagemErro = ref('')

const manutencao = ref({
  id: null,
  status: 'Pendente',
  responsavel: '',
  data_abertura: null,
  data_conclusao: null,
  descricao: '',
  servico_realizado: '',
  custo_estimado: null,
  observacoes: '',
  ativo: {}
})

const TIPOS_ATIVO = {
  GABINETE: 'Gabinete',
  MONITOR: 'Monitor',
  TECLADO: 'Teclado',
  MESA: 'Mesa'
}

// Normaliza o texto para consultar as chaves do STATUS_ATIVO.
const normalizarStatus = (status) => {
  return String(status ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
}

// Status compartilhados do projeto.
const statusOrdem = computed(() => {
  const chave = normalizarStatus(manutencao.value.status)

  return STATUS_ATIVO[chave] || {
    label: manutencao.value.status || 'Não informado',
    class: ''
  }
})

const statusLabel = computed(() => statusOrdem.value.label)
const statusClass = computed(() => statusOrdem.value.class)

const formatarTipo = (tipo) => {
  const chave = normalizarStatus(tipo)

  return TIPOS_ATIVO[chave] || tipo || 'Não informado'
}

const formatarStatusAtivo = (status) => {
  const chave = normalizarStatus(status)

  return STATUS_ATIVO[chave]?.label || status || 'Não informado'
}

const formatarResponsavel = (responsavel) => {
  if (typeof responsavel === 'object' && responsavel !== null) {
    return (
      responsavel.username ||
      responsavel.nome ||
      responsavel.first_name ||
      '-'
    )
  }

  return responsavel || '-'
}

const formatarCusto = (valor) => {
  if (valor === null || valor === undefined || valor === '') {
    return '0,00'
  }

  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return '0,00'
  }

  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const carregarManutencao = async () => {
  carregando.value = true
  erro.value = ''

  try {
    const id = String(route.params.id || '')

    if (!/^\d+$/.test(id)) {
      throw new Error('ID da manutenção inválido na URL.')
    }

    const ordem = await ordensStore.fetchOrdemById(id)

    if (!ordem) {
      throw new Error(
        ordensStore.erro || 'Manutenção não encontrada.'
      )
    }

    let ativo = {}

    if (ordem.ativo && typeof ordem.ativo === 'object') {
      ativo = ordem.ativo
    } else if (
      ordem.ativo !== null &&
      ordem.ativo !== undefined
    ) {
      try {
        const resposta = await api.get(`/ativos/${ordem.ativo}/`)
        ativo = resposta.data
      } catch (error) {
        console.error('Erro ao carregar o ativo:', error)
        ativo = { id: ordem.ativo }
      }
    }

    manutencao.value = {
      ...ordem,
      custo_estimado: ordem.custo_estimado ?? null,
      ativo
    }
  } catch (error) {
    console.error('Erro ao carregar manutenção:', error)

    erro.value =
      error.response?.data?.detail ||
      error.message ||
      'Não foi possível carregar a manutenção.'
  } finally {
    carregando.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!manutencao.value.id || excluindo.value) return

  excluindo.value = true
  erro.value = ''
  mostrarInfo.value = false

  try {
    const sucesso = await ordensStore.deleteordens(
      manutencao.value.id
    )

    showDeleteModal.value = false

    if (sucesso) {
      operacaoSucesso.value = true
      mensagem.value = 'Manutenção excluída com sucesso!'
      mensagemErro.value = ''
    } else {
      operacaoSucesso.value = false
      mensagem.value = ''
      mensagemErro.value =
        ordensStore.erro ||
        'Não foi possível excluir a manutenção.'
    }

    mostrarInfo.value = true
  } catch (error) {
    console.error('Erro ao excluir manutenção:', error)

    showDeleteModal.value = false
    operacaoSucesso.value = false
    mensagem.value = ''

    mensagemErro.value =
      ordensStore.erro ||
      error.response?.data?.detail ||
      'Ocorreu um erro ao excluir a manutenção.'

    mostrarInfo.value = true
  } finally {
    excluindo.value = false
  }
}

// Redireciona somente depois de fechar o popup de sucesso.
const handleInfoClose = () => {
  mostrarInfo.value = false

  if (operacaoSucesso.value) {
    router.push('/relatorios')
  }
}

onMounted(carregarManutencao)

watch(
  () => route.params.id,
  (novoId, idAnterior) => {
    if (novoId !== idAnterior) {
      carregarManutencao()
    }
  }
)
</script>