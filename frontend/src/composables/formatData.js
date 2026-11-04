const paraData = (data) => {
  if (!data) return null

  const convertida = new Date(data)

  return Number.isNaN(convertida.getTime()) ? null : convertida
}

// Só a data: 04/11/2026
export const dataFormatada = (data) => {
  const convertida = paraData(data)

  return convertida ? convertida.toLocaleDateString('pt-BR') : '-'
}

// Data e hora, para registros de auditoria: 04/11/2026, 14:32
export const dataHoraFormatada = (data) => {
  const convertida = paraData(data)

  return convertida
    ? convertida.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    : '-'
}
