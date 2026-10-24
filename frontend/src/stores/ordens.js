
import { defineStore } from 'pinia'
import api from '../services/api'

export const useOrdensStore = defineStore('ordens', {
    state: () => ({
        ordens: [],
        ordem: null,
        logs: [],
        carregando: false,
        erro: null,
    }),

    getters: {
        ordensCount: (state) => state.ordens.length,

        ordensList: (state) => (status) =>
            state.ordens.filter((ordem) => ordem.status === status),
    },

    actions: {
        async fetchOrdens() {
            this.carregando = true
            this.erro = null

            try {
                const response = await api.get('/ordens_manutencao/')
                this.ordens = response.data
                return true
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao buscar as ordens'

                return false
            } finally {
                this.carregando = false
            }
        },

        async registerOrder(dados) {
            this.carregando = true
            this.erro = null

            try {
                const response = await api.post(
                    '/ordens_manutencao/',
                    dados
                )

                this.ordens.push(response.data)
                return true
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao cadastrar ordem de manutenção'

                return false
            } finally {
                this.carregando = false
            }
        },

        async updateOrder(id, dados) {
            this.carregando = true
            this.erro = null

            try {
                const response = await api.patch(
                    `/ordens_manutencao/${id}/`,
                    dados
                )

                const index = this.ordens.findIndex(
                    (ordem) => ordem.id === id
                )

                if (index !== -1) {
                    this.ordens[index] = response.data
                }

                if (this.ordem?.id === id) {
                    this.ordem = response.data
                }

                return true
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao atualizar ordem de manutenção'

                return false
            } finally {
                this.carregando = false
            }
        },

        async deleteOrder(id) {
            this.carregando = true
            this.erro = null

            try {
                await api.delete(`/ordens_manutencao/${id}/`)

                this.ordens = this.ordens.filter(
                    (ordem) => ordem.id !== id
                )

                if (this.ordem?.id === id) {
                    this.ordem = null
                    this.logs = []
                }

                return true
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao excluir ordem de manutenção'

                return false
            } finally {
                this.carregando = false
            }
        },

        async fetchOrdemById(id) {
            this.carregando = true
            this.erro = null

            try {
                const response = await api.get(
                    `/ordens_manutencao/${id}/`
                )

                this.ordem = response.data
                return response.data
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao buscar ordem de manutenção'

                return null
            } finally {
                this.carregando = false
            }
        },

        async fetchLogsOrdem(id) {
            this.carregando = true
            this.erro = null
            this.logs = []

            try {
                const response = await api.get(
                    `/ordens_manutencao/${id}/logs/`
                )

                this.logs = response.data
                return true
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao buscar histórico da ordem'

                return false
            } finally {
                this.carregando = false
            }
        },
    },
})
