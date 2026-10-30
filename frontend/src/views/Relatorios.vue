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
            placeholder="Pesquisar usuários e ordens..."
          >
        </div>

        <button
          type="button"
          class="notification-button"
          aria-label="Notificações"
        >
          <Bell
            :size="16"
            :stroke-width="1.8"
          />
        </button>
      </div>
    </header>

    <main class="relatorios-content">
      <section class="report-card filters-card">
        <h2>Filtros de Exportação</h2>

        <div class="filters-grid">
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

          <div class="filter-field">
            <label for="ordemStatus">Status das Ordens</label>
            <select
              id="ordemStatus"
              v-model="filters.statusOrdens"
            >
              <option value="todos">
                Todos os Status
              </option>
              <option value="pendentes">
                Pendentes
              </option>
              <option value="emAndamento">
                Em Andamento
              </option>
              <option value="concluidos">
                Concluídos
              </option>
            </select>
          </div>

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
        v-if="usuariosStore.carregando || carregandoManutencoes"
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
        <section class="report-section">
          <div class="section-heading">
            <h2>Usuários</h2>
          </div>

          <div class="indicators-grid">
            <Card
              title="Total de Usuários"
              :value="totalUsuarios"
              :footer-text="`${usuariosAtivos} usuários ativos`"
              :icon="Users"
            />

            <Card
              title="Usuários Ativos"
              :value="usuariosAtivos"
              :footer-text="`${porcentagemAtivos}% do total`"
              :icon="UserCheck"
            />

            <Card
              title="Alunos"
              :value="totalAlunos"
              :footer-text="`${porcentagemAlunos}% dos usuários`"
              :icon="GraduationCap"
            />

            <Card
              title="Professores"
              :value="totalProfessores"
              :footer-text="`${porcentagemProfessores}% dos usuários`"
              :icon="UserRound"
            />
          </div>
        </section>

        <section class="report-section">
          <div class="section-heading">
            <h2>Ordens de Manutenção</h2>
          </div>

          <div class="indicators-grid">
            <Card
              title="Total de Ordens"
              :value="manutencaoTotal"
              :footer-text="`${manutencaoTotal} ordens registradas`"
              :icon="ClipboardList"
            />

            <Card
              title="Ordens Abertas"
              :value="ordensAbertas"
              :footer-text="`${porcentagemAbertas}% das ordens`"
              :icon="ClipboardPlus"
            />

            <Card
              title="Em Andamento"
              :value="ordensEmAndamento"
              :footer-text="`${porcentagemEmAndamento}% das ordens`"
              :icon="Wrench"
            />

            <Card
              title="Concluídas"
              :value="ordensConcluidas"
              :footer-text="`${porcentagemConcluidas}% das ordens`"
              :icon="CheckCircle"
            />
          </div>
        </section>

        <section class="charts-grid">
          <div class="report-card chart-card">
            <Chart
              type="bar"
              title="Usuários por Papel"
              :labels="papelLabels"
              :values="papelValues"
            />
          </div>

          <div class="report-card chart-card">
            <Chart
              type="bar"
              title="Status dos Usuários"
              :labels="statusLabels"
              :values="statusValues"
            />
          </div>

          <div class="report-card chart-card">
            <Chart
              type="pie"
              title="Status das Ordens"
              :labels="statusOrdensLabels"
              :values="statusOrdensValues"
              :color="colorValues"
            />
          </div>

          <div class="report-card chart-card">
            <Chart
              type="bar"
              title="Ordens por Ativo e Responsável"
              :labels="ativoOrdemLabels"
              :values="ativoOrdemValues"
            />
          </div>
        </section>

        <section class="report-card table-card">
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

            <div class="pagination">
              <button
                type="button"
                class="page-button"
                disabled
              >
                Anterior
              </button>
              <button
                type="button"
                class="page-button active"
                disabled
              >
                Próximo
              </button>
            </div>
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
              Mostrando {{ manutencaoTableRows.length }}
              de {{ manutencoes.length }} ordens de manutenção
            </span>

            <div class="pagination">
              <button
                type="button"
                class="page-button"
                disabled
              >
                Anterior
              </button>
              <button
                type="button"
                class="page-button active"
                disabled
              >
                Próximo
              </button>
            </div>
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

            <div class="pagination">
              <button
                type="button"
                class="page-button"
                disabled
              >
                Anterior
              </button>
              <button
                type="button"
                class="page-button active"
                disabled
              >
                Próximo
              </button>
            </div>
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
  Bell,
  Users,
  UserCheck,
  GraduationCap,
  UserRound,
  ClipboardList,
  ClipboardPlus,
  Wrench,
  CheckCircle
} from 'lucide-vue-next'

