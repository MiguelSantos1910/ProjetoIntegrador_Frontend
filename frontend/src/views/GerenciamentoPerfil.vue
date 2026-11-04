<template>
  <div class="perfis">
    <!-- ========================================
         CABEÇALHO
    ======================================== -->

    <header class="perfis-header">
      <div>
        <h1>Gerenciamento de Perfis</h1>
        <p>Gerencie os papéis e as contas dos usuários do sistema.</p>
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
            placeholder="Pesquisar usuários..."
            aria-label="Pesquisar usuários"
          >
        </div>
      </div>
    </header>

    <main class="perfis-content">
      <!-- Carregamento dos usuários -->
      <div
        v-if="carregando"
        class="status-message"
      >
        Carregando usuários...
      </div>

      <!-- Erro ao carregar usuários -->
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
        <!-- ========================================
             VISÃO GERAL
        ======================================== -->

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

        <!-- ========================================
             GERENCIAMENTO
        ======================================== -->

        <section class="perfil-section">
          <div class="section-heading">
            <h2>Gerenciamento</h2>
          </div>

          <!-- Abas -->
          <div class="perfil-tabs">
            <button
              type="button"
              :class="{ active: abaAtiva === 'perfis' }"
              @click="abrirAba('perfis')"
            >
              Tipos de perfil
            </button>

            <button
              type="button"
              :class="{ active: abaAtiva === 'usuarios' }"
              @click="abrirAba('usuarios')"
            >
              Usuários
            </button>

            <button
              type="button"
              :class="{ active: abaAtiva === 'logs' }"
              @click="abrirAba('logs')"
            >
              Auditoria
            </button>
          </div>

          <!-- ========================================
               TIPOS DE PERFIL
          ======================================== -->

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
                  {{ contarPorPapel(perfil.value) === 1
                    ? 'usuário'
                    : 'usuários' }}
                </span>
              </div>
            </article>
          </div>

          <!-- ========================================
               USUÁRIOS
          ======================================== -->

          <section
            v-else-if="abaAtiva === 'usuarios'"
            class="report-card table-card"
          >
            <div class="table-header perfil-table-header">
              <div>
                <h2>Usuários cadastrados</h2>
                <p>
                  Consulte as contas e altere os papéis de acesso.
                </p>
              </div>
            </div>

            <!-- Filtros -->
            <div class="perfil-filters">
              <div class="filter-field">
                <label for="filtro-papel">Papel</label>

                <select
                  id="filtro-papel"
                  v-model="filtroPapel"
                >
                  <option value="todos">
                    Todos os papéis
                  </option>

                  <option value="ALUNO">
                    Aluno
                  </option>

                  <option value="PROFESSOR">
                    Professor
                  </option>

                  <option value="SUPORTE">
                    Suporte técnico
                  </option>
                </select>
              </div>

              <div class="filter-field">
                <label for="filtro-status">Status</label>

                <select
                  id="filtro-status"
                  v-model="filtroStatus"
                >
                  <option value="todos">
                    Todos os status
                  </option>

                  <option value="ativo">
                    Ativos
                  </option>

                  <option value="inativo">
                    Inativos
                  </option>
                </select>
              </div>
            </div>

            <!-- Tabela de usuários -->
            <Table
              title=""
              :headers="tableHeaders"
              :rows="tableRows"
              :show-actions="true"
              :show-detail="false"
              :show-inactive="false"
              :max-height="450"
              @edit="editarUsuario"
            />

            <div class="table-footer">
              <span>
                Mostrando {{ usuariosFiltrados.length }}
                de {{ usuarios.length }} usuários
              </span>
            </div>
          </section>

          <!-- ========================================
               AUDITORIA
          ======================================== -->

          <section
            v-else
            class="report-card table-card logs-card"
          >
            <div class="table-header perfil-table-header">
              <div>
                <h2>Auditoria de contas</h2>

                <p>
                  Acompanhe registros de cadastro, autenticação,
                  bloqueios e alterações de senha dos usuários.
                </p>
              </div>

              <button
                type="button"
                class="save-button"
                :disabled="
                  logsStore.carregando ||
                    logsStore.atualizandoAutomaticamente
                "
                @click="carregarLogs"
              >
                {{
                  logsStore.carregando ||
                    logsStore.atualizandoAutomaticamente
                    ? 'Atualizando...'
                    : 'Atualizar logs'
                }}
              </button>
            </div>

            <!-- Filtros de auditoria -->
            <div class="perfil-filters">
              <div class="filter-field">
                <label for="filtro-log-usuario">
                  Usuário
                </label>

                <select
                  id="filtro-log-usuario"
                  v-model="filtroLogUsuario"
                  @change="carregarLogs"
                >
                  <option value="">
                    Todos os usuários
                  </option>

                  <option
                    v-for="usuario in usuarios"
                    :key="usuario.id"
                    :value="String(usuario.id)"
                  >
                    {{ usuario.username }}
                  </option>
                </select>
              </div>

              <div class="filter-field">
                <label for="filtro-log-evento">
                  Tipo de evento
                </label>

                <select
                  id="filtro-log-evento"
                  v-model="filtroLogEvento"
                  @change="carregarLogs"
                >
                  <option value="">
                    Todos os eventos
                  </option>

                  <option
                    v-for="evento in eventosAuditoria"
                    :key="evento.value"
                    :value="evento.value"
                  >
                    {{ evento.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Carregamento inicial -->
            <div
              v-if="
                logsStore.carregando &&
                  logsStore.logs.length === 0
              "
              class="status-message"
            >
              Carregando registros de auditoria...
            </div>

            <!-- Erro sem registros anteriores -->
            <div
              v-else-if="
                logsStore.erro &&
                  logsStore.logs.length === 0
              "
              class="status-message error"
            >
              {{ logsStore.erro }}

              <button
                type="button"
                class="retry-button"
                @click="carregarLogs"
              >
                Tentar novamente
              </button>
            </div>

            <!-- Tabela de auditoria -->
            <div
              v-else
              class="logs-table-container"
            >
              <Table
                title=""
                :headers="logsTableHeaders"
                :rows="logsTableRows"
                :show-actions="false"
                :show-detail="false"
                :show-edit="false"
                :show-inactive="false"
                :max-height="520"
              />
            </div>

            <!-- Erro durante atualização mantendo dados anteriores -->
            <div
              v-if="
                logsStore.erro &&
                  logsStore.logs.length > 0
              "
              class="status-message error logs-refresh-error"
              role="status"
            >
              Não foi possível atualizar os registros.
              Os dados exibidos podem estar desatualizados.
            </div>

            <!-- Rodapé -->
            <div
              v-if="
                !logsStore.carregando &&
                  !logsStore.erro
              "
              class="table-footer"
            >
              <span>
                Total de registros encontrados:
                {{ logsStore.total ?? logsStore.logs.length }}
              </span>

              <span v-if="logsStore.atualizandoAutomaticamente">
                Atualizando registros...
              </span>
            </div>
          </section>
        </section>
      </template>
    </main>

    <!-- ========================================
         MODAL DE ALTERAÇÃO DE PAPEL
    ======================================== -->

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
            <h2 id="modal-title">
              Alterar papel do usuário
            </h2>

            <p>
              Atualize o papel associado à conta.
            </p>
          </div>

          <button
            type="button"
            class="modal-close"
            aria-label="Fechar"
            :disabled="salvando"
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
              <strong>
                {{ nomeUsuario(usuarioSelecionado) }}
              </strong>

              <span>
                {{ usuarioSelecionado.email || 'E-mail não informado' }}
              </span>
            </div>
          </div>

          <div class="filter-field">
            <label for="novo-papel">
              Papel de acesso
            </label>

            <select
              id="novo-papel"
              v-model="novoPapel"
            >
              <option value="ALUNO">
                Aluno
              </option>

              <option value="PROFESSOR">
                Professor
              </option>

              <option value="SUPORTE">
                Suporte técnico
              </option>
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
            :disabled="
              salvando ||
                !novoPapel ||
                novoPapel === usuarioSelecionado?.papel
            "
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
import { computed, onMounted, ref, watch } from 'vue'

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
import { useLogsContaStore } from '../stores/logsUser'
import { dataHoraFormatada } from '../composables/formatData.js'

import '../assets/css/Perfis.css'


// ========================================
// STORE
// ========================================

const logsStore = useLogsContaStore()


// ========================================
// ESTADO DA TELA
// ========================================

const usuarios = ref([])

const carregando = ref(false)
const salvando = ref(false)

const erro = ref('')

const search = ref('')
const abaAtiva = ref('perfis')

const filtroPapel = ref('todos')
const filtroStatus = ref('todos')

const filtroLogUsuario = ref('')
const filtroLogEvento = ref('')

const modalAberto = ref(false)
const usuarioSelecionado = ref(null)
const novoPapel = ref('')


// ========================================
// DADOS DOS PERFIS
// ========================================

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


// ========================================
// EVENTOS DA AUDITORIA
// ========================================

const eventosAuditoria = [
  {
    value: 'CADASTRO',
    label: 'Cadastro realizado'
  },
  {
    value: 'CADASTRO_FALHA',
    label: 'Falha no cadastro'
  },
  {
    value: 'LOGIN',
    label: 'Login realizado'
  },
  {
    value: 'LOGIN_FALHA',
    label: 'Falha no login / credenciais incorretas'
  },
  {
    value: 'LOGIN_BLOQUEADO',
    label: 'Login bloqueado'
  },
  {
    value: 'LOGOUT',
    label: 'Logout'
  },
  {
    value: 'ALTERACAO_SENHA_FALHA',
    label: 'Falha na alteração de senha'
  },
  {
    value: 'BACKUP_CRIADO',
    label: 'Backup gerado'
  },
  {
    value: 'BACKUP_RESTAURADO',
    label: 'Banco restaurado'
  },
  {
    value: 'BACKUP_BAIXADO',
    label: 'Backup baixado'
  },
  {
    value: 'BACKUP_FALHA',
    label: 'Falha no backup'
  }
]


// ========================================
// CABEÇALHOS DAS TABELAS
// ========================================

const tableHeaders = [
  'ID',
  'Usuário',
  'Nome',
  'E-mail',
  'Papel',
  'Status'
]

const logsTableHeaders = [
  'ID',
  'Usuário',
  'Evento',
  'Descrição',
  'Endereço IP',
  'Data e horário'
]


// ========================================
// INDICADORES
// ========================================

const totalUsuarios = computed(() => {
  return usuarios.value.length
})

const usuariosAtivos = computed(() => {
  return usuarios.value.filter(
    usuario => usuario.is_active
  ).length
})

const usuariosInativos = computed(() => {
  return usuarios.value.filter(
    usuario => !usuario.is_active
  ).length
})

const totalProfessores = computed(() => {
  return contarPorPapel('PROFESSOR')
})

function contarPorPapel(papel) {
  return usuarios.value.filter(
    usuario => usuario.papel === papel
  ).length
}


// ========================================
// NOME DO USUÁRIO
// ========================================

function nomeUsuario(usuario) {
  if (!usuario) {
    return 'Usuário'
  }

  return [
    usuario.first_name,
    usuario.last_name
  ]
    .filter(Boolean)
    .join(' ') || usuario.username || 'Usuário'
}


// ========================================
// FILTROS DOS USUÁRIOS
// ========================================

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
      (
        filtroStatus.value === 'ativo' &&
        usuario.is_active
      ) ||
      (
        filtroStatus.value === 'inativo' &&
        !usuario.is_active
      )

    return (
      correspondePesquisa &&
      correspondePapel &&
      correspondeStatus
    )
  })
})


