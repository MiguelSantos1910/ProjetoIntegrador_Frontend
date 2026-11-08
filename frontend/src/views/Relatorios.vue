<template>
  <div class="relatorios">
    <header class="relatorios-header">
      <div>
        <h1>Relatórios Consolidados</h1>
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
            :placeholder="
              ehProfessor
                ? 'Pesquisar ativos, ordens e usuários...'
                : 'Pesquisar ativos e ordens...'
            "
          >
        </div>
      </div>
    </header>

    <main class="relatorios-content">
      <section class="report-card filters-card">
        <h2>Filtros de Exportação</h2>

        <div class="filters-grid">
          <div class="filter-field">
            <label for="tipoAtivo">Tipo de ativo</label>
            <select
              id="tipoAtivo"
              v-model="filters.tipoAtivo"
            >
              <option value="todos">
                Todos os Tipos
              </option>
              <option
                v-for="(label, valor) in TIPOS_ATIVO"
                :key="valor"
                :value="valor"
              >
                {{ label }}
              </option>
            </select>
          </div>

          <div class="filter-field">
            <label for="ordemStatus">Status das Ordens</label>
            <select
              id="ordemStatus"
              v-model="filters.statusOrdens"
            >
              <option value="todos">
                Todos os Status
              </option>
              <option value="PENDENTE">
                Pendentes
              </option>
              <option value="EM_ANDAMENTO">
                Em Andamento
              </option>
              <option value="CONCLUIDA">
                Concluídas
              </option>
              <option value="CANCELADA">
                Canceladas
              </option>
            </select>
          </div>

          <template v-if="ehProfessor">
            <div class="filter-field">
              <label for="papel">Papel</label>
              <select
                id="papel"
                v-model="filters.papel"
              >
                <option value="todos">
                  Todos os Papéis
                </option>
                <option value="ALUNO">
                  Aluno
                </option>
                <option value="PROFESSOR">
                  Professor
                </option>
                <option value="SUPORTE">
                  Suporte técnico
                </option>
              </select>
            </div>

            <div class="filter-field">
              <label for="status">Status do usuário</label>
              <select
                id="status"
                v-model="filters.status"
              >
                <option value="todos">
                  Todos os Status
                </option>
                <option value="ativo">
                  Ativos
                </option>
                <option value="inativo">
                  Inativos
                </option>
              </select>
            </div>
          </template>

          <button
            type="button"
            class="generate-button"
            :disabled="gerandoRelatorio"
            @click="exportarRelatorioGeral"
          >
            {{ gerandoRelatorio ? 'Gerando relatório...' : 'Gerar Relatório Geral' }}
          </button>
        </div>
      </section>

      <div
        v-if="carregando"
        class="status-message"
      >
        Carregando dados dos relatórios...
      </div>

      <div
        v-else-if="erroRelatorios"
        class="status-message error"
      >
        {{ erroRelatorios }}
      </div>

      <template v-else>
        <!-- ================= ATIVOS ================= -->
        <section class="report-section">
          <div class="section-heading">
            <h2>Ativos</h2>
          </div>

          <div class="indicators-grid">
            <Card
              title="Total de Ativos"
              :value="String(filteredAtivos.length)"
              :icon="Boxes"
            />

            <Card
              title="Em Uso"
              :value="String(contarAtivos('ATIVO'))"
              :icon="CheckCircle"
            />

            <Card
              title="Em Manutenção"
              :value="String(contarAtivos('EM_MANUTENCAO'))"
              :icon="Wrench"
            />

            <Card
              title="Devolvidos / Inativos"
              :value="`${contarAtivos('DEVOLVIDO')} / ${contarAtivos('INATIVO')}`"
              :icon="Archive"
            />
          </div>
        </section>

        <section class="charts-grid charts-grid-3">
          <div class="report-card chart-card">
            <Chart
              type="pie"
              title="Ativos por Status"
              dataset-label="Ativos"
              :labels="statusAtivoLabels"
              :values="statusAtivoValues"
              :color="CORES_STATUS_ATIVO"
            />
          </div>

          <div class="report-card chart-card">
            <Chart
              type="bar"
              title="Ativos por Tipo"
              dataset-label="Ativos"
              :labels="tipoAtivoLabels"
              :values="tipoAtivoValues"
            />
          </div>

          <div class="report-card chart-card">
            <Chart
              type="bar"
              title="Ativos por Sala"
              dataset-label="Ativos"
              :labels="salaLabels"
              :values="salaValues"
            />
          </div>
        </section>

        <!-- ============ ORDENS DE MANUTENÇÃO ============ -->
        <section class="report-section">
          <div class="section-heading">
            <h2>Ordens de Manutenção</h2>
          </div>

          <div class="indicators-grid">
            <Card
              title="Total de Ordens"
              :value="String(filteredOrdens.length)"
              :icon="ClipboardList"
            />

            <Card
              title="Pendentes"
              :value="String(contarOrdens('PENDENTE'))"
              :icon="ClipboardPlus"
            />

            <Card
              title="Em Andamento"
              :value="String(contarOrdens('EM_ANDAMENTO'))"
              :icon="Wrench"
            />

            <Card
              title="Concluídas / Canceladas"
              :value="`${contarOrdens('CONCLUIDA')} / ${contarOrdens('CANCELADA')}`"
              :icon="CheckCircle"
            />

            <Card
              title="Custo Estimado (sem canceladas)"
              :value="custoTotalFormatado"
              :icon="DollarSign"
            />

            <Card
              title="Custo das Ordens em Aberto"
              :value="custoAbertoFormatado"
              :icon="Wallet"
            />

            <Card
              title="Tempo Médio de Conclusão"
              :value="tempoMedioConclusao"
              :icon="Clock"
            />

            <Card
              :title="`Em Aberto há mais de ${DIAS_ATRASO} dias`"
              :value="String(ordensAtrasadas.length)"
              :icon="AlertTriangle"
            />
          </div>
        </section>

        <section class="charts-grid">
          <div class="report-card chart-card">
            <Chart
              type="pie"
              title="Status das Ordens"
              dataset-label="Ordens"
              :labels="statusOrdensLabels"
              :values="statusOrdensValues"
              :color="CORES_STATUS_ORDEM"
            />
          </div>

          <div class="report-card chart-card">
            <Chart
              type="bar"
              title="Ativos com Mais Ordens"
              dataset-label="Ordens"
              :labels="ativosMaisOrdensLabels"
              :values="ativosMaisOrdensValues"
            />
          </div>
        </section>

        <!-- ================= USUÁRIOS (professor) ================= -->
        <template v-if="ehProfessor">
          <section class="report-section">
            <div class="section-heading">
              <h2>Usuários</h2>
            </div>

            <div class="indicators-grid">
              <Card
                title="Total de Usuários"
                :value="String(filteredUsuarios.length)"
                :icon="Users"
              />

              <Card
                title="Alunos"
                :value="String(contarPapel('ALUNO'))"
                :icon="GraduationCap"
              />

              <Card
                title="Professores"
                :value="String(contarPapel('PROFESSOR'))"
                :icon="UserRound"
              />

              <Card
                title="Suporte Técnico"
                :value="String(contarPapel('SUPORTE'))"
                :icon="Headset"
              />
            </div>
          </section>

          <section class="charts-grid">
            <div class="report-card chart-card">
              <Chart
                type="bar"
                title="Usuários por Papel"
                dataset-label="Usuários"
                :labels="papelLabels"
                :values="papelValues"
              />
            </div>

            <div class="report-card chart-card">
              <Chart
                type="pie"
                title="Status dos Usuários"
                dataset-label="Usuários"
                :labels="statusUsuarioLabels"
                :values="statusUsuarioValues"
                :color="['#16a34a', '#94a3b8']"
              />
            </div>
          </section>
        </template>

        <!-- ================= TABELAS ================= -->
        <section class="report-card table-card">
          <div class="table-header">
            <h2>Relatório Detalhado de Ativos</h2>

            <div class="export-actions">
              <button
                type="button"
                class="export-button pdf"
                @click="exportarRelatorioAtivos"
              >
                Exportar PDF
              </button>
            </div>
          </div>

          <Table
            title=""
            :headers="ativoTableHeaders"
            :rows="ativoTableRows"
          />

          <div class="table-footer">
            <span>
              Mostrando {{ filteredAtivos.length }}
              de {{ todosAtivos.length }} ativos
            </span>
          </div>
        </section>

        <section class="report-card table-card">
          <div class="table-header">
            <h2>Ordens de Manutenção</h2>

            <div class="export-actions">
              <button
                type="button"
                class="export-button pdf"
                @click="exportarRelatorioOrdens"
              >
                Exportar PDF
              </button>
            </div>
          </div>

          <Table
            title=""
            :headers="manutencaoTableHeaders"
            :rows="manutencaoTableRows"
            :show-actions="true"
            :show-detail="true"
            :show-edit="false"
            :show-inactive="false"
            @detail="handleDetail"
          />

          <div class="table-footer">
            <span>
              Mostrando {{ filteredOrdens.length }}
              de {{ manutencoes.length }} ordens de manutenção
            </span>
          </div>
        </section>

        <section
          v-if="ehProfessor"
          class="report-card table-card"
        >
          <div class="table-header">
            <h2>Relatório Detalhado de Usuários</h2>

            <div class="export-actions">
              <button
                type="button"
                class="export-button pdf"
                @click="exportarRelatorioUsuarios"
              >
                Exportar PDF
              </button>
            </div>
          </div>

          <Table
            title=""
            :headers="userTableHeaders"
            :rows="userTableRows"
          />

          <div class="table-footer">
            <span>
              Mostrando {{ filteredUsuarios.length }}
              de {{ todosUsuarios.length }} usuários
            </span>
          </div>
        </section>

        <section class="report-card table-card">
          <div class="table-header">
            <h2>Histórico de Ordens de Manutenção</h2>

            <div class="export-actions">
              <button
                type="button"
                class="export-button pdf"
                @click="exportarRelatorioHistoricoOrdens"
              >
                Exportar PDF
              </button>
            </div>
          </div>

          <div
            v-if="carregandoHistorico"
            class="status-message"
          >
            Carregando histórico das ordens...
          </div>

          <div
            v-else-if="erroHistorico"
            class="status-message error"
          >
            {{ erroHistorico }}
          </div>

          <Table
            v-else
            title=""
            :headers="historicoHeaders"
            :rows="historicoRows"
          />

          <div class="table-footer">
            <span>
              Mostrando {{ filteredHistorico.length }}
              de {{ todosHistorico.length }} registros de histórico
            </span>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  Search,
  Users,
  GraduationCap,
  UserRound,
  Headset,
  ClipboardList,
  ClipboardPlus,
  Wrench,
  CheckCircle,
  Boxes,
  Archive,
  DollarSign,
  Wallet,
  Clock,
  AlertTriangle
} from 'lucide-vue-next'

