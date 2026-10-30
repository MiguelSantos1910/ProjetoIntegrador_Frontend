<template>
  <div class="perfis">
    <header class="perfis-header">
      <div>
        <h1>Gerenciamento de Perfis</h1>
        <p>Gerencie os papéis e as contas dos usuários do sistema.</p>
      </div>

      <div class="header-actions">
        <div class="search-box">
          <Search :size="14" :stroke-width="2" />
          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar usuários..."
          >
        </div>
      </div>
    </header>

    <main class="perfis-content">
      <div
        v-if="carregando"
        class="status-message"
      >
        Carregando usuários...
      </div>

      <div
        v-else-if="erro"
        class="status-message error"
      >
        {{ erro }}
        <button
          type="button"
          class="retry-button"
          @click="carregarUsuarios"
        >
          Tentar novamente
        </button>
      </div>

      <template v-else>
        <section class="perfil-section">
          <div class="section-heading">
            <h2>Visão geral</h2>
          </div>

          <div class="indicators-grid">
            <Card
              title="Total de Usuários"
              :value="totalUsuarios"
              :icon="Users"
            />

            <Card
              title="Usuários Ativos"
              :value="usuariosAtivos"
              :icon="UserCheck"
            />

            <Card
              title="Usuários Inativos"
              :value="usuariosInativos"
              :icon="UserX"
            />

            <Card
              title="Professores"
              :value="totalProfessores"
              :icon="GraduationCap"
            />
          </div>
        </section>

        <section class="perfil-section">
          <div class="section-heading">
            <h2>Gerenciamento</h2>
          </div>

          <div class="perfil-tabs">
            <button
              type="button"
              :class="{ active: abaAtiva === 'perfis' }"
              @click="abaAtiva = 'perfis'"
            >
              Tipos de perfil
            </button>

            <button
              type="button"
              :class="{ active: abaAtiva === 'usuarios' }"
              @click="abaAtiva = 'usuarios'"
            >
              Usuários
            </button>
          </div>

          <!-- Tipos de perfil -->
          <div
            v-if="abaAtiva === 'perfis'"
            class="perfil-roles-grid"
          >
            <article
              v-for="perfil in perfis"
              :key="perfil.value"
              class="report-card perfil-role-card"
            >
              <div class="role-icon">
                <component
                  :is="perfil.icon"
                  :size="21"
                />
              </div>

              <div class="role-content">
                <h3>{{ perfil.label }}</h3>
                <p>{{ perfil.description }}</p>
                <span class="role-count">
                  {{ contarPorPapel(perfil.value) }}
                  {{ contarPorPapel(perfil.value) === 1 ? 'usuário' : 'usuários' }}
                </span>
              </div>
            </article>
          </div>

          <!-- Usuários -->
          <section
            v-else
            class="report-card table-card"
          >
            <div class="table-header perfil-table-header">
              <div>
                <h2>Usuários cadastrados</h2>
                <p>Consulte as contas e altere os papéis de acesso.</p>
              </div>
            </div>

            <div class="perfil-filters">
              <div class="filter-field">
                <label for="filtro-papel">Papel</label>
                <select
                  id="filtro-papel"
                  v-model="filtroPapel"
                >
                  <option value="todos">Todos os papéis</option>
                  <option value="ALUNO">Aluno</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="SUPORTE">Suporte técnico</option>
                </select>
              </div>

              <div class="filter-field">
                <label for="filtro-status">Status</label>
                <select
                  id="filtro-status"
                  v-model="filtroStatus"
                >
                  <option value="todos">Todos os status</option>
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>
            </div>

            <Table
              title=""
              :headers="tableHeaders"
              :rows="tableRows"
              :show-actions="true"
              :show-detail="false"
              :show-inactive="false"
              @edit="editarUsuario"
            />

            <div class="table-footer">
              <span>
                Mostrando {{ usuariosFiltrados.length }}
                de {{ usuarios.length }} usuários
              </span>
            </div>
          </section>
        </section>
      </template>
    </main>

    <!-- Modal de alteração de papel -->
    <div
      v-if="modalAberto"
      class="modal-overlay"
      @click.self="fecharModal"
    >
      <section
        class="perfil-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="modal-header">
          <div>
            <h2 id="modal-title">Alterar papel do usuário</h2>
            <p>Atualize o papel associado à conta.</p>
          </div>

          <button
            type="button"
            class="modal-close"
            aria-label="Fechar"
            @click="fecharModal"
          >
            <X :size="19" />
          </button>
        </div>

        <div
          v-if="usuarioSelecionado"
          class="modal-body"
        >
          <div class="usuario-resumo">
            <div class="usuario-avatar">
              <UserRound :size="22" />
            </div>

            <div>
              <strong>{{ nomeUsuario(usuarioSelecionado) }}</strong>
              <span>{{ usuarioSelecionado.email || 'E-mail não informado' }}</span>
            </div>
          </div>

          <div class="filter-field">
            <label for="novo-papel">Papel de acesso</label>
            <select
              id="novo-papel"
              v-model="novoPapel"
            >
              <option value="ALUNO">Aluno</option>
              <option value="PROFESSOR">Professor</option>
              <option value="SUPORTE">Suporte técnico</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="cancel-button"
            :disabled="salvando"
            @click="fecharModal"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="save-button"
            :disabled="salvando || !novoPapel"
            @click="salvarPapel"
          >
            {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  Search,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  UserRound,
  Headset,
  X
} from 'lucide-vue-next'

