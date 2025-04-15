async function carregarDados(){
    const response = await fetch('http://127.0.0.1:5000/api/dados');
    const dados = await response.json()

    //Cria três arrays vazios para cada turno
    const eficienciaPorTurno = {
        'Manhã': [],
        'Tarde': [],
        'Noite': []
    };

    //Gráfico de evolução de eficiência
    const datas = [];
    const eficiencias = [];

    //Gráfico de composição de erros
    let erroPlasticoComoMetal = 0;
    let erroMetalComoPlastico = 0;

    //Gráfico de tempo médio de processamento
    const temposMedios = dados.map(item =>
      item.total_processado > 0
        ? item.tempo_total_processamento / item.total_processado
        : 0
    );
    const labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9+'];
    const bins = Array(labels.length).fill(0);

    temposMedios.forEach(tempo => {
      const indice = Math.min(Math.floor(tempo), 9);
      bins[indice]++;
    });

    //Parte do Mapa de desempenho
    const turnos = ['Manhã', 'Tarde', 'Noite'];
    const materiais = ['Plástico', 'Metal'];
    const agrupado = {};
    turnos.forEach(turno => {
      agrupado[turno] = {};
      materiais.forEach(material => {
        agrupado[turno][material] = [];
      });
    });
  
    dados.forEach(item => {
        const turno = item.turno;
        const eficiencia = (item.corretamente_separado / item.total_processado) * 100;
        eficienciaPorTurno[turno].push(eficiencia);
        const dataFormatada = new Date(item.data).toLocaleDateString(); // "dd/mm/yyyy"
        datas.push(dataFormatada);
        eficiencias.push(eficiencia.toFixed(2));

        //Parte da Composição dos erros
        erroPlasticoComoMetal += parseInt(item.erro_plastico_como_metal) || 0;
        erroMetalComoPlastico += parseInt(item.erro_metal_como_plastico) || 0;

        //Parte do Mapa de desempenho
        const material = item.tipo_material;
        if (!turnos.includes(turno) || !materiais.includes(material)) return;
          const taxaErro = item.total_processado > 0
            ? (item.mal_separado / item.total_processado) * 100
            : 0;

          agrupado[turno][material].push(taxaErro);
    });

    //Gráfico de Dispersão
    const pontosDispersao = dados
      .filter(item => item.total_processado > 0 && item.umidade !== null)
      .map(item => ({
        x: item.umidade,
        y: (item.mal_separado / item.total_processado) * 100
      }));
  
    // Agora criamos o gráfico
    gerarGraficoBarrasEficiência(eficienciaPorTurno);
    gerarGraficoLinhaEvolucao(datas, eficiencias);
    gerarGraficoPizzaErros(erroPlasticoComoMetal, erroMetalComoPlastico)
    gerarhistograma(labels, bins)
    gerarheatmap(agrupado, turnos, materiais);
    gerarGraficoDispersao(pontosDispersao)

    console.log("Heatmap data (z):", z);
  console.log("Turnos (y-axis):", turnos);
  console.log("Materiais (x-axis):", materiais);
}
    
    //Função do gráfico da comparação de eficiência
    function gerarGraficoBarrasEficiência(eficienciaPorTurno) {
      const turnos = Object.keys(eficienciaPorTurno);
      const medias = turnos.map(turno => {
        const lista = eficienciaPorTurno[turno];
        const soma = lista.reduce((acc, val) => acc + val, 0);
        return (soma / lista.length).toFixed(2);
      });
      

      //Gráfico de comparação de eficiência
      const ctx = document.getElementById('graficoeficiencia').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: turnos,
          datasets: [{
            label: 'Eficiência Média de Separação (%)',
            data: medias,
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
            borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Eficiência Média por Turno',
              font: {
                size: 18
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Eficiência (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Turno'
              }
            }
          }
        }
      });
    }

    //Gráfico de evolução de eficiência
    function gerarGraficoLinhaEvolucao(datas, eficiencias) {
        const ctx = document.getElementById('graficoevolucao').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: datas,
            datasets: [{
              label: 'Eficiência (%)',
              data: eficiencias,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: '#4CAF50'
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Evolução da Eficiência no Tempo',
                font: {
                  size: 18
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Eficiência (%)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Data'
                }
              }
            }
          }
        });
      }

      //Gráfico da composição de erros
      function gerarGraficoPizzaErros(erroPlasticoComoMetal, erroMetalComoPlastico) {
      const ctx = document.getElementById('graficoErros').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
            labels: [
                'Plástico como Metal',
                'Metal como Plástico'
            ],
            datasets: [{
                data: [erroPlasticoComoMetal, erroMetalComoPlastico],
                backgroundColor: ['#F44336', '#FFC107'],
                borderWidth: 1
            }]
            },
            options: {
            responsive: false,
            plugins: {
                title: {
                display: true,
                text: 'Distribuição dos Erros de Classificação',
                font: {
                    size: 18
                }
                }
            }
            }
        });
      }

      function gerarhistograma(labels, bins){
        const ctx = document.getElementById('histogramaChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Frequência de Tempo Médio (seg/item)',
              data: bins,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Frequência'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Tempo Médio (seg/item)'
                }
              }
            }
          }
        });
      }
      
      //Gráfico heatmap
      function gerarheatmap(agrupado, turnos, materiais){
        const z = turnos.map(turno => {
          return materiais.map(material => {
            const lista = agrupado[turno][material];
            if (lista.length === 0) return null;
            const media = lista.reduce((a, b) => a + b, 0) / lista.length;
            return parseFloat(media.toFixed(2));
          });
        });
  
        const data = [{
          z: z,
          x: materiais,
          y: turnos,
          type: 'heatmap',
          colorscale: 'Reds',
          hoverongaps: false
        }];
  
        const layout = {
          title: 'Taxa de Erro (%) por Turno e Tipo de Material',
          xaxis: { title: 'Tipo de Material',
                   showgrid: false,
           },
          yaxis: { title: 'Turno',
                   showgrid: false,
           },
           plot_bgcolor: 'rgba(0,0,0,0)', // Transparent plot background
           paper_bgcolor: 'rgba(0,0,0,0)',
        };
  
        Plotly.newPlot('heatmap', data, layout);
      }

      //Gráfico de dispersão
      function gerarGraficoDispersao(pontos) {
        const ctx = document.getElementById('graficoDispersao').getContext('2d');
        new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [{
              label: 'Umidade x Taxa de Erro (%)',
              data: pontos,
              backgroundColor: 'rgba(255, 99, 132, 1)'
            }]
          },
          options: {
            responsive: false,
            plugins: {
              title: {
                display: true,
                text: 'Correlação: Umidade dos Materiais vs Taxa de Erro',
                font: {
                  size: 18
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Umidade: ${context.raw.x}%, Erro: ${context.raw.y.toFixed(2)}%`;
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Umidade (%)'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Taxa de Erro (%)'
                },
                beginAtZero: true,
                max: 100
              }
            }
          }
        });
      }
carregarDados(); //Puxa a função para puxar todos os dados dos gráficos



function mudarMonitoramento(){
    window.location.href = "dashboard.html"
}
function mudarDashboard(){
    window.location.href = "monitoramento.html"
}
function mudarLogin(){
    window.location.href = "login.html"
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
