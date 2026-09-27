import { defineStore } from 'pinia'
import api from '../services/api'

export const useHistoricoStore = defineStore('historico', {
  state: () => ({
    historico: [],
    carregando: false,
    erro: null
  }),

  getters: {
    historicoCount: (state) => state.historico.length,

    historicoList: (state) => (acao) =>
      state.historico.filter(
        (historico) => historico.acao === acao
      )
  },

  actions: {

    // Buscar histórico
    async fetchHistorico() {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.get('/historico/')

        this.historico = response.data

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Não foi possível consultar o histórico do ativo.'

        return false
      } finally {
        this.carregando = false
      }
    },

    // Registrar movimentação
    async registerHistorico(dados) {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.post(
          '/historico/',
          dados
        )

        this.historico.push(response.data)

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Não foi possível registrar o histórico do ativo.'

        return false
      } finally {
        this.carregando = false
      }
    }
  }
})