import { useRouter } from 'vue-router'

import Card from '../components/Card.vue'
import Chart from '../components/Chart.vue'
import Table from '../components/Table.vue'

import { useUsuariosStore } from '../stores/usuarios'
import { useOrdensStore } from '../stores/ordens'
import api from '../services/api'
import { usePdf } from '../composables/gerarPdf.js'
import { STATUS_ATIVO } from '../composables/status.js'
import { dataFormatada } from '../composables/formatData.js'

import '../assets/css/Relatorios.css'

const usuariosStore = useUsuariosStore()
const manutencoesStore = useOrdensStore()
const router = useRouter()

const { gerarPdf } = usePdf()

const search = ref('')
const carregandoManutencoes = ref(false)
const carregandoHistorico = ref(false)
const gerandoRelatorio = ref(false)
const erroManutencoes = ref('')
const erroHistorico = ref('')
const todosHistorico = ref([])

const filters = reactive({
  papel: 'todos',
  status: 'todos',
  statusOrdens: 'todos'
})

const todosUsuarios = computed(
  () => usuariosStore.usuarios || []
)

const manutencoes = computed(
  () => manutencoesStore.ordens || []
)

const erroRelatorios = computed(
  () => usuariosStore.erro || erroManutencoes.value
)

onMounted(async () => {
  carregandoManutencoes.value = true
  erroManutencoes.value = ''

  try {
    const resultados = await Promise.allSettled([
      usuariosStore.fetchUsuarios(),
      manutencoesStore.fetchOrdens()
    ])

    if (
      resultados[0].status === 'rejected' ||
      resultados[0].value === false
    ) {
      console.error(
        'Não foi possível carregar os usuários:',
        resultados[0].status === 'rejected'
          ? resultados[0].reason
          : ''
      )
    }

    if (
      resultados[1].status === 'rejected' ||
      resultados[1].value === false
    ) {
      erroManutencoes.value =
        manutencoesStore.erro ||
        'Não foi possível carregar as ordens de manutenção.'

      if (resultados[1].status === 'rejected') {
        console.error(
          'Erro ao carregar ordens:',
          resultados[1].reason
        )
      }
    } else {
      // O histórico é carregado separadamente para não bloquear
      // os relatórios principais.
      carregarHistoricoOrdens()
    }
  } finally {
    carregandoManutencoes.value = false
  }
})

