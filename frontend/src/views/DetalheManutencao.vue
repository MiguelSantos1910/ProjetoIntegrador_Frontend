<template>
  <div class="detalhes-manutencao">
    <!-- CABEÇALHO -->

    <header class="manutencao-header">
      <h1>
        Detalhes da Manutenção
      </h1>

      <div class="header-actions">
        <div class="search-box">
          <Search
            :size="14"
            :stroke-width="2"
          />

          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar manutenções..."
          >
        </div>

        <button
          type="button"
          class="notification-button"
          title="Notificações"
        >
          <Bell
            :size="16"
            :stroke-width="1.8"
          />
        </button>
      </div>
    </header>


    <!-- CONTEÚDO -->

    <main class="manutencao-content">
      <!-- COLUNA PRINCIPAL -->

      <div class="manutencao-main">
        <!-- CARD PRINCIPAL -->

        <section class="maintenance-card">
          <div class="maintenance-card-header">
            <div>
              <h2>
                Manutenção
              </h2>

              <span class="maintenance-code">
                Ordem de manutenção:
                {{ manutencao.id || '-' }}
              </span>
            </div>

            <span
              class="maintenance-status"
              :class="statusClass"
            >
              {{ statusLabel }}
            </span>
          </div>


          <!-- ATIVO -->

          <div class="section-block">
            <h3 class="section-title">
              Ativo
            </h3>

            <div class="asset-summary">
              <div class="summary-field">
                <span>
                  Descrição
                </span>

                <strong>
                  {{ manutencao.ativo.descricao || '-' }}
                </strong>
              </div>


              <div class="summary-field">
                <span>
                  Patrimônio
                </span>

                <strong>
                  {{ manutencao.ativo.numero_patrimonio || '-' }}
                </strong>
              </div>


              <div class="summary-field">
                <span>
                  Tipo
                </span>

                <strong>
                  {{ formatarTipo(manutencao.ativo.tipo) }}
                </strong>
              </div>


              <div class="summary-field">
                <span>
                  Sala
                </span>

                <strong>
                  {{ manutencao.ativo.sala || '-' }}
                </strong>
              </div>
            </div>
          </div>


          <!-- INFORMAÇÕES DA MANUTENÇÃO -->

          <div class="section-block">
            <h3 class="section-title">
              Informações da Manutenção
            </h3>

            <div class="maintenance-fields">
              <div class="detail-field">
                <label>
                  Status
                </label>

                <div class="detail-value">
                  <span
                    class="maintenance-status"
                    :class="statusClass"
                  >
                    {{ statusLabel }}
                  </span>
                </div>
              </div>


              <div class="detail-field">
                <label>
                  Responsável
                </label>

                <div class="detail-value">
                  {{ manutencao.responsavel || '-' }}
                </div>
              </div>


              <div class="detail-field">
                <label>
                  Data de Abertura
                </label>

                <div class="detail-value">
                  {{ dataFormatada(manutencao.data_abertura) }}
                </div>
              </div>


              <div class="detail-field">
                <label>
                  Data de Conclusão
                </label>

                <div class="detail-value">
                  {{ dataFormatada(manutencao.data_conclusao) }}
                </div>
              </div>
            </div>
          </div>


          <!-- DESCRIÇÃO -->

          <div class="section-block">
            <h3 class="section-title">
              Descrição
            </h3>

            <div class="text-display">
              {{ manutencao.descricao || 'Nenhuma descrição informada.' }}
            </div>
          </div>


          <!-- SERVIÇO REALIZADO -->

          <div class="section-block">
            <h3 class="section-title">
              Serviço Realizado
            </h3>

            <div class="text-display">
              {{
                manutencao.servico_realizado ||
                  'Nenhum serviço realizado informado.'
              }}
            </div>
          </div>


          <!-- CUSTO -->

          <div class="section-block">
            <h3 class="section-title">
              Custo
            </h3>

            <div class="cost-display">
              <span>
                R$
              </span>

              <strong>
                {{ formatarCusto(manutencao.custo) }}
              </strong>
            </div>
          </div>


          <!-- OBSERVAÇÕES -->

          <div class="section-block">
            <h3 class="section-title">
              Observações
            </h3>

            <div class="text-display">
              {{
                manutencao.observacoes ||
                  'Nenhuma observação informada.'
              }}
            </div>
          </div>


          <!-- AÇÕES -->

          <div class="maintenance-actions">
            <button
              type="button"
              class="back-button"
              @click="handleBack"
            >
              Voltar
            </button>

            <button
              type="button"
              class="delete-button"
              @click="handleDelete"
            >
              Excluir Manutenção
            </button>
          </div>
        </section>
      </div>


      <!-- SIDEBAR -->

      <aside class="manutencao-sidebar">
        <!-- STATUS -->

        <section class="sidebar-card">
          <div class="sidebar-header">
            <h2>
              Status da Manutenção
            </h2>
          </div>

          <div class="sidebar-status">
            <span
              class="maintenance-status large"
              :class="statusClass"
            >
              {{ statusLabel }}
            </span>
          </div>
        </section>


        <!-- INFORMAÇÕES DO ATIVO -->

        <section class="sidebar-card">
          <div class="sidebar-header">
            <h2>
              Informações do Ativo
            </h2>
          </div>


          <div class="asset-info-row">
            <span>
              Descrição
            </span>

            <strong>
              {{ manutencao.ativo.descricao || '-' }}
            </strong>
          </div>


          <div class="asset-info-row">
            <span>
              Tipo
            </span>

            <strong>
              {{ formatarTipo(manutencao.ativo.tipo) }}
            </strong>
          </div>


          <div class="asset-info-row">
            <span>
              Patrimônio
            </span>

            <strong>
              {{ manutencao.ativo.numero_patrimonio || '-' }}
            </strong>
          </div>


          <div class="asset-info-row">
            <span>
              Sala
            </span>

            <strong>
              {{ manutencao.ativo.sala || '-' }}
            </strong>
          </div>


          <div class="asset-info-row">
            <span>
              Status do Ativo
            </span>

            <strong>
              {{ formatarStatusAtivo(manutencao.ativo.status) }}
            </strong>
          </div>
        </section>


        <!-- DATAS -->

        <section class="sidebar-card">
          <div class="sidebar-header">
            <h2>
              Datas
            </h2>
          </div>


          <div class="asset-info-row">
            <span>
              Abertura
            </span>

            <strong>
              {{ dataFormatada(manutencao.data_abertura) }}
            </strong>
          </div>


          <div class="asset-info-row">
            <span>
              Conclusão
            </span>

            <strong>
              {{ dataFormatada(manutencao.data_conclusao) }}
            </strong>
          </div>
        </section>
      </aside>
    </main>


    <!-- MODAL -->

    <ConfirmModal
      v-model="showDeleteModal"

      title="Excluir Manutenção?"

      subtitle="Esta ação não poderá ser desfeita."

      :item-name="
        manutencao.ativo.descricao ||
          'Manutenção'
      "

      :item-info="
        `Patrimônio: ${
          manutencao.ativo.numero_patrimonio || '-'
        }`
      "

      message="A manutenção será removida do sistema."

      confirm-text="Confirmar Exclusão"

      @confirm="confirmDelete"
    />
  </div>
