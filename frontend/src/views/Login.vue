<template>
  <div class="login-view">
    <img
      class="auth-logo"
      src="../assets/easy-asset-logo-verde.svg"
      alt="Easy Asset - Gestão de Ativos"
    />

    <Form
      title="Login"
      :fields="formFields"
      :submit-button-text="authStore.carregando
        ? 'Autenticando...'
        : tempoRestante > 0
          ? 'Aguarde...'
          : 'Entrar'"
      :submit-disabled="tempoRestante > 0 || authStore.carregando"
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

        <!-- Contador de bloqueio -->
        <div
          v-if="tempoRestante > 0"
          class="login-countdown"
        >
          <span>Tempo restante para liberar o acesso:</span>

          <strong class="countdown-time">
            {{ tempoFormatado }}
          </strong>

          <span class="countdown-help">
            Aguarde o término da contagem para tentar novamente.
          </span>
        </div>

        <!-- Orientação para credenciais incorretas -->
        <p
          v-else-if="statusErroExibido === 401"
          class="login-error-help"
        >
          Confira seu nome de usuário e sua senha. Verifique também
          se a tecla Caps Lock está ativada.
        </p>

        <!-- Orientação para problemas de conexão -->
        <p
          v-else-if="statusErroExibido === null"
          class="login-error-help"
        >
          Verifique sua conexão com a internet e tente novamente.
        </p>
      </div>
    </div>

    <router-link
      to="/cadastro"
      class="register-link"
    >
      Não tem uma conta? Cadastre-se
    </router-link>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted
} from 'vue'

import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Form from '../components/Form.vue'

const router = useRouter()
const authStore = useAuthStore()

// ========================================
// CONFIGURAÇÕES
// ========================================

const CHAVE_BLOQUEIO = 'easy_asset_login_bloqueio'

const DURACAO_BLOQUEIO = 3 * 60

// ========================================
// ESTADOS
// ========================================

const mensagemErro = ref('')
const tituloErro = ref('Não foi possível entrar')

const statusErroExibido = ref(null)

const tempoRestante = ref(0)

let intervaloContagem = null

// ========================================
// CAMPOS DO FORMULÁRIO
// ========================================

