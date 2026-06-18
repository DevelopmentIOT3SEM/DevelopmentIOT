let card = document.querySelector('.card');
let loginButton = document.querySelector('.btnFacaLogin');
let cadastroButton = document.querySelector('.cadastreSe');

loginButton.onclick = () => {
    card.classList.remove('cadastroActive');
    card.classList.add('loginActive');
}

cadastroButton.onclick = () => {
    card.classList.remove('loginActive');
    card.classList.add('cadastroActive');
}

async function handleCadastro() {
    const nome = document.getElementById('cadastro-nome').value;
    const email = document.getElementById('cadastro-email').value;
    const senha = document.getElementById('cadastro-senha').value;
    const confirmaSenha = document.getElementById('cadastro-confirma-senha').value;

    if (!nome || !email || !senha || !confirmaSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (senha !== confirmaSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    const dados = { nome, email, senha };
    console.log('Dados enviados:', dados); 

    try {
        const response = await fetch('http://52.44.49.80:5271/api/Auth/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        console.log('Status da resposta:', response.status);
        const textResponse = await response.text();
        console.log('Resposta bruta:', textResponse);

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${textResponse || 'Sem detalhes do erro'}`);
        }

        const result = JSON.parse(textResponse);
        console.log('Resposta parseada:', result);

        alert('Cadastro realizado com sucesso!');
        card.classList.remove('cadastroActive');
        card.classList.add('loginActive');
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(error.message);
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const dados = { email, senha: password };

    try {
        const response = await fetch('http://localhost:5271/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao fazer login. Verifique suas credenciais.');
        }

        const result = await response.json();
        if (result.token) {
            localStorage.setItem('authToken', result.token);
            alert('Login realizado com sucesso!');
            window.location.href = './dashboard.html';
        } else {
            throw new Error('Token não recebido. Tente novamente.');
        }
    } catch (error) {
        alert(error.message);
    }
}