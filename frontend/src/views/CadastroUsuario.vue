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
import { useRouter } from 'vue-router'
import { useUsuariosStore } from "../stores/usuarios.js"

const router = useRouter()
const userStore = useUsuariosStore()
const formFields = ref([
  {
    name: 'nome',
    label: 'Nome',
    type: 'text',
    placeholder: 'Digite seu nome',
    required: true
  },
  {
    name: 'sobrenome',
    label: 'Sobrenome',
    type: 'text',
    placeholder: 'Digíte seu sobrenome',
    required: true
  },
  {
    name: 'username',
    label: 'Nome de Usuário',
    type: 'text',
    placeholder: 'Digite seu nome de usuário',
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
  if (formData.senha !== formData.confirmar_senha) {
    alert('As senhas não coincidem.')
    return
  }

  const dados = {
    username: formData.username,
    first_name: formData.nome,
    last_name: formData.sobrenome,
    email: formData.email,
    password: formData.senha,
    papel: 'ALUNO'
  }

  const sucesso = await userStore.registerUsuario(dados)

  if (sucesso) {
    alert('Usuário cadastrado com sucesso.')
    router.push('/login')
  } else {
    alert(userStore.erro || 'Falha no cadastro. Verifique suas informações.')
    console.error('Erro no cadastro:', userStore.erro)
  }
}
</script>

<style>
@import '../assets/css/Login.css';
</style>