<template>
  <div class="cadastro-ativos">
    <Form
      title="Cadastro de Ativos"
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
import '../assets/css/Cadastro.css'

const formFields = ref([
  {
    name: 'nome',
    label: 'Nome',
    type: 'text',
    placeholder: 'Digite o nome do ativo',
    required: true
  },
  {
    name: 'categoria',
    label: 'Categoria',
    type: 'select',
    placeholder: 'Selecione a categoria',
    required: true,
    options: [
      { value: 'eletronico', label: 'Eletrônico' },
      { value: 'movel', label: 'Móvel' },
      { value: 'imovel', label: 'Imóvel' }
    ]
  },
  {
    name: 'numero_serie',
    label: 'Número de Série',
    type: 'text',
    placeholder: 'Digite o número de série do ativo',
    required: true
  },
  {
    name: 'data_aquisicao',
    label: 'Data de Aquisição',
    type: 'date',
    placeholder: 'Selecione a data de aquisição',
    required: true
  },
  {
    name: 'valor',
    label: 'Valor',
    type: 'number',
    placeholder: 'Digite o valor do ativo',
    required: true
  },
  {
    name: 'responsavel',
    label: 'Responsável',
    type: 'text',
    placeholder: 'Digite o nome do responsável pelo ativo',
    required: true
  },
  {
    name: 'descricao',
    label: 'Descrição',
    type: 'textarea',
    placeholder: 'Digite a descrição do ativo',
    required: false
  },
  {
    name: 'foto',
    label: 'Foto',
    type: 'file',
    placeholder: 'Selecione uma foto do ativo',
    required: false
  }
])

const initialData = ref({
  nome: '',
  descricao: '',
  categoria: ''
})

const handleFormSubmit = (data) => {
  console.log('Dados do formulário:', data)
}

const handleCancel = () => {
  console.log('Ação de cancelar')
}
</script>