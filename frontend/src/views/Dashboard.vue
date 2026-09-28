<template>
  <div class="dashboard">
    <!-- Card Saudação -->
    <div class="saudacao">
      <Card
        title="Boas vindas ao EASY ASSET"
        :value="saudacao"
        :icon="User"
      />
    </div>

    <!-- Cards -->
    <div class="card-grid">
      <Card
        title="Total Cadastrados"
        :value="totalAtivos"
        footer-text="Ativos cadastrados no sistema"
        :icon="Package"
      />

      <Card
        title="Em Manutenção"
        :value="manutencao"
        footer-text="Ativos em manutenção"
        :icon="Wrench"
      />

      <Card
        title="Disponíveis"
        :value="ativos"
        footer-text="Ativos disponíveis"
        :icon="CheckCircle"
      />

      <Card
        title="Atenção"
        :value="atencao"
        footer-text="Necessitam de atenção"
        :icon="AlertTriangle"
      />
    </div>

    <!-- Gráfico -->
    <div class="chart-section">
      <Chart
        type="bar"
        title="Ativos por Categoria"
        :labels="chartLabels"
        :values="chartValues"
      />
    </div>

    <!-- Histórico de Movimentação -->
    <div class="history-section">
      <Table
        title="Histórico de Movimentação"
        :headers="manutencaoHeaders"
        :rows="manutencaoRows"
      />
    </div>
  </div>
</template>

<script setup>
import Card from '../components/Card.vue'
import Chart from '../components/Chart.vue'
import Table from '../components/Table.vue'
import { useAuthStore } from '../stores/auth'
import { useAtivosStore } from '../stores/ativos'
import { computed, ref, onMounted } from 'vue' 
import '../assets/css/Dashboard.css'
import {
  Package,
  Wrench,
  CheckCircle,
  AlertTriangle,
  User
} from 'lucide-vue-next'

const authStore = useAuthStore()
const ativosStore = useAtivosStore()

const saudacao = computed(() => {
  const nome = authStore.usuario?.username || 'Usuário'
  return `Bem vindo, ${nome}!`
})

onMounted(() => {
  ativosStore.fetchAtivos()
})

const chartLabels = computed(() => {
  const categorias = ativosStore.ativos.map((ativo) => ativo.tipo?.descricao || ativo.tipo)
  return [...new Set(categorias)]
})

const chartValues = computed(() => {
  return chartLabels.value.map((label) => {
    return ativosStore.ativos.filter((ativo) => ativo.tipo?.descricao === label || ativo.tipo === label).length
  })
})

const manutencaoHeaders = ['Descrição', 'Tipo', 'Patrimônio', 'Sala', 'Status']

const manutencaoRows = computed(() => {
  return ativosStore.ativos
    .filter((ativo) => ativo.status === 'Em Manutenção')
    .map((ativo) => [
      ativo.descricao || 'Sem informação',
      ativo.tipo?.descricao || ativo.tipo || 'Sem informação',
      ativo.numero_patrimonio || 'Sem informação',
      ativo.sala || 'Sem informação',
      ativo.status || 'Sem informação'
    ])
})

const ativos = computed(() => {
  return ativosStore.ativos.filter((ativo) => ativo.status === 'Ativo' || ativo.status === 'ATIVO').length
})

const manutencao = computed(() => {
  return ativosStore.ativos.filter((ativo) => ativo.status === 'manutenção').length
})

const atencao = computed(() => {
  return ativosStore.ativos.filter((ativo) => ativo.status === 'atenção').length
})

const totalAtivos = computed(() => {
  return ativosStore.ativos.length
})
</script>