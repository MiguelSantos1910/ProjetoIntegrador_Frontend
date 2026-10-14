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

    <Info
      v-model="mostrarInfo"
      :success="operacaoSucesso"
      :message="mensagem"
      :error-message="mensagemErro"
      @close="handleInfoClose"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Form from '../components/Form.vue'
import Info from '../components/Info.vue'
import { useAtivosStore } from '../stores/ativos'

import '../assets/css/Cadastro.css'

const router = useRouter()
const ativosStore = useAtivosStore()

const mensagem = ref('')
const mensagemErro = ref('')
const mostrarInfo = ref(false)
const operacaoSucesso = ref(false)

const formFields = ref([
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'GABINETE', label: 'Gabinete' },
      { value: 'MONITOR', label: 'Monitor' },
      { value: 'TECLADO', label: 'Teclado' },
      { value: 'MESA', label: 'Mesa' }
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
      { value: 'ATIVO', label: 'Ativo' },
      { value: 'EM_MANUTENCAO', label: 'Em manutenção' },
      { value: 'DEVOLVIDO', label: 'Devolvido' }
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
  mostrarInfo.value = false
  mensagem.value = ''
  mensagemErro.value = ''

  try {
    const sucesso = await ativosStore.registerAtivo(formData)

    if (sucesso) {
      operacaoSucesso.value = true
      mensagem.value = 'Ativo cadastrado com sucesso!'
      mensagemErro.value = ''
      mostrarInfo.value = true
    } else {
      operacaoSucesso.value = false
      mensagem.value = ''
      mensagemErro.value =
        ativosStore.errorMessage ||
        'Ocorreu um erro ao cadastrar o ativo.'
      mostrarInfo.value = true
    }
  } catch (error) {
    operacaoSucesso.value = false
    mensagemErro.value =
      ativosStore.errorMessage ||
      'Ocorreu um erro ao cadastrar o ativo.'
    mostrarInfo.value = true

    console.error('Erro ao cadastrar ativo:', error)
  }
}

const handleInfoClose = () => {
  if (operacaoSucesso.value) {
    router.push('/ativos')
  }
}

const handleCancel = () => {
  router.push('/ativos')
}
</script>