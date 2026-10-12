<template>
  <div class="cadastro-ativos">
    <p
      v-if="carregando"
      class="status-message"
    >
      Carregando dados do ativo...
    </p>

    <p
      v-else-if="erro"
      class="status-message error"
    >
      {{ erro }}
    </p>

    <Form
      v-else
      :key="route.params.id"
      title="Editar Ativo"
      :fields="formFields"
      :initial-data="initialData"
      submit-button-text="Atualizar"
      @submit="handleFormSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Form from '../components/Form.vue'
import { useAtivosStore } from '../stores/ativos'

import '../assets/css/Cadastro.css'

const router = useRouter()
const route = useRoute()
const ativosStore = useAtivosStore()

const carregando = ref(true)
const erro = ref('')

const initialData = ref({
  tipo: '',
  numero_patrimonio: '',
  sala: '',
  status: '',
  descricao: ''
})

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

const carregarAtivo = async () => {
  carregando.value = true
  erro.value = ''

  try {
    const id = route.params.id

    if (!id) {
      throw new Error('ID do ativo não informado na rota.')
    }

    const sucesso = await ativosStore.fetchAtivo(id)

    if (!sucesso || !ativosStore.ativo) {
      throw new Error(
        ativosStore.erro || 'Não foi possível carregar o ativo.'
      )
    }

    const ativo = ativosStore.ativo

    initialData.value = {
      tipo: ativo.tipo || '',
      numero_patrimonio: ativo.numero_patrimonio || '',
      sala: ativo.sala || '',
      status: ativo.status || 'ATIVO',
      descricao: ativo.descricao || ''
    }
  } catch (error) {
    erro.value = error.message || 'Erro ao carregar o ativo.'
  } finally {
    carregando.value = false
  }
}

const handleFormSubmit = async (formData) => {
  const id = route.params.id

  const sucesso = await ativosStore.updateAtivo(id, formData)

  if (sucesso) {
    alert('Ativo atualizado com sucesso!')
    router.push('/ativos')
  } else {
    alert(
      ativosStore.erro ||
      'Falha ao atualizar o ativo.'
    )
  }
}

const handleCancel = () => {
  router.push('/ativos')
}

onMounted(carregarAtivo)
</script>