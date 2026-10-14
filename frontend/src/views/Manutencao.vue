<template>
  <div class="manutencao">
    <Form
      title="Cadastro de Manutenção"
      :sections="formSections"
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
      @close="handleClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import {
  Package,
  Wrench,
  FileText,
  Paperclip,
  ClipboardList,
  FileUp
} from 'lucide-vue-next'

import Form from '../components/Form.vue'
import api from '../services/api'
import { useOrdensStore } from '../stores/ordens'

import '../assets/css/Manutencao.css'
import Info from '../components/Info.vue'

const ordensStore = useOrdensStore()

const carregandoAtivos = ref(false)

const mensagem = ref('')
const mensagemErro = ref('')
const mostrarInfo = ref(false)
const operacaoSucesso = ref(false)

const formSections = ref([
  {
    title: 'Informações do Ativo',
    icon: Package,
    columns: 3,

    fields: [
      {
        name: 'ativo',
        label: 'Ativo',
        type: 'select',
        placeholder: 'Selecione o ativo',
        required: true,
        options: []
      },
      {
        name: 'patrimonio',
        label: 'Número de Patrimônio',
        type: 'text',
        placeholder: 'PAT-2024-0891',
        required: false
      },
      {
        name: 'localizacao',
        label: 'Localização do Ativo',
        type: 'text',
        placeholder: 'Sede Principal - Bloco B / Piso 3',
        required: false
      }
    ]
  },

  {
    title: 'Detalhes da Manutenção',
    icon: Wrench,
    columns: 2,

    fields: [
      {
        name: 'tipo',
        label: 'Tipo de Manutenção',
        type: 'select',
        placeholder: 'Selecione',
        required: true,
        options: [
          { value: 'preventiva', label: 'Preventiva' },
          { value: 'corretiva', label: 'Corretiva' },
          { value: 'preditiva', label: 'Preditiva' }
        ]
      },
      {
        name: 'prioridade',
        label: 'Prioridade',
        type: 'select',
        placeholder: 'Selecione',
        required: true,
        options: [
          { value: 'baixa', label: 'Baixa' },
          { value: 'media', label: 'Média' },
          { value: 'alta', label: 'Alta' }
        ]
      },
      {
        name: 'dataAbertura',
        label: 'Data de Abertura',
        type: 'date',
        required: true
      },
      {
        name: 'dataConclusao',
        label: 'Data Prevista de Conclusão',
        type: 'date',
        required: false
      },
      {
        name: 'responsavel',
        label: 'Responsável Técnico',
        type: 'text',
        placeholder: 'Digite o nome do responsável',
        required: false
      },
      {
        name: 'fornecedor',
        label: 'Fornecedor / Prestador de Serviço',
        type: 'text',
        placeholder: 'Digite o fornecedor',
        required: false
      }
    ]
  },

  {
    title: 'Descrição e Custos Estimados',
    icon: FileText,
    columns: 2,

    fields: [
      {
        name: 'descricao',
        label: 'Descrição do Problema',
        type: 'textarea',
        placeholder: 'Descreva o problema encontrado...',
        required: true,
        full: true
      },
      {
        name: 'custo',
        label: 'Custo Estimado (R$)',
        type: 'number',
        placeholder: '0,00',
        required: false
      },
      {
        name: 'diagnostico',
        label: 'Diagnóstico Inicial',
        type: 'textarea',
        placeholder: 'Informe o diagnóstico inicial...',
        required: false,
        full: true
      }
    ]
  },

  {
    title: 'Documentos & Anexos',
    icon: Paperclip,
    class: 'sidebar-section',

    fields: [
      {
        name: 'documentos',
        label: 'Documentos',
        type: 'file',
        icon: FileUp,
        placeholder: 'Clique para fazer upload',
        info: 'PDF, PNG, JPG ou XML • Até 10MB',
        accept: '.pdf,.png,.jpg,.jpeg,.xml',
        multiple: true,
        required: false
      }
    ]
  },
])


function criarDadosIniciais() {
  return {
    ativo: '',
    patrimonio: '',
    localizacao: '',
    tipo: '',
    prioridade: '',
    dataAbertura: new Date().toISOString().slice(0, 10),
    dataConclusao: '',
    responsavel: '',
    fornecedor: '',
    descricao: '',
    custo: '',
    diagnostico: '',
    documentos: []
  }
}

const initialData = ref(criarDadosIniciais())

async function carregarAtivos() {
  carregandoAtivos.value = true

  try {
    const response = await api.get('/ativos/')

    const ativos = Array.isArray(response.data)
      ? response.data
      : response.data.results ?? []

    const secaoAtivo = formSections.value.find(
      secao => secao.title === 'Informações do Ativo'
    )

    const campoAtivo = secaoAtivo.fields.find(
      campo => campo.name === 'ativo'
    )

    campoAtivo.options = ativos.map(ativo => ({
      value: String(ativo.id),
      label:
        ativo.nome ??
        ativo.descricao ??
        ativo.numero_patrimonio ??
        `Ativo #${ativo.id}`
    }))
  } catch (error) {
    console.error(
      'Erro ao carregar ativos:',
      error.response?.data ?? error
    )

    alert(
      'Não foi possível carregar os ativos. Verifique a API.'
    )
  } finally {
    carregandoAtivos.value = false
  }
}

onMounted(carregarAtivos)

async function handleFormSubmit(data) {
  if (ordensStore.carregando) return

  if (!data.ativo) {
    alert('Selecione um ativo.')
    return
  }

  if (!data.descricao?.trim()) {
    alert('Informe a descrição do problema.')
    return
  }

  const custo = data.custo === '' || data.custo == null
    ? null
    : Number(String(data.custo).replace(',', '.'))

  if (custo !== null && (!Number.isFinite(custo) || custo < 0)) {
    alert('Informe um custo estimado válido.')
    return
  }

  const dadosOrdem = {
    ativo: Number(data.ativo),
    descricao: data.descricao.trim(),
    responsavel: data.responsavel || 'Não informado',
    status: 'Pendente',
    custo_estimado: custo
  }

  const sucesso = await ordensStore.registerOrder(dadosOrdem)

  if (sucesso) {
    operacaoSucesso.value = true
    mensagem.value = 'Ordem de manutenção cadastrada com sucesso!'
    mensagemErro.value = ''
    mostrarInfo.value = true
    initialData.value = criarDadosIniciais()
  } else {
    operacaoSucesso.value = false
    mensagem.value = ''
    mensagemErro.value =
      ordensStore.errorMessage ||
      'Ocorreu um erro ao cadastrar a ordem de manutenção.'
    mostrarInfo.value = true
  }
}

function handleCancel() {
  initialData.value = criarDadosIniciais()
}

const handleClose = () => {
  mostrarInfo.value = false
  if (operacaoSucesso.value) {
    initialData.value = criarDadosIniciais()
  }
}
</script>
