<template>
  <div class="configuracoes">
    <!-- Cabeçalho -->
    <header class="configuracoes-header">
      <div class="configuracoes-title-area">
        <span class="breadcrumb">Sistema</span>
        <h1>Configurações</h1>
        <p>Gerencie seu perfil, preferências, sistema e segurança.</p>
      </div>

      <div class="configuracoes-header-action">
        <button
          type="button"
          class="btn-save-header"
          :disabled="salvando"
          @click="handleSave"
        >
          <Save
            :size="15"
            :stroke-width="2"
          />
          {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </div>
    </header>

    <!-- Feedback -->
    <div
      v-if="mensagemStatus"
      class="config-feedback"
      :class="tipoMensagem"
      role="status"
      aria-live="polite"
    >
      {{ mensagemStatus }}
    </div>

    <main class="configuracoes-content">
      <!-- Perfil -->
      <section class="config-card">
        <div class="config-card-header">
          <div class="config-card-icon">
            <User
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div>
            <h2>Perfil</h2>
            <span>Informações do usuário responsável pela conta.</span>
          </div>
        </div>

        <div class="config-grid">
          <div class="config-field">
            <label for="nome">Nome</label>
            <input
              id="nome"
              v-model="formData.nome"
              type="text"
              autocomplete="name"
              placeholder="Digite seu nome"
              maxlength="150"
            >
          </div>

          <div class="config-field">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              autocomplete="email"
              placeholder="Digite seu e-mail"
              maxlength="254"
            >
          </div>

          <div class="config-field">
            <label for="funcao">Função</label>
            <input
              id="funcao"
              v-model="formData.funcao"
              type="text"
              placeholder="Função do usuário"
              readonly
            >
          </div>

          <div class="config-field">
            <label for="telefone">Telefone</label>
            <input
              id="telefone"
              v-model="formData.telefone"
              type="tel"
              autocomplete="tel"
              placeholder="Digite seu telefone"
              maxlength="30"
            >
          </div>
        </div>
      </section>

      <!-- Preferências -->
      <section class="config-card">
        <div class="config-card-header">
          <div class="config-card-icon">
            <Bell
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div>
            <h2>Preferências</h2>
            <span>
              Controle como o sistema envia notificações e alertas.
            </span>
          </div>
        </div>

        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <strong>Receber notificações</strong>
              <span>
                Receba notificações importantes do sistema.
              </span>
            </div>

            <label class="switch">
              <input
                v-model="formData.notificacoes"
                type="checkbox"
                aria-label="Receber notificações"
              >
              <span class="slider" />
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <strong>Alertas de manutenção</strong>
              <span>
                Receba alertas sobre ativos que precisam de manutenção.
              </span>
            </div>

            <label class="switch">
              <input
                v-model="formData.alertasManutencao"
                type="checkbox"
                aria-label="Alertas de manutenção"
              >
              <span class="slider" />
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <strong>Atualizações do sistema</strong>
              <span>
                Receba informações sobre atualizações e novidades.
              </span>
            </div>

            <label class="switch">
              <input
                v-model="formData.atualizacoes"
                type="checkbox"
                aria-label="Atualizações do sistema"
              >
              <span class="slider" />
            </label>
          </div>
        </div>
      </section>

      <!-- Sistema -->
      <section class="config-card">
        <div class="config-card-header">
          <div class="config-card-icon">
            <Settings
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div>
            <h2>Sistema</h2>
            <span>
              Defina as configurações gerais utilizadas pelo Easy Asset.
            </span>
          </div>
        </div>

        <div class="config-grid">
          <div class="config-field">
            <label for="empresa">Nome da Empresa</label>
            <input
              id="empresa"
              v-model="formData.empresa"
              type="text"
              placeholder="Digite o nome da empresa"
              maxlength="150"
            >
          </div>

          <div class="config-field">
            <label for="moeda">Moeda</label>
            <select
              id="moeda"
              v-model="formData.moeda"
            >
              <option value="BRL">
                Real Brasileiro (R$)
              </option>
              <option value="USD">
                Dólar Americano (US$)
              </option>
              <option value="EUR">
                Euro (€)
              </option>
            </select>
          </div>

          <div class="config-field">
            <label for="formatoData">Formato de Data</label>
            <select
              id="formatoData"
              v-model="formData.formatoData"
            >
              <option value="dd/mm/yyyy">
                DD/MM/AAAA
              </option>
              <option value="yyyy-mm-dd">
                AAAA-MM-DD
              </option>
              <option value="mm/dd/yyyy">
                MM/DD/AAAA
              </option>
            </select>
          </div>

          <div class="config-field">
            <label for="fusoHorario">Fuso Horário</label>
            <select
              id="fusoHorario"
              v-model="formData.fusoHorario"
            >
              <option value="america_sao_paulo">
                Brasília (UTC-3)
              </option>
              <option value="utc">
                UTC
              </option>
            </select>
          </div>
        </div>
      </section>

      <!-- Segurança -->
      <section class="config-card">
        <div class="config-card-header">
          <div class="config-card-icon">
            <ShieldCheck
              :size="17"
              :stroke-width="1.8"
            />
          </div>

          <div>
            <h2>Segurança</h2>
            <span>
              Gerencie a senha e as opções de segurança da sua conta.
            </span>
          </div>
        </div>

        <!-- Alteração de senha -->
        <div class="password-section">
          <div class="password-section-header">
            <div>
              <strong>Alterar senha</strong>
              <span>
                Defina uma nova senha para acessar o sistema.
              </span>
            </div>

            <LockKeyhole :size="19" />
          </div>

          <form
            class="config-grid"
            @submit.prevent="handleChangePassword"
          >
            <div class="config-field">
              <label for="novaSenha">Nova senha</label>

              <div class="password-input-wrapper">
                <input
                  id="novaSenha"
                  v-model="novaSenha"
                  :type="mostrarSenha ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Digite a nova senha"
                  minlength="8"
                  required
                >

                <button
                  type="button"
                  class="password-toggle"
                  :aria-label="
                    mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                  "
                  @click="mostrarSenha = !mostrarSenha"
                >
                  <EyeOff
                    v-if="mostrarSenha"
                    :size="17"
                  />
                  <Eye
                    v-else
                    :size="17"
                  />
                </button>
              </div>
            </div>

            <div class="config-field">
              <label for="confirmarSenha">
                Confirmar nova senha
              </label>

              <div class="password-input-wrapper">
                <input
                  id="confirmarSenha"
                  v-model="confirmarSenha"
                  :type="mostrandoConfirmacao ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Digite novamente a senha"
                  minlength="8"
                  required
                >

                <button
                  type="button"
                  class="password-toggle"
                  :aria-label="
                    mostrandoConfirmacao
                      ? 'Ocultar confirmação da senha'
                      : 'Mostrar confirmação da senha'
                  "
                  @click="
                    mostrandoConfirmacao = !mostrandoConfirmacao
                  "
                >
                  <EyeOff
                    v-if="mostrandoConfirmacao"
                    :size="17"
                  />
                  <Eye
                    v-else
                    :size="17"
                  />
                </button>
              </div>
            </div>

            <div class="config-field password-action-field">
              <button
                type="submit"
                class="secondary-button password-submit"
                :disabled="alterandoSenha"
              >
                {{
                  alterandoSenha
                    ? 'Alterando senha...'
                    : 'Atualizar senha'
                }}
              </button>
            </div>
          </form>
        </div>

        <!-- Outras sessões -->
        <div class="security-actions">
          <div class="security-item">
            <div>
              <strong>Encerrar outras sessões</strong>
              <span>
                Encerre sessões abertas em outros dispositivos.
              </span>
            </div>

            <button
              type="button"
              class="secondary-button"
              @click="handleLogoutOtherSessions"
            >
              Encerrar sessões
            </button>
          </div>
        </div>
      </section>

      <!-- Ações finais -->
      <div class="config-actions">
        <button
          type="button"
          class="btn-cancel"
          :disabled="salvando"
          @click="handleCancel"
        >
          Cancelar
        </button>

        <button
          type="button"
          class="btn-save"
          :disabled="salvando"
          @click="handleSave"
        >
          <Save
            :size="15"
            :stroke-width="2"
          />
          {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'

import {
  User,
  Bell,
  Settings,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  LockKeyhole
} from 'lucide-vue-next'

import { useAuthStore } from '../stores/auth'
import { useUsuariosStore } from '../stores/usuarios'

import '../assets/css/Configuracoes.css'

const authStore = useAuthStore()
const usuariosStore = useUsuariosStore()

const STORAGE_KEY = 'easy_asset_configuracoes'

const salvando = ref(false)
const alterandoSenha = ref(false)

const mensagemStatus = ref('')
const tipoMensagem = ref('success')

const configuracoesOriginais = ref(null)

const novaSenha = ref('')
const confirmarSenha = ref('')

const mostrarSenha = ref(false)
const mostrandoConfirmacao = ref(false)

const formData = reactive({
  nome: '',
  email: '',
  funcao: '',
  telefone: '',

  notificacoes: true,
  alertasManutencao: true,
  atualizacoes: false,

  empresa: 'Easy Asset',
  moeda: 'BRL',
  formatoData: 'dd/mm/yyyy',
  fusoHorario: 'america_sao_paulo'
})

const formatarPapel = (papel) => {
  const papeis = {
    ALUNO: 'Aluno',
    PROFESSOR: 'Professor',
    SUPORTE: 'Suporte técnico'
  }

  return papeis[papel] || papel || ''
}

const mostrarMensagem = (mensagem, tipo = 'success') => {
  mensagemStatus.value = mensagem
  tipoMensagem.value = tipo
}

const carregarUsuario = () => {
  const usuario = authStore.usuario

  if (!usuario) return

  formData.nome = [
    usuario.first_name,
    usuario.last_name
  ].filter(Boolean).join(' ')

  formData.email = usuario.email || ''
  formData.funcao = formatarPapel(usuario.papel)
  formData.telefone = usuario.telefone || usuario.phone || ''
}

const carregarConfiguracoes = () => {
  try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY)

    if (!dadosSalvos) return

    const configuracoes = JSON.parse(dadosSalvos)

    // Aceita apenas valores válidos para cada preferência.
    Object.assign(formData, {
      notificacoes:
        typeof configuracoes.notificacoes === 'boolean'
          ? configuracoes.notificacoes
          : true,

      alertasManutencao:
        typeof configuracoes.alertasManutencao === 'boolean'
          ? configuracoes.alertasManutencao
          : true,

      atualizacoes:
        typeof configuracoes.atualizacoes === 'boolean'
          ? configuracoes.atualizacoes
          : false,

      empresa:
        typeof configuracoes.empresa === 'string'
          ? configuracoes.empresa
          : 'Easy Asset',

      moeda: ['BRL', 'USD', 'EUR'].includes(configuracoes.moeda)
        ? configuracoes.moeda
        : 'BRL',

      formatoData: [
        'dd/mm/yyyy',
        'yyyy-mm-dd',
        'mm/dd/yyyy'
      ].includes(configuracoes.formatoData)
        ? configuracoes.formatoData
        : 'dd/mm/yyyy',

      fusoHorario: [
        'america_sao_paulo',
        'utc'
      ].includes(configuracoes.fusoHorario)
        ? configuracoes.fusoHorario
        : 'america_sao_paulo'
    })
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)

    mostrarMensagem(
      'Não foi possível carregar as preferências salvas.',
      'error'
    )
  }
}

