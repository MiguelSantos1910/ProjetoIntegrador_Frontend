<template>
  <div class="dashboard">
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
        :labels="[
          'Categoria A',
          'Categoria B',
          'Categoria C'
        ]"
        :values="[30, 50, 20]"
      />
    </div>

    <!-- Histórico de Movimentação -->
    <div class="history-section">
      <Table
        title="Histórico de Movimentação"
        :headers="['Data', 'Ativo', 'Ação']"
        :rows="[
          ['2024-01-01', 'Ativo 1', 'Cadastrado'],
          ['2024-01-02', 'Ativo 2', 'Em manutenção'],
          ['2024-01-03', 'Ativo 3', 'Disponível'],
          ['2024-01-04', 'Ativo 4', 'Atenção  necessária'],
          ['2024-01-05', 'Ativo 5', 'Cadastrado'],
          ['2024-01-06', 'Ativo 6', 'Em manutenção'],
          ['2024-01-07', 'Ativo 7', 'Disponível'],
          ['2024-01-08', 'Ativo 8', 'Atenção necessária']
        ]"
      />
    </div>
  </div>
</template>


<script setup>
import Card from '../components/Card.vue'
import Chart from '../components/Chart.vue'
import Table from '../components/Table.vue' 

import {
  Package,
  Wrench,
  CheckCircle,
  AlertTriangle,
} from 'lucide-vue-next'

import '../assets/css/Dashboard.css'
</script>