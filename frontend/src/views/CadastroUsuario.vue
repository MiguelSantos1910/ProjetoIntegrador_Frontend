<template>
  <div class="auth-view">
    <Form
      title="Cadastro de Usuário"
      :fields="formFields"
      submit-button-text="Cadastrar"
      @submit="handleFormSubmit"
    />

    <router-link
      to="/"
      class="register-link"
    >
      Já tem uma conta?
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Form from '../components/Form.vue'
import {useRouter} from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formFields = ref([
  {
    name: 'nome',
    label: 'Nome',
    type: 'text',
    placeholder: 'Digite seu nome',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Digite seu email',
    required: true
  },
  {
    name: 'senha',
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite sua senha',
    required: true
  },
  {
    name: 'confirmar_senha',
    label: 'Confirmar Senha',
    type: 'password',
    placeholder: 'Confirme sua senha',
    required: true
  }
])

const handleFormSubmit = async (formData) => {
  const sucesso = await authStore.register(formData.nome, formData.email, formData.senha)
  if (sucesso) {
    router.push('/login')
  } else {
    alert('Falha no cadastro. Verifique suas informações.')
    console.error('Erro no cadastro:', authStore.erro)
  }
}
</script>

<style>
@import '../assets/css/Login.css';
</style>