</template>


<script setup>

import {
  computed,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  Search,
  Bell
} from 'lucide-vue-next'

import ConfirmModal from '../components/ConfirmModal.vue'

import {
  STATUS_ATIVO
} from '../composables/status.js'

import {
  dataFormatada
} from '../composables/formatData.js'

import '../assets/css/DetalheManutencao.css'


const router = useRouter()

const search = ref('')

const showDeleteModal = ref(false)


const manutencao = ref({

  id: 1,

  status: 'EM_ANDAMENTO',

  responsavel: 'Suporte técnico',

  data_abertura: '2026-10-03T10:00:00',

  data_conclusao: null,

  descricao:
    'O equipamento apresentou falha durante a utilização.',

  servico_realizado:
    'Verificação do equipamento e substituição do componente com defeito.',

  custo: '150.00',

  observacoes:
    'Equipamento deverá ser testado novamente após a manutenção.',

  ativo: {

    id: 1,

    descricao: 'Gabinete Dell',

    tipo: 'GABINETE',

    numero_patrimonio: 'PAT-001',

    sala: 'B-111',

    status: 'EM_MANUTENCAO'

  }

})

const TIPOS_ATIVO = {

  GABINETE: 'Gabinete',

  MONITOR: 'Monitor',

  TECLADO: 'Teclado',

  MESA: 'Mesa'

}


const STATUS_MANUTENCAO = {

  ABERTA: {
    label: 'Aberta',
    class: 'maintenance-aberta'
  },

  EM_ANDAMENTO: {
    label: 'Em andamento',
    class: 'maintenance-andamento'
  },

  CONCLUIDA: {
    label: 'Concluída',
    class: 'maintenance-concluida'
  },

  CANCELADA: {
    label: 'Cancelada',
    class: 'maintenance-cancelada'
  }

}


const statusLabel = computed(() => {

  return (
    STATUS_MANUTENCAO[
      manutencao.value.status
    ]?.label ||

    manutencao.value.status ||

    'Não informado'
  )

})


const statusClass = computed(() => {

  return (
    STATUS_MANUTENCAO[
      manutencao.value.status
    ]?.class ||

    ''
  )

})


const formatarTipo = (tipo) => {

  return (
    TIPOS_ATIVO[tipo] ||
    tipo ||
    'Não informado'
  )

}


const formatarStatusAtivo = (status) => {

  return (
    STATUS_ATIVO[status]?.label ||
    status ||
    'Não informado'
  )

}


const formatarCusto = (valor) => {

  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return '0,00'
  }

  const numero = Number(valor)

  if (Number.isNaN(numero)) {
    return '0,00'
  }

  return numero.toLocaleString(
    'pt-BR',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  )

}

const handleBack = () => {

  router.back()

}


const handleDelete = () => {

  showDeleteModal.value = true

}


const confirmDelete = () => {

  showDeleteModal.value = false

  router.back()

}

</script>