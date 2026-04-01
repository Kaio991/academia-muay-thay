// 1. Defina a URL base do servidor aqui
const API_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', carregarRecibos);

async function carregarRecibos() {
    try {
        // 2. Usando a variável para buscar os recibos
        const response = await fetch(`${API_URL}/api/recibos`); 
        const recibos = await response.json();
        
        const tabela = document.getElementById('lista-recibos');
        tabela.innerHTML = '';

        recibos.forEach(recibo => {
            const dataFormatada = new Date(recibo.dataPagamento).toLocaleDateString('pt-BR');
            const valorFormatado = Number(recibo.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${recibo.nomeAluno}</td>
                <td>${dataFormatada}</td>
                <td style="color: #4caf50;">${valorFormatado}</td>
                <td class="status-pago">CONFIRMADO</td>
            `;
            tabela.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar recibos:", error);
    }
}

function gerarRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFontSize(20);
    doc.setTextColor(211, 47, 47); 
    doc.text("CT MUAY THAI - RELATÓRIO FINANCEIRO", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    const dataEmissao = new Date().toLocaleString('pt-BR');
    doc.text(`Relatório extraído em: ${dataEmissao}`, 14, 28);

    const linhas = [];
    const tabelaRows = document.querySelectorAll("#lista-recibos tr");

    tabelaRows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length > 0) {
            linhas.push([
                cols[0].innerText, 
                cols[1].innerText, 
                cols[2].innerText, 
                cols[3].innerText  
            ]);
        }
    });

    doc.autoTable({
        startY: 35,
        head: [['ALUNO', 'DATA PGTO', 'VALOR', 'STATUS']],
        body: linhas,
        theme: 'striped',
        headStyles: { fillColor: [211, 47, 47], textColor: [255, 255, 255] }, 
        styles: { fontSize: 9, cellPadding: 3 },
    });

    const dataArquivo = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');
    doc.save(`Relatorio_Caixa_CTMuayThai_${dataArquivo}.pdf`);
}