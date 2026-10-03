<template>
  <div class="detalhes-ativo">
    <!-- CABEÇALHO -->

    <header class="detalhes-header">
      <h1>
        Detalhes do Ativo
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
            placeholder="Pesquisar ativos..."
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


    <!-- CARREGANDO -->

    <div
      v-if="carregando"
      class="status-message"
    >
      Carregando dados do ativo...
    </div>


    <!-- ERRO -->

    <div
      v-else-if="erro"
      class="status-message error"
    >
      {{ erro }}
    </div>


    <!-- ATIVO NÃO ENCONTRADO -->

    <div
      v-else-if="!asset"
      class="status-message"
    >
      Ativo não encontrado.
    </div>


    <!-- CONTEÚDO -->

    <main
      v-else
      class="detalhes-content"
    >
      <!-- COLUNA PRINCIPAL -->

      <div class="detalhes-main">
        <!-- CARD DO ATIVO -->

        <section class="asset-card">
          <div class="asset-card-header">
            <div>
              <h2>
                {{ asset.descricao || 'Ativo sem descrição' }}
              </h2>

              <span class="asset-code">
                Patrimônio ID:
                {{ asset.numero_patrimonio || '-' }}
              </span>
            </div>

            <span
              class="asset-status"
              :class="statusClass"
            >
              {{ statusLabel }}
            </span>
          </div>


          <!-- CAMPOS -->

          <div class="asset-fields">
            <!-- DESCRIÇÃO -->

            <div class="detail-field">
              <label for="descricao">
                Descrição
              </label>

              <input
                id="descricao"
                v-model="assetEdit.descricao"
                type="text"
              >
            </div>


            <!-- TIPO -->

            <div class="detail-field">
              <label for="tipo">
                Tipo
              </label>

              <select
                id="tipo"
                v-model="assetEdit.tipo"
              >
                <option value="GABINETE">
                  Gabinete
                </option>

                <option value="MONITOR">
                  Monitor
                </option>

                <option value="TECLADO">
                  Teclado
                </option>

                <option value="MESA">
                  Mesa
                </option>
              </select>
            </div>


            <!-- PATRIMÔNIO -->

            <div class="detail-field">
              <label for="numero-patrimonio">
                Número de Patrimônio
              </label>

              <input
                id="numero-patrimonio"
                v-model="assetEdit.numero_patrimonio"
                type="text"
              >
            </div>


            <!-- SALA -->

            <div class="detail-field">
              <label for="sala">
                Sala
              </label>

              <input
                id="sala"
                v-model="assetEdit.sala"
                type="text"
              >
            </div>


            <!-- STATUS -->

            <div class="detail-field">
              <label for="status">
                Status
              </label>

              <select
                id="status"
                v-model="assetEdit.status"
              >
                <option value="ATIVO">
                  Ativo
                </option>

                <option value="EM_MANUTENCAO">
                  Em manutenção
                </option>

                <option value="DEVOLVIDO">
                  Devolvido
                </option>
              </select>
            </div>


            <!-- DATA DE CADASTRO -->

            <div class="detail-field">
              <label for="data-cadastro">
                Data de Cadastro
              </label>

              <input
                id="data-cadastro"
                :value="dataFormatada(asset.data_cadastro)"
                type="text"
                disabled
              >
            </div>
          </div>


          <!-- AÇÕES -->

          <div class="asset-actions">
            <button
              type="button"
              class="delete-button"
              :disabled="ativosStore.carregando"
              @click="handleDelete"
            >
              Excluir Ativo
            </button>


            <div class="right-actions">
              <button
                type="button"
                class="cancel-button"
                :disabled="ativosStore.carregando"
                @click="handleCancel"
              >
                Cancelar
              </button>


              <button
                type="button"
                class="update-button"
                :disabled="ativosStore.carregando"
                @click="handleUpdate"
              >
                {{
                  ativosStore.carregando
                    ? 'Atualizando...'
                    : 'Atualizar'
                }}
              </button>
            </div>
          </div>
        </section>


        <!-- HISTÓRICO -->

        <section class="asset-card history-card">
          <h2 class="section-title">
            Histórico de Movimentações
          </h2>


          <div
            v-if="historicoFiltrado.length"
            class="maintenance-history"
          >
            <div
              v-for="evento in historicoFiltrado"
              :key="evento.id"
              class="history-item"
            >
              <div class="history-marker">
                <span />
              </div>


              <div class="history-content">
                <strong>
                  {{ formatarEvento(evento) }}
                </strong>

                <span>
                  {{ dataFormatada(evento.data) }}

                  <template v-if="evento.usuario">
                    • Resp: {{ evento.usuario }}
                  </template>

                  <template v-if="evento.descricao">
                    • {{ evento.descricao }}
                  </template>
                </span>
              </div>
            </div>
          </div>


          <div
            v-else
            class="history-empty"
          >
            Nenhuma movimentação registrada para este ativo.
          </div>
        </section>
      </div>


      <!-- COLUNA LATERAL -->

      <aside class="detalhes-sidebar">
        <!-- IMAGEM / REPRESENTAÇÃO DO ATIVO -->

        <section class="image-card">
          <div class="asset-image-wrapper">
            <div class="asset-image-placeholder">
              {{ formatarTipo(asset.tipo) }}
            </div>
          </div>
        </section>


        <!-- QR CODE + INFORMAÇÕES -->

        <section class="qr-info-card">
          <!-- QR CODE -->

          <div class="qr-section">
            <QrCode
              v-if="asset.codigo_qr"
              :value="String(asset.codigo_qr)"
              :size="180"
              title="QR Code do Ativo"
              description="Escaneie para identificar este ativo"
            />

            <div
              v-else
              class="qr-code-empty"
            >
              QR Code não disponível.
            </div>
          </div>


          <!-- INFORMAÇÕES DO ATIVO -->

          <div class="asset-info-section">
            <h2>
              Informações do Ativo
            </h2>


            <!-- TIPO -->

            <div class="asset-info-row">
              <span>
                Tipo
              </span>

              <strong>
                {{ formatarTipo(asset.tipo) }}
              </strong>
            </div>


            <!-- SALA -->

            <div class="asset-info-row">
              <span>
                Sala
              </span>

              <strong>
                {{ asset.sala || '-' }}
              </strong>
            </div>


            <!-- CÓDIGO QR -->

            <div class="asset-info-row">
              <span>
                Código QR
              </span>

              <strong class="qr-code-value">
                {{ asset.codigo_qr || '-' }}
              </strong>
            </div>


            <!-- ÚLTIMA ATUALIZAÇÃO -->

            <div class="asset-info-row">
              <span>
                Última atualização
              </span>

              <strong>
                {{ dataFormatada(asset.atualizado_em) }}
              </strong>
            </div>
          </div>
        </section>
      </aside>
    </main>


    <!-- MODAL DE EXCLUSÃO -->

    <ConfirmModal
      v-model="showDeleteModal"

      title="Excluir Ativo?"

      subtitle="Esta ação não poderá ser desfeita."

      :item-name="
        asset?.descricao || 'Ativo'
      "

      :item-info="
        asset
          ? `ID: ${asset.numero_patrimonio || '-'} • ${formatarTipo(asset.tipo)}`
          : ''
      "

      message="O ativo será removido do sistema."

      confirm-text="Confirmar Exclusão"

      @confirm="confirmDelete"
    />
  </div>
