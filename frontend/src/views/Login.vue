<template>
  <div class="login-view">
    <Form
      title="Login"
      :fields="formFields"
      submit-button-text="Entrar"
      @submit="handleFormSubmit"
    />

    <router-link
      to="/cadastro"
      class="register-link"
    >
      Não tem uma conta? Cadastre-se
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Form from '../components/Form.vue'

const router = useRouter()
const authStore = useAuthStore()
const formFields = ref([
 /*{
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Digite seu email',
    required: true
  },
  */
  {
    name:'username',
    label: 'Nome de usuário',
    type: 'text',
    placeholder: 'Digite seu nome de usuário',
    required: true
  },
  {
    name: 'senha',
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite sua senha',
    required: true
  }
])
const handleFormSubmit = async (formData) => {
  const sucesso = await authStore.login(formData.username, formData.senha)
  if (sucesso) {
    router.push('/dashboard')
  } else {
    alert('Falha no login. Verifique suas credenciais.')
    console.error('Erro no login:', authStore.erro)   
}
}
</script>

<style>
@import '../assets/css/Login.css';
</style>