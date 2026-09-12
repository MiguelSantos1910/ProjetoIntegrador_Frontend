<template>
  <div class="nova-categoria">
    <div class="nova-categoria-header">
      <div class="title-area">
        <h1>
          Nova Categoria
        </h1>

        <span>
          Cadastre uma nova categoria de ativos
        </span>
      </div>
    </div>


    <div class="nova-categoria-content">
      <Form
        title="Informações da Categoria"
        :fields="formFields"
        :initial-data="initialData"
        submit-button-text="Cadastrar"
        @submit="handleFormSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

import Form from '../components/Form.vue'

import '../assets/css/NovaCategoria.css'


/* CAMPOS */

const formFields = ref([
  {
    name: 'nome',
    label: 'Nome da Categoria',
    type: 'text',
    placeholder: 'Ex.: Equipamentos de TI',
    required: true
  },

  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Selecione o status',
    required: true,

    options: [
      {
        value: 'ativo',
        label: 'Ativo'
      },

      {
        value: 'inativo',
        label: 'Inativo'
      }
    ]
  },

  {
    name: 'descricao',
    label: 'Descrição',
    type: 'textarea',
    placeholder: 'Descreva a finalidade desta categoria...',
    required: false
  }
])


/* DADOS INICIAIS */

const initialData = ref({
  nome: '',
  status: 'ativo',
  descricao: ''
})


/* AÇÕES */

const handleFormSubmit = (data) => {
  console.log(
    'Nova categoria:',
    data
  )
}


const handleCancel = () => {
  console.log(
    'Cadastro cancelado'
  )
}
</script>