const obterSnapshot = () => {
  configuracoesOriginais.value = JSON.parse(
    JSON.stringify(formData)
  )
}

const restaurarSnapshot = () => {
  if (!configuracoesOriginais.value) return

  Object.assign(formData, configuracoesOriginais.value)
}

const obterPreferencias = () => ({
  notificacoes: formData.notificacoes,
  alertasManutencao: formData.alertasManutencao,
  atualizacoes: formData.atualizacoes,
  empresa: formData.empresa,
  moeda: formData.moeda,
  formatoData: formData.formatoData,
  fusoHorario: formData.fusoHorario
})

onMounted(async () => {
  try {
    if (!authStore.usuario) {
      await authStore.buscarUsuario()
    }

    carregarUsuario()
    carregarConfiguracoes()
    obterSnapshot()
  } catch (error) {
    console.error('Erro ao carregar os dados:', error)

    mostrarMensagem(
      'Não foi possível carregar os dados do usuário.',
      'error'
    )
  }
})

const handleSave = async () => {
  if (salvando.value) return

  const nomeCompleto = formData.nome.trim()
  const email = formData.email.trim()

  if (!nomeCompleto) {
    mostrarMensagem('Informe o nome do usuário.', 'error')
    return
  }

  if (!email) {
    mostrarMensagem('Informe o e-mail do usuário.', 'error')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarMensagem('Informe um e-mail válido.', 'error')
    return
  }

  const usuario = authStore.usuario

  if (!usuario?.id) {
    mostrarMensagem(
      'Não foi possível identificar o usuário autenticado.',
      'error'
    )
    return
  }

  // Separa o primeiro nome do restante do nome completo.
  const partesNome = nomeCompleto.split(/\s+/)
  const firstName = partesNome.shift() || ''
  const lastName = partesNome.join(' ')

  salvando.value = true

  try {
    const sucesso = await usuariosStore.updateUsuario(
      usuario.id,
      {
        first_name: firstName,
        last_name: lastName,
        email,
        telefone: formData.telefone.trim()
      }
    )

    if (!sucesso) {
      mostrarMensagem(
        usuariosStore.erro ||
          'Não foi possível atualizar o perfil.',
        'error'
      )
      return
    }

    // Persiste as preferências apenas neste navegador.
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(obterPreferencias())
      )
    } catch (error) {
      console.error('Erro ao salvar preferências:', error)

      // O perfil já foi atualizado pela API.
      // Não informamos que tudo foi salvo com sucesso.
      carregarUsuario()
      obterSnapshot()

      mostrarMensagem(
        'Perfil atualizado, mas não foi possível salvar as preferências no navegador.',
        'error'
      )
      return
    }

    // Atualiza a referência local do perfil com os dados enviados.
    // O backend continua sendo a fonte oficial dos dados do usuário.
    if (authStore.usuario) {
      authStore.usuario.first_name = firstName
      authStore.usuario.last_name = lastName
      authStore.usuario.email = email
      authStore.usuario.telefone = formData.telefone.trim()
    }

    formData.funcao = formatarPapel(authStore.usuario?.papel)

    obterSnapshot()

    mostrarMensagem('Perfil e preferências salvos com sucesso.')
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)

    mostrarMensagem(
      'Não foi possível salvar as alterações. Tente novamente.',
      'error'
    )
  } finally {
    salvando.value = false
  }
}

