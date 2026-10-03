<template>
  <div class="cadastro-ativos">
    <Form
      title="Cadastrar Ativo"
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
import { useRouter } from 'vue-router'

import Form from '../components/Form.vue'
import { useAtivosStore } from '../stores/ativos'

import '../assets/css/Cadastro.css'

const router = useRouter()
const ativosStore = useAtivosStore()

const formFields = ref([
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: [
      {
        value: 'GABINETE',
        label: 'Gabinete'
      },
      {
        value: 'MONITOR',
        label: 'Monitor'
      },
      {
        value: 'TECLADO',
        label: 'Teclado'
      },
      {
        value: 'MESA',
        label: 'Mesa'
      }
    ],
    placeholder: 'Selecione o tipo do ativo',
    required: true
  },

  {
    name: 'numero_patrimonio',
    label: 'Número de Patrimônio',
    type: 'text',
    placeholder: 'Digite o número de patrimônio do ativo',
    required: false
  },

  {
    name: 'sala',
    label: 'Sala',
    type: 'text',
    placeholder: 'Digite a sala onde o ativo está localizado',
    required: false
  },

  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      {
        value: 'ATIVO',
        label: 'Ativo'
      },
      {
        value: 'EM_MANUTENCAO',
        label: 'Em manutenção'
      },
      {
        value: 'DEVOLVIDO',
        label: 'Devolvido'
      }
    ],
    placeholder: 'Selecione o status do ativo',
    required: false
  },

  {
    name: 'descricao',
    label: 'Descrição',
    type: 'textarea',
    placeholder: 'Digite a descrição do ativo',
    required: true
  }
])

const initialData = ref({
  tipo: '',
  numero_patrimonio: '',
  sala: '',
  status: 'ATIVO',
  descricao: ''
})

const handleFormSubmit = async (formData) => {
  const sucesso = await ativosStore.registerAtivo(formData)

  if (sucesso) {
    alert('Ativo cadastrado com sucesso!')
    router.push('/ativos')
  } else {
    alert(
      ativosStore.erro ||
      'Falha ao cadastrar ativo. Verifique os dados e tente novamente.'
    )
  }
}

const handleCancel = () => {
  router.push('/ativos')
}
</script>