import { useRouter } from 'vue-router'

import Card from '../components/Card.vue'
import Chart from '../components/Chart.vue'
import Table from '../components/Table.vue'

import { useAuthStore } from '../stores/auth'
import { useAtivosStore } from '../stores/ativos'
import { useUsuariosStore } from '../stores/usuarios'
import { useOrdensStore } from '../stores/ordens'
import api from '../services/api'
import { usePdf } from '../composables/gerarPdf.js'
import { STATUS_ATIVO } from '../composables/status.js'
import { dataFormatada } from '../composables/formatData.js'

import '../assets/css/Relatorios.css'

const authStore = useAuthStore()
const ativosStore = useAtivosStore()
const usuariosStore = useUsuariosStore()
const manutencoesStore = useOrdensStore()
const router = useRouter()

const { gerarPdf } = usePdf()

// ========================================
// CONSTANTES
// ========================================

const TIPOS_ATIVO = {
  GABINETE: 'Gabinete',
  MONITOR: 'Monitor',
  TECLADO: 'Teclado',
  MESA: 'Mesa'
}

const STATUS_ATIVO_ORDEM = ['ATIVO', 'EM_MANUTENCAO', 'DEVOLVIDO', 'INATIVO']
const CORES_STATUS_ATIVO = ['#16a34a', '#f59e0b', '#3b82f6', '#94a3b8']

