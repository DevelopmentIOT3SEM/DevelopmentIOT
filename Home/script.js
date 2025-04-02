let tipoGrafico = 'pie'; // Define o tipo do gráfico como linha
let tipoGrafico2 = 'line';
let tipoGrafico3 = 'bar';

const ctx = document.getElementById('reciclagemChart').getContext('2d');
const grafico = document.getElementById('grafico').getContext('2d');
const grafico2 = document.getElementById('grafico2').getContext('2d');

let dados = {
    labels: ['Vidro', 'Plástico', 'Metal', 'Margem de Erro'],
    datasets: [{
        label: 'Quantidade Processada',
        data: [120, 200, 80, 15],
        borderColor: 'blue', // Cor da linha
        backgroundColor: 'rgba(0, 0, 255, 0.2)', // Cor de fundo semitransparente
        fill: true, // Ativa o preenchimento abaixo da linha
        tension: 0.3, // Suaviza as curvas da linha
        borderWidth: 2 // Define a espessura da linha
    }]
};

let chart = new Chart(ctx, {
    type: tipoGrafico,
    data: dados, // Mantendo os dados originais
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)' // Cor da grade do eixo Y
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)' // Cor da grade do eixo X
                }
            }
        }
    }
});

let tabela = new Chart(grafico, {
    type: tipoGrafico2,
    data: dados, // Mantendo os dados originais
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)' // Cor da grade do eixo Y
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)' // Cor da grade do eixo X
                }
            }
        }
    }
});

let tabela2 = new Chart(grafico2, {
    type: tipoGrafico3,
    data: dados, // Mantendo os dados originais
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)' // Cor da grade do eixo Y
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)' // Cor da grade do eixo X
                }
            }
        }
    }
});

// Atualizar os dados do gráfico dinamicamente
function atualizarDados() {
    chart.data.datasets[0].data = [
        Math.floor(Math.random() * 200),  // Vidro
        Math.floor(Math.random() * 200),  // Plástico
        Math.floor(Math.random() * 100),  // Outros
        Math.floor(Math.random() * 20)    // Margem de erro
    ];
    chart.update();
    
    tabela.data.datasets[0].data = [
        Math.floor(Math.random() * 200),  // Vidro
        Math.floor(Math.random() * 200),  // Plástico
        Math.floor(Math.random() * 100),  // Outros
        Math.floor(Math.random() * 20)    // Margem de erro
    ];
    tabela.update();
}

//Mudar abas das páginas
function mudarMonitoramento(){
    window.location.href = "dashboard.html"
}
function mudarDashboard(){
    window.location.href = "monitoramento.html"
}
function mudarLogin(){
    window.location.href = "login.html"
}

function mudarCor() {
    let cores = ['grey', 'black'];
    let corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    document.body.style.backgroundColor = corAleatoria;
}
//document.getElementById('texto_caixote').textContent = dados.labels[0] + ": " + dados.datasets[0].data[0];
//document.getElementById('texto_caixote2').textContent = dados.labels[1] + ": " + dados.datasets[0].data[1];
//document.getElementById('texto_caixote3').textContent = dados.labels[2] + ": " + dados.datasets[0].data[2];
//document.getElementById('texto_caixote4').textContent = dados.labels[3] + ": " + dados.datasets[0].data[3];