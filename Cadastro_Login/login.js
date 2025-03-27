document.getElementById('login').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    if(email === '' || senha === '') {
        alert('Please enter below all fields');
    } else {
        window.location = 'monitoramento.html';
    }
});