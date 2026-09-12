<template>
  <div class="manutencao">
    <Form
      title="Cadastro de Manutenção"
      :sections="formSections"
      :initial-data="initialData"
      submit-button-text="Cadastrar"
      @submit="handleFormSubmit"
      @cancel="handleCancel"
    >
      <!-- RESUMO PATRIMONIAL -->

      <template #resumo-patrimonial>
        <div class="summary-content">
          <div class="summary-item">
            <span class="summary-label">
              Valor de Aquisição
            </span>

            <strong class="summary-value">
              R$ 6.500,00
            </strong>
          </div>

          <div class="summary-item">
            <span class="summary-label">
              Total Gasto em Manut.
            </span>

            <strong class="summary-value">
              R$ 600,00
            </strong>
          </div>

          <div class="summary-item">
            <span class="summary-label">
              Última Manutenção
            </span>

            <strong class="summary-value">
              15/09/2024
            </strong>
          </div>

          <div class="summary-item">
            <span class="summary-label">
              Depreciação Acumulada
            </span>

            <strong class="summary-value">
              10%
            </strong>
          </div>

          <div class="summary-status">
            <span class="status-dot" />

            <div>
              <strong>
                Ativo Saudável
              </strong>

              <span>
                Sem pendências críticas
              </span>
            </div>
          </div>

          <div class="summary-warning">
            <span>
              ⚠
            </span>

            <p>
              O custo acumulado de manutenção representa
              9,2% do valor de aquisição do ativo.
            </p>
          </div>
        </div>
      </template>
    </Form>
  </div>
</template>


<script setup>
import { ref } from 'vue'

import {
  Package,
  Wrench,
  FileText,
  Paperclip,
  ClipboardList,
  FileUp
} from 'lucide-vue-next'

import Form from '../components/Form.vue'

import '../assets/css/Manutencao.css'


/* ========================================
   SEÇÕES DO FORMULÁRIO
   ======================================== */

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

        options: [
          {
            value: 'notebook',
            label: 'Notebook Dell Latitude'
          },

          {
            value: 'desktop',
            label: 'Desktop Dell Optiplex'
          }
        ]
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
          {
            value: 'preventiva',
            label: 'Preventiva'
          },

          {
            value: 'corretiva',
            label: 'Corretiva'
          },

          {
            value: 'preditiva',
            label: 'Preditiva'
          }
        ]
      },

      {
        name: 'prioridade',
        label: 'Prioridade',
        type: 'select',
        placeholder: 'Selecione',
        required: true,

        options: [
          {
            value: 'baixa',
            label: 'Baixa'
          },

          {
            value: 'media',
            label: 'Média'
          },

          {
            value: 'alta',
            label: 'Alta'
          }
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
        type: 'select',
        placeholder: 'Selecione',
        required: false,

        options: [
          {
            value: 'marcos',
            label: 'Marcos Santos (Suporte TI)'
          },

          {
            value: 'joao',
            label: 'João Silva'
          }
        ]
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
        required: false,
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


  {
    title: 'Resumo Patrimonial',
    icon: ClipboardList,
    class: 'sidebar-section summary-section',
    content: 'resumo-patrimonial',

    fields: []
  }
])


/* ========================================
   DADOS INICIAIS
   ======================================== */

const initialData = ref({
  ativo: '',
  patrimonio: '',
  localizacao: '',

  tipo: '',
  prioridade: '',
  dataAbertura: '',
  dataConclusao: '',
  responsavel: '',
  fornecedor: '',

  descricao: '',
  custo: '',
  diagnostico: '',

  documentos: []
})


/* ========================================
   AÇÕES
   ======================================== */

const handleFormSubmit = (data) => {
  console.log(
    'Dados da manutenção:',
    data
  )
}


const handleCancel = () => {
  console.log(
    'Ação de cancelar'
  )
}
</script>