// ========================================
// FORMATAÇÃO DOS PAPÉIS
// ========================================

function formatarPapel(papel) {
  const papeis = {
    ALUNO: 'Aluno',
    PROFESSOR: 'Professor',
    SUPORTE: 'Suporte técnico'
  }

  return papeis[papel] || papel || '-'
}


// ========================================
// DADOS DA TABELA DE USUÁRIOS
// ========================================

const tableRows = computed(() => {
  return usuariosFiltrados.value.map(usuario => [
    usuario.id ?? '-',
    usuario.username || '-',
    nomeUsuario(usuario),
    usuario.email || '-',
    formatarPapel(usuario.papel),
    usuario.is_active ? 'ATIVO' : 'INATIVO'
  ])
})


// ========================================
// CARREGAR USUÁRIOS
// ========================================

async function carregarUsuarios() {
  carregando.value = true
  erro.value = ''

  try {
    const response = await api.get('/contas/usuarios/')

    const dados = response.data

    usuarios.value = Array.isArray(dados)
      ? dados
      : Array.isArray(dados?.results)
        ? dados.results
        : []

  } catch (error) {
    console.error(
      'Erro ao carregar usuários:',
      error.response?.data || error
    )

    erro.value =
      error.response?.data?.detail ||
      'Não foi possível carregar os usuários. Verifique a conexão com a API.'

  } finally {
    carregando.value = false
  }
}


