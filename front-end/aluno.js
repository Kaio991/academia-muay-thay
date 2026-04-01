
const API_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', async () => {
    const nomeLogado = localStorage.getItem('usuarioLogado');
    const displayNome = document.getElementById('nome-aluno');
    const displayFaixa = document.getElementById('faixa-aluno');
    const cardPagamento = document.getElementById('card-pagamento');
    const qrContainer = document.getElementById('qrcode');

    if (!nomeLogado) {
        window.location.href = 'index.html'; 
        return;
    }

    try {
       
        const response = await fetch(`${API_URL}/api/admin`);
        const data = await response.json();
        
        const listaAlunos = data.alunosEncontrados || data;
        const aluno = listaAlunos.find(a => a.nome === nomeLogado);

        if (aluno) {
            if (displayNome) displayNome.innerText = aluno.nome;
            if (displayFaixa) displayFaixa.innerText = aluno.prajied || 'Branca';

            let estaPago = false;
            const hoje = new Date();

            if (aluno.statusPagamento && typeof aluno.statusPagamento !== 'boolean') {
                const dataPgto = new Date(aluno.statusPagamento);
                const diferencaTempo = hoje - dataPgto;
                const diferencaDias = diferencaTempo / (1000 * 60 * 60 * 24);
                
                if (diferencaDias < 30) {
                    estaPago = true;
                }
            }

            if (estaPago) {
                if (cardPagamento) cardPagamento.style.display = 'none';
                console.log("Status: Mensalidade em dia.");
            } else {
                if (cardPagamento) cardPagamento.style.display = 'block';
                console.log("Status: Mensalidade pendente. Gerando QR Code...");
                gerarQRCode(qrContainer);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar dados do aluno:", error);
    }
});

function gerarQRCode(container) {
    if (container && container.innerHTML === "") {
        
        const pixDados = "00020126330014br.gov.bcb.pix0111219640268715204000053039865802BR5907Rodrigo6008BRASIL62070503***63047242";
        
        new QRCode(container, {
            text: pixDados,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

function copiarPix() {
    
    navigator.clipboard.writeText("21964026871"); 
    alert("Chave PIX (Celular) de Rodrigo copiada!");
}

function copiarPixFull() {
   
    const pixCode = "00020126330014br.gov.bcb.pix0111219640268715204000053039865802BR5907Rodrigo6008BRASIL62070503***63047242";
    navigator.clipboard.writeText(pixCode);
    alert("Código PIX Copia e Cola copiado!");
}

function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}