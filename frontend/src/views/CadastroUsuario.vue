<template>
  <div class="auth-view">
    <img
      class="auth-logo"
      src="../assets/easy-asset-logo-verde.svg"
      alt="Easy Asset - Gestão de Ativos"
    />

    <Form
      title="Cadastro de Usuário"
      :fields="formFields"
      :submit-button-text="carregando ? 'Cadastrando...' : 'Cadastrar'"
      :submit-disabled="carregando || cadastroConcluido"
      @submit="handleFormSubmit"
    />

    <!-- Mensagem de erro -->
    <div
      v-if="mensagemErro"
      class="login-error"
      role="alert"
      aria-live="assertive"
    >
      <div class="login-error-content">
        <strong class="login-error-title">
          {{ tituloErro }}
        </strong>

        <p class="login-error-description">
          {{ mensagemErro }}
        </p>

        <ul
          v-if="detalhesErro.length"
          class="register-error-details"
        >
          <li
            v-for="(detalhe, index) in detalhesErro"
            :key="index"
          >
            {{ detalhe }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Mensagem de sucesso -->
    <div
      v-if="mensagemSucesso"
      class="register-success"
      role="status"
      aria-live="polite"
    >
      <div class="register-success-content">
        <strong class="register-success-title">
          Cadastro realizado!
        </strong>

        <p class="register-success-description">
          {{ mensagemSucesso }}
        </p>
      </div>
    </div>

    <router-link
      to="/"
      class="register-link"
    >
      Já tem uma conta? Faça login
    </router-link>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import Form from '../components/Form.vue'
import { useUsuariosStore } from '../stores/usuarios.js'

const router = useRouter()
const userStore = useUsuariosStore()

// ========================================
// ESTADOS
// ========================================

const carregando = ref(false)
const cadastroConcluido = ref(false)

const mensagemErro = ref('')
const tituloErro = ref('Não foi possível realizar o cadastro')

const detalhesErro = ref([])

const mensagemSucesso = ref('')

let temporizadorRedirecionamento = null

// ========================================
// CAMPOS DO FORMULÁRIO
// ========================================

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
    placeholder: 'Digite seu sobrenome',
    required: true
  },
  {
    name: 'username',
    label: 'Nome de usuário',
    type: 'text',
    placeholder: 'Escolha um nome de usuário',
    required: true
  },
  {
    name: 'email',
    label: 'E-mail',
    type: 'email',
    placeholder: 'Digite seu endereço de e-mail',
    required: true
  },
  {
    name: 'senha',
    label: 'Senha',
    type: 'password',
    placeholder: 'Crie uma senha segura',
    required: true
  },
  {
    name: 'confirmar_senha',
    label: 'Confirmar senha',
    type: 'password',
    placeholder: 'Digite novamente sua senha',
    required: true
  }
])

// ========================================
// NOMES DOS CAMPOS
// ========================================

const nomesCampos = {
  nome: 'Nome',
  first_name: 'Nome',

  sobrenome: 'Sobrenome',
  last_name: 'Sobrenome',

  username: 'Nome de usuário',

  email: 'E-mail',

  senha: 'Senha',
  password: 'Senha',

  confirmar_senha: 'Confirmação de senha',

  papel: 'Perfil de acesso'
}

// ========================================
// TRADUÇÃO DE MENSAGENS DO BACKEND
// ========================================

