import { defineStore } from 'pinia'
import api from '../services/api'

export const useUsuariosStore = defineStore('usuarios', {
  state: () => ({
    usuarios: [],
    carregando: false,
    erro: null
  }),

  getters: {
    usuariosCount: (state) => state.usuarios.length
  },

  actions: {
    async fetchUsuarios() {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.get('/contas/usuarios/')

        this.usuarios = response.data

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao buscar usuários.'

        return false
      } finally {
        this.carregando = false
      }
    },

    async registerUsuario(dados) {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.post(
          '/contas/usuarios/',
          dados
        )

        this.usuarios.push(response.data)

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao cadastrar usuário.'

        return false
      } finally {
        this.carregando = false
      }
    },

    async updateUsuario(id, dados) {
      this.carregando = true
      this.erro = null

      try {
        const response = await api.patch(
          `/contas/usuarios/${id}/`,
          dados
        )

        const index = this.usuarios.findIndex(
          (usuario) => usuario.id === id
        )

        if (index !== -1) {
          this.usuarios[index] = response.data
        }

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao atualizar o usuário.'

        return false
      } finally {
        this.carregando = false
      }
    },

    async deleteUsuario(id) {
      this.carregando = true
      this.erro = null

      try {
        await api.delete(
          `/contas/usuarios/${id}/`
        )

        this.usuarios = this.usuarios.filter(
          (usuario) => usuario.id !== id
        )

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao deletar o usuário.'

        return false
      } finally {
        this.carregando = false
      }
    },

    // senhaAtual é obrigatória ao trocar a própria senha; o professor
    // redefine a senha de outra pessoa sem ela. O back encerra todas as
    // sessões da conta depois da troca.
    async alterarSenha(id, password, senhaAtual = null) {
      this.carregando = true
      this.erro = null

      try {
        const dados = { password }

        if (senhaAtual !== null) {
          dados.senha_atual = senhaAtual
        }

        await api.patch(`/contas/usuarios/${id}/senha/`, dados)

        return true
      } catch (error) {
        const resposta = error.response?.data

        this.erro =
          resposta?.senha_atual?.[0] ||
          resposta?.password?.[0] ||
          resposta?.detail ||
          'Erro ao alterar a senha.'

        return false
      } finally {
        this.carregando = false
      }
    }
  }
})