// ========================================
// NAVEGAÇÃO ENTRE ABAS
// ========================================

function abrirAba(aba) {
  abaAtiva.value = aba
}


// ========================================
// CARREGAR AUDITORIA
// ========================================

async function carregarLogs() {
  // Atualiza os filtros da store antes da requisição.
  logsStore.filtros.usuario =
    filtroLogUsuario.value || null

  logsStore.filtros.tipo_evento =
    filtroLogEvento.value || null

  return await logsStore.fetchLogs()
}


// ========================================
// ATUALIZAÇÃO AUTOMÁTICA DA AUDITORIA
// ========================================

watch(
  abaAtiva,
  (aba, anterior, onCleanup) => {
    if (aba !== 'logs') {
      return
    }

    // Carrega os registros ao entrar na aba.
    carregarLogs()

    // Atualiza automaticamente a cada 10 segundos.
    const intervalo = window.setInterval(() => {
      if (!logsStore.requisicaoEmAndamento) {
        logsStore.atualizarAutomaticamente()
      }
    }, 10000)

    // Limpa o intervalo ao trocar de aba ou desmontar o componente.
    onCleanup(() => {
      window.clearInterval(intervalo)
    })
  }
)


// ========================================
// FORMATAÇÃO DOS EVENTOS
// ========================================

