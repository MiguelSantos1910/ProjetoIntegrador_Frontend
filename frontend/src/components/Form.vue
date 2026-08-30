<template>
  <form
    class="form"
    @submit.prevent="handleSubmit"
  >
    <div class="form-header">
      <h2 class="form-title">
        {{ title }}
      </h2>
    </div>

    <div
      v-for="field in fields"
      :key="field.name"
      class="form-field"
    >
      <label :for="field.name">
        {{ field.label }}
      </label>


      <!-- Input -->
      <input
        v-if="
          field.type !== 'select' &&
            field.type !== 'textarea' &&
            field.type !== 'file'
        "
        :id="field.name"
        v-model="formData[field.name]"
        :type="field.type || 'text'"
        :placeholder="field.placeholder"
        :required="field.required"
      >


      <!-- Select -->
      <select
        v-else-if="field.type === 'select'"
        :id="field.name"
        v-model="formData[field.name]"
        :required="field.required"
      >
        <option
          value=""
          disabled
        >
          {{ field.placeholder || 'Selecione uma opção' }}
        </option>

        <option
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>


      <!-- File Input -->
      <div
        v-else-if="field.type === 'file'"
        class="file-upload"
      >
        <input
          :id="field.name"
          type="file"
          :accept="field.accept"
          :required="field.required"
          @change="handleFileChange($event, field.name)"
        >

        <label
          :for="field.name"
          class="file-label"
        >
          {{ field.placeholder || 'Escolha um arquivo' }}
        </label>

        <span class="file-name">
          {{ fileNames[field.name] || 'Nenhum arquivo selecionado' }}
        </span>
      </div>


      <!-- Textarea -->
      <textarea
        v-else
        :id="field.name"
        v-model="formData[field.name]"
        :placeholder="field.placeholder"
        :required="field.required"
      />
    </div>


    <!-- Botões -->
    <div class="form-actions">
      <button
        type="button"
        class="btn-cancel"
        @click="emit('cancel')"
      >
        Cancelar
      </button>

      <button
        type="submit"
        class="btn-submit"
      >
        {{ submitButtonText }}
      </button>
    </div>
  </form>
</template>


<script setup>
import { reactive } from 'vue'

import '../assets/css/Form.css'


const props = defineProps({

  title: {
    type: String,
    default: 'Formulário'
  },
  
  fields: {
    type: Array,
    required: true
  },

  submitButtonText: {
    type: String,
    default: 'Salvar'
  },

  initialData: {
    type: Object,
    default: () => ({})
  }

})


const emit = defineEmits([
  'submit',
  'cancel'
])


const formData = reactive({
  ...props.initialData
})


const fileNames = reactive({})


const handleFileChange = (event, fieldName) => {
  const file = event.target.files[0]

  if (!file) {
    return
  }

  formData[fieldName] = file

  fileNames[fieldName] = file.name
}


const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>