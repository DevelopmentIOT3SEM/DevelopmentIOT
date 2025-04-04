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