const formFields = ref([
  {
    name: 'username',
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

// ========================================
// FORMATAÇÃO DO TEMPO
// ========================================

const tempoFormatado = computed(() => {
  const minutos = Math.floor(tempoRestante.value / 60)

  const segundos = tempoRestante.value % 60

  return (
    String(minutos).padStart(2, '0') +
    ':' +
    String(segundos).padStart(2, '0')
  )
})

// ========================================
// CONTROLE DO BLOQUEIO LOCAL
// ========================================

function obterHorarioFinal() {
  const horario = Number(
    localStorage.getItem(CHAVE_BLOQUEIO)
  )

  return Number.isFinite(horario) ? horario : 0
}

function pararContagem() {
  if (intervaloContagem !== null) {
    clearInterval(intervaloContagem)
    intervaloContagem = null
  }
}

function iniciarIntervaloContagem() {
  pararContagem()

  intervaloContagem = setInterval(() => {
    atualizarContagem()
  }, 1000)
}

function atualizarContagem() {
  const horarioFinal = obterHorarioFinal()

  if (!horarioFinal) {
    tempoRestante.value = 0
    return
  }

  const restante = Math.ceil(
    (horarioFinal - Date.now()) / 1000
  )

  tempoRestante.value = Math.max(0, restante)

  if (tempoRestante.value <= 0) {
    localStorage.removeItem(CHAVE_BLOQUEIO)

    pararContagem()

    tituloErro.value = 'Bloqueio encerrado'

    mensagemErro.value =
      'O período de bloqueio terminou. Você já pode tentar entrar novamente.'
  }
}

// ========================================
// INICIAR BLOQUEIO
// ========================================

function iniciarContagem(segundos) {
  const valor = Number(segundos)

  const duracao = Number.isFinite(valor) && valor > 0
    ? Math.ceil(valor)
    : DURACAO_BLOQUEIO

  const horarioFinal = Date.now() + duracao * 1000

  localStorage.setItem(
    CHAVE_BLOQUEIO,
    String(horarioFinal)
  )

  tituloErro.value = 'Acesso temporariamente bloqueado'

  mensagemErro.value =
    'Por segurança, o acesso foi bloqueado após várias tentativas de login sem sucesso.'

  atualizarContagem()

  iniciarIntervaloContagem()
}

// ========================================
// RECUPERAR BLOQUEIO AO ABRIR A TELA
// ========================================

onMounted(() => {
  atualizarContagem()

  if (tempoRestante.value > 0) {
    tituloErro.value = 'Acesso temporariamente bloqueado'

    mensagemErro.value =
      'Por segurança, o acesso foi bloqueado após várias tentativas de login sem sucesso.'

    iniciarIntervaloContagem()
  }
})

// ========================================
// IDENTIFICAÇÃO DO ERRO
// ========================================

function obterStatusErro(erro) {
  return (
    erro?.response?.status ??
    erro?.status ??
    authStore.statusErro ??
    null
  )
}

// ========================================
// OBTER TEMPO INFORMADO PELO BACKEND
// ========================================

function obterTempoBloqueio(erro) {
  const headers = erro?.response?.headers || {}

  const dados =
    erro?.data ||
    erro?.response?.data ||
    {}

  const retryHeader =
    (typeof headers.get === 'function'
      ? headers.get('retry-after')
      : null) ||
    headers['retry-after'] ||
    headers['Retry-After'] ||
    null

  const retryBody =
    dados.retry_after ??
    dados.wait ??
    dados.retryAfter ??
    erro?.retryAfter ??
    authStore.retryAfter

  const valor = retryHeader ?? retryBody

  if (valor === null || valor === undefined) {
    return 0
  }

  const segundos = Number(valor)

  if (Number.isFinite(segundos) && segundos > 0) {
    return Math.ceil(segundos)
  }

  // Compatibilidade com Retry-After em formato de data HTTP.
  const dataBloqueio = Date.parse(String(valor))

  if (!Number.isNaN(dataBloqueio)) {
    return Math.max(
      1,
      Math.ceil((dataBloqueio - Date.now()) / 1000)
    )
  }

  return 0
}

// ========================================
// MENSAGENS PERSONALIZADAS
// ========================================

function apresentarErro(status) {
  statusErroExibido.value = status

  switch (status) {

    // Credenciais incorretas.
    case 401:
      tituloErro.value = 'Credenciais incorretas'

      mensagemErro.value =
        'O nome de usuário ou a senha não conferem. Verifique seus dados e tente novamente.'

      break

    // Muitas tentativas de login.
    case 429:
      tituloErro.value = 'Acesso temporariamente bloqueado'

      mensagemErro.value =
        'Identificamos várias tentativas de login sem sucesso. Por segurança, seu acesso foi bloqueado temporariamente.'

      break

    // Dados inválidos.
    case 400:
      tituloErro.value = 'Dados não reconhecidos'

      mensagemErro.value =
        'Não foi possível validar os dados informados. Confira o preenchimento dos campos e tente novamente.'

      break

    // Sem permissão.
    case 403:
      tituloErro.value = 'Acesso não autorizado'

      mensagemErro.value =
        'Sua conta não possui permissão para acessar este recurso. Entre em contato com o responsável pelo sistema.'

      break

    // Erros internos do servidor.
    case 500:
    case 502:
    case 503:
    case 504:
      tituloErro.value = 'Serviço temporariamente indisponível'

      mensagemErro.value =
        'Ocorreu um problema na comunicação com o servidor. Tente novamente em alguns instantes.'

      break

    // Problemas de conexão.
    case null:
      tituloErro.value = 'Falha na conexão'

      mensagemErro.value =
        'Não foi possível conectar ao Easy Asset.'

      break

    // Outros erros.
    default:
      tituloErro.value = 'Não foi possível realizar o login'

      mensagemErro.value =
        'Ocorreu um problema durante a autenticação. Tente novamente.'
  }
}

// ========================================
// AUTENTICAÇÃO
// ========================================

async function handleFormSubmit(formData) {
  atualizarContagem()

  if (tempoRestante.value > 0 || authStore.carregando) {
    return
  }

  mensagemErro.value = ''
  tituloErro.value = 'Não foi possível entrar'
  statusErroExibido.value = null

  try {
    const sucesso = await authStore.login(
      formData.username,
      formData.senha
    )

    if (sucesso) {
      pararContagem()

      localStorage.removeItem(CHAVE_BLOQUEIO)

      mensagemErro.value = ''

      router.replace('/dashboard')

      return
    }

    const erro = authStore.erro

    const statusHttp = obterStatusErro(erro)

    // Bloqueio de acesso.
    if (statusHttp === 429) {
      const segundos = obterTempoBloqueio(erro)

      apresentarErro(429)

      iniciarContagem(
        segundos || DURACAO_BLOQUEIO
      )

      return
    }

    // Demais erros.
    apresentarErro(statusHttp)

    console.error(
      'Falha na autenticação:',
      erro
    )

  } catch (erro) {
    const statusHttp = obterStatusErro(erro)

    if (statusHttp === 429) {
      const segundos = obterTempoBloqueio(erro)

      apresentarErro(429)

      iniciarContagem(
        segundos || DURACAO_BLOQUEIO
      )

      return
    }

    apresentarErro(statusHttp)

    console.error(
      'Erro inesperado no login:',
      erro
    )
  }
}

// ========================================
// LIMPEZA
// ========================================

onUnmounted(() => {
  pararContagem()
})
</script>

<style>
@import '../assets/css/Login.css';
</style>