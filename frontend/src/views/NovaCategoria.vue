<template>
  <div class="nova-categoria">
    <div class="nova-categoria-header">
      <div class="title-area">
        <h1>Nova Categoria</h1>
        <span>Cadastre uma nova categoria de ativos</span>
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

      <Info
        v-model="mostrarInfo"
        :success="operacaoSucesso"
        :message="mensagem"
        :error-message="mensagemErro"
        @close="handleInfoClose"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Form from '../components/Form.vue'
import Info from '../components/Info.vue'
import { useAtivosStore } from '../stores/ativos.js'

import '../assets/css/NovaCategoria.css'

const router = useRouter()
const ativosStore = useAtivosStore()

const operacaoSucesso = ref(false)
const mensagem = ref('')
const mensagemErro = ref('')
const mostrarInfo = ref(false)

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
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' }
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

const initialData = ref({
  nome: '',
  status: 'ativo',
  descricao: ''
})

const handleFormSubmit = async (formData) => {
  operacaoSucesso.value = false
  mensagem.value = ''
  mensagemErro.value = ''

  try {
    const sucesso = await ativosStore.updateAtivo(formData)

    if (sucesso) {
      operacaoSucesso.value = true
      mensagem.value = 'Categoria cadastrada com sucesso!'
    } else {
      mensagemErro.value =
        ativosStore.erro ||
        'Ocorreu um erro ao cadastrar a categoria.'
    }
  } catch (error) {
    console.error('Erro ao cadastrar categoria:', error)

    mensagemErro.value =
      ativosStore.erro ||
      error.response?.data?.detail ||
      'Ocorreu um erro ao cadastrar a categoria.'
  }

  mostrarInfo.value = true
}

const handleCancel = () => {
  router.push('/categorias')
}

const handleInfoClose = () => {
  mostrarInfo.value = false

  if (operacaoSucesso.value) {
    router.push('/categorias')
  }
}
</script>