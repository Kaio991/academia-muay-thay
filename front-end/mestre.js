// 1. Defina a URL base do servidor aqui
const API_URL = "http://localhost:3000";

// --- TRAVA DE SEGURANÇA (Adicionada para proteger o acesso) ---
(function verificarAcessoMestre() {
    const usuario = localStorage.getItem('usuarioLogado');
    
    // Se não houver ninguém logado ou o nome não for exatamente 'mestre', expulsa!
    if (!usuario || usuario.toLowerCase() !== 'mestre') {
        alert("Acesso negado! Área exclusiva do Mestre Rodrigo.");
        window.location.href = 'index.html';
    }
})();
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', carregarAlunos);

function filtrarAlunos() {
    const termoBusca = document.getElementById('input-busca').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabela-alunos tr');

    linhas.forEach(linha => {
        const nomeAluno = linha.querySelector('td').innerText.toLowerCase();
        linha.style.display = nomeAluno.includes(termoBusca) ? "" : "none";
    });
}

async function carregarAlunos() {
    try {
        // 2. Usando a variável para buscar a lista
        const response = await fetch(`${API_URL}/api/admin`);
        const data = await response.json();
        const listaAlunos = data.alunosEncontrados || data;

        const tabela = document.getElementById('tabela-alunos');
        tabela.innerHTML = ''; 

        let totalPendentes = 0;
        const hoje = new Date();

        listaAlunos.forEach(aluno => {
            let estaPago = false;
            
            if (aluno.statusPagamento) {
                const dataPgto = new Date(aluno.statusPagamento);
                
                if (!isNaN(dataPgto.getTime())) {
                    const diferencaTempo = hoje - dataPgto;
                    const diferencaDias = diferencaTempo / (1000 * 60 * 60 * 24);
                    
                    if (diferencaDias < 30) {
                        estaPago = true;
                    }
                } else if (aluno.statusPagamento === true) {
                    estaPago = true;
                }
            }

            if (!estaPago) totalPendentes++;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aluno.nome}</td>
                <td>
                    <select onchange="atualizarFaixa('${aluno._id}', this.value)" style="background: #222; color: white; border: 1px solid #444; padding: 5px;">
                        <option value="${aluno.prajied || 'Branca'}" selected disabled>${aluno.prajied || 'Branca'}</option>
                        <option value="Branca">Branca</option>
                        <option value="Branca Ponta Vermelha">Branca Ponta Vermelha</option>
                        <option value="Vermelha">Vermelha</option>
                        <option value="Vermelha Ponta Preta">Vermelha Ponta Preta</option>
                        <option value="Preta">Preta</option>
                    </select>
                </td>
                <td>${estaPago ? '<span style="color: #00ff00; font-weight: bold;">✅ Pago</span>' : '<span style="color: #ff0000; font-weight: bold;">❌ Pendente</span>'}</td>
                <td>
                    <button class="btn-pago" onclick="confirmarPagamento('${aluno._id}', '${aluno.nome}')" ${estaPago ? 'disabled' : ''} style="cursor: ${estaPago ? 'not-allowed' : 'pointer'}">
                        Aprovar
                    </button>
                    <button class="btn-delete" onclick="deletarAlunos('${aluno._id}', '${aluno.nome}')" style="background: #d32f2f; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </td>
            `;
            tabela.appendChild(tr);
        });

        document.getElementById('total-alunos').innerText = listaAlunos.length;
        document.getElementById('total-pendentes').innerText = totalPendentes;

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

async function confirmarPagamento(id, nome) {
    try {
        // 3. Usando a variável para aprovar pagamento
        const response = await fetch(`${API_URL}/api/admin/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statusPagamento: true })
        });

        if (response.ok) {
            Swal.fire({
                title: 'Pagamento Confirmado!',
                text: `O aluno ${nome} está em dia. Recibo gerado com sucesso!`,
                icon: 'success',
                confirmButtonColor: '#ff0000'
            });
            carregarAlunos(); 
        }
    } catch (error) {
        Swal.fire('Erro!', 'Servidor fora do ar.', 'error');
    }
}

async function atualizarFaixa(id, novaFaixa) {
    try {
        // 4. Usando a variável para mudar a graduação
        const response = await fetch(`${API_URL}/api/admin/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prajied: novaFaixa })
        });
        
        if(response.ok) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Graduação atualizada!',
                showConfirmButton: false,
                timer: 2000
            });
        }
    } catch (error) {
        console.error("Erro ao atualizar faixa:", error);
    }
}

async function deletarAlunos(id, nome) {
    Swal.fire({
        title: `Remover ${nome}?`,
        text: "Isso vai apagar o aluno do banco de dados para sempre!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0000',
        cancelButtonColor: '#333',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // 5. Usando a variável para deletar o aluno
                const response = await fetch(`${API_URL}/api/admin/${id}`, { 
                    method: 'DELETE' 
                });
                
                if (response.ok) {
                    Swal.fire('Removido!', 'O aluno foi excluído.', 'success');
                    carregarAlunos();
                } else {
                    Swal.fire('Erro!', 'Não foi possível remover.', 'error');
                }
            } catch (error) {
                console.error("Erro ao deletar:", error);
            }
        }
    });
}

function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}