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
    },

    papelUsuario: (state) => {
      return (
        state.usuario?.papel ||
        state.usuario?.perfil?.papel ||
        ''
      )
    }
  },

  actions: {
    async login(username, senha) {
      this.carregando = true
      this.erro = null

      try {
        // 1. Faz login no Django
        const response = await api.post('/token/', {
          username,
          password: senha
        })

        const { access, refresh } = response.data

        // 2. Salva os tokens
        this.token = access
        this.refreshToken = refresh

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        // 3. Busca os dados do usuário
        const usuarioCarregado = await this.buscarUsuario()

        if (!usuarioCarregado) {
          throw new Error(
            'Não foi possível carregar os dados do usuário e seu papel.'
          )
        }

        return true

      } catch (error) {
        console.error(
          'Erro no login:',
          error.response?.data || error
        )

        const mensagem =
          error.response?.data?.detail ||
          error.message ||
          'Não foi possível realizar o login.'

        this.logout()
        this.erro = mensagem

        return false

      } finally {
        this.carregando = false
      }
    },

    async buscarUsuario() {
      try {
        // Busca os dados do usuário autenticado
        const response = await api.get('/contas/me/')

        const usuario = response.data

        // O papel pode vir diretamente ou dentro do perfil
        const papel =
          usuario?.papel ||
          usuario?.perfil?.papel ||
          null

        if (!papel) {
          throw new Error(
            'O endpoint /contas/me/ não retornou o papel do usuário.'
          )
        }

        this.usuario = {
          ...usuario,
          papel: String(papel).toUpperCase()
        }

        localStorage.setItem(
          'usuario',
          JSON.stringify(this.usuario)
        )

        localStorage.setItem(
          'papel',
          this.usuario.papel
        )

        return true

      } catch (error) {
        console.error(
          'Erro ao buscar usuário:',
          error.response?.data || error
        )

        this.usuario = null

        localStorage.removeItem('usuario')
        localStorage.removeItem('papel')

        this.erro =
          error.response?.data?.detail ||
          error.message ||
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
      localStorage.removeItem('papel')
    }
  }
})
