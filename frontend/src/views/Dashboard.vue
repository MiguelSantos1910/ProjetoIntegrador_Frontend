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
        value="128"
        footer-text="Ativos cadastrados no sistema"
        :icon="Package"
      />

      <Card
        title="Em Manutenção"
        value="12"
        footer-text="Ativos em manutenção"
        :icon="Wrench"
      />

      <Card
        title="Disponíveis"
        value="102"
        footer-text="Ativos disponíveis"
        :icon="CheckCircle"
      />

      <Card
        title="Atenção"
        value="14"
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
        :headers="historyHeaders"
        :rows="historyRows"
      />
    </div>
  </div>
</template>

<script setup>
import Card from '../components/Card.vue'
import Chart from '../components/Chart.vue'
import Table from '../components/Table.vue'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue' 
import '../assets/css/Dashboard.css'
import {
  Package,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Info,
  User
} from 'lucide-vue-next'

const authStore = useAuthStore()

const saudacao = computed(() => {
  const nome = authStore.usuario?.username || 'Usuário'
  return `Bem vindo, ${nome}!`
})

const chartLabels = [
  'Categoria A',
  'Categoria B',
  'Categoria C'
]

const chartValues = [
  30,
  50,
  20
]

const historyHeaders = [
  'Data',
  'Ativo',
  'Ação'
]

const historyRows = [
  ['2024-01-01', 'Ativo 1', 'Cadastrado'],
  ['2024-01-02', 'Ativo 2', 'Em manutenção'],
  ['2024-01-03', 'Ativo 3', 'Disponível'],
  ['2024-01-04', 'Ativo 4', 'Atenção necessária'],
  ['2024-01-05', 'Ativo 5', 'Cadastrado'],
  ['2024-01-06', 'Ativo 6', 'Em manutenção'],
  ['2024-01-07', 'Ativo 7', 'Disponível'],
  ['2024-01-08', 'Ativo 8', 'Atenção necessária']
]
</script>