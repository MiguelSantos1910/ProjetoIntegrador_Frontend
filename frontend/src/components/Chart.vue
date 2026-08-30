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
  }
})

const chartData = computed(() => ({
  labels: props.labels,

  datasets: [
    {
      label: 'Ativos',
      data: props.values
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