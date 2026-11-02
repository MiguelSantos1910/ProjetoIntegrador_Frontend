
import { defineStore } from 'pinia'
import api from '../services/api'

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function lerUsuarioSalvo() {
  try {
    const usuario = localStorage.getItem('usuario')
    return usuario ? JSON.parse(usuario) : null
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error)
    localStorage.removeItem('usuario')
    return null
  }
}

function obterRetryAfter(response) {
  const headers = response?.headers || {}
  const data = response?.data || {}

  const retryHeader =
    (typeof headers.get === 'function'
      ? headers.get('retry-after')
      : null) ||
    headers['retry-after'] ||
    headers['Retry-After'] ||
    null

  const retryBody =
    data.retry_after ??
    data.wait ??
    data.retryAfter ??
    null

  const valor = retryHeader ?? retryBody

  if (valor === null || valor === undefined) {
    return null
  }

  // Tempo informado em segundos.
  const segundos = Number(valor)

  if (Number.isFinite(segundos) && segundos >= 0) {
    return Math.ceil(segundos)
  }

  // Também aceita uma data HTTP no cabeçalho Retry-After.
  const dataLimite = Date.parse(String(valor))

  if (!Number.isNaN(dataLimite)) {
    return Math.max(
      0,
      Math.ceil((dataLimite - Date.now()) / 1000)
    )
  }

  return null
}

function obterMensagemErro(error) {
  const data = error?.response?.data || {}

  const detalhe =
    data.detail ??
    data.non_field_errors?.[0] ??
    data.message ??
    data.error

  if (typeof detalhe === 'string') {
    return detalhe
  }

  if (Array.isArray(detalhe)) {
    return detalhe.join(' ')
  }

  return (
    error?.message ||
    'Não foi possível realizar a operação.'
  )
}


// ========================================
// STORE DE AUTENTICAÇÃO
// ========================================

export const useAuthStore = defineStore('auth', {

  // ======================================
  // STATE
  // ======================================

  state: () => ({
    token: localStorage.getItem('access_token') || null,

    refreshToken: localStorage.getItem('refresh_token') || null,

    usuario: lerUsuarioSalvo(),

    carregando: false,

    erro: null,

    statusErro: null,

    // Tempo restante de bloqueio em segundos.
    retryAfter: null
  }),

  // ======================================
  // GETTERS
  // ======================================

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

  // ======================================
  // ACTIONS
  // ======================================

  actions: {

    // ====================================
    // LOGIN
    // ====================================

    async login(username, senha) {
      this.carregando = true

      this.erro = null
      this.statusErro = null
      this.retryAfter = null

      try {

        // 1. Autenticação no Django.
        const response = await api.post('/token/', {
          username,
          password: senha
        })

        const { access, refresh } = response.data

        if (!access || !refresh) {
          throw new Error(
            'O servidor não retornou os tokens de autenticação.'
          )
        }

        // 2. Salva os tokens.
        this.token = access
        this.refreshToken = refresh

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        // 3. Busca os dados do usuário autenticado.
        const usuarioCarregado = await this.buscarUsuario()

        if (!usuarioCarregado) {

          // Preserva o erro da consulta /contas/me/.
          const erroUsuario = this.erro
          const statusUsuario = this.statusErro
          const retryUsuario = this.retryAfter

          // Remove os tokens da autenticação incompleta.
          this.limparSessao()

          // Restaura as informações do erro.
          this.erro = erroUsuario || {
            message: (
              'Não foi possível carregar os dados do usuário.'
            ),
            status: statusUsuario,
            retryAfter: retryUsuario
          }

          this.statusErro = statusUsuario
          this.retryAfter = retryUsuario

          return false
        }

        // 4. Login concluído.
        this.erro = null
        this.statusErro = null
        this.retryAfter = null

        return true

      } catch (error) {

        console.error(
          'Erro no login:',
          error.response?.data || error
        )

        const response = error.response || null

        const statusHttp = response?.status ?? null

        const retry = obterRetryAfter(response)

        // Preserva os dados recebidos do backend.
        const erroCompleto = {
          message: obterMensagemErro(error),
          status: statusHttp,
          retryAfter: retry,
          data: response?.data || null
        }

        // Limpa qualquer sessão parcial.
        this.limparSessao()

        // Restaura o erro após limpar a sessão.
        this.erro = erroCompleto
        this.statusErro = statusHttp
        this.retryAfter = retry

        return false

      } finally {

        this.carregando = false

      }
    },


    // ====================================
    // BUSCAR USUÁRIO AUTENTICADO
    // ====================================

    async buscarUsuario() {

      try {

        const response = await api.get('/contas/me/')

        const usuario = response.data

        const papel =
          usuario?.papel ||
          usuario?.perfil?.papel ||
          null

        if (!papel) {
          throw new Error(
            'O endpoint /contas/me/ não retornou o papel do usuário.'
          )
        }

        // Normaliza o papel do usuário.
        this.usuario = {
          ...usuario,
          papel: String(papel).toUpperCase()
        }

        // Salva os dados no navegador.
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

        const statusHttp = error.response?.status ?? null

        this.usuario = null

        localStorage.removeItem('usuario')
        localStorage.removeItem('papel')

        this.erro = {
          message: obterMensagemErro(error),
          status: statusHttp,
          retryAfter: obterRetryAfter(error.response)
        }

        this.statusErro = statusHttp
        this.retryAfter = this.erro.retryAfter

        return false
      }
    },


    // ====================================
    // LOGOUT
    // ====================================

    async logout() {

      let logoutRegistrado = false

      try {

        if (this.token && this.refreshToken) {

          await api.post('/contas/logout/', {
            refresh: this.refreshToken
          })

          logoutRegistrado = true
        }

      } catch (error) {

        console.error(
          'Erro ao registrar logout no servidor:',
          error.response?.data || error
        )

      } finally {

        // Encerra a sessão local independentemente da resposta.
        this.limparSessao()

      }

      return logoutRegistrado
    },


    // ====================================
    // LIMPAR SESSÃO
    // ====================================

    limparSessao() {

      this.token = null
      this.refreshToken = null
      this.usuario = null

      this.erro = null
      this.statusErro = null
      this.retryAfter = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('usuario')
      localStorage.removeItem('papel')
    }

  }
})