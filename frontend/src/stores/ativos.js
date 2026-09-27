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

    ativosList: (state) => (status) =>
      state.ativos.filter(
        (ativo) => ativo.status === status
      )
  },

  actions: {

    // Buscar todos os ativos
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
    },

    // Cadastrar ativo
    async registerAtivo(dados) {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.post(
          '/ativos/',
          dados
        )

        // Adiciona o novo ativo à lista
        this.ativos.push(response.data)

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao cadastrar ativo.'

        return false
      } finally {
        this.carregando = false
      }
    },

    // Atualizar ativo
    async updateAtivo(id, dados) {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.patch(
          `/ativos/${id}/`,
          dados
        )

        const index = this.ativos.findIndex(
          (ativo) => ativo.id === id
        )

        if (index !== -1) {
          this.ativos[index] = response.data
        }

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao atualizar os dados do ativo.'

        return false
      } finally {
        this.carregando = false
      }
    },

    // Excluir ativo
    async deleteAtivo(id) {
      this.carregando = true
      this.erro = null

      try {
        await api.delete(`/ativos/${id}/`)

        this.ativos = this.ativos.filter(
          (ativo) => ativo.id !== id
        )

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao excluir o ativo.'

        return false
      } finally {
        this.carregando = false
      }
    }
  }
})