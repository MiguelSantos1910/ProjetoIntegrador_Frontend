<template>
  <div class="table-container">
    <!-- Cabeçalho: aparece somente quando existe título -->
    <div
      v-if="title"
      class="table-header"
    >
      <h2 class="table-title">
        {{ title }}
      </h2>
    </div>

    <!-- Área de rolagem dinâmica -->
    <div
      class="table-wrapper"
      :style="{ '--table-max-height': alturaMaxima }"
      tabindex="0"
      role="region"
      :aria-label="title || 'Tabela de dados'"
    >
      <table>
        <thead>
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
              scope="col"
            >
              {{ header }}
            </th>

            <th
              v-if="showActions"
              scope="col"
            >
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
              <!-- Status dos ativos e ordens de manutenção -->
              <span
                v-if="headers[cellIndex] === 'Status'"
                class="status-badge"
                :class="getStatusClass(cell)"
              >
                {{ getStatusLabel(cell) }}
              </span>

              <!-- Eventos da auditoria -->
              <span
                v-else-if="
                  headers[cellIndex] === 'Evento' &&
                    ehCelulaEvento(cell)
                "
                class="log-event"
                :class="classeEvento(cell.value)"
              >
                {{ cell.label }}
              </span>

              <!-- Demais células -->
              <span v-else>
                {{ cell ?? '-' }}
              </span>
            </td>

            <!-- Ações -->
            <td
              v-if="showActions"
              class="actions"
            >
              <!-- Detalhes -->
              <button
                v-if="showDetail"
                type="button"
                class="btn-detail"
                title="Detalhes"
                aria-label="Ver detalhes"
                @click="emit('detail', rowIndex)"
              >
                <Eye :size="16" />
              </button>

              <!-- Editar -->
              <button
                v-if="showEdit && permissao"
                type="button"
                class="btn-edit"
                title="Editar"
                aria-label="Editar registro"
                @click="emit('edit', rowIndex)"
              >
                <Pencil :size="16" />
              </button>

              <!-- Inativar -->
              <button
                v-if="showInactive && permissao"
                type="button"
                class="btn-delete"
                title="Inativar"
                aria-label="Inativar registro"
                @click="emit('inactive', rowIndex)"
              >
                <Ban :size="16" />
              </button>
            </td>
          </tr>

          <!-- Estado vazio -->
          <tr v-if="rows.length === 0">
            <td
              :colspan="headers.length + (showActions ? 1 : 0)"
              class="empty-row"
            >
              Nenhum registro encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rodapé opcional -->
    <div
      v-if="showFooter"
      class="table-component-footer"
    >
      <span>
        {{ rows.length }}
        {{ rows.length === 1
          ? 'registro encontrado'
          : 'registros encontrados' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import {
  Pencil,
  Ban,
  Eye
} from 'lucide-vue-next'

import { STATUS_ATIVO } from '../composables/status'
import { useAuthStore } from '../stores/auth'

import '../assets/css/Table.css'


// ========================================
// PROPS
// ========================================

const props = defineProps({

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
  },

  showDetail: {
    type: Boolean,
    default: true
  },

  showEdit: {
    type: Boolean,
    default: true
  },

  showInactive: {
    type: Boolean,
    default: true
  },

  // Altura máxima da área de rolagem.
  maxHeight: {
    type: [String, Number],
    default: 'min(65vh, 520px)'
  },

  // Exibe o rodapé com a quantidade de registros.
  showFooter: {
    type: Boolean,
    default: false
  }
})


// ========================================
// EVENTOS
// ========================================

const emit = defineEmits([
  'edit',
  'inactive',
  'detail'
])


// ========================================
// ALTURA DINÂMICA
// ========================================

const alturaMaxima = computed(() => {
  return typeof props.maxHeight === 'number'
    ? `${props.maxHeight}px`
    : props.maxHeight
})


// ========================================
// AUTENTICAÇÃO E PERMISSÕES
// ========================================

const authStore = useAuthStore()

const papelAtual = computed(() => {
  return String(
    authStore.papelUsuario || ''
  ).toUpperCase()
})

// Somente PROFESSOR e SUPORTE podem editar ou inativar.
const permissao = computed(() => {
  return ['PROFESSOR', 'SUPORTE'].includes(
    papelAtual.value
  )
})


// ========================================
// NORMALIZAÇÃO DE STATUS
// ========================================

function normalizarStatus(status) {
  return String(status ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
}


// ========================================
// CLASSE DO STATUS
// ========================================

function getStatusClass(status) {
  const chave = normalizarStatus(status)

  return STATUS_ATIVO[chave]?.class || ''
}


// ========================================
// TEXTO DO STATUS
// ========================================

function getStatusLabel(status) {
  const chave = normalizarStatus(status)

  return STATUS_ATIVO[chave]?.label || status || '-'
}


// ========================================
// IDENTIFICAÇÃO DOS EVENTOS DA AUDITORIA
// ========================================

function ehCelulaEvento(cell) {
  return (
    cell !== null &&
    typeof cell === 'object' &&
    !Array.isArray(cell) &&
    'value' in cell &&
    'label' in cell
  )
}


// ========================================
// CLASSE CSS DO EVENTO
// ========================================

function classeEvento(evento) {
  if (!evento) return ''

  return `log-${String(evento).trim().toLowerCase()}`
}

</script>