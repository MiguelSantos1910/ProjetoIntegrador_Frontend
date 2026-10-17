
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export function usePdf() {
  function gerarPdf({
    titulo = 'Relatório Easy Asset',
    nomeArquivo = 'relatorio.pdf',
    colunas = [],
    dados = [],
    secoes = []
  }) {
    const doc = new jsPDF()

    // Cabeçalho geral
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

    // Mantém compatibilidade com exportações individuais.
    const tabelas = secoes.length > 0
      ? secoes
      : [{ colunas, dados }]

    let posicaoY = 35

    tabelas.forEach((secao) => {
      const alturaPagina = doc.internal.pageSize.getHeight()

      // Evita deixar o título da seção isolado no fim da página.
      if (
        secao.titulo &&
        posicaoY + 35 > alturaPagina - 15
      ) {
        doc.addPage()
        posicaoY = 20
      }

      // Título da seção
      if (secao.titulo) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.text(secao.titulo, 14, posicaoY)
        posicaoY += 5
      }

      // Tabela da seção
      autoTable(doc, {
        startY: posicaoY,
        head: [secao.colunas || []],
        body: secao.dados || [],
        theme: 'grid',
        headStyles: {
          fillColor: [13, 159, 149],
          textColor: 255
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        margin: {
          top: 15,
          left: 14,
          right: 14,
          bottom: 15
        },
        showHead: 'everyPage'
      })

      // Próxima seção começa depois da tabela anterior.
      posicaoY = doc.lastAutoTable.finalY + 12
    })

    // Gera um único arquivo PDF.
    doc.save(nomeArquivo)
  }

  return {
    gerarPdf
  }
}
