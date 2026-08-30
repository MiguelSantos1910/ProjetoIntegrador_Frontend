<template>
  <div class="manutencao">
    <Form
      title="Cadastro de Manutenção"
      :fields="formFields"
      :initial-data="initialData"
      submit-button-text="Cadastrar"
      @submit="handleFormSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Form from '../components/Form.vue'
import '../assets/css/Manutencao.css'

const formFields = ref([
  {
    name: 'ativo',
    label: 'Ativo',
    type: 'select',
    placeholder: 'Selecione o ativo',
    required: true,
    options: [
      { value: 'ativo1', label: 'Ativo 1' },
      { value: 'ativo2', label: 'Ativo 2' }
    ]
  },
  {
    name: 'data',
    label: 'Data',
    type: 'date',
    placeholder: 'Selecione a data',
    required: true
  },
  {
    name: 'descricao',
    label: 'Descrição',
    type: 'textarea',
    placeholder: 'Digite a descrição da manutenção',
    required: false
  }
])

const initialData = ref({
  ativo: '',
  data: '',
  descricao: ''
})

const handleFormSubmit = (data) => {
  console.log('Dados do formulário:', data)
}

const handleCancel = () => {
  console.log('Ação de cancelar')
}
</script>