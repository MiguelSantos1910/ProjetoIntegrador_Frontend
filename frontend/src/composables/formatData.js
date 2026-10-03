export const dataFormatada = (data) => {
  if (!data) return '-'

  return new Date(data).toLocaleDateString('pt-BR')
}