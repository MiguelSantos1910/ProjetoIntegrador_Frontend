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
            Categorias cadastradas
          </h2>

          <span>
            Organize e acompanhe os ativos por categoria.
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


      <!-- TABELA REUTILIZÁVEL -->

      <section class="categories-table">
        <Table
          title="Lista de Categorias"
          :headers="tableHeaders"
          :rows="tableRows"
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

import '../assets/css/Categorias.css'


/* ROTEAMENTO */

const router = useRouter()


/* PESQUISA */

const search = ref('')


/* MODAL DE EXCLUSÃO */

const showDeleteModal = ref(false)

const selectedCategory = ref(null)


/* CATEGORIAS */

const categories = ref([
  {
    id: 1,
    name: 'TI',
    description: 'Computadores, servidores e equipamentos de rede.',
    assets: 345,
    active: true
  },

  {
    id: 2,
    name: 'Eletrônicos',
    description: 'Monitores, TVs, projetores e outros eletrônicos.',
    assets: 82,
    active: true
  },

  {
    id: 3,
    name: 'Mobiliário',
    description: 'Mesas, cadeiras, armários e outros móveis.',
    assets: 180,
    active: true
  },

  {
    id: 4,
    name: 'Veículos',
    description: 'Carros, motos, caminhões e veículos corporativos.',
    assets: 128,
    active: true
  },

  {
    id: 5,
    name: 'Máquinas e Equipamentos',
    description: 'Máquinas e equipamentos utilizados pela empresa.',
    assets: 112,
    active: true
  },

  {
    id: 6,
    name: 'Ferramentas',
    description: 'Ferramentas manuais e elétricas.',
    assets: 56,
    active: true
  },

  {
    id: 7,
    name: 'Imóveis e Instalações',
    description: 'Salas, galpões e instalações da empresa.',
    assets: 31,
    active: true
  },

  {
    id: 8,
    name: 'Outros',
    description: 'Ativos que não se enquadram nas demais categorias.',
    assets: 13,
    active: true
  }
])


/* FILTRO */

const filteredCategories = computed(() => {
  const term = search.value
    .toLowerCase()
    .trim()

  if (!term) {
    return categories.value
  }

  return categories.value.filter((category) => {
    return (
      category.name
        .toLowerCase()
        .includes(term) ||

      category.description
        .toLowerCase()
        .includes(term)
    )
  })
})


/* TABELA */

const tableHeaders = [
  'Categoria',
  'Descrição',
  'Ativos',
  'Status'
]


const tableRows = computed(() => {
  return filteredCategories.value.map((category) => {
    return [
      category.name,
      category.description,
      category.assets,
      category.active
        ? 'Ativa'
        : 'Inativa'
    ]
  })
})


/* RESUMO */

const totalAssets = computed(() => {
  return categories.value.reduce(
    (total, category) => {
      return total + category.assets
    },
    0
  )
})


const activeCategories = computed(() => {
  return categories.value.filter(
    (category) => category.active
  ).length
})


/* AÇÕES */

/* Abre a tela de cadastro de nova categoria.*/

const handleNewCategory = () => {
  router.push('/categorias/nova')
}


/* Edita uma categoria. */

const handleEdit = (row) => {
  console.log(
    'Editar categoria:',
    row
  )
}


/* Abre o modal de confirmação.*/

const handleDelete = (row) => {
  const categoryName = row[0]

  const category = categories.value.find(
    (item) => item.name === categoryName
  )

  if (!category) {
    return
  }

  selectedCategory.value = category

  showDeleteModal.value = true
}


/* Confirma a exclusão da categoria. */

const confirmDelete = () => {
  if (!selectedCategory.value) {
    return
  }

  categories.value = categories.value.filter(
    (category) => {
      return category.id !== selectedCategory.value.id
    }
  )

  showDeleteModal.value = false

  selectedCategory.value = null
}
</script>