function formatarEvento(evento) {
  const eventos = {
    CADASTRO: 'Cadastro realizado',
    CADASTRO_FALHA: 'Falha no cadastro',
    LOGIN: 'Login realizado',
    LOGIN_FALHA: 'Falha no login',
    LOGIN_BLOQUEADO: 'Login bloqueado',
    LOGOUT: 'Logout',
    ALTERACAO_SENHA_FALHA: 'Falha na alteração de senha',
    BACKUP_CRIADO: 'Backup gerado',
    BACKUP_RESTAURADO: 'Banco restaurado',
    BACKUP_BAIXADO: 'Backup baixado',
    BACKUP_FALHA: 'Falha no backup'
  }

  return eventos[evento] || evento || '-'
}


// ========================================
// DADOS DA TABELA DE AUDITORIA
// ========================================

const logsTableRows = computed(() => {
  return logsStore.logs.map(log => {
    const tipoEvento = log.tipo_evento || ''

    return [
      log.id ?? '-',

      log.usuario_nome || 'Usuário não identificado',

      // O Table.vue utiliza value para identificar
      // a classe CSS e label para mostrar o texto.
      {
        value: tipoEvento,
        label:
          log.tipo_evento_display ||
          formatarEvento(tipoEvento)
      },

      log.descricao || '-',

      log.ip || '-',

      dataHoraFormatada(log.data)
    ]
  })
})


// ========================================
// EDITAR PAPEL DO USUÁRIO
// ========================================

function editarUsuario(payload) {
  let usuario = null

  // O Table.vue atual emite o índice da linha.
  if (typeof payload === 'number') {
    usuario = usuariosFiltrados.value[payload]
  }

  // Compatibilidade caso futuramente a tabela emita o objeto.
  else if (
    payload &&
    typeof payload === 'object' &&
    payload.id !== undefined
  ) {
    usuario = usuariosFiltrados.value.find(
      item => String(item.id) === String(payload.id)
    ) || payload
  }

  if (!usuario) {
    return
  }

  usuarioSelecionado.value = usuario
  novoPapel.value = usuario.papel || 'ALUNO'

  modalAberto.value = true
}


// ========================================
// FECHAR MODAL
// ========================================

function fecharModal() {
  if (salvando.value) {
    return
  }

  modalAberto.value = false
  usuarioSelecionado.value = null
  novoPapel.value = ''
}


// ========================================
// SALVAR ALTERAÇÃO DE PAPEL
// ========================================

async function salvarPapel() {
  const usuarioId = usuarioSelecionado.value?.id

  if (
    !usuarioId ||
    !novoPapel.value ||
    salvando.value
  ) {
    return
  }

  if (novoPapel.value === usuarioSelecionado.value.papel) {
    fecharModal()
    return
  }

  salvando.value = true

  try {
    const response = await api.patch(
      `/contas/usuarios/${usuarioId}/`,
      {
        papel: novoPapel.value
      }
    )

    // Atualiza o usuário na lista local.
    const indice = usuarios.value.findIndex(
      usuario => String(usuario.id) === String(usuarioId)
    )

    if (indice !== -1) {
      usuarios.value[indice] = {
        ...usuarios.value[indice],
        ...response.data,
        papel: response.data?.papel || novoPapel.value
      }
    }

    // Fecha o modal após a confirmação da API.
    salvando.value = false
    fecharModal()

  } catch (error) {
    console.error(
      'Erro ao atualizar papel:',
      error.response?.data || error
    )

    const mensagem =
      error.response?.data?.detail ||
      error.response?.data?.papel?.[0] ||
      'Não foi possível atualizar o papel do usuário.'

    window.alert(mensagem)

  } finally {
    salvando.value = false
  }
}


// ========================================
// INICIALIZAÇÃO
// ========================================

onMounted(() => {
  carregarUsuarios()
})
</script>