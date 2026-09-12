import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Ativos from '../views/Ativos.vue'
import CadastroAtivo from '../views/CadastroAtivos.vue'
import ManutencaoAtivo from '../views/Manutencao.vue'
import Login from '../views/Login.vue'
import CadastroUsuario from '../views/CadastroUsuario.vue'
import DetalheAtivo from '../views/DetalheAtivo.vue'
import Relatorios from '../views/Relatorios.vue'
import Categorias from '../views/Categorias.vue'
import Configuracoes from "../views/Configuracoes.vue"
import NovaCategoria from '../views/NovaCategoria.vue'

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
    path: '/ativos/detalhe',
    name: 'detalhe',
    component: DetalheAtivo
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: Relatorios
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: Categorias
  },
  {
    path: '/categorias/nova',
    name: 'nova-categoria',
    component: NovaCategoria
  },
  {
    path: '/manutencao',
    name: 'manutencao-ativo',
    component: ManutencaoAtivo
  },
  {
    path: '/configuracoes',
    name: 'configuracoes',
    component: Configuracoes
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router