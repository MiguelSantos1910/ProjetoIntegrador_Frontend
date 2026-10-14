<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>{{ title }}</h3>
    </div>

    <div class="chart-container">
      <!-- Barras -->
      <Bar
        v-if="type === 'bar'"
        :data="chartData"
        :options="chartOptions"
      />

      <!-- Linha -->
      <Line
        v-else-if="type === 'line'"
        :data="chartData"
        :options="chartOptions"
      />

      <!-- Pizza -->
      <Pie
        v-else-if="type === 'pie'"
        :data="chartData"
        :options="chartOptions"
      />

      <!-- Rosca -->
      <Doughnut
        v-else-if="type === 'doughnut'"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js'

import {
  Bar,
  Line,
  Pie,
  Doughnut
} from 'vue-chartjs'

import { computed } from 'vue'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
)

const props = defineProps({
  title: {
    type: String,
    default: 'Gráfico'
  },

  type: {
    type: String,
    default: 'bar'
  },

  labels: {
    type: Array,
    required: true
  },

  values: {
    type: Array,
    required: true
  },

  color: {
    type: String,
    default: '#0D9F95'
  }
})

const chartData = computed(() => ({
  labels: props.labels,

  datasets: [
    {
      label: 'Ativos',
      data: props.values,

      backgroundColor: props.color,
      borderColor: props.color,
      borderWidth: 1,

      borderRadius: props.type === 'bar' ? 6 : 0,

      // Estilo do gráfico de linha
      pointBackgroundColor: props.color,
      pointBorderColor: props.color,
      tension: 0.3
    }
  ]
}))

const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: true
    }
  }
}
</script>