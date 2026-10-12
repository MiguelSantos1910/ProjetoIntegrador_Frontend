import { defineStore } from 'pinia'
import api from '../services/api'

export const useOrdensStore = defineStore('ordens', {
    state: () => ({
        ordens: [],
        ordem: null,
        carregando: false,
        erro: null,
    }),

    getters: {
        ordensCount: (state) => state.ordens.length,

        ordensList: (state) => (status) => state.ordens.filter((ordens) => ordens.status === status)
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
                this.erro = error.response?.data?.detail ||
                "Erro ao buscar as ordens"

                return false
            } finally {
                this.carregando = false
            }
        },

        async registerOrder(dados) {
            this.carregando = true
            this.erro = null

            try {
                const response = await api.post('/ordens_manutencao/', dados)

                this.ordens.push(response.data)

                return true
            } catch (error) {
                this.erro = error.response?.data?.detail ||
                "Erro ao cadastrar ordens"

                return false
            } finally {
                this.carregando = false
            }
        },

        async updateOrder(id, dados) {
            this.carregando = true
            this.erro = null

            try {
                const response = await api.patch(`/ordens_manutencao/${id}`, dados)

                const index = this.ordens.findIndex(
                    (ordens) => ordens.id === id
                )

                if (index !== -1) {
                    this.ordens[index] = response.data
                }

                return true
            } catch (error) {
                this.erro.response?.data?.detail ||
                "Erro ao atualizar ordens"

                return false
            } finally {
                this.carregando = false
            }
        },

        async deleteordens(id) {
            this.carregando = true
            this.erro = null

            try {
                
                await api.delete(`/ordens_manutencao/${id}/`)

                this.ordens = this.ordens.id(
                    (ordens) => ordens.id !== id
                )
                
                return true
            } catch (error) {
                this.erro.response?.data?.detail ||
                "Erro ao deletar ordens"
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
                    'Erro ao buscar a ordem de manutenção'

                return null
            } finally {
                this.carregando = false
            }
        },
    }
})