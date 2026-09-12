<template>
  <div class="relatorios">
    <!-- CABEÇALHO -->

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

    <!-- CONTEÚDO -->

    <main class="relatorios-content">
      <!-- FILTROS -->

      <section class="report-card filters-card">
        <h2>
          Filtros de Exportação
        </h2>

        <div class="filters-grid">
          <div class="filter-field">
            <label for="data-inicial">
              De
            </label>

            <input
              id="data-inicial"
              v-model="filters.dataInicial"
              type="date"
            >
          </div>

          <div class="filter-field">
            <label for="data-final">
              Até
            </label>

            <input
              id="data-final"
              v-model="filters.dataFinal"
              type="date"
            >
          </div>

          <div class="filter-field">
            <label for="categoria">
              Categoria
            </label>

            <select
              id="categoria"
              v-model="filters.categoria"
            >
              <option value="todas">
                Todas as Categorias
              </option>

              <option value="ti">
                TI
              </option>

              <option value="veiculos">
                Veículos
              </option>

              <option value="mobiliario">
                Mobiliário
              </option>

              <option value="maquinario">
                Maquinário
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
                Ativo
              </option>

              <option value="manutencao">
                Em Manutenção
              </option>

              <option value="depreciado">
                Depreciado
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

      <!-- INDICADORES -->

      <section class="indicators-grid">
        <Card
          title="Total de Ativos"
          value="847"
          footer-text="↑ 5,2% — Novos cadastrados"
        />

        <Card
          title="Valor do Patrimônio"
          value="R$ 2.340.500"
          footer-text="↑ 14,8% — Valor residual total"
        />

        <Card
          title="Depreciação Média"
          value="18,4%"
          footer-text="↓ 1,2% — Taxa anual média"
        />

        <Card
          title="Em Manutenção"
          value="23"
          footer-text="↓ 4,1% — Custos sob controle"
        />
      </section>

      <!-- GRÁFICOS -->

      <section class="charts-grid">
        <div class="report-card chart-card">
          <Chart
            type="bar"
            title="Ativos por Categoria (Quantidade)"
            :labels="categoryLabels"
            :values="categoryValues"
          />
        </div>

        <div class="report-card chart-card">
          <Chart
            type="line"
            title="Evolução do Patrimônio (R$k) — 12 Meses"
            :labels="patrimonyLabels"
            :values="patrimonyValues"
          />
        </div>
      </section>

      <!-- TABELA -->

      <section class="report-card table-card">
        <div class="table-header">
          <h2>
            Relatório Detalhado de Ativos
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
          :headers="tableHeaders"
          :rows="tableRows"
        />

        <!-- PAGINAÇÃO -->

        <div class="table-footer">
          <span>
            Mostrando 1–6 de 847 ativos
          </span>

          <div class="pagination">
            <button
              type="button"
              class="page-button"
            >
              Anterior
            </button>

            <button
              type="button"
              class="page-button active"
            >
              Próximo
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import {
  Search,
  Bell
} from 'lucide-vue-next'

import Card from '../components/Card.vue'
import Chart from '../components/Chart.vue'
import Table from '../components/Table.vue'

import '../assets/css/Relatorios.css'


/* PESQUISA */

const search = ref('')


/* FILTROS */

const filters = reactive({
  dataInicial: '2023-01-01',
  dataFinal: '2023-12-31',
  categoria: 'todas',
  status: 'todos'
})


/* DADOS DO GRÁFICO DE CATEGORIAS */

const categories = ref([
  {
    name: 'TI',
    value: 345
  },

  {
    name: 'Veículos',
    value: 210
  },

  {
    name: 'Mobiliário',
    value: 180
  },

  {
    name: 'Maquinário',
    value: 112
  }
])

const categoryLabels = computed(() => {
  return categories.value.map(category => category.name)
})

const categoryValues = computed(() => {
  return categories.value.map(category => category.value)
})


/* DADOS DO GRÁFICO DE PATRIMÔNIO */

const patrimonyLabels = [
  'Jan',
  'Mar',
  'Mai',
  'Jul',
  'Set',
  'Nov',
  'Dez'
]

const patrimonyValues = [
  40,
  46,
  55,
  64,
  71,
  82,
  94
]


/* ATIVOS */

const assets = ref([
  {
    id: 'ATV-001',
    nome: 'Notebook Dell Latitude 5520',
    categoria: 'TI',
    localizacao: 'Sede - Bloco A',
    valorAquisicao: 'R$ 6.500,00',
    depreciacao: '10% (R$ 650)',
    valorAtual: 'R$ 5.850,00',
    status: 'Ativo'
  },

  {
    id: 'ATV-002',
    nome: 'Impressora HP LaserJet Pro',
    categoria: 'TI',
    localizacao: 'Sede - Recepção',
    valorAquisicao: 'R$ 2.100,00',
    depreciacao: '15% (R$ 315)',
    valorAtual: 'R$ 1.785,00',
    status: 'Em Manutenção'
  },

  {
    id: 'ATV-003',
    nome: 'Fiat Fiorino 1.4 Hard Working',
    categoria: 'Veículos',
    localizacao: 'Sede - Logística',
    valorAquisicao: 'R$ 82.000,00',
    depreciacao: '20% (R$ 16.400)',
    valorAtual: 'R$ 65.600,00',
    status: 'Ativo'
  },

  {
    id: 'ATV-005',
    nome: 'Servidor Dell PowerEdge R750',
    categoria: 'TI',
    localizacao: 'Datacenter Principal',
    valorAquisicao: 'R$ 45.000,00',
    depreciacao: '8% (R$ 3.600)',
    valorAtual: 'R$ 41.400,00',
    status: 'Ativo'
  },

  {
    id: 'ATV-006',
    nome: 'Ar Condicionado Split Consul 1.8',
    categoria: 'Mobiliário',
    localizacao: 'Filial SP',
    valorAquisicao: 'R$ 3.500,00',
    depreciacao: '100% (R$ 3.500)',
    valorAtual: 'R$ 0,00',
    status: 'Depreciado'
  },

  {
    id: 'ATV-008',
    nome: 'Switch Cisco 24 Portas Gigabit',
    categoria: 'TI',
    localizacao: 'Datacenter - Rack 1',
    valorAquisicao: 'R$ 7.900,00',
    depreciacao: '12% (R$ 948)',
    valorAtual: 'R$ 6.952,00',
    status: 'Ativo'
  }
])


/* TABELA */

const tableHeaders = [
  'ID',
  'Ativo',
  'Categoria',
  'Localização',
  'Valor Aquisição',
  'Depreciação',
  'Valor Atual',
  'Status'
]

const tableRows = computed(() => {
  return assets.value.map(asset => [
    asset.id,
    asset.nome,
    asset.categoria,
    asset.localizacao,
    asset.valorAquisicao,
    asset.depreciacao,
    asset.valorAtual,
    asset.status
  ])
})


/* AÇÕES */

const generateReport = () => {
  console.log(
    'Gerando relatório:',
    filters
  )
}


const exportExcel = () => {
  console.log('Exportar Excel')
}


const exportPdf = () => {
  console.log('Exportar PDF')
}
</script>