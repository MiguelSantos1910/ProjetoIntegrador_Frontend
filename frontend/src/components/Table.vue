<template>
  <div class="table-container">
    <div class="table-header">
      <h2 class="table-title">
        {{ title }}
      </h2>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
            >
              {{ header }}
            </th>

            <th v-if="showActions">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
          >
            <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
            >
              <span
                v-if="headers[cellIndex] === 'Status'"
                class="status-badge"
                :class="getStatusClass(cell)"
              >
                {{ getStatusLabel(cell) }}
              </span>

              <span v-else>
                {{ cell }}
              </span>
            </td>

            <td
              v-if="showActions"
              class="actions"
            >
              <button
                type="button"
                class="btn-edit"
                title="Editar"
                @click="emit('edit', rowIndex)"
              >
                <Pencil :size="16" />
              </button>

              <button
                type="button"
                class="btn-delete"
                title="Excluir"
                @click="emit('delete', rowIndex)"
              >
                <Trash2 :size="16" />
              </button>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td
              :colspan="headers.length + (showActions ? 1 : 0)"
              class="empty-row"
            >
              Nenhum ativo encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {
  Pencil,
  Trash2
} from 'lucide-vue-next'

import { STATUS_ATIVO } from '../composables/status'

import '../assets/css/Table.css'

defineProps({
  title: {
    type: String,
    default: 'Tabela'
  },

  headers: {
    type: Array,
    required: true
  },

  rows: {
    type: Array,
    required: true
  },

  showActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'edit',
  'delete'
])

const getStatusClass = (status) => {
  return STATUS_ATIVO[status]?.class || ''
}

const getStatusLabel = (status) => {
  return STATUS_ATIVO[status]?.label || status
}
</script>