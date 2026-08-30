import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Ativos from '../views/Ativos.vue'
import CadastroAtivo from '../views/CadastroAtivos.vue'
import ManutencaoAtivo from '../views/Manutencao.vue'
import Login from '../views/Login.vue'
import CadastroUsuario from '../views/CadastroUsuario.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/cadastro',
    name: 'cadastro-usuario',
    component: CadastroUsuario
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/ativos',
    name: 'ativos',
    component: Ativos
  },
  {
    path: '/ativos/novo',
    name: 'novo-ativo',
    component: CadastroAtivo
  },
  {
    path: '/manutencao',
    name: 'manutencao-ativo',
    component: ManutencaoAtivo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router