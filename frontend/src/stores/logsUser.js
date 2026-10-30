import { defineStore } from 'pinia'
import api from '../services/api'

export const useLogsContaStore = defineStore('logsConta', {
  state: () => ({
    logs: [],
    carregando: false,
    erro: null,

    filtros: {
      usuario: null,
      tipo_evento: null
    }
  }),

  getters: {
    logsCount: (state) => state.logs.length,

    logsLogin: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'LOGIN'
      ),

    logsCadastro: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'CADASTRO'
      ),

    logsLogout: (state) =>
      state.logs.filter(
        (log) => log.tipo_evento === 'LOGOUT'
      )
  },

  actions: {
    async fetchLogs() {
      this.carregando = true
      this.erro = null

      try {
        const params = {}

        if (this.filtros.usuario) {
          params.usuario = this.filtros.usuario
        }

        if (this.filtros.tipo_evento) {
          params.tipo_evento = this.filtros.tipo_evento
        }

        const response = await api.get(
          '/contas/logs/',
          { params }
        )

        this.logs = response.data

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao buscar os registros de auditoria.'

        return false
      } finally {
        this.carregando = false
      }
    },

    async filtrarPorUsuario(usuarioId) {
      this.filtros.usuario = usuarioId || null

      return await this.fetchLogs()
    },

    async filtrarPorEvento(tipoEvento) {
      this.filtros.tipo_evento = tipoEvento || null

      return await this.fetchLogs()
    },

    async limparFiltros() {
      this.filtros.usuario = null
      this.filtros.tipo_evento = null

      return await this.fetchLogs()
    },

    limparLogs() {
      this.logs = []
      this.erro = null
    }
  }
})