const handleCancel = () => {
  if (salvando.value) return

  restaurarSnapshot()

  novaSenha.value = ''
  confirmarSenha.value = ''

  mostrarSenha.value = false
  mostrandoConfirmacao.value = false

  mostrarMensagem('Alterações não salvas foram descartadas.')
}

const handleChangePassword = async () => {
  if (alterandoSenha.value) return

  if (!novaSenha.value) {
    mostrarMensagem('Digite a nova senha.', 'error')
    return
  }

  if (novaSenha.value.length < 8) {
    mostrarMensagem(
      'A nova senha deve ter pelo menos 8 caracteres.',
      'error'
    )
    return
  }

  if (!confirmarSenha.value) {
    mostrarMensagem('Confirme a nova senha.', 'error')
    return
  }

  if (novaSenha.value !== confirmarSenha.value) {
    mostrarMensagem('As senhas não coincidem.', 'error')
    return
  }

  const usuarioId = authStore.usuario?.id

  if (!usuarioId) {
    mostrarMensagem(
      'Não foi possível identificar o usuário autenticado.',
      'error'
    )
    return
  }

  alterandoSenha.value = true

  try {
    const sucesso = await usuariosStore.alterarSenha(
      usuarioId,
      novaSenha.value
    )

    if (!sucesso) {
      mostrarMensagem(
        usuariosStore.erro || 'Não foi possível alterar a senha.',
        'error'
      )
      return
    }

    novaSenha.value = ''
    confirmarSenha.value = ''

    mostrarSenha.value = false
    mostrandoConfirmacao.value = false

    mostrarMensagem('Senha alterada com sucesso.')
  } catch (error) {
    console.error('Erro ao alterar senha:', error)

    mostrarMensagem(
      'Ocorreu um erro ao alterar a senha.',
      'error'
    )
  } finally {
    alterandoSenha.value = false
  }
}

const handleLogoutOtherSessions = () => {
  mostrarMensagem(
    'O encerramento de outras sessões ainda precisa ser implementado na API de autenticação.',
    'error'
  )
}
</script>