const normalizarStatus = (status) => {
  return String(status ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
}

const statusEhAberto = (status) =>
  ['PENDENTE', 'ABERTA'].includes(normalizarStatus(status))

const statusEhAndamento = (status) =>
  normalizarStatus(status) === 'EM_ANDAMENTO'

const statusEhConcluido = (status) =>
  ['CONCLUIDO', 'CONCLUIDA'].includes(
    normalizarStatus(status)
  )

const manutencaoTotal = computed(
  () => manutencoes.value.length
)

const ordensAbertas = computed(() =>
  manutencoes.value.filter((ordem) =>
    statusEhAberto(ordem.status)
  ).length
)

const ordensEmAndamento = computed(() =>
  manutencoes.value.filter((ordem) =>
    statusEhAndamento(ordem.status)
  ).length
)

const ordensConcluidas = computed(() =>
  manutencoes.value.filter((ordem) =>
    statusEhConcluido(ordem.status)
  ).length
)

const porcentagemAbertas = computed(() => {
  if (!manutencaoTotal.value) return 0

  return Math.round(
    (ordensAbertas.value / manutencaoTotal.value) * 100
  )
})

const porcentagemEmAndamento = computed(() => {
  if (!manutencaoTotal.value) return 0

  return Math.round(
    (ordensEmAndamento.value / manutencaoTotal.value) * 100
  )
})

const porcentagemConcluidas = computed(() => {
  if (!manutencaoTotal.value) return 0

  return Math.round(
    (ordensConcluidas.value / manutencaoTotal.value) * 100
  )
})

const formatPapel = (papel) => {
  const papeis = {
    ALUNO: 'Aluno',
    PROFESSOR: 'Professor',
    SUPORTE: 'Suporte técnico'
  }

  return papeis[papel] || papel || '-'
}

const filteredUsuarios = computed(() => {
  const termo = search.value.toLowerCase().trim()

  return todosUsuarios.value.filter((usuario) => {
    const nomeCompleto = [
      usuario.first_name,
      usuario.last_name
    ].filter(Boolean).join(' ')

    const textoPesquisa = [
      usuario.username,
      nomeCompleto,
      usuario.email,
      usuario.papel,
      usuario.id
    ]
      .filter((valor) => valor !== null && valor !== undefined)
      .join(' ')
      .toLowerCase()

    const correspondePesquisa =
      !termo || textoPesquisa.includes(termo)

    const correspondePapel =
      filters.papel === 'todos' ||
      usuario.papel === filters.papel

    const correspondeStatus =
      filters.status === 'todos' ||
      (filters.status === 'ativo' && usuario.is_active) ||
      (filters.status === 'inativo' && !usuario.is_active)

    return (
      correspondePesquisa &&
      correspondePapel &&
      correspondeStatus
    )
  })
})

const filteredOrdens = computed(() => {
  const termo = search.value.toLowerCase().trim()

  return manutencoes.value.filter((ordem) => {
    const ativo =
      typeof ordem.ativo === 'object' && ordem.ativo !== null
        ? ordem.ativo
        : {}

    const responsavel =
      typeof ordem.responsavel === 'object' &&
      ordem.responsavel !== null
        ? ordem.responsavel
        : {}

    const nomeResponsavel = [
      responsavel.username,
      responsavel.first_name,
      responsavel.last_name,
      responsavel.nome
    ].filter(Boolean).join(' ')

    const textoPesquisa = [
      ordem.id,
      ordem.tipo,
      ordem.descricao,
      ordem.status,
      ativo.descricao,
      ativo.nome,
      ativo.numero_patrimonio,
      responsavel.username,
      nomeResponsavel,
      typeof ordem.responsavel === 'string' ||
      typeof ordem.responsavel === 'number'
        ? ordem.responsavel
        : ''
    ]
      .filter((valor) => valor !== null && valor !== undefined)
      .join(' ')
      .toLowerCase()

    const correspondePesquisa =
      !termo || textoPesquisa.includes(termo)

    const status = normalizarStatus(ordem.status)

    const correspondeStatus =
      filters.statusOrdens === 'todos' ||
      (
        filters.statusOrdens === 'pendentes' &&
        ['PENDENTE', 'ABERTA'].includes(status)
      ) ||
      (
        filters.statusOrdens === 'emAndamento' &&
        status === 'EM_ANDAMENTO'
      ) ||
      (
        filters.statusOrdens === 'concluidos' &&
        ['CONCLUIDO', 'CONCLUIDA'].includes(status)
      )

    return correspondePesquisa && correspondeStatus
  })
})

const historicoHeaders = [
  'Log',
  'Ordem',
  'Ação',
  'Descrição',
  'Status anterior',
  'Status novo',
  'Usuário',
  'Data',
]

const filteredHistorico = computed(() => {
  const termo = search.value.toLowerCase().trim()

  return todosHistorico.value.filter((log) => {
    const texto = [
      log.id,
      log.ordem,
      log.acao,
      log.descricao,
      log.status_anterior,
      log.status_novo,
      log.usuario_nome,
      log.usuario,
      log.data,
    ]
      .filter((valor) => valor !== null && valor !== undefined)
      .join(' ')
      .toLowerCase()

    const correspondePesquisa = !termo || texto.includes(termo)

    const statusNovo = normalizarStatus(log.status_novo)
    const correspondeStatus =
      filters.statusOrdens === 'todos' ||
      (
        filters.statusOrdens === 'pendentes' &&
        ['PENDENTE', 'ABERTA'].includes(statusNovo)
      ) ||
      (
        filters.statusOrdens === 'emAndamento' &&
        statusNovo === 'EM_ANDAMENTO'
      ) ||
      (
        filters.statusOrdens === 'concluidos' &&
        ['CONCLUIDO', 'CONCLUIDA'].includes(statusNovo)
      )

    return correspondePesquisa && correspondeStatus
  })
})

const historicoRows = computed(() =>
  filteredHistorico.value.map((log) => [
    log.id ?? '-',
    log.ordem ? `#${log.ordem}` : '-',
    log.acao || '-',
    log.descricao || '-',
    log.status_anterior || '-',
    log.status_novo || '-',
    log.usuario_nome || (log.usuario ? `ID ${log.usuario}` : 'Sistema'),
    log.data ? dataFormatada(log.data) : '-',
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
      // Mantém os registros carregados visíveis e informa falhas no console.
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

const totalUsuarios = computed(
  () => todosUsuarios.value.length
)

const usuariosAtivos = computed(() =>
  todosUsuarios.value.filter(
    (usuario) => usuario.is_active
  ).length
)

const totalAlunos = computed(() =>
  todosUsuarios.value.filter(
    (usuario) => usuario.papel === 'ALUNO'
  ).length
)

const totalProfessores = computed(() =>
  todosUsuarios.value.filter(
    (usuario) => usuario.papel === 'PROFESSOR'
  ).length
)

const porcentagemAtivos = computed(() => {
  if (!totalUsuarios.value) return 0

  return Math.round(
    (usuariosAtivos.value / totalUsuarios.value) * 100
  )
})

const porcentagemAlunos = computed(() => {
  if (!totalUsuarios.value) return 0

  return Math.round(
    (totalAlunos.value / totalUsuarios.value) * 100
  )
})

const porcentagemProfessores = computed(() => {
  if (!totalUsuarios.value) return 0

  return Math.round(
    (totalProfessores.value / totalUsuarios.value) * 100
  )
})

const papelLabels = [
  'Aluno',
  'Professor',
  'Suporte técnico'
]

const papelValues = computed(() => [
  filteredUsuarios.value.filter(
    (usuario) => usuario.papel === 'ALUNO'
  ).length,
  filteredUsuarios.value.filter(
    (usuario) => usuario.papel === 'PROFESSOR'
  ).length,
  filteredUsuarios.value.filter(
    (usuario) => usuario.papel === 'SUPORTE'
  ).length
])

const statusLabels = ['Ativos', 'Inativos']

const statusValues = computed(() => [
  filteredUsuarios.value.filter(
    (usuario) => usuario.is_active
  ).length,
  filteredUsuarios.value.filter(
    (usuario) => !usuario.is_active
  ).length
])

const statusOrdensLabels = [
  'Pendentes',
  'Em Andamento',
  'Concluídas'
]

const statusOrdensValues = computed(() => [
  filteredOrdens.value.filter((ordem) =>
    statusEhAberto(ordem.status)
  ).length,
  filteredOrdens.value.filter((ordem) =>
    statusEhAndamento(ordem.status)
  ).length,
  filteredOrdens.value.filter((ordem) =>
    statusEhConcluido(ordem.status)
  ).length
])

const colorValues = [
  '#ffff00',
  '#0070ff',
  '#0D9F95'
]


const ativoResponsavelChartData = computed(() => {
  const contagens = new Map()

  filteredOrdens.value.forEach((ordem) => {
    const ativo =
      typeof ordem.ativo === 'object' && ordem.ativo !== null
        ? ordem.ativo
        : null

    const nomeAtivo = ativo
      ? (
          ativo.descricao ||
          ativo.nome ||
          ativo.numero_patrimonio ||
          `ID ${ativo.id ?? ''}`
        )
      : (
          ordem.ativo !== null && ordem.ativo !== undefined
            ? `ID ${ordem.ativo}`
            : 'Não identificado'
        )

    const responsavel =
      typeof ordem.responsavel === 'object' &&
      ordem.responsavel !== null
        ? (
            ordem.responsavel.username ||
            [
              ordem.responsavel.first_name,
              ordem.responsavel.last_name
            ].filter(Boolean).join(' ') ||
            ordem.responsavel.nome ||
            'Não identificado'
          )
        : (ordem.responsavel || 'Não identificado')

    const categorias = [
      `Ativo: ${nomeAtivo}`,
      `Responsável: ${responsavel}`
    ]

    categorias.forEach((categoria) => {
      contagens.set(
        categoria,
        (contagens.get(categoria) || 0) + 1
      )
    })
  })

  return Array.from(contagens.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
})

const ativoOrdemLabels = computed(() =>
  ativoResponsavelChartData.value.map(([label]) => label)
)

const ativoOrdemValues = computed(() =>
  ativoResponsavelChartData.value.map(([, quantidade]) => quantidade)
)

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
    const nomeCompleto = [
      usuario.first_name,
      usuario.last_name
    ].filter(Boolean).join(' ')

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

const formatStatusManutencao = (status) => {
  const chave = normalizarStatus(status)

  const statusManutencao = {
    PENDENTE: 'Pendente',
    ABERTA: 'Aberta',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDO: 'Concluído',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada'
  }

  return (
    STATUS_ATIVO?.[chave]?.label ||
    statusManutencao[chave] ||
    status ||
    '-'
  )
}

const manutencaoTableHeaders = [
  'Ordem',
  'Ativo',
  'Tipo',
  'Descrição',
  'Responsável',
  'Status',
  'Data'
]

const obterNomeAtivo = (ordem) => {
  const ativo =
    typeof ordem.ativo === 'object' && ordem.ativo !== null
      ? ordem.ativo
      : null

  if (!ativo) {
    return ordem.ativo ?? '-'
  }

  return (
    ativo.descricao ||
    ativo.nome ||
    ativo.numero_patrimonio ||
    (ativo.id ? `ID ${ativo.id}` : '-') ||
    '-'
  )
}

const obterResponsavel = (responsavel) => {
  if (typeof responsavel === 'object' && responsavel !== null) {
    const nomeCompleto = [
      responsavel.first_name,
      responsavel.last_name
    ].filter(Boolean).join(' ')

    return (
      responsavel.username ||
      responsavel.nome ||
      nomeCompleto ||
      '-'
    )
  }

  return responsavel ?? '-'
}

const manutencaoTableRows = computed(() =>
  filteredOrdens.value.map((ordem) => {
    const ativo =
      typeof ordem.ativo === 'object' && ordem.ativo !== null
        ? ordem.ativo
        : null

    return [
      ordem.id ?? '-',
      obterNomeAtivo(ordem),
      ativo?.tipo || ordem.tipo || '-',
      ordem.descricao || '-',
      obterResponsavel(ordem.responsavel),
      formatStatusManutencao(ordem.status),
      dataFormatada(ordem.data_abertura)
    ]
  })
)

const handleDetail = (rowIndex) => {
  const ordem = filteredOrdens.value[rowIndex]

  if (!ordem?.id) return

  router.push(`/manutencao/detalhe/${ordem.id}`)
}


const relatorioGeralRows = computed(() => {
  const linhasUsuarios = filteredUsuarios.value.map((usuario) => {
    const nomeCompleto = [
      usuario.first_name,
      usuario.last_name
    ].filter(Boolean).join(' ')

    return [
      'Usuário',
      usuario.id ?? '-',
      usuario.username || nomeCompleto || '-',
      usuario.email || '-',
      formatPapel(usuario.papel),
      usuario.is_active ? 'Ativo' : 'Inativo',
      dataFormatada(usuario.date_joined)
    ]
  })

  const linhasOrdens = filteredOrdens.value.map((ordem) => {
    return [
      'Manutenção',
      ordem.id ?? '-',
      obterNomeAtivo(ordem),
      ordem.descricao || '-',
      obterResponsavel(ordem.responsavel),
      formatStatusManutencao(ordem.status),
      dataFormatada(ordem.data_abertura)
    ]
  })

  return [...linhasUsuarios, ...linhasOrdens]
})

function exportarRelatorioGeral() {
  if (gerandoRelatorio.value) return

  if (relatorioGeralRows.value.length === 0) {
    window.alert(
      'Não há registros para exportar com os filtros atuais.'
    )
    return
  }

  gerandoRelatorio.value = true

  try {
    gerarPdf({
      titulo: 'Relatório Geral — Easy Asset',
      nomeArquivo: 'relatorio_geral_easy_asset.pdf',
      secoes: [
        {
          titulo: "Usuários",
          colunas: userTableHeaders,
          dados: userTableRows.value
        },
        {
          titulo: "Ordens Manutenção",
          colunas: manutencaoTableHeaders,
          dados: manutencaoTableRows.value
        }
      ]
    })
  } catch (error) {
    console.error('Erro ao gerar relatório geral:', error)

    window.alert(
      'Não foi possível gerar o relatório. Tente novamente.'
    )
  } finally {
    gerandoRelatorio.value = false
  }
}

function exportarRelatorioUsuarios() {
  gerarPdf({
    titulo: 'Relatório de Usuários',
    nomeArquivo: 'relatorio_usuarios.pdf',
    colunas: userTableHeaders,
    dados: userTableRows.value
  })
}

function exportarRelatorioOrdens() {
  gerarPdf({
    titulo: 'Relatório de Manutenção dos Ativos',
    nomeArquivo: 'relatorio_manutencao.pdf',
    colunas: manutencaoTableHeaders,
    dados: manutencaoTableRows.value
  })
}
function exportarRelatorioHistoricoOrdens() {
  if (filteredHistorico.value.length === 0) {
    window.alert(
      'Não há registros de histórico para exportar com os filtros atuais.'
    )
    return
  }

  gerarPdf({
    titulo: 'Histórico de Ordens de Manutenção',
    nomeArquivo: 'historico_ordens_manutencao.pdf',
    colunas: historicoHeaders,
    dados: historicoRows.value,
  })
}

</script>