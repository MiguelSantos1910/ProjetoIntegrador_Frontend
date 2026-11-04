import { defineStore } from 'pinia'
import api from '../services/api'

// Confirmação exigida pelo back em POST /backups/<nome>/restaurar/
const CONFIRMACAO_RESTAURAR = 'RESTAURAR'

export const useBackupsStore = defineStore('backups', {
    state: () => ({
        backups: [],
        carregando: false,
        processando: false,
        erro: null,
    }),

    getters: {
        backupsCount: (state) => state.backups.length,

        ultimoBackup: (state) =>
            state.backups.find((backup) => backup.tipo === 'db') || null,
    },

    actions: {
        async fetchBackups() {
            this.carregando = true
            this.erro = null

            try {
                const response = await api.get('/backups/')
                this.backups = response.data
                return true
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao buscar os backups'

                return false
            } finally {
                this.carregando = false
            }
        },

        async criarBackup() {
            this.processando = true
            this.erro = null

            try {
                const response = await api.post('/backups/')
                this.backups.unshift(response.data)
                return response.data
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao gerar o backup'

                return null
            } finally {
                this.processando = false
            }
        },

        async restaurarBackup(nome) {
            this.processando = true
            this.erro = null

            try {
                const response = await api.post(
                    `/backups/${encodeURIComponent(nome)}/restaurar/`,
                    { confirmacao: CONFIRMACAO_RESTAURAR }
                )

                return response.data
            } catch (error) {
                this.erro =
                    error.response?.data?.detail ||
                    'Erro ao restaurar o backup'

                return null
            } finally {
                this.processando = false
            }
        },
    },
})