</template>


<script setup>

import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'


import {
  useRoute,
  useRouter
} from 'vue-router'


import {
  Search,
  Bell
} from 'lucide-vue-next'


import ConfirmModal from '../components/ConfirmModal.vue'

import QrCode from '../components/QrCode.vue'


import { useAtivosStore } from '../stores/ativos'

import { useHistoricoStore } from '../stores/historico'


import { STATUS_ATIVO } from '../composables/status.js'

import { dataFormatada } from '../composables/formatData.js'


import '../assets/css/DetalhesAtivo.css'

const route = useRoute()

const router = useRouter()

const ativosStore = useAtivosStore()

const historicoStore = useHistoricoStore()

const search = ref('')

const showDeleteModal = ref(false)

const asset = ref(null)

const assetOriginal = ref(null)

const assetEdit = reactive({

  descricao: '',

  tipo: '',

  numero_patrimonio: '',

  sala: '',

  status: ''

})

const TIPOS_ATIVO = {

  GABINETE: 'Gabinete',

  MONITOR: 'Monitor',

  TECLADO: 'Teclado',

  MESA: 'Mesa'

}

const carregando = computed(() => {

  return (
    ativosStore.carregando ||
    historicoStore.carregando
  )

})


const erro = computed(() => {

  return (
    ativosStore.erro ||
    historicoStore.erro
  )

})

