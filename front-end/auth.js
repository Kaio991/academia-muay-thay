const API_URL = "http://localhost:3000";

const btnIrLogin = document.getElementById('ir-login');
const btnIrCadastro = document.getElementById('ir-cadastro');
const areaCadastro = document.getElementById('area-cadastro');
const areaLogin = document.getElementById('area-login');

btnIrLogin.addEventListener('click', (e) => {
    e.preventDefault();
    areaCadastro.style.display = 'none';
    areaLogin.style.display = 'block';
});

btnIrCadastro.addEventListener('click', (e) => {
    e.preventDefault();
    areaLogin.style.display = 'none';
    areaCadastro.style.display = 'block';
});

document.getElementById('form-matricula').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        dataDeNascimento: document.getElementById('nascimento').value, 
        senha: document.getElementById('senha').value,
        diaVencimento: new Date().getDate() 
    };

    try {
        const response = await fetch(`${API_URL}/api/matricula`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            Swal.fire({
                title: 'Matrícula Concluída! 🥊',
                text: 'Ficha salva no sistema! Clique em OK para avisar o mestre.',
                icon: 'success',
                confirmButtonColor: '#d32f2f',
                confirmButtonText: 'OK, AVISAR MESTRE'
            }).then((result) => {
                if (result.isConfirmed) {
                    const mensagem = encodeURIComponent(`Olá Mestre! Acabei de fazer minha matrícula no CT. Meu nome é ${dados.nome}.`);
                    window.open(`https://wa.me/5521964026871?text=${mensagem}`, "_blank");
                    location.reload(); 
                }
            });
        } else {
            const erro = await response.json();
            Swal.fire({
                title: 'Erro no Cadastro',
                text: erro.message || 'Verifique os dados.',
                icon: 'error',
                confirmButtonColor: '#d32f2f'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Erro de Conexão',
            text: 'O servidor Node está ligado?',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
        });
    }
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('login-nome').value;
    const senha = document.getElementById('login-senha').value;

    
    const senhaMestreSecreta = "RODRIGO31032026"; 

    if (nome.toLowerCase() === 'mestre') {
        if (senha === senhaMestreSecreta) {
            localStorage.setItem('usuarioLogado', 'mestre');
            window.location.href = './mestre.html';
            return;
        } else {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Senha do Mestre incorreta!',
                icon: 'error',
                confirmButtonColor: '#d32f2f'
            });
            return;
        }
    }
    

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('usuarioLogado', nome);
            
            if (data.aluno && data.aluno._id) {
                localStorage.setItem('alunoId', data.aluno._id);
            }

            if (data.isAdmin) {
                window.location.href = './mestre.html'; 
            } else {
                window.location.href = './aluno.html';
            }
        } else {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Nome ou senha incorretos!',
                icon: 'error',
                confirmButtonColor: '#d32f2f'
            });
        }
    } catch (error) {
        console.error("Erro no login:", error);
        Swal.fire({
            title: 'Erro!',
            text: 'Verifique se o servidor está rodando corretamente.',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
        });
    }
});