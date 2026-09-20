import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    carregando: false,
    erro: null
  }),

  getters: {
    autenticado: (state) => !!state.token,

    nomeUsuario: (state) => {
      return state.usuario?.first_name || 'Usuário'
    }
  },

  actions: {
    async login(username, senha) {
      this.carregando = true
      this.erro = null

      try {
        // 1. Faz login no Django
        const response = await api.post('/token/', {
          username: username,
          password: senha
        })

        const { access, refresh } = response.data

        // 2. Salva o JWT
        this.token = access
        this.refreshToken = refresh

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        // 3. Busca os dados do usuário
        const usuarioCarregado = await this.buscarUsuario()

        if (!usuarioCarregado) {
          throw new Error('Não foi possível carregar os dados do usuário.')
        }

        return true

      } catch (error) {
        console.error(
          'Erro no login:',
          error.response?.data || error
        )

        this.erro =
          error.response?.data?.detail ||
          error.message ||
          'Não foi possível realizar o login.'

        return false

      } finally {
        this.carregando = false
      }
    },

    async buscarUsuario() {
      try {
        const response = await api.get('/contas/me/')

        this.usuario = response.data

        localStorage.setItem(
          'usuario',
          JSON.stringify(response.data)
        )

        return true

      } catch (error) {
        console.error(
          'Erro ao buscar usuário:',
          error.response?.data || error
        )

        this.usuario = null

        this.erro =
          error.response?.data?.detail ||
          'Não foi possível carregar os dados do usuário.'

        return false
      }
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.usuario = null
      this.erro = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('usuario')
    }
  }
})