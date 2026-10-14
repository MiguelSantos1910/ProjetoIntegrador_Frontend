import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export function usePdf() {
  function gerarPdf({
    titulo = 'Relatório Easy Asset',
    nomeArquivo = 'relatorio.pdf',
    colunas = [],
    dados = []
  }) {
    const doc = new jsPDF()

    // Cabeçalho
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(titulo, 14, 20)

    // Data de geração
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`,
      14,
      28
    )

    // Tabela
    autoTable(doc, {
      startY: 35,
      head: [colunas],
      body: dados,
      theme: 'grid',
      headStyles: {
        fillColor: [13, 159, 149],
        textColor: 255
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: {
        left: 14,
        right: 14
      }
    })

    // Download do PDF
    doc.save(nomeArquivo)
  }

  return {
    gerarPdf
  }
}