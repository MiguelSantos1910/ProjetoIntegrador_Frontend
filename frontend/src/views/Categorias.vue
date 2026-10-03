<template>
  <div class="categorias">
    <!-- CABEÇALHO -->

    <header class="categorias-header">
      <div class="categorias-title-area">
        <h1>
          Categorias de Ativos
        </h1>

        <span>
          Gerencie as categorias utilizadas para organizar os ativos.
        </span>
      </div>

      <div class="header-actions">
        <div class="search-box">
          <Search
            :size="14"
            :stroke-width="2"
          />

          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar categorias..."
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

    <main class="categorias-content">
      <!-- AÇÕES -->

      <div class="page-actions">
        <div>
          <h2>
            Categorias
          </h2>

          <span>
            Categorias disponíveis para classificação dos ativos.
          </span>
        </div>

        <button
          type="button"
          class="new-category-button"
          @click="handleNewCategory"
        >
          <Plus
            :size="15"
            :stroke-width="2"
          />

          Nova Categoria
        </button>
      </div>


      <!-- CARDS DE RESUMO -->

      <section class="summary-grid">
        <article class="summary-card">
          <div class="summary-icon">
            <Layers
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div class="summary-info">
            <span>
              Total de Categorias
            </span>

            <strong>
              {{ categories.length }}
            </strong>
          </div>
        </article>


        <article class="summary-card">
          <div class="summary-icon">
            <Package
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div class="summary-info">
            <span>
              Total de Ativos
            </span>

            <strong>
              {{ totalAssets }}
            </strong>
          </div>
        </article>


        <article class="summary-card">
          <div class="summary-icon">
            <CheckCircle
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div class="summary-info">
            <span>
              Categorias Ativas
            </span>

            <strong>
              {{ activeCategories }}
            </strong>
          </div>
        </article>
      </section>


      <!-- CARREGANDO -->

      <div
        v-if="ativosStore.carregando"
        class="status-message"
      >
        Carregando categorias...
      </div>


      <!-- ERRO -->

      <div
        v-else-if="ativosStore.erro"
        class="status-message error"
      >
        {{ ativosStore.erro }}
      </div>


      <!-- TABELA -->

      <section
        v-else
        class="categories-table"
      >
        <Table
          title="Lista de Categorias"
          :headers="categoriasHeaders"
          :rows="filteredCategories"
          :show-actions="true"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </section>
    </main>


    <!-- MODAL DE EXCLUSÃO -->

    <ConfirmModal
      v-model="showDeleteModal"
      title="Excluir Categoria?"
      subtitle="Esta ação não poderá ser desfeita."
      :item-name="selectedCategory?.name || ''"
      :item-info="
        selectedCategory
          ? `${selectedCategory.assets} ativos associados`
          : ''
      "
      message="A categoria será removida do sistema. Certifique-se de que não existem ativos vinculados a ela antes de confirmar."
      confirm-text="Confirmar Exclusão"
      @confirm="confirmDelete"
    />
  </div>
</template>


<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import { useRouter } from 'vue-router'

import {
  Search,
  Bell,
  Plus,
  Layers,
  Package,
  CheckCircle
} from 'lucide-vue-next'

import Table from '../components/Table.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

import { useAtivosStore } from '../stores/ativos'

import '../assets/css/Categorias.css'


const router = useRouter()
const ativosStore = useAtivosStore()


const search = ref('')
const showDeleteModal = ref(false)
const selectedCategory = ref(null)


onMounted(async () => {
  await ativosStore.fetchAtivos()
})


const categoriasHeaders = [
  'Categoria',
  'Descrição',
  'Status'
]

const categories = computed(() => {

  const tipos = [
    {
      id: 'GABINETE',
      name: 'Gabinete',
      description: 'Computadores e gabinetes',
      active: true
    },

    {
      id: 'MONITOR',
      name: 'Monitor',
      description: 'Monitores e telas',
      active: true
    },

    {
      id: 'TECLADO',
      name: 'Teclado',
      description: 'Teclados para computadores',
      active: true
    },

    {
      id: 'MESA',
      name: 'Mesa',
      description: 'Mesas e mobiliário',
      active: true
    }
  ]

  return tipos.map((tipo) => {

    const quantidade = ativosStore.ativos.filter(
      (ativo) => ativo.tipo === tipo.id
    ).length

    return {
      ...tipo,
      assets: quantidade
    }

  })
})

const totalAssets = computed(() => {
  return ativosStore.ativos.length
})

const activeCategories = computed(() => {

  return categories.value.filter(
    (category) => category.active
  ).length

})


const categoriasRows = computed(() => {

  return categories.value.map((category) => [

    category.name,

    `${category.description} (${category.assets} ativos)`,

    category.active
      ? 'ATIVO'
      : 'INATIVO'

  ])

})


const filteredCategories = computed(() => {

  const term = search.value
    .toLowerCase()
    .trim()

  if (!term) {
    return categoriasRows.value
  }

  return categoriasRows.value.filter((row) => {

    const categoria =
      row[0]?.toLowerCase() || ''

    const descricao =
      row[1]?.toLowerCase() || ''

    return (
      categoria.includes(term) ||
      descricao.includes(term)
    )

  })

})


const handleNewCategory = () => {

  router.push('/categorias/nova')

}

const handleEdit = (rowIndex) => {

  const row = filteredCategories.value[rowIndex]

  if (!row) {
    return
  }

  const category = categories.value.find(
    (item) => item.name === row[0]
  )

  if (!category) {
    return
  }

  console.log(
    'Editar categoria:',
    category
  )

}


const handleDelete = (rowIndex) => {

  const row = filteredCategories.value[rowIndex]

  if (!row) {
    return
  }

  const category = categories.value.find(
    (item) => item.name === row[0]
  )

  if (!category) {
    return
  }

  selectedCategory.value = category

  showDeleteModal.value = true

}

const confirmDelete = () => {

  if (!selectedCategory.value) {
    return
  }

  console.log(
    'Categoria selecionada:',
    selectedCategory.value
  )

  showDeleteModal.value = false
  selectedCategory.value = null

}
</script>