function traduzirMensagem(mensagem, campo = '') {
  const texto = String(mensagem).trim()
  const normalizado = texto.toLowerCase()

  const nomeCampo = nomesCampos[campo] || 'Campo'

  // Nome de usuário já cadastrado.
  if (
    normalizado.includes('username') &&
    (
      normalizado.includes('already exists') ||
      normalizado.includes('já existe') ||
      normalizado.includes('already been taken')
    )
  ) {
    return 'Este nome de usuário já está em uso. Escolha outro.'
  }

  // E-mail já cadastrado.
  if (
    normalizado.includes('email') &&
    (
      normalizado.includes('already exists') ||
      normalizado.includes('já existe') ||
      normalizado.includes('already been taken')
    )
  ) {
    return 'Este endereço de e-mail já está cadastrado.'
  }

  // Campo obrigatório.
  if (
    normalizado.includes('this field is required') ||
    normalizado.includes('este campo é obrigatório')
  ) {
    return `O campo ${nomeCampo.toLowerCase()} é obrigatório.`
  }

  // E-mail inválido.
  if (
    normalizado.includes('enter a valid email') ||
    normalizado.includes('valid email address')
  ) {
    return 'Digite um endereço de e-mail válido.'
  }

  // Senha curta.
  if (
    normalizado.includes('password is too short') ||
    normalizado.includes('senha é muito curta')
  ) {
    return 'A senha informada é muito curta. Utilize mais caracteres.'
  }

  // Senha semelhante aos dados do usuário.
  if (
    normalizado.includes('too similar') ||
    normalizado.includes('muito semelhante')
  ) {
    return 'A senha não deve ser muito semelhante ao seu nome ou nome de usuário.'
  }

  // Senha comum.
  if (
    normalizado.includes('too common') ||
    normalizado.includes('muito comum')
  ) {
    return 'Escolha uma senha menos comum e mais difícil de adivinhar.'
  }

  // Senha exclusivamente numérica.
  if (
    normalizado.includes('entirely numeric') ||
    normalizado.includes('inteiramente numérica')
  ) {
    return 'Sua senha não pode conter somente números.'
  }

  // Quantidade mínima de caracteres.
  const minimo = normalizado.match(
    /at least (\d+) characters?/
  )

  if (minimo) {
    return `A senha precisa possuir pelo menos ${minimo[1]} caracteres.`
  }

  return texto
}

// ========================================
// EXTRAIR MENSAGENS DA API
// ========================================

function achatarMensagens(valor) {
  if (Array.isArray(valor)) {
    return valor.flatMap(item => achatarMensagens(item))
  }

  if (typeof valor === 'string') {
    return [valor]
  }

  if (valor && typeof valor === 'object') {
    return Object.values(valor).flatMap(
      item => achatarMensagens(item)
    )
  }

  return []
}

function formatarErro(erro) {
  if (!erro) {
    return {
      titulo: 'Não foi possível realizar o cadastro',
      mensagem: 'Ocorreu um problema durante o cadastro.',
      detalhes: []
    }
  }

  const dados =
    erro.response?.data ??
    erro.data ??
    erro

  const statusHttp =
    erro.response?.status ??
    erro.status ??
    null

  const detalhes = []

  let mensagemGeral = ''

  // A API pode retornar uma mensagem diretamente.
  if (typeof dados === 'string') {
    mensagemGeral = traduzirMensagem(dados)
  }

  // A API pode retornar erros separados por campo.
  else if (dados && typeof dados === 'object') {
    Object.entries(dados).forEach(([campo, valor]) => {

      // Mensagens gerais.
      if (
        ['detail', 'message', 'non_field_errors', 'error'].includes(campo)
      ) {
        const mensagens = achatarMensagens(valor)

        if (mensagens.length && !mensagemGeral) {
          mensagemGeral = mensagens
            .map(item => traduzirMensagem(item))
            .join(' ')
        }

        return
      }

      // Mensagens específicas dos campos.
      const nomeCampo = nomesCampos[campo] || campo

      const mensagens = achatarMensagens(valor)

      mensagens.forEach(mensagem => {
        detalhes.push(
          traduzirMensagem(mensagem, campo)
        )
      })
    })
  }

  // Mensagem genérica de acordo com o status HTTP.
  let titulo = 'Não foi possível realizar o cadastro'

  let mensagem = mensagemGeral

  if (detalhes.length > 0) {
    titulo = 'Confira os dados informados'

    mensagem =
      'Algumas informações precisam ser corrigidas antes de continuar.'
  }

  else if (statusHttp === 400) {
    titulo = 'Dados inválidos'

    mensagem =
      mensagemGeral ||
      'Verifique as informações preenchidas e tente novamente.'
  }

  else if (statusHttp === 403) {
    titulo = 'Cadastro não autorizado'

    mensagem =
      mensagemGeral ||
      'Você não possui permissão para realizar este cadastro.'
  }

  else if (statusHttp === 409) {
    titulo = 'Cadastro já existente'

    mensagem =
      mensagemGeral ||
      'Algumas informações já estão sendo utilizadas por outra conta.'
  }

  else if (statusHttp === 429) {
    titulo = 'Muitas solicitações'

    mensagem =
      'Aguarde um pouco antes de tentar realizar outro cadastro.'
  }

  else if (statusHttp >= 500) {
    titulo = 'Problema no servidor'

    mensagem =
      'Não foi possível concluir seu cadastro neste momento. Tente novamente mais tarde.'
  }

  else if (!erro.response && statusHttp === null) {
    titulo = 'Falha na conexão'

    mensagem =
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
  }

  else if (!mensagem) {
    mensagem =
      erro.message ||
      'Ocorreu um problema durante o cadastro.'
  }

  // Evita apresentar mensagens duplicadas.
  return {
    titulo,
    mensagem,
    detalhes: [...new Set(detalhes)]
  }
}

