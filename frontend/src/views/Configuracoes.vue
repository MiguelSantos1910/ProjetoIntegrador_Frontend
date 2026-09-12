<template>
  <div class="configuracoes">
    <!-- Cabeçalho -->
    <header class="configuracoes-header">
      <div class="configuracoes-title-area">
        <span class="breadcrumb">
          Sistema
        </span>

        <h1>
          Configurações
        </h1>

        <p>
          Gerencie seu perfil, preferências, sistema e segurança.
        </p>
      </div>

      <div class="configuracoes-header-action">
        <button
          type="button"
          class="btn-save-header"
          @click="handleSave"
        >
          <Save
            :size="15"
            :stroke-width="2"
          />

          Salvar alterações
        </button>
      </div>
    </header>


    <!-- Conteúdo -->
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
            <h2>
              Perfil
            </h2>

            <span>
              Informações do usuário responsável pela conta.
            </span>
          </div>
        </div>

        <div class="config-grid">
          <div class="config-field">
            <label for="nome">
              Nome
            </label>

            <input
              id="nome"
              v-model="formData.nome"
              type="text"
              placeholder="Digite seu nome"
            >
          </div>


          <div class="config-field">
            <label for="email">
              E-mail
            </label>

            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Digite seu e-mail"
            >
          </div>


          <div class="config-field">
            <label for="funcao">
              Função
            </label>

            <input
              id="funcao"
              v-model="formData.funcao"
              type="text"
              placeholder="Digite sua função"
            >
          </div>


          <div class="config-field">
            <label for="telefone">
              Telefone
            </label>

            <input
              id="telefone"
              v-model="formData.telefone"
              type="text"
              placeholder="Digite seu telefone"
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
            <h2>
              Preferências
            </h2>

            <span>
              Controle como o sistema envia notificações e alertas.
            </span>
          </div>
        </div>

        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <strong>
                Receber notificações
              </strong>

              <span>
                Receba notificações importantes do sistema.
              </span>
            </div>

            <label class="switch">
              <input
                v-model="formData.notificacoes"
                type="checkbox"
              >

              <span class="slider" />
            </label>
          </div>


          <div class="setting-item">
            <div class="setting-info">
              <strong>
                Alertas de manutenção
              </strong>

              <span>
                Receba alertas sobre ativos que precisam de manutenção.
              </span>
            </div>

            <label class="switch">
              <input
                v-model="formData.alertasManutencao"
                type="checkbox"
              >

              <span class="slider" />
            </label>
          </div>


          <div class="setting-item">
            <div class="setting-info">
              <strong>
                Atualizações do sistema
              </strong>

              <span>
                Receba informações sobre atualizações e novidades.
              </span>
            </div>

            <label class="switch">
              <input
                v-model="formData.atualizacoes"
                type="checkbox"
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
            <h2>
              Sistema
            </h2>

            <span>
              Defina as configurações gerais utilizadas pelo Easy Asset.
            </span>
          </div>
        </div>

        <div class="config-grid">
          <div class="config-field">
            <label for="empresa">
              Nome da Empresa
            </label>

            <input
              id="empresa"
              v-model="formData.empresa"
              type="text"
              placeholder="Digite o nome da empresa"
            >
          </div>


          <div class="config-field">
            <label for="moeda">
              Moeda
            </label>

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
            <label for="formatoData">
              Formato de Data
            </label>

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
            <label for="fusoHorario">
              Fuso Horário
            </label>

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
            <h2>
              Segurança
            </h2>

            <span>
              Gerencie as opções de segurança da sua conta.
            </span>
          </div>
        </div>

        <div class="security-actions">
          <div class="security-item">
            <div>
              <strong>
                Alterar senha
              </strong>

              <span>
                Atualize sua senha de acesso ao sistema.
              </span>
            </div>

            <button
              type="button"
              class="secondary-button"
              @click="handleChangePassword"
            >
              Alterar senha
            </button>
          </div>


          <div class="security-item">
            <div>
              <strong>
                Encerrar outras sessões
              </strong>

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


      <!-- Ações -->
      <div class="config-actions">
        <button
          type="button"
          class="btn-cancel"
          @click="handleCancel"
        >
          Cancelar
        </button>

        <button
          type="button"
          class="btn-save"
          @click="handleSave"
        >
          <Save
            :size="15"
            :stroke-width="2"
          />

          Salvar alterações
        </button>
      </div>
    </main>
  </div>
</template>


<script setup>
import { reactive } from 'vue'

import {
  User,
  Bell,
  Settings,
  ShieldCheck,
  Save
} from 'lucide-vue-next'

import '../assets/css/Configuracoes.css'


const formData = reactive({
  nome: 'Usuário',
  email: 'usuario@empresa.com',
  funcao: 'Administrador',
  telefone: '',

  notificacoes: true,
  alertasManutencao: true,
  atualizacoes: false,

  empresa: 'Easy Asset',
  moeda: 'BRL',
  formatoData: 'dd/mm/yyyy',
  fusoHorario: 'america_sao_paulo'
})


const handleSave = () => {
  console.log('Configurações salvas:', formData)
}


const handleCancel = () => {
  console.log('Cancelando alterações')
}


const handleChangePassword = () => {
  console.log('Alterar senha')
}


const handleLogoutOtherSessions = () => {
  console.log('Encerrar outras sessões')
}
</script>