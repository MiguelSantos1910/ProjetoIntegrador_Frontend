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

    async alterarSenha(id, password) {
      this.carregando = true
      this.erro = null

      try {
        await api.patch(
          `/contas/usuarios/${id}/senha/`,
          { password }
        )

        return true
      } catch (error) {
        this.erro =
          error.response?.data?.detail ||
          'Erro ao alterar a senha.'

        return false
      } finally {
        this.carregando = false
      }
    }
  }
})