const STATUS_ORDEM = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA']
const CORES_STATUS_ORDEM = ['#f59e0b', '#3b82f6', '#0d9488', '#94a3b8']

// Ordem pendente ou em andamento há mais tempo que isso é considerada atrasada.
const DIAS_ATRASO = 7
const MS_POR_DIA = 24 * 60 * 60 * 1000

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

// ========================================
// ESTADO
// ========================================

const search = ref('')
const carregando = ref(false)
const carregandoHistorico = ref(false)
const gerandoRelatorio = ref(false)
const erroRelatorios = ref('')
const erroHistorico = ref('')
const todosHistorico = ref([])

const filters = reactive({
  tipoAtivo: 'todos',
  statusOrdens: 'todos',
  papel: 'todos',
  status: 'todos'
})

// A API só devolve a lista completa de usuários para o professor; para o
// suporte ela traz apenas a própria conta, por isso a seção fica oculta.
const ehProfessor = computed(() =>
  Boolean(
    authStore.usuario?.is_superuser ||
      String(authStore.papelUsuario).toUpperCase() === 'PROFESSOR'
  )
)

const todosAtivos = computed(() => ativosStore.ativos || [])
const todosUsuarios = computed(() => usuariosStore.usuarios || [])
const manutencoes = computed(() => manutencoesStore.ordens || [])

