import { defineStore } from 'pinia'
import api from '../services/api'

export const useAtivosStore = defineStore('ativos', {
  state: () => ({
    ativos: [],
    carregando: false,
    erro: null
  }),

  getters: {
    ativosCount: (state) => state.ativos.length,

    ativosList: (state) => (active) =>
      state.ativos.filter(
        (ativo) => ativo.ativo === active
      )
  },

  actions: {
    async fetchAtivos() {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.get('/ativos/')

        this.ativos = response.data

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao buscar ativos.'

        return false
      } finally {
        this.carregando = false
      }
    }
  }
})