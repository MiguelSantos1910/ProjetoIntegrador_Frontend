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
import DetalheManutencao from '../views/DetalheManutencao.vue'
import EditarAtivo from '../views/EditarAtivo.vue'
import GerenciamentoPerfil from '../views/GerenciamentoPerfil.vue'

// Papéis existentes no backend
const PROFESSOR_SUPORTE = ['PROFESSOR', 'SUPORTE']
const TODOS_PAPEIS = ['PROFESSOR', 'SUPORTE', 'ALUNO']

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/cadastro',
    name: 'cadastro-usuario',
    component: CadastroUsuario,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/ativos',
    name: 'ativos',
    component: Ativos,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/ativos/novo',
    name: 'novo-ativo',
    component: CadastroAtivo,
    meta: {
      requiresAuth: true,
      roles: PROFESSOR_SUPORTE
    }
  },
  {
    path: '/ativos/detalhe/:id',
    name: 'detalhe',
    component: DetalheAtivo,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/ativos/editar/:id',
    name: 'editar',
    component: EditarAtivo,
    meta: {
      requiresAuth: true,
      roles: PROFESSOR_SUPORTE
    }
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: Relatorios,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: Categorias,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/categorias/nova',
    name: 'nova-categoria',
    component: NovaCategoria,
    meta: {
      requiresAuth: true,
      roles: PROFESSOR_SUPORTE
    }
  },
  {
    path: '/manutencao',
    name: 'manutencao-ativo',
    component: ManutencaoAtivo,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/manutencao/detalhe/:id',
    name: 'detalhe-manutencao',
    component: DetalheManutencao,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/configuracoes',
    name: 'configuracoes',
    component: Configuracoes,
    meta: {
      requiresAuth: true,
      roles: TODOS_PAPEIS
    }
  },
  {
    path: '/perfis',
    name: 'perfis',
    component: GerenciamentoPerfil,
    meta: {
      requiresAuth: true,
      roles: PROFESSOR_SUPORTE
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  const papel = localStorage.getItem('papel')?.toUpperCase()

  // 1. Impede acesso a páginas protegidas sem autenticação
  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  // 2. Impede usuário autenticado de acessar login ou cadastro
  if (
    (to.name === 'login' || to.name === 'cadastro-usuario') &&
    token
  ) {
    return { name: 'dashboard' }
  }

  // 3. Permite acessar o Dashboard para evitar redirecionamento circular
  if (to.name === 'dashboard') {
    return true
  }

  // 4. Verifica se o papel está autorizado para a rota
  if (to.meta.roles) {
    if (!papel || !to.meta.roles.includes(papel)) {
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router