const statusAtual = computed(() => {

  return (
    assetEdit.status ||
    asset.value?.status ||
    ''
  )

})


const statusLabel = computed(() => {

  if (!statusAtual.value) {
    return 'Não informado'
  }


  return (
    STATUS_ATIVO[statusAtual.value]?.label ||
    statusAtual.value
  )

})


const statusClass = computed(() => {

  if (!statusAtual.value) {
    return ''
  }


  return (
    STATUS_ATIVO[statusAtual.value]?.class ||
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


const formatarEvento = (evento) => {

  const tipoEvento =
    evento.acao ||
    evento.tipo_evento ||
    ''


  const eventos = {

    CADASTRO: 'Cadastro do ativo',

    ENTREGA: 'Entrega do ativo',

    DEVOLUCAO: 'Devolução do ativo',

    MANUTENCAO: 'Manutenção do ativo'

  }


  return (
    eventos[tipoEvento] ||
    tipoEvento ||
    'Movimentação'
  )

}

const historicoFiltrado = computed(() => {

  if (!asset.value) {
    return []
  }


  return historicoStore.historico.filter((evento) => {

    const ativoId =
      evento.ativo_id ??
      evento.ativo


    return (
      String(ativoId) ===
      String(asset.value.id)
    )

  })

})

const preencherFormulario = (dados) => {

  assetEdit.descricao =
    dados?.descricao || ''


  assetEdit.tipo =
    dados?.tipo || ''


  assetEdit.numero_patrimonio =
    dados?.numero_patrimonio || ''


  assetEdit.sala =
    dados?.sala || ''


  assetEdit.status =
    dados?.status || ''

}

const carregarAtivo = async () => {

  const id = route.params.id


  if (!id) {

    ativosStore.erro =
      'ID do ativo não informado.'

    return

  }


  const sucesso =
    await ativosStore.fetchAtivo(id)


  if (
    !sucesso ||
    !ativosStore.ativo
  ) {

    return

  }


  asset.value = {
    ...ativosStore.ativo
  }


  assetOriginal.value = {
    ...ativosStore.ativo
  }


  preencherFormulario(
    ativosStore.ativo
  )


  await historicoStore.fetchHistorico()

}

const handleUpdate = async () => {

  if (!asset.value) {
    return
  }


  const dados = {

    descricao:
      assetEdit.descricao.trim(),

    tipo:
      assetEdit.tipo,

    numero_patrimonio:
      assetEdit.numero_patrimonio.trim() ||
      null,

    sala:
      assetEdit.sala.trim(),

    status:
      assetEdit.status

  }


  const sucesso =
    await ativosStore.updateAtivo(

      asset.value.id,

      dados

    )


  if (!sucesso) {
    return
  }


  asset.value = {
    ...ativosStore.ativo
  }


  assetOriginal.value = {
    ...ativosStore.ativo
  }


  preencherFormulario(
    ativosStore.ativo
  )

}

const handleCancel = () => {

  if (!assetOriginal.value) {
    return
  }


  preencherFormulario(
    assetOriginal.value
  )

  router.push('/ativos')
}


const handleDelete = () => {

  showDeleteModal.value = true

}


const confirmDelete = async () => {

  if (!asset.value) {
    return
  }


  const sucesso =
    await ativosStore.deleteAtivo(
      asset.value.id
    )


  if (!sucesso) {
    return
  }


  showDeleteModal.value = false

  asset.value = null

  assetOriginal.value = null


  router.push('/ativos')

}

onMounted(async () => {

  await carregarAtivo()

})

</script>