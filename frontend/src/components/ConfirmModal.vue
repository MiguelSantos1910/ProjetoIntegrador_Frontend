<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="confirm-modal-overlay"
      @click.self="handleCancel"
      @keydown.esc="handleCancel"
    >
      <div
        class="confirm-modal"
        :class="`confirm-modal--${variant}`"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        :aria-describedby="message ? 'confirm-modal-message' : undefined"
        @keydown.tab="trapFocus"
      >
        <!-- CABEÇALHO -->

        <div class="confirm-modal-header">
          <div class="confirm-modal-icon">
            <TriangleAlert
              :size="18"
              :stroke-width="2"
            />
          </div>

          <div class="confirm-modal-title-area">
            <h2 id="confirm-modal-title">
              {{ title }}
            </h2>

            <p v-if="subtitle">
              {{ subtitle }}
            </p>
          </div>
        </div>


        <!-- INFORMAÇÕES -->

        <div
          v-if="itemName || itemInfo"
          class="confirm-modal-item"
        >
          <strong v-if="itemName">
            {{ itemName }}
          </strong>

          <span v-if="itemInfo">
            {{ itemInfo }}
          </span>
        </div>


        <!-- MENSAGEM -->

        <div
          v-if="message"
          id="confirm-modal-message"
          class="confirm-modal-message"
        >
          {{ message }}
        </div>


        <!-- AÇÕES -->

        <div class="confirm-modal-actions">
          <button
            ref="cancelRef"
            type="button"
            class="confirm-modal-cancel"
            :disabled="loading"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>

          <button
            ref="confirmRef"
            type="button"
            class="confirm-modal-confirm"
            :disabled="loading"
            :aria-busy="loading"
            @click="handleConfirm"
          >
            <span
              v-if="loading"
              class="confirm-modal-spinner"
              aria-hidden="true"
            />

            <component
              :is="variant === 'warning' ? Archive : Trash2"
              v-else
              :size="14"
              :stroke-width="2"
            />

            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>


<script setup>
import { nextTick, ref, watch } from 'vue'

import {
  Archive,
  TriangleAlert,
  Trash2
} from 'lucide-vue-next'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },

  title: {
    type: String,
    default: 'Confirmar ação?'
  },

  subtitle: {
    type: String,
    default: 'Esta ação não poderá ser desfeita.'
  },

  itemName: {
    type: String,
    default: ''
  },

  itemInfo: {
    type: String,
    default: ''
  },

  message: {
    type: String,
    default: 'Esta ação removerá permanentemente este registro.'
  },

  cancelText: {
    type: String,
    default: 'Cancelar'
  },

  confirmText: {
    type: String,
    default: 'Confirmar'
  },

  variant: {
    type: String,
    default: 'danger',
    validator: (value) => ['danger', 'warning'].includes(value)
  },

  loading: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits([
  'update:modelValue',
  'confirm',
  'cancel'
])


const cancelRef = ref(null)
const confirmRef = ref(null)

watch(
  () => props.modelValue,
  async (aberto) => {
    if (!aberto) return

    await nextTick()

    cancelRef.value?.focus()
  },
  { immediate: true }
)


// Mantém o Tab dentro do modal
const trapFocus = (event) => {
  const botoes = [cancelRef.value, confirmRef.value]
    .filter((botao) => botao && !botao.disabled)

  if (botoes.length === 0) {
    event.preventDefault()
    return
  }

  const primeiro = botoes[0]
  const ultimo = botoes[botoes.length - 1]

  if (event.shiftKey && document.activeElement === primeiro) {
    event.preventDefault()
    ultimo.focus()
  } else if (!event.shiftKey && document.activeElement === ultimo) {
    event.preventDefault()
    primeiro.focus()
  }
}


const handleCancel = () => {
  if (props.loading) return

  emit('update:modelValue', false)
  emit('cancel')
}


const handleConfirm = () => {
  if (props.loading) return

  emit('confirm')
}
</script>


<style>
@import '../assets/css/ConfirmModal.css';
</style>