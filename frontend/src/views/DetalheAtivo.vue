<template>
  <div class="detalhes-ativo">
    <!-- CABEÇALHO -->

    <header class="detalhes-header">
      <h1>Detalhes do Ativo</h1>

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
        >
          <Bell
            :size="16"
            :stroke-width="1.8"
          />
        </button>
      </div>
    </header>


    <!-- CONTEÚDO -->

    <main class="detalhes-content">
      <!-- COLUNA PRINCIPAL -->

      <div class="detalhes-main">
        <!-- CARD DO ATIVO -->

        <section class="asset-card">
          <div class="asset-card-header">
            <div>
              <h2>
                Notebook Dell Latitude 5520
              </h2>

              <span class="asset-code">
                Patrimônio ID: AVT-001
              </span>
            </div>

            <span class="asset-status">
              Ativo
            </span>
          </div>


          <!-- CAMPOS -->

          <div class="asset-fields">
            <div class="detail-field">
              <label for="nome-ativo">
                Nome do Ativo
              </label>

              <input
                id="nome-ativo"
                v-model="asset.nome"
                type="text"
              >
            </div>


            <div class="detail-field">
              <label for="categoria">
                Categoria
              </label>

              <select
                id="categoria"
                v-model="asset.categoria"
              >
                <option value="TI">
                  TI
                </option>

                <option value="Eletrônico">
                  Eletrônico
                </option>

                <option value="Móvel">
                  Móvel
                </option>
              </select>
            </div>


            <div class="detail-field">
              <label for="numero-serie">
                Número de Série
              </label>

              <input
                id="numero-serie"
                v-model="asset.numeroSerie"
                type="text"
              >
            </div>


            <div class="detail-field">
              <label for="data-aquisicao">
                Data de Aquisição
              </label>

              <input
                id="data-aquisicao"
                v-model="asset.dataAquisicao"
                type="date"
              >
            </div>


            <div class="detail-field">
              <label for="valor">
                Valor de Aquisição
              </label>

              <input
                id="valor"
                v-model="asset.valor"
                type="text"
              >
            </div>


            <div class="detail-field">
              <label for="localizacao">
                Localização
              </label>

              <select
                id="localizacao"
                v-model="asset.localizacao"
              >
                <option value="Sede - Bloco A">
                  Sede - Bloco A
                </option>

                <option value="Sede - Bloco B">
                  Sede - Bloco B
                </option>

                <option value="Filial">
                  Filial
                </option>
              </select>
            </div>
          </div>


          <!-- AÇÕES -->

          <div class="asset-actions">
            <button
              type="button"
              class="delete-button"
              @click="handleDelete"
            >
              Excluir Ativo
            </button>


            <div class="right-actions">
              <button
                type="button"
                class="cancel-button"
                @click="handleCancel"
              >
                Cancelar
              </button>


              <button
                type="button"
                class="update-button"
                @click="handleUpdate"
              >
                Atualizar
              </button>
            </div>
          </div>
        </section>


        <!-- HISTÓRICO -->

        <section class="asset-card history-card">
          <h2 class="section-title">
            Histórico de Manutenções
          </h2>


          <div class="maintenance-history">
            <div
              v-for="maintenance in maintenanceHistory"
              :key="maintenance.id"
              class="history-item"
            >
              <div class="history-marker">
                <span />
              </div>


              <div class="history-content">
                <strong>
                  {{ maintenance.title }}
                </strong>

                <span>
                  {{ maintenance.date }}
                  • Resp: {{ maintenance.responsible }}
                  • Custo: {{ maintenance.cost }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>


      <!-- COLUNA LATERAL -->

      <aside class="detalhes-sidebar">
        <!-- IMAGEM -->

        <section class="image-card">
          <div class="asset-image-wrapper">
            <img
              :src="asset.image"
              alt="Imagem do ativo"
              class="asset-image"
            >
          </div>
        </section>


        <!-- DEPRECIAÇÃO -->

        <section class="depreciation-card">
          <div class="depreciation-header">
            <h2>
              Depreciação Acumulada
            </h2>
          </div>


          <div class="depreciation-row">
            <span>
              Taxa de Depreciação Anual
            </span>

            <strong>
              20%
            </strong>
          </div>


          <div class="depreciation-row">
            <span>
              Valor Depreciado Atual
            </span>

            <strong class="negative">
              - R$ 1.300,00
            </strong>
          </div>


          <div class="depreciation-row residual">
            <span>
              Valor Contábil Residual
            </span>

            <strong>
              R$ 5.200,00
            </strong>
          </div>


          <div class="depreciation-bar">
            <span />
          </div>


          <p class="depreciation-info">
            Ciclo de vida restante estimado:
            48 meses.
          </p>
        </section>
      </aside>
    </main>
  </div>


  <!-- MODAL DE EXCLUSÃO -->

  <ConfirmModal
    v-model="showDeleteModal"
    title="Excluir Ativo?"
    subtitle="Esta ação não poderá ser desfeita."
    item-name="Notebook Dell Latitude 5520"
    item-info="ID: AVT-001 • Categoria: TI • R$ 6.500,00"
    message="O ativo será removido permanentemente de todas as listagens e relatórios. Caso o ativo ainda esteja fisicamente em operação, isto poderá causar divergências contábeis."
    confirm-text="Confirmar Exclusão"
    @confirm="confirmDelete"
  />
</template>


<script setup>
import { ref, reactive } from 'vue'

import {
  Search,
  Bell
} from 'lucide-vue-next'

import ConfirmModal from '../components/ConfirmModal.vue'

import '../assets/css/DetalhesAtivo.css'


/* MODAL DE EXCLUSÃO */

const showDeleteModal = ref(false)


const handleDelete = () => {
  showDeleteModal.value = true
}


const confirmDelete = () => {
  console.log('Ativo excluído')

  showDeleteModal.value = false
}


/* PESQUISA */

const search = ref('')


/* DADOS DO ATIVO */

const asset = reactive({
  nome: 'Notebook Dell Latitude 5520',

  categoria: 'TI',

  numeroSerie: 'CN-0X7Z8D-Dell-81A',

  dataAquisicao: '2024-03-12',

  valor: 'R$ 6.500,00',

  localizacao: 'Sede - Bloco A',

  image:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80'
})


/* HISTÓRICO */

const maintenanceHistory = ref([
  {
    id: 1,

    title:
      'Limpeza física interna e troca de pasta térmica',

    date:
      '15/09/2024',

    responsible:
      'Suporte Técnico TI',

    cost:
      'R$ 150,00'
  },

  {
    id: 2,

    title:
      'Upgrade de Memória RAM para 32GB',

    date:
      '10/05/2024',

    responsible:
      'Rodrigo Silva (Admin)',

    cost:
      'R$ 450,00'
  }
])


/* CANCELAR */

const handleCancel = () => {
  console.log('Cancelar alterações')
}


/* ATUALIZAR */

const handleUpdate = () => {
  console.log(
    'Atualizar ativo:',
    asset
  )
}
</script>