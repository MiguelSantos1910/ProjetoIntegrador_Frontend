import { defineStore } from 'pinia'
import api from '../services/api'

// Endpoint do LogContaViewSet.
const ENDPOINT_AUDITORIA = '/contas/auditoria/'

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function obterMensagemErro(error) {
  const data = error?.response?.data || {}

  const detalhe =
    data.detail ||
    data.message ||
    data.error

  if (typeof detalhe === 'string') {
    return detalhe
  }

  if (Array.isArray(detalhe)) {
    return detalhe.join(' ')
  }

  return 'Erro ao buscar os registros de auditoria.'
}


// ========================================
// STORE DE AUDITORIA
// ========================================

export const useLogsContaStore = defineStore('logsConta', {

  // ======================================
  // STATE
  // ======================================

  state: () => ({
    logs: [],

    total: 0,

    carregando: false,

    atualizandoAutomaticamente: false,

    // Impede requisições simultâneas.
    requisicaoEmAndamento: false,

    erro: null,

    filtros: {
      usuario: null,
      tipo_evento: null
    },

    tiposEvento: [
      {
        valor: 'CADASTRO',
        label: 'Cadastro realizado'
      },
      {
        valor: 'CADASTRO_FALHA',
        label: 'Falha no cadastro'
      },
      {
        valor: 'LOGIN',
        label: 'Login realizado'
      },
      {
        valor: 'LOGIN_FALHA',
        label: 'Falha no login'
      },
      {
        valor: 'LOGIN_BLOQUEADO',
        label: 'Login bloqueado'
      },
      {
        valor: 'LOGOUT',
        label: 'Logout'
      },
      {
        valor: 'ALTERACAO_SENHA_FALHA',
        label: 'Falha na alteração de senha'
      }
    ]
  }),

  // ======================================
  // GETTERS
  // ======================================

  getters: {

    logsCount: (state) => state.logs.length,

    totalLogs: (state) => state.total,

    // ------------------------------------
    // CADASTROS
    // ------------------------------------

    logsCadastro: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'CADASTRO'
      ),

    logsCadastroFalha: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'CADASTRO_FALHA'
      ),

    // ------------------------------------
    // AUTENTICAÇÃO
    // ------------------------------------

    logsLogin: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'LOGIN'
      ),

    logsLoginFalha: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'LOGIN_FALHA'
      ),

    logsLoginBloqueado: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'LOGIN_BLOQUEADO'
      ),

    // ------------------------------------
    // LOGOUT
    // ------------------------------------

    logsLogout: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'LOGOUT'
      ),

    // ------------------------------------
    // ALTERAÇÃO DE SENHA
    // ------------------------------------

    logsAlteracaoSenhaFalha: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'ALTERACAO_SENHA_FALHA'
      ),

    // ------------------------------------
    // TODAS AS FALHAS
    // ------------------------------------

    logsFalhas: (state) =>
      state.logs.filter(
        (log) => [
          'CADASTRO_FALHA',
          'LOGIN_FALHA',
          'LOGIN_BLOQUEADO',
          'ALTERACAO_SENHA_FALHA'
        ].includes(log.tipo_evento)
      )
  },

  // ======================================
  // ACTIONS
  // ======================================

  actions: {

    // ====================================
    // BUSCAR LOGS
    // ====================================

    async fetchLogs({ silencioso = false } = {}) {

      // Evita requisições simultâneas.
      if (this.requisicaoEmAndamento) {
        return false
      }

      this.requisicaoEmAndamento = true

      if (silencioso) {
        this.atualizandoAutomaticamente = true
      } else {
        this.carregando = true
        this.erro = null
      }

      try {

        const params = {}

        // --------------------------------
        // FILTRO POR USUÁRIO
        // --------------------------------

        if (
          this.filtros.usuario !== null &&
          this.filtros.usuario !== ''
        ) {
          params.usuario = this.filtros.usuario
        }

        // --------------------------------
        // FILTRO POR EVENTO
        // --------------------------------

        if (this.filtros.tipo_evento) {
          params.tipo_evento = this.filtros.tipo_evento
        }

        // --------------------------------
        // REQUISIÇÃO À API
        // --------------------------------

        const response = await api.get(
          ENDPOINT_AUDITORIA,
          {
            params
          }
        )

        const dados = response.data

        // --------------------------------
        // API NÃO PAGINADA
        // --------------------------------

        if (Array.isArray(dados)) {

          this.logs = dados
          this.total = dados.length

        }

        // --------------------------------
        // API PAGINADA
        // --------------------------------

        else if (Array.isArray(dados?.results)) {

          this.logs = dados.results

          this.total = dados.count ?? dados.results.length

        }

        else {

          this.logs = []
          this.total = 0

        }

        this.erro = null

        return true

      } catch (error) {

        console.error(
          'Erro ao buscar auditoria:',
          error.response?.data || error
        )

        // Durante a atualização automática,
        // preserva os registros já carregados.
        if (!silencioso) {
          this.erro = obterMensagemErro(error)
        }

        return false

      } finally {

        this.requisicaoEmAndamento = false

        this.carregando = false

        this.atualizandoAutomaticamente = false

      }
    },


    // ====================================
    // FILTRAR POR USUÁRIO
    // ====================================

    async filtrarPorUsuario(usuarioId) {

      this.filtros.usuario = usuarioId || null

      return await this.fetchLogs()
    },


    // ====================================
    // FILTRAR POR EVENTO
    // ====================================

    async filtrarPorEvento(tipoEvento) {

      this.filtros.tipo_evento = tipoEvento || null

      return await this.fetchLogs()
    },


    // ====================================
    // APLICAR FILTROS
    // ====================================

    async aplicarFiltros(filtros = {}) {

      this.filtros.usuario = filtros.usuario || null

      this.filtros.tipo_evento = filtros.tipo_evento || null

      return await this.fetchLogs()
    },


    // ====================================
    // LIMPAR FILTROS
    // ====================================

    async limparFiltros() {

      this.filtros.usuario = null

      this.filtros.tipo_evento = null

      return await this.fetchLogs()
    },


    // ====================================
    // ATUALIZAÇÃO AUTOMÁTICA
    // ====================================

    async atualizarAutomaticamente() {

      return await this.fetchLogs({
        silencioso: true
      })
    },


    // ====================================
    // LIMPAR LOGS
    // ====================================

    limparLogs() {

      this.logs = []

      this.total = 0

      this.erro = null
    }

  }
})