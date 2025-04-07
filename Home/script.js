let tipoGrafico1 = 'pie';
let tipoGrafico2 = 'bar';
let tipoGrafico3 = 'line';

const grafico1 = document.getElementById('sub-grafico1').getContext('2d');
const grafico2 = document.getElementById('sub-grafico2').getContext('2d');
const grafico3 = document.getElementById('sub-grafico3').getContext('2d');

let dados = {
    labels: ['Vidro', 'Plástico', 'Metal', 'Margem de Erro'],
    datasets: [{
        label: 'Quantidade Processada',
        data: [120, 200, 80, 15],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true,
        tension: 0.3,
        borderWidth: 2
    }]
};

let graficooo1 = new Chart(grafico1, {
    type: tipoGrafico1,
    data: dados,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            }
        }
    }
});

let graficooo2 = new Chart(grafico2, {
    type: tipoGrafico2,
    data: dados,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                    
                }
            }
        }
    }
});

let graficooo3 = new Chart(grafico3, {
    type: tipoGrafico3,
    data: dados,
    options: {
        responsive: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            }
        }
    }
});

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

function mudarMetal(){
    chart.data.datasets[0].data = [
       
    ];
    chart.update();
    
    tabela.data.datasets[0].data = [
        
    ];
    tabela.update();
}

function trocarMaterial() {
    let dropdown = event.target.nextElementSibling;
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

function trocarTurno() {
    let dropdown = event.target.nextElementSibling;
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

function trocarData() {
    let dropdown = event.target.nextElementSibling;
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}
