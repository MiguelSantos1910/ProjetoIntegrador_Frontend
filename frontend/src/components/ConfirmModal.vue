<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="confirm-modal-overlay"
      @click.self="handleCancel"
    >
      <div
        class="confirm-modal"
        role="dialog"
        aria-modal="true"
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
            <h2>
              {{ title }}
            </h2>

            <p>
              {{ subtitle }}
            </p>
          </div>
        </div>


        <!-- INFORMAÇÕES -->

        <div class="confirm-modal-item">
          <strong>
            {{ itemName }}
          </strong>

          <span>
            {{ itemInfo }}
          </span>
        </div>


        <!-- MENSAGEM -->

        <div class="confirm-modal-message">
          {{ message }}
        </div>


        <!-- AÇÕES -->

        <div class="confirm-modal-actions">
          <button
            type="button"
            class="confirm-modal-cancel"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>

          <button
            type="button"
            class="confirm-modal-confirm"
            @click="handleConfirm"
          >
            <Trash2
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
import {
  TriangleAlert,
  Trash2
} from 'lucide-vue-next'


defineProps({
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
  }
})


const emit = defineEmits([
  'update:modelValue',
  'confirm',
  'cancel'
])


const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}


const handleConfirm = () => {
  emit('confirm')
}
</script>


<style>
@import '../assets/css/ConfirmModal.css';
</style>