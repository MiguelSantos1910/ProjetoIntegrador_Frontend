<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="info-overlay"
      @click.self="fechar"
      @keydown.esc="fechar"
    >
      <section
        class="info-popup"
        :class="success ? 'info-popup-success' : 'info-popup-error'"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="success ? 'info-title-success' : 'info-title-error'"
      >
        <button
          type="button"
          class="info-close"
          aria-label="Fechar mensagem"
          @click="fechar"
        >
          <X :size="22" />
        </button>

        <div class="info-icon">
          <CheckCircle
            v-if="success"
            :size="34"
          />
          <CircleX
            v-else
            :size="34"
          />
        </div>

        <h2
          v-if="success"
          id="info-title-success"
        >
          Sucesso!
        </h2>

        <h2
          v-else
          id="info-title-error"
        >
          Erro!
        </h2>

        <p>
          {{
            success
              ? message || 'Operação realizada com sucesso.'
              : errorMessage || 'Ocorreu um erro na operação.'
          }}
        </p>

        <button
          type="button"
          class="info-button"
          @click="fechar"
        >
          OK
        </button>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { CheckCircle, CircleX, X } from 'lucide-vue-next'
import '../assets/css/Info.css'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const fechar = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>