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
import Configuracoes from '../views/Configuracoes.vue'
import NovaCategoria from '../views/NovaCategoria.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },

  {
    path: '/cadastro',
    name: 'cadastro-usuario',
    component: CadastroUsuario,
    meta: {
      requiresAuth: false
    }
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/ativos',
    name: 'ativos',
    component: Ativos,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/ativos/novo',
    name: 'novo-ativo',
    component: CadastroAtivo,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/ativos/detalhe',
    name: 'detalhe',
    component: DetalheAtivo,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/relatorios',
    name: 'relatorios',
    component: Relatorios,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/categorias',
    name: 'categorias',
    component: Categorias,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/categorias/nova',
    name: 'nova-categoria',
    component: NovaCategoria,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/manutencao',
    name: 'manutencao-ativo',
    component: ManutencaoAtivo,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/configuracoes',
    name: 'configuracoes',
    component: Configuracoes,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('access_token')

  // Página protegida sem login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  // Usuário já logado tentando acessar login/cadastro
  if (
    (to.name === 'login' || to.name === 'cadastro-usuario') &&
    isAuthenticated
  ) {
    return '/dashboard'
  }

  // Permite a navegação
  return true
})

export default router