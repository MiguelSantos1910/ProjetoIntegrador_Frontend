<template>
  <div class="relatorios">
    <header class="relatorios-header">
      <div>
        <h1>
          Relatórios Consolidados
        </h1>
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
            placeholder="Pesquisar nos relatórios..."
          >
        </div>

        <button
          type="button"
          class="notification-button"
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
        <h2>
          Filtros de Exportação
        </h2>

        <div class="filters-grid">

          <div class="filter-field">
            <label for="papel">
              Papel
            </label>

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
            <label for="status">
              Status
            </label>

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

          <button
            type="button"
            class="generate-button"
            @click="generateReport"
          >
            Gerar Relatório
          </button>

        </div>
      </section>

      <div
        v-if="usuariosStore.carregando"
        class="status-message"
      >
        Carregando dados dos usuários...
      </div>

      <div
        v-else-if="usuariosStore.erro"
        class="status-message error"
      >
        {{ usuariosStore.erro }}
      </div>

      <template v-else>

        <section class="report-section">

          <div class="section-heading">
            <h2>
              Usuários
            </h2>
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
            <h2>
              Ordens de Manutenção
            </h2>
          </div>

          <div class="indicators-grid">

            <Card
              title="Total de Ordens"
              :value="totalManutencoes"
              :footer-text="`${ordensAbertas} ordens abertas`"
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

        </section>

        <section class="report-card table-card">

          <div class="table-header">
            <h2>
              Relatório Detalhado de Usuários
            </h2>

            <div class="export-actions">

              <button
                type="button"
                class="export-button excel"
                @click="exportExcel"
              >
                Exportar Excel
              </button>

              <button
                type="button"
                class="export-button pdf"
                @click="exportPdf"
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
              Mostrando
              {{ filteredUsuarios.length }}
              de
              {{ usuariosStore.usuarios.length }}
              usuários
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
            <h2>
              Ordens de Manutenção
            </h2>

            <div class="export-actions">

              <button
                type="button"
                class="export-button excel"
                @click="exportManutencaoExcel"
              >
                Exportar Excel
              </button>

              <button
                type="button"
                class="export-button pdf"
                @click="exportManutencaoPdf"
              >
                Exportar PDF
              </button>

            </div>
          </div>

          <div
            v-if="carregandoManutencoes"
            class="status-message"
          >
            Carregando ordens de manutenção...
          </div>

          <Table
            v-else
            title=""
            :headers="manutencaoTableHeaders"
            :rows="manutencaoTableRows"
          />

          <div class="table-footer">
            <span>
              Mostrando
              {{ manutencaoTableRows.length }}
              ordens de manutenção
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

import Card from '../components/Card.vue'
import Chart from '../components/Chart.vue'
import Table from '../components/Table.vue'

import { useUsuariosStore } from '../stores/usuarios'

import '../assets/css/Relatorios.css'

const usuariosStore = useUsuariosStore()

const search = ref('')

const filters = reactive({
  papel: 'todos',
  status: 'todos'
})

const manutencoes = ref([])

const carregandoManutencoes = ref(false)