// A ordem traz só o id do ativo: o mapa resolve descrição, tipo e sala.
const ativosPorId = computed(() => {
  const mapa = new Map()

  todosAtivos.value.forEach((ativo) => mapa.set(ativo.id, ativo))

  return mapa
})

onMounted(async () => {
  carregando.value = true
  erroRelatorios.value = ''

  try {
    const [ordens, ativos] = await Promise.all([
      manutencoesStore.fetchOrdens(),
      ativosStore.fetchAtivos(),
      ehProfessor.value ? usuariosStore.fetchUsuarios() : true
    ])

    if (!ordens || !ativos) {
      erroRelatorios.value =
        manutencoesStore.erro ||
        ativosStore.erro ||
        'Não foi possível carregar os dados dos relatórios.'
      return
    }

    // O histórico é carregado separadamente para não bloquear os
    // relatórios principais.
    carregarHistoricoOrdens()
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error)
    erroRelatorios.value =
      'Não foi possível carregar os dados dos relatórios.'
  } finally {
    carregando.value = false
  }
})

// ========================================
// AUXILIARES
// ========================================

const normalizarStatus = (status) => {
  return String(status ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
}

const rotuloStatus = (status) => {
  const chave = normalizarStatus(status)

  return STATUS_ATIVO[chave]?.label || status || '-'
}

const formatPapel = (papel) => {
  const papeis = {
    ALUNO: 'Aluno',
    PROFESSOR: 'Professor',
    SUPORTE: 'Suporte técnico'
  }

  return papeis[papel] || papel || '-'
}

const formatTipo = (tipo) => TIPOS_ATIVO[tipo] || tipo || '-'

const ativoDaOrdem = (ordem) => {
  if (ordem.ativo && typeof ordem.ativo === 'object') return ordem.ativo

  return ativosPorId.value.get(ordem.ativo) || null
}

const nomeAtivo = (ativo, idReserva) => {
  if (!ativo) {
    return idReserva !== null && idReserva !== undefined
      ? `Ativo #${idReserva}`
      : 'Não identificado'
  }

  const patrimonio = ativo.numero_patrimonio
    ? ` (${ativo.numero_patrimonio})`
    : ''

  return `${ativo.descricao || `Ativo #${ativo.id}`}${patrimonio}`
}

const custoDaOrdem = (ordem) => {
  const valor = Number(ordem.custo_estimado)

  return Number.isFinite(valor) ? valor : 0
}

const formatCusto = (ordem) =>
  ordem.custo_estimado === null || ordem.custo_estimado === undefined
    ? '-'
    : moeda.format(custoDaOrdem(ordem))

const contem = (valores, termo) =>
  !termo ||
  valores
    .filter((valor) => valor !== null && valor !== undefined)
    .join(' ')
    .toLowerCase()
    .includes(termo)

const termoBusca = computed(() => search.value.toLowerCase().trim())

// ========================================
// ATIVOS
// ========================================

const filteredAtivos = computed(() =>
  todosAtivos.value.filter((ativo) => {
    const correspondeTipo =
      filters.tipoAtivo === 'todos' || ativo.tipo === filters.tipoAtivo

    return (
      correspondeTipo &&
      contem(
        [
          ativo.id,
          ativo.descricao,
          ativo.numero_patrimonio,
          ativo.sala,
          formatTipo(ativo.tipo),
          rotuloStatus(ativo.status)
        ],
        termoBusca.value
      )
    )
  })
)

const contarAtivos = (status) =>
  filteredAtivos.value.filter(
    (ativo) => normalizarStatus(ativo.status) === status
  ).length

const statusAtivoLabels = STATUS_ATIVO_ORDEM.map(
  (status) => STATUS_ATIVO[status].label
)

const statusAtivoValues = computed(() =>
  STATUS_ATIVO_ORDEM.map((status) => contarAtivos(status))
)

const tipoAtivoLabels = Object.values(TIPOS_ATIVO)

const tipoAtivoValues = computed(() =>
  Object.keys(TIPOS_ATIVO).map(
    (tipo) =>
      filteredAtivos.value.filter((ativo) => ativo.tipo === tipo).length
  )
)

// As 8 salas com mais ativos.
const ativosPorSala = computed(() => {
  const contagem = new Map()

  filteredAtivos.value.forEach((ativo) => {
    const sala = ativo.sala || 'Sem sala'
    contagem.set(sala, (contagem.get(sala) || 0) + 1)
  })

  return [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
})

const salaLabels = computed(() => ativosPorSala.value.map(([sala]) => sala))
const salaValues = computed(() => ativosPorSala.value.map(([, total]) => total))

const ativoTableHeaders = [
  'ID',
  'Descrição',
  'Tipo',
  'Patrimônio',
  'Sala',
  'Status',
  'Cadastro'
]

const ativoTableRows = computed(() =>
  filteredAtivos.value.map((ativo) => [
    ativo.id ?? '-',
    ativo.descricao || '-',
    formatTipo(ativo.tipo),
    ativo.numero_patrimonio || '-',
    ativo.sala || '-',
    ativo.status || '-',
    dataFormatada(ativo.data_cadastro)
  ])
)

// ========================================
// ORDENS DE MANUTENÇÃO
// ========================================

// Ordens que passam pelos filtros (sem a pesquisa de texto).
const ordensNosFiltros = computed(() =>
  manutencoes.value.filter((ordem) => {
    const ativo = ativoDaOrdem(ordem)

    const correspondeTipo =
      filters.tipoAtivo === 'todos' || ativo?.tipo === filters.tipoAtivo

    const correspondeStatus =
      filters.statusOrdens === 'todos' ||
      normalizarStatus(ordem.status) === filters.statusOrdens

    return correspondeTipo && correspondeStatus
  })
)

const filteredOrdens = computed(() =>
  ordensNosFiltros.value.filter((ordem) => {
    const ativo = ativoDaOrdem(ordem)

    return contem(
        [
          ordem.id,
          ordem.descricao,
          ordem.status,
          ordem.responsavel,
          nomeAtivo(ativo, ordem.ativo),
          ativo?.sala,
          formatTipo(ativo?.tipo)
        ],
      termoBusca.value
    )
  })
)

const contarOrdens = (status) =>
  filteredOrdens.value.filter(
    (ordem) => normalizarStatus(ordem.status) === status
  ).length

const ordemEmAberto = (ordem) =>
  ['PENDENTE', 'EM_ANDAMENTO'].includes(normalizarStatus(ordem.status))

const custoTotalFormatado = computed(() =>
  moeda.format(
    filteredOrdens.value
      .filter((ordem) => normalizarStatus(ordem.status) !== 'CANCELADA')
      .reduce((soma, ordem) => soma + custoDaOrdem(ordem), 0)
  )
)

const custoAbertoFormatado = computed(() =>
  moeda.format(
    filteredOrdens.value
      .filter(ordemEmAberto)
      .reduce((soma, ordem) => soma + custoDaOrdem(ordem), 0)
  )
)

// Média de dias entre a abertura e a conclusão das ordens concluídas.
const tempoMedioConclusao = computed(() => {
  const duracoes = filteredOrdens.value
    .filter(
      (ordem) =>
        normalizarStatus(ordem.status) === 'CONCLUIDA' &&
        ordem.data_abertura &&
        ordem.data_conclusao
    )
    .map(
      (ordem) =>
        new Date(ordem.data_conclusao) - new Date(ordem.data_abertura)
    )
    .filter((ms) => Number.isFinite(ms) && ms >= 0)

  if (duracoes.length === 0) return '-'

  const dias =
    duracoes.reduce((soma, ms) => soma + ms, 0) /
    duracoes.length /
    MS_POR_DIA

  if (dias < 1) {
    const horas = Math.max(1, Math.round(dias * 24))
    return `${horas} ${horas === 1 ? 'hora' : 'horas'}`
  }

  const arredondado = dias.toLocaleString('pt-BR', {
    maximumFractionDigits: 1
  })

  return `${arredondado} ${dias < 2 ? 'dia' : 'dias'}`
})

const ordensAtrasadas = computed(() => {
  const limite = Date.now() - DIAS_ATRASO * MS_POR_DIA

  return filteredOrdens.value.filter(
    (ordem) =>
      ordemEmAberto(ordem) &&
      ordem.data_abertura &&
      new Date(ordem.data_abertura).getTime() < limite
  )
})

const statusOrdensLabels = STATUS_ORDEM.map(
  (status) => STATUS_ATIVO[status].label
)

const statusOrdensValues = computed(() =>
  STATUS_ORDEM.map((status) => contarOrdens(status))
)

// Os 8 ativos com mais ordens de manutenção.
const ativosMaisOrdens = computed(() => {
  const contagem = new Map()

  filteredOrdens.value.forEach((ordem) => {
    const nome = nomeAtivo(ativoDaOrdem(ordem), ordem.ativo)
    contagem.set(nome, (contagem.get(nome) || 0) + 1)
  })

  return [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
})

const ativosMaisOrdensLabels = computed(() =>
  ativosMaisOrdens.value.map(([nome]) => nome)
)

const ativosMaisOrdensValues = computed(() =>
  ativosMaisOrdens.value.map(([, total]) => total)
)

const manutencaoTableHeaders = [
  'Ordem',
  'Ativo',
  'Tipo',
  'Sala',
  'Responsável',
  'Status',
  'Custo',
  'Abertura',
  'Conclusão'
]

const manutencaoTableRows = computed(() =>
  filteredOrdens.value.map((ordem) => {
    const ativo = ativoDaOrdem(ordem)

    return [
      ordem.id ?? '-',
      nomeAtivo(ativo, ordem.ativo),
      formatTipo(ativo?.tipo),
      ativo?.sala || '-',
      ordem.responsavel || '-',
      ordem.status || '-',
      formatCusto(ordem),
      dataFormatada(ordem.data_abertura),
      dataFormatada(ordem.data_conclusao)
    ]
  })
)

const handleDetail = (rowIndex) => {
  const ordem = filteredOrdens.value[rowIndex]

  if (!ordem?.id) return

  router.push(`/manutencao/detalhe/${ordem.id}`)
}

// ========================================
// HISTÓRICO DAS ORDENS
// ========================================

const historicoHeaders = [
  'Log',
  'Ordem',
  'Ativo',
  'Ação',
  'Descrição',
  'Status anterior',
  'Status novo',
  'Usuário',
  'Data'
]

const ordensPorId = computed(() => {
  const mapa = new Map()

  manutencoes.value.forEach((ordem) => mapa.set(ordem.id, ordem))

  return mapa
})

const ativoDoLog = (log) => {
  const ordem = ordensPorId.value.get(log.ordem)

  return ordem ? nomeAtivo(ativoDaOrdem(ordem), ordem.ativo) : '-'
}

// Segue os filtros das ordens; a pesquisa vale para o log e para o ativo.
const filteredHistorico = computed(() => {
  const ordensVisiveis = new Set(
    ordensNosFiltros.value.map((ordem) => ordem.id)
  )

  return todosHistorico.value.filter(
    (log) =>
      ordensVisiveis.has(log.ordem) &&
      contem(
        [
          log.id,
          log.ordem,
          log.acao,
          log.descricao,
          log.status_anterior,
          log.status_novo,
          log.usuario_nome,
          ativoDoLog(log)
        ],
        termoBusca.value
      )
  )
})

const historicoRows = computed(() =>
  filteredHistorico.value.map((log) => [
    log.id ?? '-',
    log.ordem ? `#${log.ordem}` : '-',
    ativoDoLog(log),
    log.acao || '-',
    log.descricao || '-',
    log.status_anterior || '-',
    log.status_novo || '-',
    log.usuario_nome || (log.usuario ? `ID ${log.usuario}` : 'Sistema'),
    dataFormatada(log.data)
  ])
)

async function carregarHistoricoOrdens() {
  carregandoHistorico.value = true
  erroHistorico.value = ''

  try {
    const ordens = manutencoes.value.filter((ordem) => ordem?.id)

    if (ordens.length === 0) {
      todosHistorico.value = []
      return
    }

    const resultados = await Promise.allSettled(
      ordens.map((ordem) =>
        api.get(`/ordens_manutencao/${ordem.id}/logs/`)
      )
    )

    const logs = []
    let falhas = 0

    resultados.forEach((resultado) => {
      if (resultado.status === 'fulfilled') {
        const registros = Array.isArray(resultado.value.data)
          ? resultado.value.data
          : resultado.value.data?.results || []

        logs.push(...registros)
      } else {
        falhas += 1
        console.error(
          'Não foi possível carregar o histórico de uma ordem:',
          resultado.reason
        )
      }
    })

    todosHistorico.value = logs.sort(
      (a, b) => new Date(b.data || 0) - new Date(a.data || 0)
    )

    if (falhas > 0 && logs.length === 0) {
      erroHistorico.value =
        'Não foi possível carregar o histórico. Verifique a autenticação e a rota da API.'
    } else if (falhas > 0) {
      console.warn(
        `${falhas} ordem(ns) não tiveram o histórico carregado.`
      )
    }
  } catch (error) {
    console.error('Erro ao carregar histórico das ordens:', error)
    erroHistorico.value =
      'Não foi possível carregar o histórico das ordens de manutenção.'
  } finally {
    carregandoHistorico.value = false
  }
}

// ========================================
// USUÁRIOS (somente professor)
// ========================================

const filteredUsuarios = computed(() =>
  todosUsuarios.value.filter((usuario) => {
    const nomeCompleto = [usuario.first_name, usuario.last_name]
      .filter(Boolean)
      .join(' ')

    const correspondePapel =
      filters.papel === 'todos' || usuario.papel === filters.papel

    const correspondeStatus =
      filters.status === 'todos' ||
      (filters.status === 'ativo' && usuario.is_active) ||
      (filters.status === 'inativo' && !usuario.is_active)

    return (
      correspondePapel &&
      correspondeStatus &&
      contem(
        [
          usuario.id,
          usuario.username,
          nomeCompleto,
          usuario.email,
          formatPapel(usuario.papel)
        ],
        termoBusca.value
      )
    )
  })
)

const contarPapel = (papel) =>
  filteredUsuarios.value.filter((usuario) => usuario.papel === papel).length

const papelLabels = ['Aluno', 'Professor', 'Suporte técnico']

const papelValues = computed(() => [
  contarPapel('ALUNO'),
  contarPapel('PROFESSOR'),
  contarPapel('SUPORTE')
])

const statusUsuarioLabels = ['Ativos', 'Inativos']

const statusUsuarioValues = computed(() => [
  filteredUsuarios.value.filter((usuario) => usuario.is_active).length,
  filteredUsuarios.value.filter((usuario) => !usuario.is_active).length
])

const userTableHeaders = [
  'ID',
  'Usuário',
  'Nome',
  'E-mail',
  'Papel',
  'Status'
]

const userTableRows = computed(() =>
  filteredUsuarios.value.map((usuario) => {
    const nomeCompleto = [usuario.first_name, usuario.last_name]
      .filter(Boolean)
      .join(' ')

    return [
      usuario.id ?? '-',
      usuario.username || '-',
      nomeCompleto || '-',
      usuario.email || '-',
      formatPapel(usuario.papel),
      usuario.is_active ? 'ATIVO' : 'INATIVO'
    ]
  })
)

// ========================================
// EXPORTAÇÃO EM PDF
// ========================================

// No PDF o status sai como texto (na tela vira badge pelo Table.vue).
const comStatusLegivel = (linhas, headers) => {
  const indice = headers.indexOf('Status')

  if (indice < 0) return linhas

  return linhas.map((linha) =>
    linha.map((celula, i) => (i === indice ? rotuloStatus(celula) : celula))
  )
}

const resumoRows = computed(() => {
  const linhas = [
    ['Ativos cadastrados', String(filteredAtivos.value.length)],
    ['Ativos em uso', String(contarAtivos('ATIVO'))],
    ['Ativos em manutenção', String(contarAtivos('EM_MANUTENCAO'))],
    ['Ativos devolvidos', String(contarAtivos('DEVOLVIDO'))],
    ['Ativos inativos', String(contarAtivos('INATIVO'))],
    ['Ordens de manutenção', String(filteredOrdens.value.length)],
    ['Ordens pendentes', String(contarOrdens('PENDENTE'))],
    ['Ordens em andamento', String(contarOrdens('EM_ANDAMENTO'))],
    ['Ordens concluídas', String(contarOrdens('CONCLUIDA'))],
    ['Ordens canceladas', String(contarOrdens('CANCELADA'))],
    ['Custo estimado (sem canceladas)', custoTotalFormatado.value],
    ['Custo das ordens em aberto', custoAbertoFormatado.value],
    ['Tempo médio de conclusão', tempoMedioConclusao.value],
    [
      `Ordens em aberto há mais de ${DIAS_ATRASO} dias`,
      String(ordensAtrasadas.value.length)
    ]
  ]

  if (ehProfessor.value) {
    linhas.push(['Usuários', String(filteredUsuarios.value.length)])
  }

  return linhas
})

function exportarRelatorioGeral() {
  if (gerandoRelatorio.value) return

  gerandoRelatorio.value = true

  try {
    const secoes = [
      {
        titulo: 'Resumo',
        colunas: ['Indicador', 'Valor'],
        dados: resumoRows.value
      },
      {
        titulo: 'Ativos',
        colunas: ativoTableHeaders,
        dados: comStatusLegivel(ativoTableRows.value, ativoTableHeaders)
      },
      {
        titulo: 'Ordens de Manutenção',
        colunas: manutencaoTableHeaders,
        dados: comStatusLegivel(
          manutencaoTableRows.value,
          manutencaoTableHeaders
        )
      }
    ]

    if (ehProfessor.value) {
      secoes.push({
        titulo: 'Usuários',
        colunas: userTableHeaders,
        dados: comStatusLegivel(userTableRows.value, userTableHeaders)
      })
    }

    gerarPdf({
      titulo: 'Relatório Geral — Easy Asset',
      nomeArquivo: 'relatorio_geral_easy_asset.pdf',
      secoes
    })
  } catch (error) {
    console.error('Erro ao gerar relatório geral:', error)

    window.alert('Não foi possível gerar o relatório. Tente novamente.')
  } finally {
    gerandoRelatorio.value = false
  }
}

function exportarTabela(titulo, nomeArquivo, headers, rows) {
  if (rows.length === 0) {
    window.alert('Não há registros para exportar com os filtros atuais.')
    return
  }

  gerarPdf({
    titulo,
    nomeArquivo,
    colunas: headers,
    dados: comStatusLegivel(rows, headers)
  })
}

function exportarRelatorioAtivos() {
  exportarTabela(
    'Relatório de Ativos',
    'relatorio_ativos.pdf',
    ativoTableHeaders,
    ativoTableRows.value
  )
}

function exportarRelatorioUsuarios() {
  exportarTabela(
    'Relatório de Usuários',
    'relatorio_usuarios.pdf',
    userTableHeaders,
    userTableRows.value
  )
}

function exportarRelatorioOrdens() {
  exportarTabela(
    'Relatório de Manutenção dos Ativos',
    'relatorio_manutencao.pdf',
    manutencaoTableHeaders,
    manutencaoTableRows.value
  )
}

function exportarRelatorioHistoricoOrdens() {
  exportarTabela(
    'Histórico de Ordens de Manutenção',
    'historico_ordens_manutencao.pdf',
    historicoHeaders,
    historicoRows.value
  )
}
</script>