import Card from '../components/Card.vue'
import Table from '../components/Table.vue'
import api from '../services/api'

import '../assets/css/Perfis.css'

const usuarios = ref([])
const carregando = ref(false)
const salvando = ref(false)
const erro = ref('')

const search = ref('')
const abaAtiva = ref('perfis')

const filtroPapel = ref('todos')
const filtroStatus = ref('todos')

const modalAberto = ref(false)
const usuarioSelecionado = ref(null)
const novoPapel = ref('')

const perfis = [
  {
    value: 'ALUNO',
    label: 'Aluno',
    description: 'Acesso destinado aos alunos que utilizam o sistema.',
    icon: GraduationCap
  },
  {
    value: 'PROFESSOR',
    label: 'Professor',
    description: 'Perfil destinado aos professores responsáveis pelo acompanhamento.',
    icon: UserRound
  },
  {
    value: 'SUPORTE',
    label: 'Suporte técnico',
    description: 'Perfil destinado ao suporte e gerenciamento técnico.',
    icon: Headset
  }
]

const tableHeaders = [
  'ID',
  'Usuário',
  'Nome',
  'E-mail',
  'Papel',
  'Status'
]

const totalUsuarios = computed(() => usuarios.value.length)

const usuariosAtivos = computed(() =>
  usuarios.value.filter(usuario => usuario.is_active).length
)

const usuariosInativos = computed(() =>
  usuarios.value.filter(usuario => !usuario.is_active).length
)

const totalProfessores = computed(() =>
  contarPorPapel('PROFESSOR')
)

function contarPorPapel(papel) {
  return usuarios.value.filter(
    usuario => usuario.papel === papel
  ).length
}

function nomeUsuario(usuario) {
  return [
    usuario.first_name,
    usuario.last_name
  ].filter(Boolean).join(' ') || usuario.username || 'Usuário'
}

const usuariosFiltrados = computed(() => {
  const termo = search.value.toLowerCase().trim()

  return usuarios.value.filter(usuario => {
    const texto = [
      usuario.id,
      usuario.username,
      usuario.first_name,
      usuario.last_name,
      usuario.email,
      usuario.papel
    ]
      .filter(valor => valor !== null && valor !== undefined)
      .join(' ')
      .toLowerCase()

    const correspondePesquisa =
      !termo || texto.includes(termo)

    const correspondePapel =
      filtroPapel.value === 'todos' ||
      usuario.papel === filtroPapel.value

    const correspondeStatus =
      filtroStatus.value === 'todos' ||
      (filtroStatus.value === 'ativo' && usuario.is_active) ||
      (filtroStatus.value === 'inativo' && !usuario.is_active)

    return (
      correspondePesquisa &&
      correspondePapel &&
      correspondeStatus
    )
  })
})

function formatarPapel(papel) {
  const papeis = {
    ALUNO: 'Aluno',
    PROFESSOR: 'Professor',
    SUPORTE: 'Suporte técnico'
  }

  return papeis[papel] || papel || '-'
}

const tableRows = computed(() =>
  usuariosFiltrados.value.map(usuario => [
    usuario.id ?? '-',
    usuario.username || '-',
    nomeUsuario(usuario),
    usuario.email || '-',
    formatarPapel(usuario.papel),
    usuario.is_active ? 'ATIVO' : 'INATIVO'
  ])
)

async function carregarUsuarios() {
  carregando.value = true
  erro.value = ''

  try {
    const response = await api.get('/contas/usuarios/')

    usuarios.value = Array.isArray(response.data)
      ? response.data
      : response.data?.results || []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)

    erro.value =
      error.response?.data?.detail ||
      'Não foi possível carregar os usuários. Verifique a conexão com a API.'
  } finally {
    carregando.value = false
  }
}

function editarUsuario(index) {
  const usuario = usuariosFiltrados.value[index]

  if (!usuario) return

  usuarioSelecionado.value = usuario
  novoPapel.value = usuario.papel || 'ALUNO'
  modalAberto.value = true
}

function fecharModal() {
  if (salvando.value) return

  modalAberto.value = false
  usuarioSelecionado.value = null
  novoPapel.value = ''
}

async function salvarPapel() {
  if (
    !usuarioSelecionado.value?.id ||
    !novoPapel.value ||
    salvando.value
  ) {
    return
  }

  salvando.value = true

  try {
    const response = await api.patch(
      `/contas/usuarios/${usuarioSelecionado.value.id}/`,
      {
        papel: novoPapel.value
      }
    )

    const indice = usuarios.value.findIndex(
      usuario => usuario.id === usuarioSelecionado.value.id
    )

    if (indice !== -1) {
      usuarios.value[indice] = {
        ...usuarios.value[indice],
        ...response.data,
        papel: novoPapel.value
      }
    }

    fecharModal()
  } catch (error) {
    console.error('Erro ao atualizar papel:', error)

    window.alert(
      error.response?.data?.detail ||
      'Não foi possível atualizar o papel do usuário.'
    )
  } finally {
    salvando.value = false
  }
}

onMounted(carregarUsuarios)
</script>