export const STATUS_ATIVO = {
  ATIVO: {
    label: 'Ativo',
    class: 'status-ativo'
  },

  EM_MANUTENCAO: {
    label: 'Em manutenção',
    class: 'status-manutencao'
  },

  DEVOLVIDO: {
    label: 'Devolvido',
    class: 'status-devolvido'
  },

  INATIVO: {
    label: 'Inativo',
    class: 'status-inativo'
  },

  EM_ANDAMENTO: {
    label: 'Em andamento',
    class: 'status-andamento'
  },

  PENDENTE: {
    label: 'Pendente',
    class: 'status-pendente'
  },

  CONCLUIDO: {
    label: 'Concluído',
    class: 'status-concluido'
  },

  // O back grava as ordens no feminino ('Concluída', 'Cancelada'), que
  // normalizam para CONCLUIDA e CANCELADA.
  CONCLUIDA: {
    label: 'Concluída',
    class: 'status-concluida'
  },

  CANCELADO: {
    label: 'Cancelado',
    class: 'status-cancelado'
  },

  CANCELADA: {
    label: 'Cancelada',
    class: 'status-cancelada'
  }
}
