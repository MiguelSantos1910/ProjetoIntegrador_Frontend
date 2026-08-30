<template>
  <div class="login-view">
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

const handleFormSubmit = (formData) => {
  console.log('Formulário enviado:', formData)
}
</script>

<style>
@import '../assets/css/Login.css';
</style>