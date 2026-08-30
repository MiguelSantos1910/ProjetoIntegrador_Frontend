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
import Form from '../components/Form.vue'

const formFields = ref([
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
  }
])

const handleFormSubmit = (formData) => {
  console.log('Formulário enviado:', formData)
}
</script>

<style>
@import '../assets/css/Login.css';
</style>