// ========================================
// EXIBIR ERRO
// ========================================

function exibirErro(erro) {
  const resultado = formatarErro(erro)

  tituloErro.value = resultado.titulo

  mensagemErro.value = resultado.mensagem

  detalhesErro.value = resultado.detalhes
}

// ========================================
// VALIDAÇÃO DOS DADOS
// ========================================

function validarFormulario(formData) {
  if (
    !formData.nome?.trim() ||
    !formData.sobrenome?.trim() ||
    !formData.username?.trim() ||
    !formData.email?.trim() ||
    !formData.senha ||
    !formData.confirmar_senha
  ) {
    return {
      titulo: 'Campos obrigatórios',
      mensagem: 'Preencha todos os campos para continuar.',
      detalhes: []
    }
  }

  if (formData.nome.trim().length > 150) {
    return {
      titulo: 'Nome muito longo',
      mensagem: 'O nome informado ultrapassa o limite permitido.',
      detalhes: ['Utilize no máximo 150 caracteres.']
    }
  }

  if (formData.sobrenome.trim().length > 150) {
    return {
      titulo: 'Sobrenome muito longo',
      mensagem: 'O sobrenome informado ultrapassa o limite permitido.',
      detalhes: ['Utilize no máximo 150 caracteres.']
    }
  }

  if (formData.username.trim().length > 150) {
    return {
      titulo: 'Nome de usuário muito longo',
      mensagem: 'O nome de usuário ultrapassa o limite permitido.',
      detalhes: ['Utilize no máximo 150 caracteres.']
    }
  }

  if (formData.senha !== formData.confirmar_senha) {
    return {
      titulo: 'Senhas diferentes',
      mensagem: 'Os campos de senha não correspondem.',
      detalhes: ['Digite a mesma senha nos dois campos.']
    }
  }

  if (formData.senha.length < 8) {
    return {
      titulo: 'Senha muito curta',
      mensagem: 'Sua senha precisa possuir pelo menos 8 caracteres.',
      detalhes: []
    }
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailValido.test(formData.email.trim())) {
    return {
      titulo: 'E-mail inválido',
      mensagem: 'O endereço de e-mail informado não parece válido.',
      detalhes: ['Confira o endereço e tente novamente.']
    }
  }

  return null
}

// ========================================
// CADASTRO DE USUÁRIO
// ========================================

async function handleFormSubmit(formData) {
  if (carregando.value || cadastroConcluido.value) {
    return
  }

  mensagemErro.value = ''
  tituloErro.value = 'Não foi possível realizar o cadastro'
  detalhesErro.value = []
  mensagemSucesso.value = ''

  // Validação local.
  const erroValidacao = validarFormulario(formData)

  if (erroValidacao) {
    tituloErro.value = erroValidacao.titulo
    mensagemErro.value = erroValidacao.mensagem
    detalhesErro.value = erroValidacao.detalhes

    return
  }

  carregando.value = true

  const dados = {
    username: formData.username.trim(),
    first_name: formData.nome.trim(),
    last_name: formData.sobrenome.trim(),
    email: formData.email.trim(),
    password: formData.senha,
    papel: 'ALUNO'
  }

  try {
    const sucesso = await userStore.registerUsuario(dados)

    if (!sucesso) {
      exibirErro(userStore.erro)
      return
    }

    cadastroConcluido.value = true

    mensagemSucesso.value =
      'Sua conta foi criada com sucesso. Você será redirecionado para a tela de login em instantes.'

    temporizadorRedirecionamento = setTimeout(() => {
      router.replace('/login')
    }, 2000)

  } catch (erro) {
    console.error(
      'Erro no cadastro:',
      erro.response?.data || erro
    )

    exibirErro(erro)

  } finally {
    carregando.value = false
  }
}

// ========================================
// LIMPEZA
// ========================================

onUnmounted(() => {
  if (temporizadorRedirecionamento) {
    clearTimeout(temporizadorRedirecionamento)
    temporizadorRedirecionamento = null
  }
})
</script>

<style>
@import '../assets/css/Login.css';
</style>
