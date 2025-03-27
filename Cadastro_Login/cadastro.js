document.getElementById('cadastrar').addEventListener('click', () => {
    const prim_nome = document.getElementById('prim_nome').value.trim();
    const ult_nome = document.getElementById('ult_nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    if(prim_nome === '' || ult_nome === '' || email === '' || senha === '') {
        alert('Please enter below all fields');
    } else {
        localStorage.setItem('primeiroNome', prim_nome);
        localStorage.setItem('ultimoNome', ult_nome);
        localStorage.setItem('email', email);
        localStorage.setItem('senha', senha);
        window.location = 'monitoramento.html';
    }
});