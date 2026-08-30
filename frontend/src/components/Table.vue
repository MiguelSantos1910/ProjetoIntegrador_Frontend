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
              {{ cell }}
            </td>

            <td
              v-if="showActions"
              class="actions"
            >
              <button
                class="btn-edit"
                title="Editar"
                @click="emit('edit', row)"
              >
                <Pencil :size="16" />
              </button>

              <button
                class="btn-delete"
                title="Excluir"
                @click="emit('delete', row)"
              >
                <Trash2 :size="16" />
              </button>
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
</script>