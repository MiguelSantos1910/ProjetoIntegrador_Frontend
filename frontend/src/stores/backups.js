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

        // O download passa pelo Axios (e não por um link comum) porque a
        // rota exige o token JWT no cabeçalho Authorization.
        async baixarBackup(nome) {
            this.erro = null

            try {
                const response = await api.get(
                    `/backups/${encodeURIComponent(nome)}/download/`,
                    { responseType: 'blob' }
                )

                const url = URL.createObjectURL(response.data)
                const link = document.createElement('a')

                link.href = url
                link.download = nome
                document.body.appendChild(link)
                link.click()
                link.remove()

                URL.revokeObjectURL(url)
                return true
            } catch (error) {
                // Com responseType 'blob', o corpo do erro também vem em blob.
                let detalhe = null

                try {
                    const texto = await error.response?.data?.text?.()
                    detalhe = texto ? JSON.parse(texto).detail : null
                } catch {
                    detalhe = null
                }

                this.erro = detalhe || 'Erro ao baixar o backup'
                return false
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