onMounted(async () => {
  await usuariosStore.fetchUsuarios()
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
  const termo = search.value
    .toLowerCase()
    .trim()

  return usuariosStore.usuarios.filter((usuario) => {
    const nomeCompleto = [
      usuario.first_name,
      usuario.last_name
    ]
      .filter(Boolean)
      .join(' ')

    const correspondePesquisa =
      !termo ||
      usuario.username
        ?.toLowerCase()
        .includes(termo) ||
      nomeCompleto
        .toLowerCase()
        .includes(termo) ||
      usuario.email
        ?.toLowerCase()
        .includes(termo)

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

const totalUsuarios = computed(() => {
  return filteredUsuarios.value.length
})

const usuariosAtivos = computed(() => {
  return filteredUsuarios.value.filter(
    (usuario) => usuario.is_active
  ).length
})

const usuariosInativos = computed(() => {
  return filteredUsuarios.value.filter(
    (usuario) => !usuario.is_active
  ).length
})

const totalAlunos = computed(() => {
  return filteredUsuarios.value.filter(
    (usuario) => usuario.papel === 'ALUNO'
  ).length
})

const totalProfessores = computed(() => {
  return filteredUsuarios.value.filter(
    (usuario) => usuario.papel === 'PROFESSOR'
  ).length
})

const porcentagemAtivos = computed(() => {
  if (!totalUsuarios.value) {
    return 0
  }

  return Math.round(
    (usuariosAtivos.value / totalUsuarios.value) * 100
  )
})

const porcentagemAlunos = computed(() => {
  if (!totalUsuarios.value) {
    return 0
  }

  return Math.round(
    (totalAlunos.value / totalUsuarios.value) * 100
  )
})

const porcentagemProfessores = computed(() => {
  if (!totalUsuarios.value) {
    return 0
  }

  return Math.round(
    (totalProfessores.value / totalUsuarios.value) * 100
  )
})

const totalManutencoes = computed(() => {
  return manutencoes.value.length
})

const ordensAbertas = computed(() => {
  return manutencoes.value.filter(
    (ordem) => ordem.status === 'ABERTA'
  ).length
})

const ordensEmAndamento = computed(() => {
  return manutencoes.value.filter(
    (ordem) => ordem.status === 'EM_ANDAMENTO'
  ).length
})

const ordensConcluidas = computed(() => {
  return manutencoes.value.filter(
    (ordem) => ordem.status === 'CONCLUIDA'
  ).length
})

const porcentagemAbertas = computed(() => {
  if (!totalManutencoes.value) {
    return 0
  }

  return Math.round(
    (ordensAbertas.value / totalManutencoes.value) * 100
  )
})

const porcentagemEmAndamento = computed(() => {
  if (!totalManutencoes.value) {
    return 0
  }

  return Math.round(
    (ordensEmAndamento.value / totalManutencoes.value) * 100
  )
})

const porcentagemConcluidas = computed(() => {
  if (!totalManutencoes.value) {
    return 0
  }

  return Math.round(
    (ordensConcluidas.value / totalManutencoes.value) * 100
  )
})

const papelLabels = [
  'Aluno',
  'Professor',
  'Suporte técnico'
]

const papelValues = computed(() => {
  return [
    filteredUsuarios.value.filter(
      (usuario) => usuario.papel === 'ALUNO'
    ).length,

    filteredUsuarios.value.filter(
      (usuario) => usuario.papel === 'PROFESSOR'
    ).length,

    filteredUsuarios.value.filter(
      (usuario) => usuario.papel === 'SUPORTE'
    ).length
  ]
})

const statusLabels = [
  'Ativos',
  'Inativos'
]

const statusValues = computed(() => {
  return [
    usuariosAtivos.value,
    usuariosInativos.value
  ]
})

const userTableHeaders = [
  'ID',
  'Usuário',
  'Nome',
  'E-mail',
  'Papel',
  'Status'
]

const userTableRows = computed(() => {
  return filteredUsuarios.value.map((usuario) => {
    const nomeCompleto = [
      usuario.first_name,
      usuario.last_name
    ]
      .filter(Boolean)
      .join(' ')

    return [
      usuario.id || '-',
      usuario.username || '-',
      nomeCompleto || '-',
      usuario.email || '-',
      formatPapel(usuario.papel),
      usuario.is_active ? 'ATIVO' : 'INATIVO'
    ]
  })
})

const manutencaoTableHeaders = [
  'Ordem',
  'Ativo',
  'Tipo',
  'Descrição',
  'Responsável',
  'Status',
  'Data'
]

const formatStatusManutencao = (status) => {
  const statusMap = {
    ABERTA: 'Aberta',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada'
  }

  return statusMap[status] || status || '-'
}

const formatData = (data) => {
  if (!data) {
    return '-'
  }

  return new Date(data).toLocaleDateString('pt-BR')
}

const manutencaoTableRows = computed(() => {
  return manutencoes.value.map((ordem) => {
    return [
      ordem.id || '-',
      ordem.ativo?.descricao || ordem.ativo || '-',
      ordem.tipo || '-',
      ordem.descricao || '-',
      ordem.responsavel?.username ||
        ordem.responsavel ||
        '-',
      formatStatusManutencao(ordem.status),
      formatData(ordem.data_abertura)
    ]
  })
})

const generateReport = () => {
  console.log(
    'Filtros aplicados:',
    {
      ...filters
    }
  )

  console.log(
    'Usuários encontrados:',
    filteredUsuarios.value
  )

  console.log(
    'Ordens de manutenção:',
    manutencoes.value
  )
}

const exportExcel = () => {
  console.log(
    'Exportando relatório de usuários:',
    filteredUsuarios.value
  )
}

const exportPdf = () => {
  console.log(
    'Exportando relatório de usuários:',
    filteredUsuarios.value
  )
}

const exportManutencaoExcel = () => {
  console.log(
    'Exportando ordens de manutenção:',
    manutencoes.value
  )
}

const exportManutencaoPdf = () => {
  console.log(
    'Exportando ordens de manutenção:',
    manutencoes.value
  )
}
</script>